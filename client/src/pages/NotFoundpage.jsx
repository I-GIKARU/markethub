import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets /nopagebackgroundimage.png"; 

const NotFound = () => {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-contain p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="relative z-20 text-center bg-transparent backdrop-blur-md p-10 rounded-xl shadow-xl max-w-md w-full">
        <h1 className="text-6xl font-bold text-red-700 mb-4">404</h1>
        <h2
          className="text-2xl font-semibold text-gray-800 mb-2"
          style={{ fontFamily: '"Bitcount Prop Double", sans-serif' }}
        >
          Page Not Found
        </h2>
        <p className="text-gray-900 mb-6">
          Oops! The page you're looking for doesn't exist or was moved.
        </p>
        <Link
          to="/"
          className="bg-transparent text-black px-6 py-2 rounded hover:bg-gray-400 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
