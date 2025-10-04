from .login import CurrentUser, UserLogout, RegisterUser, EmailLogin, FIREBASE_AVAILABLE
from .profile import UserProfile
from .dashboard import StudentDashboard, AdminDashboard, ClientDashboard

if FIREBASE_AVAILABLE:
    from .login import GoogleLogin

def setup_routes(api):
    # Email/password authentication
    api.add_resource(RegisterUser, '/api/auth/register')
    api.add_resource(EmailLogin, '/api/auth/login')
    
    # Firebase authentication (if available)
    if FIREBASE_AVAILABLE:
        api.add_resource(GoogleLogin, '/api/auth/google')
    
    # Common auth routes
    api.add_resource(CurrentUser, '/api/auth/me')
    api.add_resource(UserLogout, '/api/auth/logout')
    api.add_resource(UserProfile, '/api/auth/profile')
    
    # Dashboard routes
    api.add_resource(StudentDashboard, '/api/dashboard/student')
    api.add_resource(ClientDashboard, '/api/dashboard/client')
    api.add_resource(AdminDashboard, '/api/dashboard/admin')
