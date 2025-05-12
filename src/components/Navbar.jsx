import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-transparent backdrop-blur-md bg-white/10 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-neon-glow">
              ECE-23
            </span>
          </div>
          <div className="flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 after:shadow-glow"
                    : "text-gray-200 hover:text-white hover:shadow-glow"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/intro-generator"
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 after:shadow-glow"
                    : "text-gray-200 hover:text-white hover:shadow-glow"
                }`
              }
            >
              Intro Generator
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
