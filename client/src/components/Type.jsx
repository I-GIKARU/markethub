// "use client";
// import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
// export function TypewriterEffectSmoothDemo() {
//   const words = [
//     {
//       text: "Build",
//     },
//     {
//       text: "awesome",
//     },
//     {
//       text: "apps",
//     },
//     {
//       text: "with",
//     },
//     {
//       text: "Aceternity.",
//       className: "text-blue-500 dark:text-blue-500",
//     },
//   ];
//   return (
//     <div className="flex flex-col items-center justify-center h-[40rem]  ">
//       <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
//         The road to freedom starts from here
//       </p>
//       <TypewriterEffectSmooth words={words} />
//       <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
//         <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
//           Join now
//         </button>
//         <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
//           Signup
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";

export function TypewriterEffectSmoothDemo() {
  const words = [
    { text: "🚀" },
    {
      text: "Launch",
      className:
        "text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600",
    },
    {
      text: "Your",
      className: "text-4xl md:text-6xl font-bold text-orange-400",
    },
    {
      text: "Next",
      className:
        "text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700",
    },
    {
      text: "Marketplace",
      className:
        "text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto">
        <TypewriterEffectSmooth
          words={words}
          className="text-center w-full"
          cursorClassName="h-10 w-2 bg-orange-500"
        />
      </div>
      <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
        Connect with innovators, showcase your projects, and find your next
        opportunity
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
        <button className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-orange-200 dark:shadow-orange-900/50">
          Explore Projects
        </button>
        <button className="px-6 py-3 rounded-full bg-white text-orange-500 font-medium border-2 border-orange-500 hover:bg-orange-50 transition-all duration-300 transform hover:scale-105">
          Sign Up Free
        </button>
      </div>
    </div>
  );
}