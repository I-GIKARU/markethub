// import React, { useState, useEffect, useRef } from "react";
// import {
//   Mail,
//   Phone,
//   MapPin,
//   MessageCircle,
//   Send,
//   User,
//   Clock,
//   Globe,
//   Shield,
//   Zap,
//   ChevronRight,
//   Check,
//   Home,
// } from "lucide-react";
// import * as THREE from "three";
// import { Link } from "react-router-dom";

// const ContactUs = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",
//     course: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState("");
//   const [focusedField, setFocusedField] = useState("");
//   const [typedText, setTypedText] = useState("");
//   const [particleSystem, setParticleSystem] = useState([]);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const globeRef = useRef(null);
//   const rendererRef = useRef(null);

//   // Update time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Initialize 3D background globe
//   useEffect(() => {
//     const initGlobe = () => {
//       if (!globeRef.current) return;

//       const scene = new THREE.Scene();
//       const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
//       camera.position.z = 3;

//       const renderer = new THREE.WebGLRenderer({
//         alpha: true,
//         antialias: true,
//       });
//       renderer.setSize(300, 300);
//       renderer.setClearColor(0x000000, 0);
//       globeRef.current.appendChild(renderer.domElement);
//       rendererRef.current = renderer;

//       const geometry = new THREE.SphereGeometry(0.8, 32, 32);
//       const material = new THREE.ShaderMaterial({
//         uniforms: { time: { value: 0 } },
//         vertexShader: `
//           varying vec2 vUv;
//           varying vec3 vPosition;
//           void main() {
//             vUv = uv;
//             vPosition = position;
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//           }
//         `,
//         fragmentShader: `
//           uniform float time;
//           varying vec2 vUv;
//           varying vec3 vPosition;
          
//           void main() {
//             vec2 uv = vUv;
//             float continents = sin(uv.x * 8.0 + time * 0.3) * sin(uv.y * 6.0);
//             continents = smoothstep(0.1, 0.7, continents);
            
//             vec3 oceanColor = vec3(0.1, 0.4, 0.9);
//             vec3 landColor = vec3(0.9, 0.5, 0.2);
            
//             vec3 color = mix(oceanColor, landColor, continents);
//             float rim = 1.0 - dot(normalize(vPosition), vec3(0.0, 0.0, 1.0));
//             color += rim * vec3(0.9, 0.5, 0.2) * 0.6;
            
//             gl_FragColor = vec4(color, 0.7);
//           }
//         `,
//         transparent: true,
//       });

//       const earth = new THREE.Mesh(geometry, material);
//       scene.add(earth);

//       const animate = () => {
//         requestAnimationFrame(animate);
//         earth.rotation.y += 0.003;
//         earth.material.uniforms.time.value += 0.01;
//         renderer.render(scene, camera);
//       };
//       animate();
//     };

//     initGlobe();

//     const phrases = [
//       "Get In Touch",
//       "Start Your Journey",
//       "Join Our Community",
//     ];
//     let phraseIndex = 0;
//     let charIndex = 0;
//     let isDeleting = false;

//     const typeTimer = setInterval(
//       () => {
//         const currentPhrase = phrases[phraseIndex];

//         if (isDeleting) {
//           setTypedText(currentPhrase.substring(0, charIndex - 1));
//           charIndex--;
//           if (charIndex === 0) {
//             isDeleting = false;
//             phraseIndex = (phraseIndex + 1) % phrases.length;
//           }
//         } else {
//           setTypedText(currentPhrase.substring(0, charIndex + 1));
//           charIndex++;
//           if (charIndex === currentPhrase.length) {
//             setTimeout(() => {
//               isDeleting = true;
//             }, 2000);
//           }
//         }
//       },
//       isDeleting ? 50 : 100
//     );

//     return () => {
//       clearInterval(typeTimer);
//       if (rendererRef.current && globeRef.current) {
//         globeRef.current.removeChild(rendererRef.current.domElement);
//         rendererRef.current.dispose();
//       }
//     };
//   }, []);

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Simulate form submission
//     setTimeout(() => {
//       setIsSubmitting(false);
//       setSubmitStatus("success");
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         subject: "",
//         message: "",
//         course: "",
//       });

//       setTimeout(() => setSubmitStatus(""), 3000);
//     }, 2000);
//   };

//   const contactInfo = [
//     {
//       icon: Phone,
//       label: "Phone",
//       value: "+254711 082 146",
//       subtext: "General Inquiries",
//     },
//     {
//       icon: MessageCircle,
//       label: "WhatsApp",
//       value: "+254712 293 878",
//       subtext: "Quick Support",
//     },
//     {
//       icon: MapPin,
//       label: "Address",
//       value: "Ngong Lane Plaza, 1st Floor",
//       subtext: "Nairobi, Kenya",
//     },
//     {
//       icon: Clock,
//       label: "Current Time",
//       value: currentTime.toLocaleTimeString(),
//       subtext: currentTime.toLocaleDateString(),
//     },
//   ];

//   const features = [
//     { icon: Clock, title: "24/7 Support", desc: "Round-the-clock assistance" },
//     {
//       icon: Globe,
//       title: "Global Reach",
//       desc: "Worldwide learning community",
//     },
//     { icon: Shield, title: "Secure", desc: "Your data is protected" },
//     { icon: Zap, title: "Fast Response", desc: "Quick turnaround time" },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#101F3C] via-slate-900 to-[#101F3C] text-white relative overflow-hidden">
//       {/* Home Icon Button */}
//       <Link
//         to="/"
//         className="absolute top-6 left-6 z-50 p-2 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-orange-400 transition-colors duration-300 group"
//         aria-label="Home"
//       >
//         <Home className="w-6 h-6 text-orange-400 group-hover:text-white transition-colors duration-300" />
//       </Link>

//       <div className="absolute inset-0 pointer-events-none">
//         {particleSystem.map((particle) => (
//           <div
//             key={particle.id}
//             className="absolute w-1 h-1 bg-orange-400 rounded-full animate-pulse"
//             style={{
//               left: `${particle.x}%`,
//               top: `${particle.y}%`,
//               opacity: particle.opacity,
//               transform: `scale(${particle.size})`,
//               animation: `float ${
//                 3 + particle.id * 0.1
//               }s ease-in-out infinite alternate`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Animated Grid Pattern */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="w-full h-full bg-grid-pattern animate-pulse" />
//       </div>

//       {/* Scanning Lines */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-30 animate-scan" />
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Header Section */}
//         <div className="text-center mb-16">
//           <div className="flex items-center justify-center mb-8">
//             <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group hover:scale-110 transition-transform duration-500">
//               <MessageCircle className="w-8 h-8 text-white group-hover:animate-bounce" />
//             </div>
//           </div>

//           <h1 className="text-5xl md:text-7xl font-bold mb-6">
//             <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
//               {typedText}
//             </span>
//             <span className="inline-block w-1 h-16 bg-orange-400 ml-2 animate-pulse" />
//           </h1>

//           <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
//             Ready to transform your career with cutting-edge technology skills?
//             <span className="text-orange-400 font-semibold">
//               {" "}
//               Let's start the conversation.
//             </span>
//           </p>

//           {/* Feature Pills */}
//           <div className="flex flex-wrap justify-center gap-4 mb-12">
//             {features.map((feature, index) => {
//               const Icon = feature.icon;
//               return (
//                 <div
//                   key={index}
//                   className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-600 hover:border-orange-400 transition-all duration-300 group"
//                   style={{ animationDelay: `${index * 200}ms` }}
//                 >
//                   <Icon className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
//                   <span className="text-sm font-medium">{feature.title}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
//           {/* Contact Form */}
//           <div className="space-y-8">
//             <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-lg border border-slate-600 rounded-2xl p-8 hover:border-orange-400/50 transition-all duration-500 group">
//               <div className="flex items-center space-x-3 mb-8">
//                 <Send className="w-6 h-6 text-orange-400 animate-pulse" />
//                 <h2 className="text-2xl font-bold">Send us a Message</h2>
//               </div>

//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="relative">
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Full Name
//                     </label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-400" />
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         onFocus={() => setFocusedField("name")}
//                         onBlur={() => setFocusedField("")}
//                         className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
//                           focusedField === "name"
//                             ? "border-orange-400 shadow-lg shadow-orange-400/25"
//                             : "border-slate-600"
//                         }`}
//                         placeholder="Enter your full name"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="relative">
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-7 h-2 text-orange-400" />
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         onFocus={() => setFocusedField("email")}
//                         onBlur={() => setFocusedField("")}
//                         className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
//                           focusedField === "email"
//                             ? "border-orange-400 shadow-lg shadow-orange-400/25"
//                             : "border-slate-600"
//                         }`}
//                         placeholder="your.email@example.com"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="relative">
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Phone Number
//                     </label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-400" />
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         onFocus={() => setFocusedField("phone")}
//                         onBlur={() => setFocusedField("")}
//                         className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
//                           focusedField === "phone"
//                             ? "border-orange-400 shadow-lg shadow-orange-400/25"
//                             : "border-slate-600"
//                         }`}
//                         placeholder="+254 xxx xxx xxx"
//                       />
//                     </div>
//                   </div>

//                   <div className="relative">
//                     <label className="block text-sm font-medium text-gray-300 mb-2">
//                       Course Interest
//                     </label>
//                     <select
//                       name="course"
//                       value={formData.course}
//                       onChange={handleInputChange}
//                       onFocus={() => setFocusedField("course")}
//                       onBlur={() => setFocusedField("")}
//                       className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
//                         focusedField === "course"
//                           ? "border-orange-400 shadow-lg shadow-orange-400/25"
//                           : "border-slate-600"
//                       }`}
//                     >
//                       <option value="">Select a course</option>
//                       <option value="web-development">Web Development</option>
//                       <option value="data-science">Data Science</option>
//                       <option value="mobile-development">
//                         Mobile Development
//                       </option>
//                       <option value="ui-ux-design">UI/UX Design</option>
//                       <option value="cybersecurity">Cybersecurity</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Subject
//                   </label>
//                   <input
//                     type="text"
//                     name="subject"
//                     value={formData.subject}
//                     onChange={handleInputChange}
//                     onFocus={() => setFocusedField("subject")}
//                     onBlur={() => setFocusedField("")}
//                     className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
//                       focusedField === "subject"
//                         ? "border-orange-400 shadow-lg shadow-orange-400/25"
//                         : "border-slate-600"
//                     }`}
//                     placeholder="What's this about?"
//                     required
//                   />
//                 </div>

//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Message
//                   </label>
//                   <textarea
//                     name="message"
//                     value={formData.message}
//                     onChange={handleInputChange}
//                     onFocus={() => setFocusedField("message")}
//                     onBlur={() => setFocusedField("")}
//                     rows={5}
//                     className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none resize-none transition-all duration-300 ${
//                       focusedField === "message"
//                         ? "border-orange-400 shadow-lg shadow-orange-400/25"
//                         : "border-slate-600"
//                     }`}
//                     placeholder="Tell us more about your inquiry..."
//                     required
//                   />
//                 </div>

//                 <button
//                   disabled={isSubmitting}
//                   onClick={handleSubmit}
//                   className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   <div className="relative flex items-center justify-center space-x-2">
//                     {isSubmitting ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         <span>Sending...</span>
//                       </>
//                     ) : (
//                       <>
//                         <Send className="w-5 h-5" />
//                         <span>Send Message</span>
//                         <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//                       </>
//                     )}
//                   </div>
//                 </button>

//                 {submitStatus === "success" && (
//                   <div className="flex items-center space-x-2 p-4 bg-green-500/20 border border-green-500/50 rounded-lg animate-fadeIn">
//                     <Check className="w-5 h-5 text-green-400" />
//                     <span className="text-green-400 font-medium">
//                       Message sent successfully! We'll get back to you soon.
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Contact Information & Globe */}
//           <div className="space-y-8">
//             {/* Contact Information Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {contactInfo.map((info, index) => {
//                 const Icon = info.icon;
//                 return (
//                   <div
//                     key={index}
//                     className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-lg border border-slate-600 rounded-xl p-6 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 group"
//                     style={{ animationDelay: `${index * 200}ms` }}
//                   >
//                     <div className="flex items-start space-x-4">
//                       <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                         <Icon className="w-6 h-6 text-white" />
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-orange-400 mb-1">
//                           {info.label}
//                         </h3>
//                         <p className="text-white font-medium mb-1">
//                           {info.value}
//                         </p>
//                         <p className="text-sm text-gray-400">{info.subtext}</p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Office Hours */}
//             <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-lg border border-slate-600 rounded-xl p-6 hover:border-orange-400/50 transition-all duration-300">
//               <div className="flex items-center space-x-3 mb-4">
//                 <Clock className="w-6 h-6 text-orange-400" />
//                 <h3 className="text-xl font-semibold">Office Hours</h3>
//               </div>
//               <div className="space-y-2 text-gray-300">
//                 <div className="flex justify-between">
//                   <span>Monday - Friday</span>
//                   <span className="text-orange-400 font-medium">
//                     8:00 AM - 5:00 PM
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Saturday</span>
//                   <span className="text-orange-400 font-medium">
//                     9:00 AM - 12:00 PM
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Sunday</span>
//                   <span className="text-gray-500">Closed</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .bg-grid-pattern {
//           background-image: linear-gradient(
//               rgba(249, 115, 22, 0.1) 1px,
//               transparent 1px
//             ),
//             linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px);
//           background-size: 20px 20px;
//         }

//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-10px) rotate(180deg);
//           }
//         }

//         @keyframes scan {
//           0% {
//             transform: translateY(-100vh);
//             top: 0%;
//           }
//           100% {
//             transform: translateY(100vh);
//             top: 100%;
//           }
//         }

//         .animate-scan {
//           animation: scan 8s linear infinite;
//         }

//         @keyframes fadeIn {
//           0% {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.5s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ContactUs;

import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  User,
  Clock,
  Globe,
  Shield,
  Zap,
  ChevronRight,
  Check,
  X,
  Home,
} from "lucide-react";
import * as THREE from "three";
import { Link } from "react-router-dom";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    course: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [typedText, setTypedText] = useState("");
  const [particleSystem, setParticleSystem] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const globeRef = useRef(null);
  const rendererRef = useRef(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initialize 3D background globe
  useEffect(() => {
    const initGlobe = () => {
      if (!globeRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 3;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(300, 300);
      renderer.setClearColor(0x000000, 0);
      globeRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const geometry = new THREE.SphereGeometry(0.8, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vec2 uv = vUv;
            float continents = sin(uv.x * 8.0 + time * 0.3) * sin(uv.y * 6.0);
            continents = smoothstep(0.1, 0.7, continents);
            
            vec3 oceanColor = vec3(0.1, 0.4, 0.9);
            vec3 landColor = vec3(0.9, 0.5, 0.2);
            
            vec3 color = mix(oceanColor, landColor, continents);
            float rim = 1.0 - dot(normalize(vPosition), vec3(0.0, 0.0, 1.0));
            color += rim * vec3(0.9, 0.5, 0.2) * 0.6;
            
            gl_FragColor = vec4(color, 0.7);
          }
        `,
        transparent: true,
      });

      const earth = new THREE.Mesh(geometry, material);
      scene.add(earth);

      const animate = () => {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.003;
        earth.material.uniforms.time.value += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    };

    initGlobe();

    const phrases = [
      "Get In Touch",
      "Start Your Journey",
      "Join Our Community",
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeTimer = setInterval(
      () => {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
          setTypedText(currentPhrase.substring(0, charIndex - 1));
          charIndex--;
          if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
          }
        } else {
          setTypedText(currentPhrase.substring(0, charIndex + 1));
          charIndex++;
          if (charIndex === currentPhrase.length) {
            setTimeout(() => {
              isDeleting = true;
            }, 2000);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => {
      clearInterval(typeTimer);
      if (rendererRef.current && globeRef.current) {
        globeRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const response = await fetch("http://localhost:5555/api/contact", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit form");
      }

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Reset form on success
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        course: "",
      });
      setSubmitStatus("success");
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      // Clear status message after 5 seconds
      setTimeout(() => setSubmitStatus(""), 5000);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+254711 082 146",
      subtext: "General Inquiries",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+254712 293 878",
      subtext: "Quick Support",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "Ngong Lane Plaza, 1st Floor",
      subtext: "Nairobi, Kenya",
    },
    {
      icon: Clock,
      label: "Current Time",
      value: currentTime.toLocaleTimeString(),
      subtext: currentTime.toLocaleDateString(),
    },
  ];

  const features = [
    { icon: Clock, title: "24/7 Support", desc: "Round-the-clock assistance" },
    {
      icon: Globe,
      title: "Global Reach",
      desc: "Worldwide learning community",
    },
    { icon: Shield, title: "Secure", desc: "Your data is protected" },
    { icon: Zap, title: "Fast Response", desc: "Quick turnaround time" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101F3C] via-slate-900 to-[#101F3C] text-white relative overflow-hidden">
      {/* Home Icon Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-50 p-2 bg-slate-800/50 rounded-lg border border-slate-600 hover:border-orange-400 transition-colors duration-300 group"
        aria-label="Home"
      >
        <Home className="w-6 h-6 text-orange-400 group-hover:text-white transition-colors duration-300" />
      </Link>

      <div className="absolute inset-0 pointer-events-none">
        {particleSystem.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              transform: `scale(${particle.size})`,
              animation: `float ${
                3 + particle.id * 0.1
              }s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-grid-pattern animate-pulse" />
      </div>

      {/* Scanning Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-30 animate-scan" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group hover:scale-110 transition-transform duration-500">
              <MessageCircle className="w-8 h-8 text-white group-hover:animate-bounce" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              {typedText}
            </span>
            <span className="inline-block w-1 h-16 bg-orange-400 ml-2 animate-pulse" />
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Ready to transform your career with cutting-edge technology skills?
            <span className="text-orange-400 font-semibold">
              {" "}
              Let's start the conversation.
            </span>
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-600 hover:border-orange-400 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <Icon className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Contact Form */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-lg border border-slate-600 rounded-2xl p-8 hover:border-orange-400/50 transition-all duration-500 group">
              <div className="flex items-center space-x-3 mb-8">
                <Send className="w-6 h-6 text-orange-400 animate-pulse" />
                <h2 className="text-2xl font-bold">Send us a Message</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField("")}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                          focusedField === "name"
                            ? "border-orange-400 shadow-lg shadow-orange-400/25"
                            : "border-slate-600"
                        }`}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-7 h-2 text-orange-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField("")}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                          focusedField === "email"
                            ? "border-orange-400 shadow-lg shadow-orange-400/25"
                            : "border-slate-600"
                        }`}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField("")}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                          focusedField === "phone"
                            ? "border-orange-400 shadow-lg shadow-orange-400/25"
                            : "border-slate-600"
                        }`}
                        placeholder="+254 xxx xxx xxx"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Course Interest
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("course")}
                      onBlur={() => setFocusedField("")}
                      className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
                        focusedField === "course"
                          ? "border-orange-400 shadow-lg shadow-orange-400/25"
                          : "border-slate-600"
                      }`}
                    >
                      <option value="">Select a course</option>
                      <option value="web-development">Web Development</option>
                      <option value="data-science">Data Science</option>
                      <option value="mobile-development">
                        Mobile Development
                      </option>
                      <option value="ui-ux-design">UI/UX Design</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField("")}
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                      focusedField === "subject"
                        ? "border-orange-400 shadow-lg shadow-orange-400/25"
                        : "border-slate-600"
                    }`}
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField("")}
                    rows={5}
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none resize-none transition-all duration-300 ${
                      focusedField === "message"
                        ? "border-orange-400 shadow-lg shadow-orange-400/25"
                        : "border-slate-600"
                    }`}
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>

                <button
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                </button>

                {submitStatus === "success" ? (
                  <div className="flex items-center space-x-2 p-4 bg-green-500/20 border border-green-500/50 rounded-lg animate-fadeIn">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">
                      Message sent successfully! We'll get back to you soon.
                    </span>
                  </div>
                ) : submitStatus === "error" ? (
                  <div className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-500/50 rounded-lg animate-fadeIn">
                    <X className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-medium">
                      Failed to send message. Please try again later.
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Contact Information & Globe */}
          <div className="space-y-8">
            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-lg border border-slate-600 rounded-xl p-6 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 group"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-orange-400 mb-1">
                          {info.label}
                        </h3>
                        <p className="text-white font-medium mb-1">
                          {info.value}
                        </p>
                        <p className="text-sm text-gray-400">{info.subtext}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-lg border border-slate-600 rounded-xl p-6 hover:border-orange-400/50 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-orange-400" />
                <h3 className="text-xl font-semibold">Office Hours</h3>
              </div>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-orange-400 font-medium">
                    8:00 AM - 5:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-orange-400 font-medium">
                    9:00 AM - 12:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-gray-500">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(
              rgba(249, 115, 22, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100vh);
            top: 0%;
          }
          100% {
            transform: translateY(100vh);
            top: 100%;
          }
        }

        .animate-scan {
          animation: scan 8s linear infinite;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;