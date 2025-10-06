import os
import json
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # General App Config
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///moringa_marketplace.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Dynamic database configuration based on database type
    @property
    def SQLALCHEMY_ENGINE_OPTIONS(self):
        database_url = os.getenv('DATABASE_URL', 'sqlite:///moringa_marketplace.db')
        
        if database_url.startswith('sqlite'):
            # SQLite-specific options
            return {
                'pool_pre_ping': True,
                'connect_args': {
                    'check_same_thread': False,  # Allow SQLite to be used in multi-threaded app
                    'timeout': 20  # SQLite lock timeout
                }
            }
        elif database_url.startswith('postgres'):
            # PostgreSQL-specific options
            return {
                'pool_pre_ping': True,
                'pool_size': 10,
                'pool_timeout': 20,
                'pool_recycle': -1,
                'max_overflow': 0
            }
        else:
            # Default options for other databases
            return {
                'pool_pre_ping': True
            }

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)  # Match login.py expiration

    # JWT Token locations - accept both cookies and headers for flexibility
    JWT_TOKEN_LOCATION = ['cookies', 'headers']
    JWT_COOKIE_SECURE = os.getenv('JWT_COOKIE_SECURE', 'false').lower() == 'true'
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_SAMESITE = 'Lax'
    JWT_ACCESS_COOKIE_NAME = 'access_token'
    JWT_COOKIE_CSRF_PROTECT = False  # Disable CSRF protection for simplicity
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'

    # Custom domain validation
    STUDENT_EMAIL_DOMAIN = '@student.moringaschool.com'
    
    # Firebase/Google Cloud Configuration (Auth only)
    FIREBASE_SERVICE_ACCOUNT_KEY = os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY')  # Path to service account JSON
    GOOGLE_CREDENTIALS_JSON = os.getenv('GOOGLE_CREDENTIALS_JSON')  # JSON string for deployment
    FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID')
    
    @staticmethod
    def get_firebase_credentials():
        """
        Get Firebase credentials from either file path or JSON string
        Returns credentials object or None if not found
        """
        from firebase_admin import credentials
        
        # Try JSON string first (for deployment)
        if Config.GOOGLE_CREDENTIALS_JSON:
            try:
                # Handle potential double-escaping issues from Cloud Run environment variables
                json_str = Config.GOOGLE_CREDENTIALS_JSON
                
                # Debug: print first 100 chars to see what we're getting
                print(f"🔍 GOOGLE_CREDENTIALS_JSON first 100 chars: {json_str[:100]}...")
                
                # Try to parse the JSON directly first
                try:
                    cred_dict = json.loads(json_str)
                    print(f"✅ Successfully parsed JSON on first attempt")
                    return credentials.Certificate(cred_dict)
                except json.JSONDecodeError:
                    # If that fails, try unescaping double-escaped JSON
                    print(f"🔄 First parse failed, trying to unescape...")
                    try:
                        # Remove extra escaping that might have been added
                        unescaped_json = json_str.replace('\\"', '"').replace('\\n', '\n')
                        cred_dict = json.loads(unescaped_json)
                        print(f"✅ Successfully parsed JSON after unescaping")
                        return credentials.Certificate(cred_dict)
                    except json.JSONDecodeError as e2:
                        print(f"⚠️ JSON parsing failed even after unescaping: {e2}")
                        # Try one more approach: direct string replacement
                        try:
                            # Replace escaped quotes and newlines more aggressively
                            fixed_json = json_str
                            if '\\"' in fixed_json:
                                fixed_json = fixed_json.replace('\\"', '"')
                            if '\\n' in fixed_json:
                                fixed_json = fixed_json.replace('\\n', '\n')
                            cred_dict = json.loads(fixed_json)
                            print(f"✅ Successfully parsed JSON after aggressive fixing")
                            return credentials.Certificate(cred_dict)
                        except json.JSONDecodeError as e3:
                            print(f"⚠️ All JSON parsing attempts failed: {e3}")
                            return None
                        
            except Exception as e:
                print(f"⚠️ Error processing GOOGLE_CREDENTIALS_JSON: {e}")
                return None
        
        # Try file path (for local development)
        if Config.FIREBASE_SERVICE_ACCOUNT_KEY and os.path.exists(Config.FIREBASE_SERVICE_ACCOUNT_KEY):
            try:
                return credentials.Certificate(Config.FIREBASE_SERVICE_ACCOUNT_KEY)
            except Exception as e:
                print(f"⚠️ Invalid service account key file: {e}")
                return None
        
        return None
    
    # DigitalOcean Spaces Configuration
    DO_SPACES_KEY = os.getenv('DO_SPACES_KEY')
    DO_SPACES_SECRET = os.getenv('DO_SPACES_SECRET')
    DO_SPACES_BUCKET = os.getenv('DO_SPACES_BUCKET', 'innovation-marketplace')
    DO_SPACES_REGION = os.getenv('DO_SPACES_REGION', 'nyc3')
    DO_SPACES_CDN_ENDPOINT = os.getenv('DO_SPACES_CDN_ENDPOINT')
    
    # M-Pesa Configuration
    MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY')
    MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET')
    MPESA_BUSINESS_SHORT_CODE = os.getenv('MPESA_BUSINESS_SHORT_CODE')
    MPESA_PASSKEY = os.getenv('MPESA_PASSKEY')
    MPESA_CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL', 'https://your-domain.com/api/mpesa/callback')
    MPESA_ENVIRONMENT = os.getenv('MPESA_ENVIRONMENT', 'sandbox')  # 'sandbox' or 'production'
    
    # Email Configuration
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
    MAIL_USE_SSL = os.getenv('MAIL_USE_SSL', 'false').lower() == 'true'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@innovationmarketplace.com')
    ADMIN_EMAIL = os.getenv('ADMIN_EMAIL')  # Optional: for admin notifications
