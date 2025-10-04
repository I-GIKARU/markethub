from werkzeug.security import check_password_hash, generate_password_hash
from models import User, Role, db
from utils.validation import validate_student_email, validate_email_format
import re
import logging

logger = logging.getLogger(__name__)

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, "Valid password"

def register_user(email, password, role_name='student'):
    """Register new user with email/password"""
    try:
        # Validate email based on role
        if role_name == 'student':
            is_valid, message = validate_student_email(email)
        else:
            is_valid, message = validate_email_format(email)
        
        if not is_valid:
            return None, message
        
        # Check if user exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return None, "User already exists"
        
        # Validate password
        is_valid, message = validate_password(password)
        if not is_valid:
            return None, message
        
        # Get role
        role = Role.query.filter_by(name=role_name).first()
        if not role:
            return None, f"Role '{role_name}' not found"
        
        # Create user
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            auth_provider='email',
            role_id=role.id
        )
        
        db.session.add(user)
        db.session.commit()
        
        logger.info(f"User registered: {email}")
        return user, None
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Registration error: {str(e)}")
        return None, "Registration failed"

def authenticate_user(email, password):
    """Authenticate user with email/password"""
    try:
        # Find user
        user = User.query.filter_by(email=email, auth_provider='email').first()
        if not user:
            return None, "Invalid email or password"
        
        # Check password
        if not check_password_hash(user.password_hash, password):
            return None, "Invalid email or password"
        
        logger.info(f"User authenticated: {email}")
        return user, None
        
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        return None, "Authentication failed"
