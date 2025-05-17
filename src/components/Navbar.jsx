import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaBook,
  FaLink,
  FaBullhorn,
  FaUpload,
  FaLock,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
          "https://ece-23-backend.onrender.com/api/users/me",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        setCurrentUser(null);
        console.error("User fetch error:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("https://ece-23-backend.onrender.com/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsSidebarOpen(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <FaHome className="text-xl" /> },
    {
      to: "/intro-generator",
      label: "Intro Generator",
      icon: <FaBook className="text-xl" />,
    },
    {
      to: "/notes",
      label: "Notes",
      exact: true,
      icon: <FaBook className="text-xl" />,
    },
    {
      to: "/important-links",
      label: "Important Links",
      icon: <FaLink className="text-xl" />,
    },
    {
      to: "/announcements",
      label: "Announcements",
      icon: <FaBullhorn className="text-xl" />,
    },
    ...(isAuthenticated
      ? [
          {
            to: "/notes/upload",
            label: "Upload Note",
            icon: <FaUpload className="text-xl" />,
          },
          ...(currentUser?.canAnnounce
            ? [
                {
                  to: "/upload-important-links",
                  label: "Upload Important Link",
                  icon: <FaUpload className="text-xl" />,
                },
              ]
            : []),
          {
            to: "/change-password",
            label: "Change Password",
            icon: <FaLock className="text-xl" />,
          },
        ]
      : [
          {
            to: "/login",
            label: "Login",
            icon: <FaSignInAlt className="text-xl" />,
          },
        ]),
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 text-gray-200 hover:text-blue-400 focus:outline-none bg-gray-900/90 rounded-full p-2 border border-blue-500/30 shadow-lg transition-colors duration-200"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isSidebarOpen}
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
              isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </motion.button>
      <motion.div
        initial={{ width: window.innerWidth >= 768 ? 64 : 0 }}
        animate={{
          width: isSidebarOpen ? 256 : window.innerWidth >= 768 ? 64 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-950 backdrop-blur-lg border-r border-blue-500/20 z-40 flex flex-col shadow-xl"
      >
        <div className="flex items-center justify-center h-20 border-b border-blue-500/20">
          <NavLink
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-2"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-wide"
            >
              {isSidebarOpen ? "ECE-23" : null}
            </motion.div>
          </NavLink>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="py-4 space-y-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-300 group relative ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-800/80 hover:text-white"
                  }`
                }
              >
                <div className="flex-shrink-0 w-6 h-6">{link.icon}</div>
                <span
                  className={`text-sm font-bold tracking-wide uppercase transition-opacity duration-300 ${
                    isSidebarOpen
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 group-hover:absolute left-16 bg-gray-800/90 px-2 py-1 rounded-lg text-gray-200 shadow-lg whitespace-nowrap"
                  }`}
                >
                  {link.label}
                </span>
              </NavLink>
            ))}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleLogout();
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-gray-300 hover:bg-gray-800/80 hover:text-red-400 transition-all duration-300 group relative w-full text-left"
                aria-label="Logout"
              >
                <div className="flex-shrink-0 w-6 h-6">
                  <FaSignOutAlt className="text-xl" />
                </div>
                <span
                  className={`text-sm font-bold tracking-wide uppercase transition-opacity duration-300 ${
                    isSidebarOpen
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 group-hover:absolute left-16 bg-gray-800/90 px-2 py-1 rounded-lg text-gray-200 shadow-lg whitespace-nowrap"
                  }`}
                >
                  Logout
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isSidebarOpen ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 bg-black z-30 pointer-events-none ${
          isSidebarOpen ? "pointer-events-auto" : ""
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
    </>
  );
};

export default Navbar;
