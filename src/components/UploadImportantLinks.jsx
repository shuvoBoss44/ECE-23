import React, { useState, useEffect } from "react";
import Background from "./Background";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";

const UploadImportantLinks = () => {
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null);

  // Fetch current user information
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
          setIsAuthorized(userData.canAnnounce);
        } else {
          setCurrentUser(null);
          setIsAuthorized(false);
        }
      } catch (err) {
        setError("Failed to fetch user data: " + err.message);
        setCurrentUser(null);
        setIsAuthorized(false);
        console.error("User fetch error:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!title || !fileUrl || !fileType) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const googleDriveRegex =
      /^https:\/\/(drive\.google\.com\/file\/d\/|docs\.google\.com\/.*id=)[a-zA-Z0-9_-]+/;
    if (!googleDriveRegex.test(fileUrl)) {
      setError("Please provide a valid Google Drive URL");
      setLoading(false);
      return;
    }

    const linkData = {
      title,
      fileType,
      fileUrl,
      isImportantLink: true,
    };

    try {
      const response = await fetch(
        "https://ece-23-backend.onrender.com/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(linkData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      setSuccess("Important link uploaded successfully!");
      setTitle("");
      setFileUrl("");
      setFileType("pdf");
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.message || "Failed to upload important link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized === null) {
    return null; // Loading state while fetching user data
  }

  if (!isAuthorized) {
    return <Navigate to="/important-links" />;
  }

  return (
    <>
      <Background />
      <div className="min-h-screen bg-black/50 backdrop-blur-sm flex flex-col pl-0 sm:pl-64 p-4 sm:p-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900/80 backdrop-blur-lg rounded-xl max-w-lg w-full p-4 sm:p-6 border border-blue-500/20 shadow-lg hover:shadow-blue-500/30 transition-shadow z-10 mx-auto mt-8"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6 text-center">
            Upload an Important Link
          </h2>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/80 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded-lg backdrop-blur-sm text-sm sm:text-base"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-900/80 border-l-4 border-green-500 text-green-200 p-4 mb-6 rounded-lg backdrop-blur-sm text-sm sm:text-base"
            >
              {success}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-200"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="mt-1 w-full p-2 sm:p-3 bg-gray-800/50 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
                placeholder="Enter link title"
              />
            </div>
            <div>
              <label
                htmlFor="fileType"
                className="block text-sm font-medium text-gray-200"
              >
                File Type
              </label>
              <select
                id="fileType"
                value={fileType}
                onChange={e => setFileType(e.target.value)}
                required
                className="mt-1 w-full p-2 sm:p-3 bg-gray-800/50 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              >
                <option value="pdf" className="bg-gray-800">
                  PDF
                </option>
                <option value="ppt" className="bg-gray-800">
                  PowerPoint (PPT)
                </option>
                <option value="pptx" className="bg-gray-800">
                  PowerPoint (PPTX)
                </option>
                <option value="doc" className="bg-gray-800">
                  Word (DOC)
                </option>
                <option value="docx" className="bg-gray-800">
                  Word (DOCX)
                </option>
              </select>
            </div>
            <div>
              <label
                htmlFor="fileUrl"
                className="block text-sm font-medium text-gray-200"
              >
                Google Drive URL
              </label>
              <input
                type="url"
                id="fileUrl"
                value={fileUrl}
                onChange={e => setFileUrl(e.target.value)}
                required
                className="mt-1 w-full p-2 sm:p-3 bg-gray-800/50 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
                placeholder="https://drive.google.com/file/d/..."
              />
              <p className="mt-1 text-xs sm:text-sm text-gray-400">
                Ensure the Google Drive link is publicly accessible or shared
                with view permissions.
              </p>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 sm:p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition disabled:opacity-50 disabled:hover:bg-gradient-to-r disabled:hover:from-blue-600 disabled:hover:to-purple-600"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </span>
              ) : (
                "Upload Important Link"
              )}
            </motion.button>
          </form>
        </motion.div>
        <footer className="w-full py-4 bg-gray-900/80 backdrop-blur-sm mt-auto relative z-10">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-xs sm:text-sm text-gray-200">
              Developed by{" "}
              <a
                href="https://www.facebook.com/shuvo.chakma.16121/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                -Shuvo(61) ❤️
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              All rights reserved by ECE-23
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default UploadImportantLinks;
