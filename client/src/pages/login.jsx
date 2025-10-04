import React, { useState, useEffect } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, provider } from "../components/firebase";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
const LoginForm = () => {
  const navigate = useNavigate();
  // State for login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const API_URL =
    import.meta.env.VITE_REACT_APP_API_URL
  console.log("API_URL in production:", API_URL);
  // New state to manage initial redirect check status
  const [isRedirectCheckDone, setIsRedirectCheckDone] = useState(false);
  // Single useEffect for handling Google login redirect and navigation
  useEffect(() => {
    const handleGoogleLoginCallback = async () => {
      setLoading(true);
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          const idToken = await user.getIdToken();
          const res = await fetch(`${API_URL}/api/auth/google-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
          const data = await res.json();
          if (!res.ok) {
            console.error("Server error:", data);
            toast.error(data.msg || "Google login failed on server");
          } else {
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            if (data.role) {
              localStorage.setItem("user_role", data.role);
            }
            toast.success(`Welcome, ${user.displayName || user.email}`);
            // Navigate based on role immediately after a successful response
            if (data.role === "student") {
              navigate("/dashboard");
            } else if (data.role === "admin") {
              navigate("/admin-dashboard");
            } else {
              navigate("/home");
            }
          }
        }
      } catch (error) {
        console.error("Error during Google sign-in:", error);
        toast.error("Google sign-in failed");
      } finally {
        setLoading(false);
        setIsRedirectCheckDone(true); // Mark check as complete
      }
    };
    handleGoogleLoginCallback();
  }, [navigate, API_URL]);
  // EMAIL / PASSWORD LOGIN -> calls Flask /login
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.msg || "Login failed");
      } else {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        if (data.role) {
          localStorage.setItem("user_role", data.role);
        }
        toast.success("Signed in successfully");
        if (data.role === "student") {
          navigate("/dashboard");
        } else if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  // GOOGLE LOGIN -> now initiates redirect
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      toast.error("Google sign-in failed");
      setLoading(false);
    }
  };
  // Wait until the redirect check is done before rendering the form
  if (!isRedirectCheckDone) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
        <p>Checking login status...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 overflow-hidden relative bg-black">
      {/* Background and overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url(/blue-wave-is-lit-up-black-background_889227-20579.png)",
          opacity: 0.7,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90"></div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
      {/* Home Link */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-1 text-sm text-white px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300 z-10 border border-white/20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
          className="h-4 w-4"
        >
          <path d="M10.707 1.293a1 1 0 00-1.414 0l-8 8A1 1 0 002 10h1v7a1 1 0 001 1h5v-5h2v5h5a1 1 0 001-1v-7h1a1 1 0 00.707-1.707l-8-8z" />
        </svg>
        <span>Home</span>
      </Link>
      {/* Glassmorphic Form */}
      <div className="w-full max-w-md p-8 rounded-2xl z-10 relative overflow-hidden">
        {/* Glassmorphic Container and Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-orange-500/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-orange-500/20 rounded-full filter blur-3xl" />
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-300 text-sm">Sign in to your account</p>
          </div>
          <form className="space-y-4" onSubmit={handleSignIn}>
            {/* Email Input */}
            <LabelInputContainer>
              <Label htmlFor="email" className="text-sm text-white text-left">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
            </LabelInputContainer>
            {/* Password Input with Visibility Toggle */}
            <LabelInputContainer>
              <Label
                htmlFor="password"
                className="text-sm text-white text-left"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm pr-10"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {/* Visibility Toggle Button */}
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="h-5 w-5"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.954 9.954 0 00-4.085.955L3.707 2.293zM10 14a4 4 0 00-4-4l-1.447-1.447a.5.5 0 01-.157-.354v-1.447a4 4 0 00-4-4V7a.5.5 0 01-.5-.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </LabelInputContainer>
            {/* Divider */}
            <div className="relative my-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gradient-to-r from-blue-900/80 via-blue-800/50 to-orange-500/50 text-sm text-gray-300 rounded-full backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </div>
            {/* Google Sign-In Button */}
            <div className="w-full flex justify-center mb-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className={`w-full py-3 px-4 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google Icon"
                  className="w-5 h-5 mr-2"
                />
                {loading ? "Signing in..." : "Sign in with Google"}
              </button>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-orange-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 mt-2 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-blue-500/20 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              {loading ? "Signing in..." : "Sign In"}
            </button>
            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-400 mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
            {/* Forgot Password Link */}
            <p className="text-center mt-2">
              <Link
                to="/forgot-password"
                className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
              >
                Forgot your password?
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
// Helper component for form inputs
const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col w-full space-y-1", className)}>
      {children}
    </div>
  );
};
