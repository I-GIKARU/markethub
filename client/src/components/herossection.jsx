// const Herossection = () => {
//   return (
//     <div
//       className="relative w-screen h-screen bg-cover bg-center bg-no-repeat px-6 py-8"
//       style={{ backgroundImage: "url('/pic1.jpg')" }}
//     >
//       <div className="absolute top-50 left-12 z-20 text-left text-white">
//         <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-xl">
//           <span className="text-yellow">Launch</span>{" "}
//           <span className="text-orange-400">Ideas</span> <br />
//           <span className="text-white">Inspire</span>{" "}
//           <span className="text-blue-400">Innovation</span>
//         </h1>

//         <p className="text-lg md:text-xl mt-4 text-gray-200 drop-shadow-md max-w-xl leading-relaxed">
//           A digital launchpad where{" "}
//           <span className="text-orange-400 font-semibold">Moringa students</span>{" "}
//           <br />
//           turn final projects into{" "}
//           <span className="text-green-400 font-semibold">
//             real-world impact
//           </span>
//           . <br />
//           Demo. Hire. Shop. Repeat. Yes
//         </p>

//         <button className="mt-6 px-8 py-3 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 hover:scale-105 transition duration-300 ease-in-out rounded-full text-lg font-semibold shadow-lg text-white">
//           Browse Projects
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Herossection;


// src/components/Herossection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Herossection = () => {
  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center bg-no-repeat px-6 py-8"
      style={{ backgroundImage: "url('/pic1.jpg')" }}
    >
      <div className="absolute top-50 left-12 z-20 text-left text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-xl">
          <span className="text-yellow">Launch</span>{" "}
          <span className="text-orange-400">Ideas</span> <br />
          <span className="text-white">Inspire</span>{" "}
          <span className="text-blue-400">Innovation</span>
        </h1>

        <p className="text-lg md:text-xl mt-4 text-gray-200 drop-shadow-md max-w-xl leading-relaxed">
          A digital launchpad where{" "}
          <span className="text-orange-400 font-semibold">Moringa students</span>{" "}
          <br />
          turn final projects into
          <span className="text-green-400 font-semibold">
            real-world impact
          </span>
          . <br />
          Demo. Hire. Shop. Repeat. Yes
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 hover:scale-105 transition duration-300 ease-in-out rounded-full text-lg font-semibold shadow-lg text-white">
            Browse Projects
          </button>

          <Link
            to="/student-signin"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition duration-300 ease-in-out rounded-full text-lg font-semibold shadow-lg text-white inline-flex items-center justify-center"
          >
            Go to My Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Herossection;

