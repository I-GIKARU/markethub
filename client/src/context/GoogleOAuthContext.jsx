import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const GoogleOAuthContext = createContext({
  user: null,
  isGoogleAuth: false,
  isLoading: false,
  error: null,
  handleGoogleSuccess: () => {},
  handleGoogleError: () => {},
  logout: () => {},
});

export const useGoogleAuth = () => {
  return useContext(GoogleOAuthContext);
};

export const GoogleOAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Log the current environment for debugging
  useEffect(() => {
    console.log('Google OAuth Provider initialized');
    console.log('Current environment:', import.meta.env.MODE);
    console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
  }, []);

  useEffect(() => {
    // Check for existing auth state in localStorage
    const storedUser = localStorage.getItem('user');
    const storedIsGoogleAuth = localStorage.getItem('isGoogleAuth') === 'true';
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsGoogleAuth(storedIsGoogleAuth);
    }
  }, []);

  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Google OAuth success:', credentialResponse);
      
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }
      
      // Decode the JWT token to get user info
      const decodedToken = jwtDecode(credentialResponse.credential);
      console.log('Decoded JWT:', decodedToken);
      
      // Verify the token is from Google
      if (decodedToken.iss !== 'https://accounts.google.com' && 
          decodedToken.iss !== 'accounts.google.com') {
        throw new Error('Invalid token issuer');
      }
      
      // Get the API URL from environment variables
      const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5555';
      
      // Send the credential to your backend
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
        credentials: 'include', // Important for cookies/sessions
        mode: 'cors', // Ensure CORS mode is enabled
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      const data = await response.json();
      console.log('Backend response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store the token and user data
      if (data.access_token) {
        // Store token with the key that StudentDashBoard expects
        localStorage.setItem('access_token', data.access_token);
        
        // Also store refresh token if available
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        
        // Store user data and auth method
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isGoogleAuth', 'true');
        
        setUser(data.user);
        setIsGoogleAuth(true);
        toast.success('Successfully signed in with Google!');
        
        // Redirect based on user role or to dashboard
        const redirectPath = data.user.role === 'admin' ? '/admin-dashboard' : '/dashboard';
        navigate(redirectPath);
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      setError(error.message || 'Failed to sign in with Google');
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleGoogleError = useCallback((error) => {
    console.error('Google OAuth error:', error);
    setError('Google sign-in failed. Please try again.');
    toast.error('Google sign-in failed. Please try again.');
  }, []);

  const logout = useCallback(() => {
    try {
      // Clear user data and tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isGoogleAuth');
      
      // Reset state
      setUser(null);
      setIsGoogleAuth(false);
      setError(null);
      
      // Redirect to home page
      navigate('/');
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during sign out');
    }
  }, [navigate]);

  // Provide context value
  const contextValue = {
    user,
    isGoogleAuth,
    isLoading,
    error,
    handleGoogleSuccess,
    handleGoogleError,
    logout,
  };

  return (
    <GoogleOAuthContext.Provider value={contextValue}>
      {children}
    </GoogleOAuthContext.Provider>
  );
};

export default GoogleOAuthContext;


// import { GoogleLogin } from '@react-oauth/google';

// export default function GoogleSignInButton({ onSuccess, onError }) {
//   return (
//     <div className="w-full">
//       <GoogleLogin
//         onSuccess={onSuccess}
//         onError={onError}
//         useOneTap
//         theme="filled_blue"
//         size="large"
//         text="signin_with"
//         shape="rectangular"
//         logo_alignment="center"
//         width="100%"
//       />
//     </div>
//   );
// }