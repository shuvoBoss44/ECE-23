import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-neon-glow">
            ECE-23
          </div>

          {/* Navigation Links (horizontal always) */}
          <div className="flex space-x-6 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400"
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/intro-generator"
              className={({ isActive }) =>
                `relative px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400"
                    : "text-gray-300 hover:text-white"
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
