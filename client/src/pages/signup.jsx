// "use client";
// import React, { useState } from "react";
// import { Label } from "../components/ui/label";
// import { Input } from "../components/ui/input";
// import { cn } from "@/lib/utils";
// import { Link, useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function SignupForm() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     // 'role' removed from state as frontend no longer sends it for registration
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.id]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const {
//       first_name,
//       last_name,
//       username,
//       email,
//       password,
//       confirmPassword,
//     } = formData;

//     // Frontend validation
//     if (
//       !first_name ||
//       !last_name ||
//       !username ||
//       !email ||
//       !password ||
//       !confirmPassword
//     ) {
//       toast.error("Please fill in all required fields.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("http://127.0.0.1:5555/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           first_name,
//           last_name,
//           username,
//           email,
//           password,
//           // Do NOT send 'role' here. Backend determines it based on email.
//           bio: "", // You can make these optional or collect them on a profile page later
//           github: "",
//           linkedin: "",
//           skills: "",
//           profile_pic: "",
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success("Signup successful! Please log in.");
//         console.log("Registered User Data:", data); // Log the full response data
//         if (data.role) {
//           console.log("User registered with role:", data.role); // Access the role directly from backend response
//         }
//         navigate("/login"); // Redirect to login page after successful signup
//       } else {
//         toast.error(data.msg || "Signup failed. Please try again.");
//       }
//     } catch (err) {
//       console.error("Signup error:", err);
//       toast.error("Network error or server unreachable. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-black px-4 overflow-hidden relative">
//       <ToastContainer position="top-center" autoClose={2000} />
//       {/* Ensure this Link does not contain another <a> or Link inside it */}
//       <Link
//         to="/"
//         className="absolute top-4 left-4 flex items-center gap-1 text-sm text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors duration-200"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//           className="h-4 w-4"
//         >
//           <path d="M10.707 1.293a1 1 0 00-1.414 0l-8 8A1 1 0 002 10h1v7a1 1 0 001 1h5v-5h2v5h5a1 1 0 001-1v-7h1a1 1 0 00.707-1.707l-8-8z" />
//         </svg>
//         <span>Home</span>
//       </Link>

//       <div className="w-full max-w-md bg-black p-4 md:rounded-2xl md:p-8 border-none">
//         <h2 className="text-xl font-bold text-white text-center mb-4">
//           Create Account
//         </h2>

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <div className="flex flex-col gap-4 md:flex-row">
//             <LabelInputContainer>
//               <Label
//                 htmlFor="first_name"
//                 className="text-sm text-white text-left"
//               >
//                 First name
//               </Label>
//               <Input
//                 id="first_name"
//                 type="text"
//                 placeholder="First Name"
//                 className="bg-zinc-900 text-white"
//                 value={formData.first_name}
//                 onChange={handleChange}
//                 required
//               />
//             </LabelInputContainer>
//             <LabelInputContainer>
//               <Label
//                 htmlFor="last_name"
//                 className="text-sm text-white text-left"
//               >
//                 Last name
//               </Label>
//               <Input
//                 id="last_name"
//                 type="text"
//                 placeholder="Last Name"
//                 className="bg-zinc-900 text-white"
//                 value={formData.last_name}
//                 onChange={handleChange}
//                 required
//               />
//             </LabelInputContainer>
//           </div>

//           <LabelInputContainer>
//             <Label htmlFor="username" className="text-sm text-white text-left">
//               Username
//             </Label>
//             <Input
//               id="username"
//               type="text"
//               placeholder="Username"
//               className="bg-zinc-900 text-white"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//           </LabelInputContainer>

//           <LabelInputContainer>
//             <Label htmlFor="email" className="text-sm text-white text-left">
//               Email Address
//             </Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="Email"
//               className="bg-zinc-900 text-white"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </LabelInputContainer>

//           <LabelInputContainer>
//             <Label htmlFor="password" className="text-sm text-white text-left">
//               Password
//             </Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="Password"
//               className="bg-zinc-900 text-white"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </LabelInputContainer>

//           <LabelInputContainer>
//             <Label
//               htmlFor="confirmPassword"
//               className="text-sm text-white text-left"
//             >
//               Confirm Password
//             </Label>
//             <Input
//               id="confirmPassword"
//               type="password"
//               placeholder="Confirm Password"
//               className="bg-zinc-900 text-white"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//             />
//           </LabelInputContainer>

//           <button
//             className="relative group/btn h-10 w-full rounded-md bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition mt-2 disabled:opacity-50"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? "Signing up..." : "Sign up"}
//             <BottomGradient />
//           </button>

//           <p className="text-sm text-neutral-400 text-center">
//             Already have an account?{" "}
//             <Link to="/login" className="text-cyan-700 hover:underline">
//               Login here
//             </Link>
//           </p>

//           <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />
//         </form>
//       </div>
//     </div>
//   );
// }

// // Utility components (assuming these are defined elsewhere or provided)
// const LabelInputContainer = ({ children, className }) => (
//   <div className={cn("flex flex-col w-full space-y-1", className)}>
//     {children}
//   </div>
// );

// const BottomGradient = () => (
//   <>
//     <span className="absolute inset-x-0 -bottom-px block h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover/btn:opacity-100" />
//     <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm group-hover/btn:opacity-100" />
//   </>
// );

"use client";
import React, { useState, useContext } from "react";
import { useGoogleAuth } from "../context/GoogleOAuthContext";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function SignupForm() {
  const navigate = useNavigate();
  const { handleGoogleSuccess, handleGoogleError, isLoading, error } =
    useGoogleAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    // 'role' removed from state as frontend no longer sends it for registration
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      confirmPassword,
    } = formData;

    // Frontend validation
    if (
      !first_name ||
      !last_name ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5555/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          username,
          email,
          password,
          // Do NOT send 'role' here. Backend determines it based on email.
          bio: "", // You can make these optional or collect them on a profile page later
          github: "",
          linkedin: "",
          skills: "",
          profile_pic: "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Signup successful! Please log in.");
        console.log("Registered User Data:", data); // Log the full response data
        if (data.role) {
          console.log("User registered with role:", data.role); // Access the role directly from backend response
        }
        navigate("/login"); // Redirect to login page after successful signup
      } else {
        toast.error(data.msg || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Network error or server unreachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 overflow-hidden relative bg-black">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url(/blue-wave-is-lit-up-black-background_889227-20579.png)",
          opacity: 0.7,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
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

      <div className="w-full max-w-md p-8 rounded-2xl z-10 relative overflow-hidden">
        {/* Glassmorphic Container */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-orange-500/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl" />

        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-orange-500/20 rounded-full filter blur-3xl" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Create Account
            </h2>
            <p className="text-gray-300 text-sm">
              Join our community of developers and designers
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 md:flex-row">
              <LabelInputContainer>
                <Label
                  htmlFor="first_name"
                  className="text-sm text-white text-left"
                >
                  First name
                </Label>
                <Input
                  id="first_name"
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label
                  htmlFor="last_name"
                  className="text-sm text-white text-left"
                >
                  Last name
                </Label>
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </LabelInputContainer>
            </div>

            <LabelInputContainer>
              <Label
                htmlFor="username"
                className="text-sm text-white text-left"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="email" className="text-sm text-white text-left">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label
                htmlFor="password"
                className="text-sm text-white text-left"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label
                htmlFor="confirmPassword"
                className="text-sm text-white text-left"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>

            {/* Google Sign-In Button */}
            <div className="relative w-full mt-4 mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="w-full flex justify-center mb-4">
              <div className="w-full">
                <div className="relative w-full">
                  <GoogleOAuthProvider
                    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                  >
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap
                      auto_select
                      theme="filled_black"
                      size="large"
                      text="signup_with"
                      shape="rectangular"
                      width="100%"
                      className={`w-full google-signin-button ${
                        isLoading ? "opacity-50" : ""
                      }`}
                      disabled={isLoading}
                      ux_mode="popup"
                      scope="openid profile email"
                      prompt="select_account"
                      cookie_policy="single_host_origin"
                    />
                  </GoogleOAuthProvider>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              className="relative group/btn w-full rounded-lg bg-gradient-to-r from-blue-600 to-orange-500 text-white font-medium py-3 px-4 hover:opacity-90 transition-all duration-300 mt-2 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-sm text-neutral-400 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-700 hover:underline">
                Login here
              </Link>
            </p>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-600 to-transparent"></div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper component for form inputs
function LabelInputContainer({ children, className }) {
  return (
    <div className={cn("flex flex-col w-full space-y-1", className)}>
      {children}
    </div>
  );
}

function BottomGradient() {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover/btn:opacity-100"></span>
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm group-hover/btn:opacity-100"></span>
    </>
  );
}