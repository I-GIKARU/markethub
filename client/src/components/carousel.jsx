// import React, { useRef } from "react";
// import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";

// const style = `
//   .hide-scrollbar::-webkit-scrollbar {
//     display: none;
//   }
//   .hide-scrollbar {
//     -ms-overflow-style: none;
//     scrollbar-width: none;
//   }
// `;

// export default function Carousel() {
//   const scrollRef = useRef(null);
//   const scrollAmount = 400;

//   const data = [
//     {
//       category: "Software Engineering",
//       title: "Build scalable software solutions.",
//       src: "https://picsum.photos/400/500?random=1",
//     },
//     {
//       category: "Data Science",
//       title: "Data-driven decisions with insights.",
//       src: "https://picsum.photos/400/500?random=2",
//     },
//     {
//       category: "Artificial Intelligence",
//       title: "AI is shaping the future.",
//       src: "https://picsum.photos/400/500?random=3",
//     },
//     {
//       category: "Cyber Security",
//       title: "Protect your digital world.",
//       src: "https://picsum.photos/400/500?random=4",
//     },
//     {
//       category: "Product Design",
//       title: "Design meets innovation.",
//       src: "https://picsum.photos/400/500?random=5",
//     },
//     {
//       category: "Software Engineering",
//       title: "Join the engineering revolution.",
//       src: "https://picsum.photos/400/500?random=6",
//     },
//   ];

//   const scrollLeft = () => {
//     scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
//   };

//   const scrollRight = () => {
//     scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
//   };

//   return (
//     <>
//       <style>{style}</style>

//       <div className="relative w-full min-h-screen bg-neutral-900 py-12 px-6 overflow-hidden">
//         <h2 className="text-center text-4xl font-bold text-white mb-12">
//           Explore Career Tracks
//         </h2>

//         {/* Arrows */}
//         <button
//           onClick={scrollLeft}
//           className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md"
//         >
//           <IconArrowNarrowLeft size={24} className="text-black" />
//         </button>
//         <button
//           onClick={scrollRight}
//           className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md"
//         >
//           <IconArrowNarrowRight size={24} className="text-black" />
//         </button>

//         {/* Scrollable Cards */}
//         <div
//           ref={scrollRef}
//           className="flex gap-6 overflow-x-auto scroll-smooth px-4 hide-scrollbar"
//         >
//           {data.map((item, index) => (
//             <div
//               key={index}
//               className="w-[360px] h-[460px] flex-shrink-0 bg-gray-900 rounded-xl overflow-hidden shadow-xl relative"
//             >
//               <img
//                 src={item.src}
//                 alt={item.title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black/50 p-4 flex flex-col justify-end">
//                 <h1 className="text-lg text-white font-bold ">
//                   {item.category}
//                 </h1>
//                 <p className="text-xs text-white tracking-widest mb-1 font-medium">
//                   {item.title}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useRef, useState, useEffect } from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconArrowRight,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const style = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

export default function Carousel() {
  const scrollRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollAmount = 400;

  const data = [
    {
      category: "Software Engineering",
      title: "Build scalable software solutions with modern technologies.",
      src: "https://moringaschool.com/wp-content/uploads/2024/11/2150010127.jpg",
      color: "from-blue-600/80 to-blue-800/80",
      link: "https://moringaschool.com/programs/software-engineering/",
    },
    {
      category: "Data Science",
      title: "Transform data into actionable insights and drive decisions.",
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      color: "from-purple-600/80 to-indigo-800/80",
      link: "https://moringaschool.com/programs/data-science/",
    },
    {
      category: "Artificial Intelligence",
      title: "Shape the future with cutting-edge AI technologies.",
      src: "https://moringaschool.com/wp-content/uploads/2021/08/moringa-students-ms007.jpg",
      color: "from-emerald-600/80 to-teal-800/80",
      link: "https://moringaschool.com/courses/generative-ai-essentials-program/",
    },
    {
      category: "Cyber Security",
      title: "Protect digital assets and secure online environments.",
      src: "https://moringaschool.com/wp-content/uploads/2025/07/1726033977364-768x432.png",
      color: "from-rose-600/80 to-red-800/80",
      link: "https://moringaschool.com/courses/cybersecurity-bootcamp/",
    },
    {
      category: "Product Design",
      title: "Create intuitive and beautiful user experiences.",
      src: "https://moringaschool.com/wp-content/uploads/2022/09/ui-ux-featured.jpg",
      color: "from-amber-600/80 to-orange-800/80",
      link: "https://moringaschool.com/courses/product-design-2/",
    },
    {
      category: "Cloud Computing",
      title: "Leverage the power of cloud infrastructure and services.",
      src: "https://moringaschool.com/wp-content/uploads/2023/03/aws-circular-banner.jpg",
      color: "from-sky-600/80 to-blue-800/80",
      link: "https://moringaschool.com/corporate_course/aws-cloud-practitioner-essentials/",
    },
  ];

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    currentRef?.addEventListener("scroll", updateScrollState);
    updateScrollState();
    return () => currentRef?.removeEventListener("scroll", updateScrollState);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      setActiveIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setActiveIndex((prev) => Math.min(data.length - 1, prev + 1));
    }
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const card = scrollRef.current.children[index];
      card?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      setActiveIndex(index);
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-900 to-gray-800 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <style>{style}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Career Tracks
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover exciting career paths in technology and design
          </p>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={scrollLeft}
          disabled={isAtStart}
          className={`absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 ${
            isAtStart ? "opacity-0 pointer-events-none" : "opacity-100"
          } bg-white/90 hover:bg-white text-gray-800 hover:scale-110`}
          aria-label="Scroll left"
        >
          <IconArrowNarrowLeft size={24} />
        </button>

        <button
          onClick={scrollRight}
          disabled={isAtEnd}
          className={`absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all duration-300 ${
            isAtEnd ? "opacity-0 pointer-events-none" : "opacity-100"
          } bg-white/90 hover:bg-white text-gray-800 hover:scale-110`}
          aria-label="Scroll right"
        >
          <IconArrowNarrowRight size={24} />
        </button>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-4 pb-8 -mx-4 hide-scrollbar"
        >
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-[300px] sm:w-[360px] flex-shrink-0 relative group cursor-pointer transition-all duration-500 hover:scale-105"
              onClick={() => scrollToIndex(index)}
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${item.color} via-transparent`}
                >
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
                    <div className="flex items-center mb-2">
                      <span className="inline-block w-8 h-1 bg-white/50 rounded-full mr-2"></span>
                      <span className="text-sm font-medium tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 leading-tight">
                      {item.title}
                    </h3>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-white hover:text-blue-200 transition-colors group-hover:translate-x-1"
                    >
                      Learn more{" "}
                      <IconArrowRight
                        size={16}
                        className="ml-1 transition-transform group-hover:translate-x-1"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-8 space-x-2">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeIndex
                  ? "w-8 bg-gradient-to-r from-blue-400 to-cyan-400"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}