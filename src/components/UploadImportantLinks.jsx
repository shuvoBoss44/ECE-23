import React, { useState, useEffect } from "react";
import Background from "./Background";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { FaLink, FaTimes, FaUpload } from "react-icons/fa";

const UploadImportantLinks = () => {
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("pdf");
  const [semester, setSemester] = useState("");
  const [courseNo, setCourseNo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();

  // Predefined semesters (same as ImportantLinks.jsx)
  const semesters = [
    "1st Year Odd",
    "1st Year Even",
    "2nd Year Odd",
    "2nd Year Even",
    "3rd Year Odd",
    "3rd Year Even",
    "4th Year Odd",
    "4th Year Even",
  ];

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

    if (!title || (!file && !fileUrl)) {
      setError("Title and either a file or Google Drive URL are required");
      setLoading(false);
      return;
    }

    if (fileUrl) {
      const googleDriveRegex =
        /^https:\/\/(drive\.google\.com\/file\/d\/|docs\.google\.com\/.*id=)[a-zA-Z0-9_-]+/;
      if (!googleDriveRegex.test(fileUrl)) {
        setError("Please provide a valid Google Drive URL");
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("title", title);
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("fileUrl", fileUrl);
      formData.append("fileType", fileType);
    }
    if (semester) {
      formData.append("semester", semester);
    }
    if (courseNo) {
      formData.append("courseNo", courseNo);
    }
    formData.append("isImportantLink", true);

    try {
      const response = await fetch(
        "https://ece-23-backend.onrender.com/api/notes",
        {
          method: "POST",
          body: formData,
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
      setFile(null);
      setFileType("pdf");
      setSemester("");
      setCourseNo("");
      // Redirect to ImportantLinks with semester filter
      navigate(
        semester
          ? `/important-links?semester=${encodeURIComponent(semester)}`
          : "/important-links"
      );
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
    return (
      <div className="min-h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/important-links" />;
  }

  return (
    <>
      <Background />
      <div className="min-h-screen bg-black/50 backdrop-blur-sm flex flex-col p-4 sm:p-6 pt-16 pl-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900/80 backdrop-blur-lg rounded-xl max-w-lg w-full p-4 sm:p-6 border border-blue-500/20 shadow-lg hover:shadow-blue-500/30 transition-shadow z-10 mx-auto mt-8"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6 text-center flex items-center justify-center">
            <FaLink className="mr-2" />
            Upload an Important Link
          </h2>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/80 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded-lg backdrop-blur-sm text-sm sm:text-base flex items-center"
            >
              <FaTimes className="mr-2" />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-900/80 border-l-4 border-green-500 text-green-200 p-4 mb-6 rounded-lg backdrop-blur-sm text-sm sm:text-base flex items-center"
            >
              <FaUpload className="mr-2" />
              {success}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-200 flex items-center"
              >
                <FaLink className="mr-2" />
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
                aria-label="Link title"
              />
            </div>
            <div>
              <label
                htmlFor="semester"
                className="block text-sm font-medium text-gray-200 flex items-center"
              >
                <FaLink className="mr-2" />
                Semester
              </label>
              <select
                id="semester"
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="mt-1 w-full p-2 sm:p-3 bg-gray-800/50 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                aria-label="Select semester"
              >
                <option value="">Select Semester (Optional)</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem} className="bg-gray-800">
                    {sem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="courseNo"
                className="block text-sm font-medium text-gray-200 flex items-center"
              >
                <FaLink className="mr-2" />
                Course Number
              </label>
              <input
                type="text"
                id="courseNo"
                value={courseNo}
                onChange={e => setCourseNo(e.target.value)}
                className="mt-1 w-full p-2 sm:p-3 bg-gray-800/50 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
                placeholder="e.g., ECE101 (Optional)"
                aria-label="Course number"
              />
            </div>
            <div>
              <label
                htmlFor="fileType"
                className="block text-sm font-medium text-gray-200 flex items-center"
              >
                <FaLink className="mr-2" />
                File Type (for URL uploads)
              </label>
              <select
                id="fileType"
                value={fileType}
                onChange={e => setFileType(e.target.value)}
                disabled={file} // Disable if a file is selected
                className="mt-1 w-full p-2 sm:p-3 bg-gray-800/50 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition disabled:opacity-50"
                aria-label="Select file type"
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
                htmlFor="file"
                className="block text-sm font-medium text-gray-200 flex items-center"
              >
                <FaLink className="mr-2" />
                Upload File
              </label>
              <input
                type="file"
                id="file"
                onChange={e => setFile(e.target.files[0])}
                className="mt-1 w-full p-2 sm:p-3 bg-gray-800/50 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                accept=".pdf,.ppt,.pptx,.doc,.docx"
                aria-label="Upload file"
              />
              <p className="mt-1 text-xs sm:text-sm text-gray-400">
                Upload a file or provide a Google Drive URL below.
              </p>
            </div>
            <div>
              <label
                htmlFor="fileUrl"
                className="block text-sm font-medium text-gray-200 flex items-center"
              >
                <FaLink className="mr-2" />
                Google Drive URL
              </label>
              <input
                type="url"
                id="fileUrl"
                value={fileUrl}
                onChange={e => setFileUrl(e.target.value)}
                disabled={file} // Disable if a file is selected
                className="mt-1 w-full p-2 sm:p-3 bg-gray-800/50 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 disabled:opacity-50"
                placeholder="https://drive.google.com/file/d/..."
                aria-label="Google Drive URL"
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 sm:p-3 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-purple-600 flex items-center justify-center"
              aria-label="Upload important link"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </span>
              ) : (
                <>
                  <FaUpload className="mr-2" />
                  Upload Important Link
                </>
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
