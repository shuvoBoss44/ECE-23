import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await fetch("https://ece-23-backend.vercel.app/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      setIsMobileMenuOpen(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isAuthenticated === null) {
    return null;
  }

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/intro-generator", label: "Intro Generator" },
    { to: "/notes", label: "Notes", exact: true },
    { to: "/announcements", label: "Announcements" },
    ...(isAuthenticated
      ? [
          { to: "/notes/upload", label: "Upload Note" },
          { to: "/change-password", label: "Change Password" },
        ]
      : []),
    ...(isAuthenticated ? [] : [{ to: "/login", label: "Login" }]),
  ];

  return (
    <nav className="w-full bg-gray-900 sm:bg-gray-900/80 backdrop-blur-lg border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink
            to="/"
            className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ECE-23
          </NavLink>
          <div className="hidden sm:flex space-x-1 items-center">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  `relative px-3 py-1.5 text-sm sm:text-base font-bold tracking-wide uppercase text-transparent bg-clip-text ${
                    isActive
                      ? "bg-gradient-to-r from-blue-400 to-purple-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400"
                      : "bg-gradient-to-r from-gray-200 to-gray-300 hover:from-blue-400 hover:to-purple-400 hover:scale-105 transition-all duration-300"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="relative px-3 py-1.5 text-sm sm:text-base font-bold tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-300 hover:from-red-400 hover:to-red-600 hover:scale-105 transition-all duration-300"
                aria-label="Logout"
              >
                Logout
              </motion.button>
            )}
          </div>
          <div className="sm:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="text-gray-200 hover:text-blue-400 focus:outline-none"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="sm:hidden bg-gray-900 border-b border-blue-500/20"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm font-bold tracking-wide uppercase text-transparent bg-clip-text ${
                    isActive
                      ? "bg-gradient-to-r from-blue-400 to-purple-400"
                      : "bg-gradient-to-r from-gray-200 to-gray-300 hover:from-blue-400 hover:to-purple-400 hover:scale-105 transition-all duration-300"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-sm font-bold tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-300 hover:from-red-400 hover:to-red-600 hover:scale-105 transition-all duration-300 w-full text-left"
                aria-label="Logout"
              >
                Logout
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
