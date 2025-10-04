// "use client";
// import React from "react";
// import { Link } from "react-router-dom";
// import { Vortex } from "../components/ui/vortex";
// import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";

// export function HerosSection() {
//   const words = [
//     {
//       text: "Launch Ideas Inspire Innovations.",
//       className: "text-white",
//     },
//   ];  

//   return (
//     <div className="w-screen h-screen overflow-hidden">
//       <Vortex
//         backgroundColor="black"
//         rangeY={800}
//         particleCount={500}
//         baseHue={120}
//         className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
//       >
//         <TypewriterEffectSmooth words={words} speed={5} />

//         <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
//           Welcome to a digital launchpad where Moringa students turn final
//           projects into real-world impact.
//         </p>

//         <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
//           <Link to="/signup">
//             <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
//               View now
//             </button>
//           </Link>
//         </div>
//       </Vortex>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Vortex } from "../components/ui/vortex";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";

export function HerosSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const words = [
    { text: "Launch", className: "text-4xl md:text-6xl font-bold text-white" },
    {
      text: "Ideas",
      className: "text-4xl md:text-6xl font-bold text-orange-400",
    },
    { text: "Inspire", className: "text-4xl md:text-6xl font-bold text-white" },
    {
      text: "Innovations.",
      className: "text-4xl md:text-6xl font-bold text-yellow-400",
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/pic1.jpg)",
          filter: "brightness(0.7)",
          WebkitFilter: "brightness(0.7)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full overflow-auto">
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <Vortex
            backgroundColor="transparent"
            rangeY={800}
            particleCount={isMobile ? 200 : 400}
            baseHue={40}
            className="flex items-center justify-center w-full py-10 px-2"
            particleStyle={{
              opacity: 0.7,
              size: 3,
              baseRadius: 1,
              connectionRadius: 10,
            }}
          >
            <div className="text-center max-w-4xl mx-auto">
              <div className="min-h-[150px] md:min-h-[180px] flex items-center justify-center">
                <TypewriterEffectSmooth
                  words={words}
                  speed={5}
                  cursorClassName="h-10 bg-yellow-400"
                  className="text-center"
                />
              </div>

              <p className="text-white/90 text-lg md:text-2xl max-w-2xl mx-auto mt-6 md:mt-8 px-4">
                Welcome to a digital launchpad where Moringa students turn final
                projects into real-world impact.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link to="/signup" className="group block">
                  <button className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 transform hover:scale-105">
                    Get Started
                  </button>
                </Link>
                <Link to="/projects" className="group block">
                  <button className="w-full sm:w-auto px-6 py-2.5 bg-transparent text-white font-medium border-2 border-white/30 rounded-full hover:border-white/60 transition-all duration-300 transform hover:scale-105">
                    Explore Projects
                  </button>
                </Link>
              </div>
            </div>
          </Vortex>
        </div>
      </div>
    </div>
  );
}