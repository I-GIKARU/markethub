# DigitalOcean VPS Deployment Guide - Fresh Server

Complete deployment guide for markethub on a fresh DigitalOcean VPS with domains `www.markethub.co.ke` and `api.markethub.co.ke`.

## Prerequisites

- Fresh DigitalOcean VPS (Ubuntu 22.04 LTS)
- Domain names pointing to your VPS IP
- Firebase project setup
- DigitalOcean Spaces account

## Step 1: Initial VPS Setup

```bash
# Connect to VPS
ssh root@your_vps_ip

# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git vim nano htop unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release build-essential libpq-dev

# Install Node.js 20+
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
```

## Step 2: Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE markethub_db;
CREATE USER markethub_user WITH PASSWORD 'your_secure_password_123';
ALTER USER markethub_user CREATEDB SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE markethub_db TO markethub_user;
\q

# Restart PostgreSQL
systemctl restart postgresql
systemctl enable postgresql
```

## Step 3: Setup Application

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

```bash
# Go to server directory
cd /var/www/markethub/server

# Create virtual environment
python3.12 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn psycopg2-binary

# Create production environment file
nano .env
# Add your environment variables here

# Initialize database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Test backend
python app.py
# Press Ctrl+C to stop
```

## Step 5: Frontend Setup

```bash
cd /var/www/markethub/client

# Create production environment
nano .env.production
# Add your frontend environment variables here

# Install and build
npm install
npm run build
```

## Step 6: Nginx Configuration

```bash
# Edit main nginx config (existing file)
nano /etc/nginx/nginx.conf
# Paste the nginx.conf content from your local machine

# Create and edit client config (new file)
nano /etc/nginx/sites-available/client
# Paste the client.conf content from your local machine

# Create and edit server config (new file)
nano /etc/nginx/sites-available/server
# Paste the server.conf content from your local machine

# Enable sites
ln -s /etc/nginx/sites-available/client /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/server /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test and restart nginx
nginx -t
systemctl restart nginx
systemctl enable nginx
```

## Step 7: SSL Certificates

```bash
# Install SSL certificates
certbot --nginx -d www.markethub.co.ke -d markethub.co.ke -d api.markethub.co.ke

# Test auto-renewal
certbot renew --dry-run

# Setup auto-renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 8: Start Backend Service

```bash
cd /var/www/markethub/server
source venv/bin/activate

# Start with PM2
pm2 start "gunicorn --bind 127.0.0.1:5000 --workers 4 app:app" --name server

# Save PM2 config and setup auto-start
pm2 save
pm2 startup
# Follow the command it gives you

# Check status
pm2 status
pm2 logs server
```

## Step 9: Firewall Configuration

```bash
# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw enable
```

## Step 10: Final Verification

```bash
# Test API
curl https://api.markethub.co.ke/api/health

# Test frontend
curl https://www.markethub.co.ke

# Check services
pm2 status
systemctl status nginx
systemctl status postgresql
```

## Backup Script

```bash
# Create backup script
cat > /usr/local/bin/backup-markethub.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/markethub"
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U markethub_user -h localhost markethub_db > $BACKUP_DIR/db_backup_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/markethub

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-markethub.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-markethub.sh
```

## Troubleshooting

```bash
# Check logs
pm2 logs server
tail -f /var/log/nginx/error.log
journalctl -u postgresql

# Restart services
pm2 restart server
systemctl restart nginx

# Database connection test
sudo -u postgres psql -d markethub_db -c "SELECT version();"
```

## Maintenance Commands

```bash
# Update application
cd /var/www/markethub
git pull origin main

# Rebuild frontend
cd client
npm run build

# Restart backend
pm2 restart server

# Reload nginx
systemctl reload nginx
```

Your markethub application will be live at:
- **Frontend**: https://www.markethub.co.ke
- **Backend API**: https://api.markethub.co.ke
