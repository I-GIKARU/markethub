// import React from "react";

// function Home() {
//   return (
//     <div
//       className="min-h-screen bg-cover bg-center flex"
//       style={{
//         backgroundImage: "url('/background.gif')",
//         backgroundRepeat: "no-repeat",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* Left Dashboard Sidebar */}
//       <aside className="w-64 bg-white/80 dark:bg-zinc-800/50 backdrop-blur-md border-r border-gray-300 dark:border-zinc-700 p-9">
//         <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Dashboard</h2>
//         <ul className="space-y-4 text-gray-700 dark:text-gray-300">
//           <li><a href="/" className="hover:text-indigo-600">Home</a></li>
//           <li><a href="/projects" className="hover:text-indigo-600">Projects</a></li>
//           <li><a href="/marketplace" className="hover:text-indigo-600">Marketplace</a></li>
//           <li><a href="/profile" className="hover:text-indigo-600">Profile</a></li>
//         </ul>
//       </aside>

//       {/*  Main Hero Content */}
//       <main className="flex-1 flex items-center justify-center px-4">
//         <div className="max-w-4xl mx-auto text-center bg-white/70 dark:bg-black/60 rounded-xl p-6 shadow-lg">
//           <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
//             Welcome to Moringa Innovation Marketplace 
//           </h1>
//           <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
//             Discover, build, and monetize your ideas with a community of innovators.
//           </p>
//           <div className="mt-8 flex justify-center gap-4">
//             <a
//               href="/signup"
//               className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300"
//             >
//               Get Started
//             </a>
//             <a
//               href="/login"
//               className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300"
//             >
//               Log In
//             </a>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Home;

import React from "react";

function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex"
      style={{
        backgroundImage: "url('/background.gif')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left Dashboard Sidebar */}
      <aside className="w-64 bg-white/80 dark:bg-zinc-800/50 backdrop-blur-md border-r border-gray-300 dark:border-zinc-700 p-9">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
          Dashboard
        </h2>
        <ul className="space-y-4 text-gray-700 dark:text-gray-300">
          <li>
            <a href="/" className="hover:text-indigo-600">
              Home
            </a>
          </li>
          <li>
            <a href="/projects" className="hover:text-indigo-600">
              Projects
            </a>
          </li>
          <li>
            <a href="/marketplace" className="hover:text-indigo-600">
              Marketplace
            </a>
          </li>
          <li>
            <a href="/profile" className="hover:text-indigo-600">
              Profile
            </a>
          </li>
        </ul>
      </aside>

      {/*  Main Hero Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center bg-white/70 dark:bg-black/60 rounded-xl p-6 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Welcome to Moringa Innovation Marketplace
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Discover, build, and monetize your ideas with a community of
            innovators.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300"
            >
              Log In
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;