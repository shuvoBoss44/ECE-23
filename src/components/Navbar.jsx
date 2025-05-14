import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-neon-glow">
            ECE-23
          </div>

          {/* Navigation Links (horizontal always) */}
          <div className="flex space-x-1 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative px-3 py-1.5 text-sm sm:text-base font-bold tracking-wide uppercase text-transparent bg-clip-text max-sm:ml-3 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-400 to-purple-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 animate-neon-glow"
                    : "bg-gradient-to-r from-gray-300 to-gray-400 hover:from-blue-400 hover:to-purple-400 hover:scale-105 transition-all duration-300"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/intro-generator"
              className={({ isActive }) =>
                `relative px-3 py-1.5 text-sm sm:text-base font-bold tracking-wide uppercase text-transparent bg-clip-text ${
                  isActive
                    ? "bg-gradient-to-r from-blue-400 to-purple-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 animate-neon-glow"
                    : "bg-gradient-to-r from-gray-300 to-gray-400 hover:from-blue-400 hover:to-purple-400 hover:scale-105 transition-all duration-300"
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
