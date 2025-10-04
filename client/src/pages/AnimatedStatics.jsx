import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, Users, Building2, Gift } from "lucide-react";

const AnimatedStats = () => {
  const [animatedValues, setAnimatedValues] = useState({
    projects: 0,
    students: 0,
    companies: 0,
    merch: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const targetValues = {
    projects: 200,
    students: 1000,
    companies: 85,
    merch: 700,
  };

  const statsData = [
    {
      key: "projects",
      icon: TrendingUp,
      title: "Projects Launched",
      subtitle: "Student innovations",
      color: "bg-gradient-to-br from-amber-400 to-orange-500",
    },
    {
      key: "students",
      icon: Users,
      title: "Students Participating",
      subtitle: "Active creators",
      color: "bg-gradient-to-br from-violet-500 to-purple-600",
    },
    {
      key: "companies",
      icon: Building2,
      title: "Patnering Companies",
      subtitle: "Industry partners",
      color: "bg-gradient-to-br from-emerald-400 to-teal-500",
    },
    {
      key: "merch",
      icon: Gift,
      title: "Merch Items Sold",
      subtitle: "Community support",
      color: "bg-gradient-to-br from-rose-400 to-pink-500",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    Object.entries(targetValues).forEach(([key, target], index) => {
      setTimeout(() => {
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          current = Math.min(increment * step, target);

          setAnimatedValues((prev) => ({
            ...prev,
            [key]: Math.floor(current),
          }));

          if (step >= steps) {
            clearInterval(timer);
          }
        }, duration / steps);
      }, index * 200);
    });
  };

  return (
    <div className="min-h-screen bg-[#00100f]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            <span className="text-[#00ffd5]">About Us</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed">
            We are a passionate team of designers, engineers, and creators
            working together to deliver innovative solutions. Our goal is to
            combine creativity with technology to build exceptional user
            experiences.
          </p>
        </div>

        {/* Stats Grid */}
        <div
          ref={sectionRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;

            return (
              <div
                key={stat.key}
                className="group relative overflow-hidden rounded-2xl bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 shadow-xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer hover:bg-gray-700/40"
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${stat.color} mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Number */}
                <div className="mb-4">
                  <span className="text-5xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
                    {animatedValues[stat.key].toLocaleString()}
                  </span>
                  <span className="text-amber-400 text-3xl font-bold">+</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-100 mb-2 group-hover:text-amber-300 transition-colors duration-300">
                  {stat.title}
                </h3>

                {/* Subtitle */}
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                  {stat.subtitle}
                </p>

                {/* Hover Effect Bottom Border */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            );
          })}
        </div>

        {/* Decorative Background Elements */}
        <div className="fixed top-20 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl animate-pulse pointer-events-none" />
        <div
          className="fixed bottom-20 right-10 w-48 h-48 bg-violet-500/10 rounded-full blur-xl animate-pulse pointer-events-none"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/5 rounded-full blur-2xl animate-pulse pointer-events-none"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  );
};

export default AnimatedStats;


// import React, { useState, useEffect, useRef } from "react";
// import { TrendingUp, Users, Building2, Gift } from "lucide-react";

// const AnimatedStats = () => {
//   const [animatedValues, setAnimatedValues] = useState({
//     projects: 0,
//     students: 0,
//     companies: 0,
//     merch: 0,
//   });
//   const [hasAnimated, setHasAnimated] = useState(false);
//   const [typewriterText, setTypewriterText] = useState("");
//   const [showCursor, setShowCursor] = useState(true);
//   const sectionRef = useRef(null);

//   const targetValues = {
//     projects: 120,
//     students: 950,
//     companies: 75,
//     merch: 430,
//   };

//   const fullText =
//     "We are a passionate team of designers, engineers, and creators working together to deliver innovative solutions. Our goal is to combine creativity with technology to build exceptional user experiences.";

//   const statsData = [
//     {
//       key: "projects",
//       icon: TrendingUp,
//       title: "Projects Launched",
//       subtitle: "Student innovations",
//       color: "bg-gradient-to-br from-amber-400 to-orange-500",
//     },
//     {
//       key: "students",
//       icon: Users,
//       title: "Students Participating",
//       subtitle: "Active creators",
//       color: "bg-gradient-to-br from-violet-500 to-purple-600",
//     },
//     {
//       key: "companies",
//       icon: Building2,
//       title: "Companies Browsing",
//       subtitle: "Industry partners",
//       color: "bg-gradient-to-br from-emerald-400 to-teal-500",
//     },
//     {
//       key: "merch",
//       icon: Gift,
//       title: "Merch Items Sold",
//       subtitle: "Community support",
//       color: "bg-gradient-to-br from-rose-400 to-pink-500",
//     },
//   ];

//   // Typewriter effect
//   useEffect(() => {
//     let currentIndex = 0;
//     const typewriterTimer = setInterval(() => {
//       if (currentIndex <= fullText.length) {
//         setTypewriterText(fullText.slice(0, currentIndex));
//         currentIndex++;
//       } else {
//         clearInterval(typewriterTimer);
//         // Hide cursor after typing is complete
//         setTimeout(() => setShowCursor(false), 1000);
//       }
//     }, 50); // Adjust speed here (lower = faster)

//     return () => clearInterval(typewriterTimer);
//   }, []);

//   // Cursor blinking effect
//   useEffect(() => {
//     const cursorTimer = setInterval(() => {
//       setShowCursor((prev) => !prev);
//     }, 500);

//     return () => clearInterval(cursorTimer);
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && !hasAnimated) {
//             setHasAnimated(true);
//             animateCounters();
//           }
//         });
//       },
//       { threshold: 0.3 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, [hasAnimated]);

//   const animateCounters = () => {
//     Object.entries(targetValues).forEach(([key, target], index) => {
//       setTimeout(() => {
//         const duration = 2000;
//         const steps = 60;
//         const increment = target / steps;
//         let current = 0;
//         let step = 0;

//         const timer = setInterval(() => {
//           step++;
//           current = Math.min(increment * step, target);

//           setAnimatedValues((prev) => ({
//             ...prev,
//             [key]: Math.floor(current),
//           }));

//           if (step >= steps) {
//             clearInterval(timer);
//           }
//         }, duration / steps);
//       }, index * 200);
//     });
//   };

//   return (
//     <div className="min-h-screen bg-[#00100f]">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-16">
//           <h1 className="text-6xl font-bold mb-6">
//             <span className="text-[#00ffd5]">About Us</span>
//           </h1>
//           <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed">
//             {typewriterText}
//             <span
//               className={`inline-block w-0.5 h-6 bg-[#00ffd5] ml-1 ${
//                 showCursor ? "opacity-100" : "opacity-0"
//               } transition-opacity duration-100`}
//             ></span>
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div
//           ref={sectionRef}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
//         >
//           {statsData.map((stat, index) => {
//             const IconComponent = stat.icon;

//             return (
//               <div
//                 key={stat.key}
//                 className="group relative overflow-hidden rounded-2xl bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 shadow-xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer hover:bg-gray-700/40"
//               >
//                 {/* Icon */}
//                 <div
//                   className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${stat.color} mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
//                 >
//                   <IconComponent className="w-8 h-8 text-white" />
//                 </div>

//                 {/* Number */}
//                 <div className="mb-4">
//                   <span className="text-5xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
//                     {animatedValues[stat.key].toLocaleString()}
//                   </span>
//                   <span className="text-amber-400 text-3xl font-bold">+</span>
//                 </div>

//                 {/* Title */}
//                 <h3 className="text-xl font-semibold text-gray-100 mb-2 group-hover:text-amber-300 transition-colors duration-300">
//                   {stat.title}
//                 </h3>

//                 {/* Subtitle */}
//                 <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
//                   {stat.subtitle}
//                 </p>

//                 {/* Hover Effect Bottom Border */}
//                 <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
//               </div>
//             );
//           })}
//         </div>

//         {/* Decorative Background Elements */}
//         <div className="fixed top-20 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl animate-pulse pointer-events-none" />
//         <div
//           className="fixed bottom-20 right-10 w-48 h-48 bg-violet-500/10 rounded-full blur-xl animate-pulse pointer-events-none"
//           style={{ animationDelay: "1s" }}
//         />
//         <div
//           className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/5 rounded-full blur-2xl animate-pulse pointer-events-none"
//           style={{ animationDelay: "2s" }}
//         />
//       </div>
//     </div>
//   );
// };

// export default AnimatedStats;


// import React, { useState, useEffect, useRef } from "react";
// import { TrendingUp, Users, Building2, Gift } from "lucide-react";

// const AnimatedStats = () => {
//   // State for animating the numerical values of the statistics
//   const [animatedValues, setAnimatedValues] = useState({
//     projects: 0,
//     students: 0,
//     companies: 0,
//     merch: 0,
//   });
//   // State to track if the scroll-based animation for stats has already occurred
//   const [hasStatsAnimated, setHasStatsAnimated] = useState(false);

//   // State for the text displayed by the typewriter effect
//   const [typewriterText, setTypewriterText] = useState("");
//   // State to control the visibility (blinking) of the typewriter cursor
//   const [showCursor, setShowCursor] = useState(true);
//   // State to track if the typewriter effect has started (on scroll)
//   const [hasTypewriterStarted, setHasTypewriterStarted] = useState(false);

//   // Ref for the section to observe for intersection (when it comes into view)
//   const sectionRef = useRef(null);

//   // Define the final target values for each statistic
//   const targetValues = {
//     projects: 120,
//     students: 950,
//     companies: 75,
//     merch: 430,
//   };

//   // The full text for the typewriter effect in the header
//   const fullText =
//     "We are a passionate team of designers, engineers, and creators working together to deliver innovative solutions. Our goal is to combine creativity with technology to build exceptional user experiences.";

//   // Data structure for the statistics cards, including icons and styling
//   const statsData = [
//     {
//       key: "projects",
//       icon: TrendingUp,
//       title: "Projects Launched",
//       subtitle: "Student innovations",
//       color: "bg-gradient-to-br from-amber-400 to-orange-500",
//     },
//     {
//       key: "students",
//       icon: Users,
//       title: "Students Participating",
//       subtitle: "Active creators",
//       color: "bg-gradient-to-br from-violet-500 to-purple-600",
//     },
//     {
//       key: "companies",
//       icon: Building2,
//       title: "Companies Browse",
//       subtitle: "Industry partners",
//       color: "bg-gradient-to-br from-emerald-400 to-teal-500",
//     },
//     {
//       key: "merch",
//       icon: Gift,
//       title: "Merch Items Sold",
//       subtitle: "Community support",
//       color: "bg-gradient-to-br from-rose-400 to-pink-500",
//     },
//   ];

//   // --- Intersection Observer for Animations (Stats & Typewriter) ---
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             // Trigger stats animation if not already animated
//             if (!hasStatsAnimated) {
//               setHasStatsAnimated(true);
//               animateCounters();
//             }
//             // Trigger typewriter effect if not already started
//             if (!hasTypewriterStarted) {
//               setHasTypewriterStarted(true);
//             }
//           }
//         });
//       },
//       { threshold: 0.3 } // Trigger when 30% of the section is visible
//     );

//     // Start observing the section reference
//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     // Cleanup function to unobserve when the component unmounts
//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, [hasStatsAnimated, hasTypewriterStarted]); // Dependencies: re-run if these flags change

//   // --- Typewriter Effect Logic (now conditional on hasTypewriterStarted) ---
//   useEffect(() => {
//     let currentIndex = 0;
//     let typewriterTimer;

//     if (hasTypewriterStarted) {
//       typewriterTimer = setInterval(() => {
//         if (currentIndex <= fullText.length) {
//           setTypewriterText(fullText.slice(0, currentIndex));
//           currentIndex++;
//         } else {
//           clearInterval(typewriterTimer);
//           // Hide cursor after typing is complete
//           setTimeout(() => setShowCursor(false), 1000);
//         }
//       }, 30); // Typing speed: lower value means faster typing
//     }

//     // Cleanup function to clear the interval if the component unmounts or effect re-runs
//     return () => clearInterval(typewriterTimer);
//   }, [hasTypewriterStarted, fullText]); // Re-run effect when hasTypewriterStarted changes

//   // --- Cursor Blinking Effect (still independent for continuous blinking) ---
//   useEffect(() => {
//     const cursorTimer = setInterval(() => {
//       setShowCursor((prev) => !prev);
//     }, 500); // Blinks every 500 milliseconds (0.5 seconds)

//     return () => clearInterval(cursorTimer);
//   }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

//   // --- Counter Animation Logic ---
//   const animateCounters = () => {
//     Object.entries(targetValues).forEach(([key, target], index) => {
//       setTimeout(() => {
//         const duration = 2000;
//         const steps = 100;
//         const increment = target / steps;
//         let current = 0;
//         let step = 0;

//         const timer = setInterval(() => {
//           step++;
//           current = Math.min(increment * step, target);

//           setAnimatedValues((prev) => ({
//             ...prev,
//             [key]: Math.floor(current),
//           }));

//           if (step >= steps) {
//             clearInterval(timer);
//           }
//         }, duration / steps);
//       }, index * 200);
//     });
//   };

//   return (
//     <div className="min-h-screen bg-[#00100f] py-20 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-16">
//           <h1 className="text-6xl font-bold mb-6">
//             <span className="text-[#00ffd5]">About Us</span>
//           </h1>
//           <p className="text-gray-300 text-xl max-w-4xl mx-auto leading-relaxed h-[6rem] overflow-hidden">
//             {/* Typewriter text display */}
//             {typewriterText}
//             {/* Blinking cursor (only visible if typing has started and showCursor is true) */}
//             <span
//               className={`inline-block w-0.5 h-6 bg-[#00ffd5] ml-1 align-bottom transition-opacity duration-100 ${
//                 hasTypewriterStarted && showCursor ? "opacity-100" : "opacity-0"
//               }`}
//             ></span>
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div
//           ref={sectionRef} // Attach the ref for Intersection Observer
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
//         >
//           {statsData.map((stat) => {
//             const IconComponent = stat.icon;

//             return (
//               <div
//                 key={stat.key}
//                 className="group relative overflow-hidden rounded-2xl bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 shadow-xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer hover:bg-gray-700/40"
//               >
//                 {/* Icon */}
//                 <div
//                   className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${stat.color} mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
//                 >
//                   <IconComponent className="w-8 h-8 text-white" />
//                 </div>

//                 {/* Animated Number */}
//                 <div className="mb-4">
//                   <span className="text-5xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
//                     {animatedValues[stat.key].toLocaleString()}
//                   </span>
//                   <span className="text-amber-400 text-3xl font-bold">+</span>
//                 </div>

//                 {/* Title */}
//                 <h3 className="text-xl font-semibold text-gray-100 mb-2 group-hover:text-amber-300 transition-colors duration-300">
//                   {stat.title}
//                 </h3>

//                 {/* Subtitle */}
//                 <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
//                   {stat.subtitle}
//                 </p>

//                 {/* Hover Effect Bottom Border */}
//                 <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
//               </div>
//             );
//           })}
//         </div>

//         {/* Decorative Background Elements */}
//         <div className="fixed top-20 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl animate-pulse pointer-events-none z-0" />
//         <div
//           className="fixed bottom-20 right-10 w-48 h-48 bg-violet-500/10 rounded-full blur-xl animate-pulse pointer-events-none z-0"
//           style={{ animationDelay: "1s" }}
//         />
//         <div
//           className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/5 rounded-full blur-2xl animate-pulse pointer-events-none z-0"
//           style={{ animationDelay: "2s" }}
//         />
//       </div>
//     </div>
//   );
// };

// export default AnimatedStats;