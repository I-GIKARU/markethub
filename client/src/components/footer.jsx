
// import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer className="bg-[#101F3C] text-white font-bold px-4 sm:px-6 lg:px-8 py-12 [p]:text-white [p]:font-bold [a]:text-white [a]:font-bold [span]:text-white [span]:font-bold">
//       <div className="max-w-7xl h-[460px] mx-auto">
//         <div className="grid grid-cols-3 gap-12 mb-8">
//           {/* Column 1: School Info with Logo */}
//           <div className="space-y-6">
//             <img
//               src="/Moringa Logo.png"
//               alt="Moringa Logo"
//               className="ml-10 w-100 h-15 object-contain"
//             />

//             {/* Navigation Links */}
//             <div className="mt-6 ml-30">
//               <ul className="space-y-3 text-sm">
//                 <li>
//                   <a
//                     href="#"
//                     className="hover:text-orange-500 transition-colors"
//                   >
//                     Courses
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="hover:text-orange-500 transition-colors"
//                   >
//                     Careers
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="hover:text-orange-500 transition-colors"
//                   >
//                     FAQs
//                   </a>
//                 </li>
//                 <li>
//                   <Link to="/contact">
//                     <a
//                       href="#"
//                       className="hover:text-orange-500 transition-colors"
//                     >
//                       Contact Us
//                     </a>
//                   </Link>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="hover:text-orange-500 transition-colors"
//                   >
//                     Privacy Policy
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="hover:text-orange-500 transition-colors"
//                   >
//                     Events
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Column 2: Contact & Quick Links */}
//           <div className="flex flex-col space-y-6">
//             {/* Physical Address */}
//             <div className="flex items-start space-x-3">
//               <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
//               <p className="text-sm leading-relaxed">
//                 Ngong Lane, Ngong Lane Plaza, 1st Floor,
//                 <br />
//                 Nairobi Kenya
//               </p>
//             </div>

//             {/* Phone Numbers */}
//             <div className="flex flex-col space-y-4">
//               <div className="flex items-center space-x-3">
//                 <Phone className="w-5 h-5 text-orange-500" />
//                 <span className="text-sm">
//                   +254711 082 146 (General Enquiries)
//                 </span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <MessageCircle className="w-5 h-5 text-orange-500" />
//                 <span className="text-sm">+254712 293 878 (Whatsapp)</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Phone className="w-5 h-5 text-orange-500" />
//                 <span className="text-sm">
//                   0738 368 319 (Corporate Inquiries)
//                 </span>
//               </div>
//             </div>

//             {/* Email Addresses */}
//             <div className="flex flex-col space-y-4">
//               <div className="flex items-center space-x-3">
//                 <Mail className="w-5 h-5 text-orange-500" />
//                 <span className="text-sm">contact@moringaschool.com</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Mail className="w-5 h-5 text-orange-500" />
//                 <span className="text-sm">admissions@moringaschool.com</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Mail className="w-5 h-5 text-orange-500" />
//                 <span className="text-sm">corporate@moringaschool.com</span>
//               </div>
//             </div>

//             {/* P.O Box */}
//             <div className="flex items-center space-x-3">
//               <MapPin className="w-5 h-5 text-orange-500" />
//               <span className="text-sm">P.O Box 28860 - 00100, Nairobi</span>
//             </div>
//           </div>

//           {/* Column 3: Map */}
//           <div className="space-y-6">
//             <div>
//               <iframe
//                 title="Moringa School Location"
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.790933742468!2d36.78771457497177!3d-1.297495535623098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10b75a109a93%3A0xc3f8b0e87b7a7c81!2sMoringa%20School!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
//                 width="100%"
//                 height="300"
//                 className="border-gray-600"
//                 allowFullScreen=""
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//               ></iframe>
//             </div>
//           </div>
//         </div>

//         {/* Footer Bottom */}
//         <p className="text-gray-400 text-sm text-center mt-20">
//           © 2025 Moringa School. All rights reserved.
//         </p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  ArrowUp,
  MessageCircle,
  Globe,
  Shield,
  Zap,
  BookOpen,
  Users,
} from "lucide-react";

const Footer = () => {
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    students: 0,
    graduates: 0,
    companies: 0,
  });
  const [typedText, setTypedText] = useState("");
  const [matrixChars, setMatrixChars] = useState([]);
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Typewriter effect for tagline
    const tagline = "Transforming Lives Through Technology";
    let currentIndex = 0;
    const typeTimer = setInterval(() => {
      if (currentIndex <= tagline.length) {
        setTypedText(tagline.slice(0, currentIndex));
        currentIndex++;
      } else {
        setTimeout(() => {
          currentIndex = 0;
          setTypedText("");
        }, 2000);
      }
    }, 100);

    // Matrix digital rain effect
    const createMatrixChars = () => {
      const chars = [];
      for (let i = 0; i < 20; i++) {
        chars.push({
          id: i,
          char: String.fromCharCode(0x30a0 + Math.random() * 96),
          x: Math.random() * 100,
          y: Math.random() * 100,
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.8 + 0.2,
        });
      }
      return chars;
    };

    setMatrixChars(createMatrixChars());

    const matrixTimer = setInterval(() => {
      setMatrixChars((prev) =>
        prev.map((char) => ({
          ...char,
          y: (char.y + char.speed) % 110,
          char:
            Math.random() > 0.98
              ? String.fromCharCode(0x30a0 + Math.random() * 96)
              : char.char,
        }))
      );
    }, 150);

    // Wave animation for divider
    const waveTimer = setInterval(() => {
      setWaveOffset((prev) => (prev + 2) % 360);
    }, 50);

    // Animate stats counter
    const animateStats = () => {
      const targets = { students: 5000, graduates: 2500, companies: 150 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;

      let step = 0;
      const statsTimer = setInterval(() => {
        step++;
        const progress = Math.min(step / steps, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setStats({
          students: Math.floor(targets.students * easeOut),
          graduates: Math.floor(targets.graduates * easeOut),
          companies: Math.floor(targets.companies * easeOut),
        });

        if (progress >= 1) clearInterval(statsTimer);
      }, increment);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setTimeout(animateStats, 500);
        }
      },
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById("futuristic-footer");
    if (footerElement) observer.observe(footerElement);

    return () => {
      clearInterval(timer);
      clearInterval(typeTimer);
      clearInterval(matrixTimer);
      clearInterval(waveTimer);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  const navigationLinks = [
    "Courses",
    "Careers",
    "FAQs",
    "Contact Us",
    "Privacy Policy",
    "Events",
  ];

  const contactInfo = [
    { icon: Phone, text: "+254711 082 146", label: "General Enquiries" },
    // { icon: MessageCircle, text: "+254712 293 878", label: "WhatsApp" },
    // { icon: Phone, text: "0738 368 319", label: "Corporate Inquiries" },
    { icon: Mail, text: "contact@moringaschool.com", label: "General Contact" },
    // { icon: Mail, text: "admissions@moringaschool.com", label: "Admissions" },
    { icon: Mail, text: "corporate@moringaschool.com", label: "Corporate" },
  ];

  return (
    <footer
      id="futuristic-footer"
      className="relative bg-gradient-to-br from-[#101F3C] via-slate-900 to-[#101F3C] text-white overflow-hidden font-bold"
    >
      {/* Rotating Globe Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="relative w-96 h-96">
          {/* Globe sphere */}
          <div
            className="absolute inset-0 rounded-full border-2 border-orange-400/30 animate-spin"
            style={{ animation: "globeRotate 20s linear infinite" }}
          >
            {/* Longitude lines */}
            {[0, 30, 60, 90, 120, 150].map((angle) => (
              <div
                key={angle}
                className="absolute inset-0 border border-orange-300/20 rounded-full"
                style={{
                  transform: `rotateY(${angle}deg)`,
                  borderStyle: "dashed",
                }}
              />
            ))}

            {/* Latitude lines */}
            {[0, 30, 60, 90, 120, 150].map((angle) => (
              <div
                key={`lat-${angle}`}
                className="absolute left-1/2 top-1/2 w-full border-t border-orange-300/20"
                style={{
                  transform: `translateX(-50%) translateY(-50%) rotateZ(${angle}deg)`,
                  borderStyle: "dashed",
                }}
              />
            ))}

            {/* Continents simulation */}
            <div className="absolute top-1/4 left-1/3 w-8 h-6 bg-orange-400/40 rounded-lg animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-6 h-8 bg-orange-400/40 rounded-lg animate-pulse delay-1000" />
            <div className="absolute bottom-1/3 left-1/4 w-10 h-4 bg-orange-400/40 rounded-lg animate-pulse delay-2000" />
            <div className="absolute bottom-1/4 right-1/3 w-5 h-7 bg-orange-400/40 rounded-lg animate-pulse delay-3000" />

            {/* Orbiting satellites */}
            <div
              className="absolute inset-0 animate-spin"
              style={{ animation: "satelliteOrbit1 15s linear infinite" }}
            >
              <div className="absolute -top-2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse" />
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{
                animation: "satelliteOrbit2 25s linear infinite reverse",
              }}
            >
              <div className="absolute -bottom-2 right-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 animate-pulse" />
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animation: "satelliteOrbit3 18s linear infinite" }}
            >
              <div className="absolute top-1/2 -right-2 w-2 h-2 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50 animate-pulse" />
            </div>
          </div>

          {/* Globe glow effect */}
          <div className="absolute inset-4 rounded-full bg-gradient-radial from-orange-500/10 via-blue-500/5 to-transparent animate-pulse" />

          {/* Data connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 384 384">
            <defs>
              <linearGradient
                id="connection-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Connection arcs */}
            <path
              d="M100,150 Q192,50 284,150"
              stroke="url(#connection-gradient)"
              strokeWidth="1"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M150,100 Q250,192 150,284"
              stroke="url(#connection-gradient)"
              strokeWidth="1"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <path
              d="M284,234 Q192,334 100,234"
              stroke="url(#connection-gradient)"
              strokeWidth="1"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: "2s" }}
            />

            {/* Connection nodes */}
            <circle
              cx="100"
              cy="150"
              r="3"
              fill="#f97316"
              className="animate-ping"
            />
            <circle
              cx="284"
              cy="150"
              r="3"
              fill="#3b82f6"
              className="animate-ping"
              style={{ animationDelay: "1s" }}
            />
            <circle
              cx="150"
              cy="100"
              r="3"
              fill="#f97316"
              className="animate-ping"
              style={{ animationDelay: "2s" }}
            />
            <circle
              cx="250"
              cy="192"
              r="3"
              fill="#3b82f6"
              className="animate-ping"
              style={{ animationDelay: "3s" }}
            />
          </svg>
        </div>
      </div>

      {/* Matrix Digital Rain */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {matrixChars.map((char) => (
          <div
            key={char.id}
            className="absolute text-green-400 font-mono text-xs"
            style={{
              left: `${char.x}%`,
              top: `${char.y}%`,
              opacity: char.opacity,
              textShadow: "0 0 10px currentColor",
            }}
          >
            {char.char}
          </div>
        ))}
      </div>

      {/* Holographic Scanning Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
          style={{
            top: "20%",
            animation: "scanLine 4s linear infinite",
          }}
        ></div>
        <div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-30"
          style={{
            top: "60%",
            animation: "scanLine 6s linear infinite reverse",
          }}
        ></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Animated Stats Section */}
        <div
          className={`mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                label: "Active Students",
                value: stats.students,
                color: "text-blue-400",
              },
              {
                icon: BookOpen,
                label: "Graduates",
                value: stats.graduates,
                color: "text-green-400",
              },
              {
                icon: Zap,
                label: "Partner Companies",
                value: stats.companies,
                color: "text-orange-400",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600 hover:border-orange-500 transition-all duration-500 hover:scale-105 group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <Icon
                    className={`w-8 h-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                  />
                  <div
                    className={`text-3xl font-bold mb-2 ${stat.color} animate-pulse`}
                  >
                    {stat.value.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Top Section */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Column 1: School Info with Logo */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4 group">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <Shield className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Moringa School
                </h3>
                <div className="text-xs text-gray-300 min-h-[20px] relative">
                  <span className="inline-block">{typedText}</span>
                  <span className="inline-block w-0.5 h-4 bg-orange-400 ml-1 animate-pulse"></span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-400 flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span>Quick Links</span>
              </h4>
              <ul className="grid grid-cols-2 gap-3">
                {navigationLinks.map((link, index) => (
                  <li
                    key={index}
                    className="transform hover:scale-105 transition-transform duration-300"
                  >
                    <a
                      href="#"
                      className="text-gray-300 hover:text-orange-400 transition-all duration-300 inline-block group text-sm relative overflow-hidden"
                      style={{
                        animation: `slideInLeft 0.5s ease-out ${
                          index * 0.1
                        }s both`,
                      }}
                    >
                      <span className="relative z-10 border-b border-transparent group-hover:border-orange-400 transition-all duration-300">
                        {link}
                      </span>
                      <div className="absolute inset-0 w-0 bg-gradient-to-r from-orange-500/20 to-transparent group-hover:w-full transition-all duration-500"></div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Live Status */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-lg border border-slate-600 hover:border-green-400 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div
                  className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-blue-400"
                  style={{ animation: "progress 2s ease-in-out infinite" }}
                ></div>
              </div>
              <div className="flex items-center space-x-2 text-sm relative z-10">
                <Globe className="w-4 h-4 text-green-400 animate-spin group-hover:animate-pulse" />
                <span className="text-green-400 animate-pulse">
                  Online Learning Available
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1 relative z-10">
                24/7 Student Support
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1 mt-2 relative z-10">
                <div
                  className="bg-green-400 h-1 rounded-full animate-pulse"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Information */}
          <div className="space-y-8">
            <h4 className="text-lg font-semibold text-orange-400 flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Get In Touch</span>
            </h4>

            {/* Physical Address */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-lg border border-slate-600">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white leading-relaxed">
                    Ngong Lane, Ngong Lane Plaza, 1st Floor,
                    <br />
                    Nairobi Kenya
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    P.O Box 28860 - 00100, Nairobi
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 group hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      <Icon className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-all duration-300 group-hover:rotate-12" />
                      <div className="absolute -inset-1 bg-orange-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-white block group-hover:text-orange-100 transition-colors duration-300">
                        {contact.text}
                      </span>
                      <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {contact.label}
                      </span>
                    </div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Map & Time */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-blue-400 flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Find Us</span>
            </h4>

            {/* Live Clock */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-lg border border-slate-600">
              <div className="text-xs text-gray-400 mb-1">NAIROBI TIME</div>
              <div className="text-xl font-mono text-blue-400 font-bold">
                {time.toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-300 font-bold">
                {time.toLocaleDateString()}
              </div>
            </div>

            {/* Map Container */}
            <div className="relative rounded-lg overflow-hidden border-2 border-slate-600 hover:border-orange-500 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent z-10"></div>
              <div className="relative w-full h-[300px] rounded-lg overflow-hidden shadow-lg z-10">
                <iframe
                  title="Moringa School Location"
                  src="https://maps.google.com/maps?q=Moringa+School,+Nairobi,+Kenya&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 1,
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Divider with Wave Animation */}
        <div className="relative mb-8 overflow-hidden">
          <svg
            className="w-full h-4"
            viewBox="0 0 400 20"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="wave-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="transparent" />
                <stop offset="25%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="75%" stopColor="#f97316" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d={`M0,10 Q${100 + Math.sin((waveOffset * Math.PI) / 180) * 20},${
                5 + Math.sin((waveOffset * Math.PI) / 180) * 3
              } ${200},10 Q${
                300 + Math.sin(((waveOffset + 180) * Math.PI) / 180) * 20
              },${
                15 + Math.sin(((waveOffset + 180) * Math.PI) / 180) * 3
              } 400,10`}
              stroke="url(#wave-gradient)"
              strokeWidth="2"
              fill="none"
              className="drop-shadow-glow"
            />
          </svg>

          {/* Data Stream Effect */}
          <div className="absolute top-1/2 left-0 w-2 h-2">
            <div
              className="w-full h-full bg-orange-400 rounded-full animate-ping"
              style={{ animation: "dataStream 3s linear infinite" }}
            ></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm mr-4 font-bold">
              Connect With Us:
            </span>
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-lg flex items-center justify-center hover:from-orange-600 hover:to-orange-700 hover:border-orange-400 transition-all duration-300 hover:scale-110 hover:rotate-3 group"
                >
                  <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="text-center lg:text-left">
            <p className="text-gray-400 text-sm font-bold">
              © 2025 Moringa School. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1 font-bold">
              Empowering the Next Generation of Tech Leaders
            </p>
          </div>

          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 group relative overflow-hidden"
          >
            <ArrowUp className="w-5 h-5 text-white group-hover:animate-bounce z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          </button>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500 animate-pulse"></div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(
              rgba(249, 115, 22, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        @keyframes scanLine {
          0% {
            transform: translateY(-100vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes slideInLeft {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }

        @keyframes dataStream {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) scale(0.5);
            opacity: 0;
          }
        }

        .drop-shadow-glow {
          filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.5));
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </footer>
  );
};

export default Footer;