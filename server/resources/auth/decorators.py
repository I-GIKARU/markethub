from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import User

def role_required(required_role):
    """Decorator to require specific role"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user or not user.role:
                return {'error': 'User not found or no role assigned'}, 404
            
            if user.role.name != required_role:
                return {'error': f'Access denied. {required_role} role required'}, 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def admin_or_role_required(allowed_roles):
    """Decorator to require admin or specific roles"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user or not user.role:
                return {'error': 'User not found or no role assigned'}, 404
            
            if user.role.name not in allowed_roles and user.role.name != 'admin':
                return {'error': f'Access denied. Required roles: {allowed_roles} or admin'}, 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def flexible_auth_required(f):
    """Decorator for optional authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request(optional=True)
        except:
            pass
        return f(*args, **kwargs)
    return decorated_function

def get_current_user():
    """Get current user from JWT token"""
    user_id = get_jwt_identity()
    return User.query.get(user_id) if user_id else None
