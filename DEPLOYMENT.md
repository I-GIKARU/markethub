# DigitalOcean VPS Deployment Guide

This guide walks you through deploying the markethub application on a DigitalOcean VPS with PostgreSQL, Nginx, and SSL certificates.

## Prerequisites

- DigitalOcean VPS (Ubuntu 22.04 LTS recommended)
- Domain names: `www.markethub.co.ke` and `api.markethub.co.ke` pointing to your VPS IP
- Firebase project setup
- Cloudinary account

## Step 1: Initial VPS Setup

### Connect to your VPS
```bash
ssh root@your_vps_ip
```

### Update system and install packages
```bash
# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git vim nano htop unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Install Python 3.12
apt install -y python3.12 python3.12-venv python3.12-dev python3-pip

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx

# Install PM2 for process management
npm install -g pm2

# Install build essentials
apt install -y build-essential libpq-dev
```

## Step 2: Configure PostgreSQL

### Setup database
```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell, run:
CREATE DATABASE markethub_db;
CREATE USER markethub_user WITH PASSWORD 'your_secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE markethub_db TO markethub_user;
ALTER USER markethub_user CREATEDB;
\q
```

### Configure PostgreSQL
```bash
# Edit PostgreSQL configuration
nano /etc/postgresql/14/main/postgresql.conf

# Find and modify:
listen_addresses = 'localhost'

# Edit authentication
nano /etc/postgresql/14/main/pg_hba.conf

# Add this line:
local   all   markethub_user   md5

# Restart PostgreSQL
systemctl restart postgresql
systemctl enable postgresql
```

## Step 3: Setup Application Directory

```bash
# Create app directory
mkdir -p /var/www/markethub
cd /var/www/markethub

# Clone repository
git clone https://github.com/your-username/markethub.git .

# Set permissions
chown -R www-data:www-data /var/www/markethub
```

## Step 4: Backend Setup

### Setup Python environment
```bash
cd /var/www/markethub/server

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn psycopg2-binary
```

### Create production environment file
```bash
nano /var/www/markethub/server/.env
```

Add the following content:
```env
# Production Environment Variables
SECRET_KEY=your_super_secret_key_change_this_in_production
JWT_SECRET_KEY=your_jwt_secret_key_change_this_in_production

# Database Configuration
DATABASE_URL=postgresql://markethub_user:your_secure_password_123@localhost:5432/markethub_db

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_project_id.firebasestorage.app
GOOGLE_CREDENTIALS_JSON={"type":"service_account","project_id":"your_project_id","private_key_id":"key_id","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk@your_project_id.iam.gserviceaccount.com","client_id":"client_id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token"}

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
JWT_COOKIE_SECURE=true
```

### Initialize database
```bash
cd /var/www/markethub/server
source venv/bin/activate

# Run migrations
flask db upgrade

# Test the backend
python app.py
# Press Ctrl+C to stop
```

### Create Gunicorn configuration
```bash
nano /var/www/markethub/server/gunicorn.conf.py
```

Add:
```python
bind = "127.0.0.1:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True
```

### Create systemd service for backend
```bash
nano /etc/systemd/system/markethub-backend.service
```

Add:
```ini
[Unit]
Description=Markethub Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/markethub/server
Environment=PATH=/var/www/markethub/server/venv/bin
ExecStart=/var/www/markethub/server/venv/bin/gunicorn --config gunicorn.conf.py app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

## Step 5: Frontend Setup

### Build frontend
```bash
cd /var/www/markethub/client

# Create production environment
nano .env.production
```

Add:
```env
VITE_API_URL=https://api.markethub.co.ke
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Install and build
```bash
# Install dependencies
npm install

# Build for production
npm run build
```

## Step 6: Nginx Configuration

### Copy nginx configuration files
```bash
# Copy the nginx configuration files from your project
cp /var/www/markethub/nginx/nginx.conf /etc/nginx/nginx.conf
cp /var/www/markethub/nginx/client.conf /etc/nginx/sites-available/client
cp /var/www/markethub/nginx/server.conf /etc/nginx/sites-available/server
```

### Enable the sites
```bash
# Enable sites
ln -s /etc/nginx/sites-available/client /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/server /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx
```

## Step 7: SSL Certificates with Certbot

### Install SSL certificates
```bash
# Get certificates for both domains
certbot --nginx -d www.markethub.co.ke -d markethub.co.ke -d api.markethub.co.ke

# Follow the prompts and select redirect HTTP to HTTPS
```

### Setup auto-renewal
```bash
# Test renewal
certbot renew --dry-run

# Add to crontab for auto-renewal
crontab -e

# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 8: Start Services

### Start backend service
```bash
# Enable and start backend
systemctl enable markethub-backend
systemctl start markethub-backend

# Check status
systemctl status markethub-backend
```

### Verify deployment
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check if frontend is accessible
curl http://localhost/

# Check logs
journalctl -u markethub-backend -f
tail -f /var/log/nginx/access.log
```

## Step 9: Firewall Configuration

```bash
# Install UFW
apt install ufw

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 5432  # PostgreSQL (only if needed externally)

# Enable firewall
ufw enable
```

## Step 10: Monitoring and Maintenance

### Setup log rotation
```bash
nano /etc/logrotate.d/markethub
```

Add:
```
/var/www/markethub/server/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

### Create backup script
```bash
nano /usr/local/bin/backup-markethub.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/markethub"
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U markethub_user -h localhost markethub_db > $BACKUP_DIR/db_backup_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/markethub

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Make executable and add to cron:
```bash
chmod +x /usr/local/bin/backup-markethub.sh

# Add to crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-markethub.sh
```

## Step 11: Final Verification

### Test all endpoints
```bash
# Test frontend
curl -I https://www.markethub.co.ke

# Test backend API
curl -I https://api.markethub.co.ke/api/health

# Test database connection
sudo -u postgres psql -d markethub_db -c "SELECT version();"
```

### Performance optimization
```bash
# Optimize PostgreSQL
nano /etc/postgresql/14/main/postgresql.conf

# Add these optimizations:
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200

# Restart PostgreSQL
systemctl restart postgresql
```

## Troubleshooting

### Common issues and solutions

1. **Backend not starting:**
   ```bash
   journalctl -u markethub-backend -n 50
   ```

2. **Database connection issues:**
   ```bash
   sudo -u postgres psql -d markethub_db -c "\dt"
   ```

3. **Nginx configuration errors:**
   ```bash
   nginx -t
   tail -f /var/log/nginx/error.log
   ```

4. **SSL certificate issues:**
   ```bash
   certbot certificates
   certbot renew --dry-run
   ```

5. **Frontend build issues:**
   ```bash
   cd /var/www/markethub/client
   npm run build
   ```

## Maintenance Commands

```bash
# Update application
cd /var/www/markethub
git pull origin main

# Restart services
systemctl restart markethub-backend
systemctl reload nginx

# Check service status
systemctl status markethub-backend
systemctl status nginx
systemctl status postgresql

# View logs
journalctl -u markethub-backend -f
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Security Checklist

- [ ] Changed default PostgreSQL password
- [ ] Updated SECRET_KEY and JWT_SECRET_KEY
- [ ] Configured firewall (UFW)
- [ ] SSL certificates installed and auto-renewal setup
- [ ] Regular backups configured
- [ ] Log rotation setup
- [ ] Rate limiting configured in Nginx
- [ ] CORS properly configured
- [ ] Database user has minimal required permissions

Your markethub application should now be live at:
- Frontend: https://www.markethub.co.ke
- Backend API: https://api.markethub.co.ke
