
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, LogIn, Menu, X } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="w-screen bg-gray-900 text-white">
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <Link to="/" className="flex flex-col items-start group">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-300 font-calligraphy relative z-10">
                  Innovation
                </span>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-400 font-calligraphy -mt-2 relative z-10">
                  Marketplace
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/home"
                className="text-white/90 hover:text-orange-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/5 transform hover:scale-110"
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="text-white/90 hover:text-orange-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/5 transform hover:scale-110"
              >
                Projects
              </Link>
              <Link
                to="/shop"
                className="text-white/90 hover:text-orange-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/5 transform hover:scale-110"
              >
                Shop
              </Link>
              <Link
                to="/contact"
                className="text-white/90 hover:text-orange-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/5 transform hover:scale-110"
              >
                Contact Us
              </Link>
            </div>

            {/* Right: Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/signup"
                className="flex items-center space-x-2 text-white/90 hover:text-white px-4 py-2 rounded-lg border border-orange-500/30 bg-orange-600/10 hover:bg-orange-500/20 transition-all duration-300 hover:shadow-md hover:shadow-orange-500/20 transform hover:scale-110"
              >
                <User size={16} className="text-orange-300" />
                <span>Sign Up</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-110 hover:brightness-110"
              >
                <LogIn size={16} className="text-white" />
                <span>Log In</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/home"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                onClick={toggleMenu}
              >
                Projects
              </Link>
              <Link
                to="/shop"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                onClick={toggleMenu}
              >
                Shop
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                onClick={toggleMenu}
              >
                Contact Us
              </Link>
              <div className="pt-4 border-t border-gray-700">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 mb-2"
                  onClick={toggleMenu}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-4 py-2 border border-orange-500 rounded-md shadow-sm text-base font-medium text-orange-300 bg-orange-500/10 hover:bg-orange-500/20"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}


// "use client";
// import React, { useState, useEffect } from "react";
// import { Menu, X, Home, MessageCircle, LogIn, UserPlus } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function NavBar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [activeItem, setActiveItem] = useState("Home");
//   const [scrolled, setScrolled] = useState(false);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const navItems = [
//     {
//       name: "Home",
//       link: "/",
//       icon: <Home className="h-4 w-4" />,
//     },
//     {
//       name: "Contact",
//       link: "/contact",
//       icon: <MessageCircle className="h-4 w-4" />,
//     },
//     {
//       name: "Login",
//       link: "/login",
//       icon: <LogIn className="h-4 w-4" />,
//       type: "button",
//     },
//     {
//       name: "Sign Up",
//       link: "/signup",
//       icon: <UserPlus className="h-4 w-4" />,
//       type: "button-primary",
//     },
//   ];

//   const handleItemClick = (itemName) => {
//     setActiveItem(itemName);
//     setIsMenuOpen(false);
//   };

//   return (
//     <>
//       {/* Background overlay for mobile menu */}
//       {isMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
//           onClick={() => setIsMenuOpen(false)}
//         />
//       )}

//       {/* Floating Navbar */}
//       <div
//         className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
//           scrolled ? "top-4 scale-95" : "top-6 scale-100"
//         }`}
//       >
//         {/* Desktop Floating Navbar */}
//         <nav className="hidden md:flex items-center bg-black/95 backdrop-blur-2xl rounded-full px-4 py-3 shadow-2xl border border-white/10 relative overflow-hidden group">
//           {/* Animated background glow */}
//           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
//           {/* Glass effect overlay */}
//           <div className="absolute inset-0 bg-white/3 rounded-full" />

//           <div className="relative flex items-center space-x-1">
//             {navItems.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.link}
//                 onClick={() => handleItemClick(item.name)}
//                 className={`group/item relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 ${
//                   activeItem === item.name
//                     ? "text-white bg-white/10"
//                     : "text-gray-300 hover:text-white hover:bg-white/5"
//                 }`}
//               >
//                 {item.icon && (
//                   <span
//                     className={`transition-all duration-300 text-gray-400 group-hover/item:text-white ${
//                       activeItem === item.name
//                         ? "scale-110"
//                         : "group-hover/item:scale-110"
//                     }`}
//                   >
//                     {item.icon}
//                   </span>
//                 )}
//                 <span className="relative z-10">{item.name}</span>

//                 {/* Active indicator */}
//                 {activeItem === item.name && !item.type && (
//                   <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse" />
//                 )}

//                 {/* Hover glow effect */}
//                 <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
//               </Link>
//             ))}
//           </div>
//         </nav>

//         {/* Mobile Floating Button */}
//         <div className="md:hidden relative">
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className={`flex items-center justify-center w-16 h-16 bg-black/95 backdrop-blur-2xl rounded-full shadow-2xl text-white transition-all duration-300 border border-white/10 group relative overflow-hidden ${
//               isMenuOpen ? "scale-110 rotate-90" : "hover:scale-105"
//             }`}
//           >
//             {/* Animated background */}
//             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

//             <div className="relative z-10">
//               {isMenuOpen ? (
//                 <X className="w-6 h-6 transition-transform duration-300" />
//               ) : (
//                 <Menu className="w-6 h-6 transition-transform duration-300" />
//               )}
//             </div>
//           </button>

//           {/* Mobile Menu */}
//           <div
//             className={`absolute top-20 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-out ${
//               isMenuOpen
//                 ? "opacity-100 scale-100 translate-y-0"
//                 : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
//             }`}
//           >
//             <div className="bg-black/95 backdrop-blur-2xl rounded-2xl p-3 shadow-2xl border border-white/10 min-w-[200px] relative overflow-hidden">
//               {/* Glass effect overlay */}
//               <div className="absolute inset-0 bg-white/5 rounded-2xl" />

//               <div className="relative space-y-1">
//                 {navItems.map((item, index) => (
//                   <Link
//                     key={item.name}
//                     to={item.link}
//                     onClick={() => handleItemClick(item.name)}
//                     style={{ animationDelay: `${index * 50}ms` }}
//                     className={`group/item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 animate-slideIn ${
//                       activeItem === item.name
//                         ? "text-white bg-white/10"
//                         : "text-gray-300 hover:text-white hover:bg-white/5"
//                     }`}
//                   >
//                     {item.icon && (
//                       <span className="text-gray-400 group-hover/item:text-white transition-all duration-300">
//                         {item.icon}
//                       </span>
//                     )}
//                     <span className="flex-1 text-left">{item.name}</span>

//                     {/* Active indicator */}
//                     {activeItem === item.name && !item.type && (
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
//                     )}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slideIn {
//           animation: slideIn 0.3s ease-out forwards;
//         }
//       `}</style>
//     </>
//   );
// }
