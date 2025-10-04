from flask import request, make_response
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from models import User
from datetime import timedelta
from utils.email_auth import authenticate_user, register_user

try:
    from utils.firebase_auth import verify_firebase_token, create_or_get_user_from_firebase
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False

class CurrentUser(Resource):
    @jwt_required()
    def get(self):
        """Get current user info from JWT token"""
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return {'error': 'User not found'}, 404
            
            return {
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'role': user.role.name if user.role else None,
                    'auth_provider': user.auth_provider
                }
            }, 200
            
        except Exception as e:
            return {'error': str(e)}, 500

class UserLogout(Resource):
    @jwt_required()
    def post(self):
        """Logout user and clear httpOnly cookies"""
        response = make_response({'message': 'Logout successful'})
        unset_jwt_cookies(response)
        return response

class RegisterUser(Resource):
    def post(self):
        """Register new user with email/password"""
        try:
            data = request.get_json()
            
            if not data:
                return {'error': 'No data provided'}, 400
            
            email = data.get('email')
            password = data.get('password')
            role_name = data.get('role', 'student')
            
            if not email or not password:
                return {'error': 'Email and password required'}, 400
            
            # Register user
            user, error = register_user(email, password, role_name)
            if error:
                return {'error': error}, 400
            
            # Create access token
            access_token = create_access_token(
                identity=str(user.id),  # Convert to string for JWT
                expires_delta=timedelta(days=7)
            )
            
            response_data = {
                'message': 'Registration successful',
                'access_token': access_token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'role': user.role.name
                }
            }
            
            response = make_response(response_data, 201)
            set_access_cookies(response, access_token, max_age=timedelta(days=7))
            return response
            
        except Exception as e:
            return {'error': str(e)}, 500

class EmailLogin(Resource):
    def post(self):
        """Login with email/password"""
        try:
            data = request.get_json()
            
            if not data:
                return {'error': 'No data provided'}, 400
            
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return {'error': 'Email and password required'}, 400
            
            # Authenticate user
            user, error = authenticate_user(email, password)
            if error:
                return {'error': error}, 401
            
            # Create access token
            access_token = create_access_token(
                identity=str(user.id),  # Convert to string for JWT
                expires_delta=timedelta(days=7)
            )
            
            response_data = {
                'message': 'Login successful',
                'access_token': access_token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'role': user.role.name
                }
            }
            
            response = make_response(response_data, 200)
            set_access_cookies(response, access_token, max_age=timedelta(days=7))
            return response
            
        except Exception as e:
            return {'error': str(e)}, 500

class GoogleLogin(Resource):
    def post(self):
        """Firebase authentication endpoint"""
        if not FIREBASE_AVAILABLE:
            return {'error': 'Firebase authentication not available'}, 503
            
        try:
            data = request.get_json()
            
            if not data or 'idToken' not in data:
                return {'message': 'Firebase ID token required'}, 400
            
            id_token = data['idToken']
            
            # Verify Firebase token
            firebase_user_data, error = verify_firebase_token(id_token)
            if error:
                return {'error': error}, 401
            
            # Create or get user from database
            user, error = create_or_get_user_from_firebase(firebase_user_data, role_name=None)
            if error:
                return {'error': error}, 500
            
            # Create JWT access token
            access_token = create_access_token(
                identity=user.id,
                expires_delta=timedelta(days=7)
            )
            
            response_data = {
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'role': user.role.name if user.role else None,
                    'auth_provider': user.auth_provider
                }
            }
            
            response = make_response(response_data, 200)
            set_access_cookies(response, access_token, max_age=timedelta(days=7))
            return response
            
        except Exception as e:
            return {'error': str(e)}, 500
