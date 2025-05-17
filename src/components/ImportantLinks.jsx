import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Background from "./Background";
import { FaLink, FaTrash, FaDownload, FaUpload, FaTimes } from "react-icons/fa";

const ImportantLinks = () => {
  const [importantLinks, setImportantLinks] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("pdf");
  const [semester, setSemester] = useState("");
  const [courseNo, setCourseNo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Predefined semesters
  const semesters = ["1st Year Odd", "1st Year Even"];

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
        setError("Failed to fetch user data: " + err.message);
        setCurrentUser(null);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchImportantLinks = async () => {
      setLoading(true);
      setError("");
      try {
        const queryParams = new URLSearchParams({
          page,
          limit: 10,
          isImportantLink: true,
        });
        if (semester) {
          queryParams.append("semester", semester);
        }
        if (searchQuery) {
          queryParams.append("search", searchQuery);
        }
        const response = await fetch(
          `https://ece-23-backend.onrender.com/api/notes?${queryParams}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch important links"
          );
        }
        const { notes: linksData, total, pages } = await response.json();
        setImportantLinks(linksData || []);
        setTotalPages(pages || 1);
      } catch (err) {
        setError("Failed to load important links: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchImportantLinks();
  }, [page, semester, searchQuery]);

  const handleDeleteLink = async linkId => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      setError("");
      setLoading(true);
      try {
        const response = await fetch(
          `https://ece-23-backend.onrender.com/api/notes/${linkId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete link");
        }
        setImportantLinks(importantLinks.filter(link => link._id !== linkId));
      } catch (err) {
        setError(err.message || "Failed to delete link");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!title || !semester || (!file && !fileUrl)) {
      setError(
        "Title, semester, and either a file or Google Drive URL are required"
      );
      setLoading(false);
      return;
    }

    if (file && fileUrl) {
      setError("Please provide either a file or a Google Drive URL, not both");
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
    formData.append("semester", semester);
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("fileUrl", fileUrl);
      formData.append("fileType", fileType);
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
      setShowUploadForm(false);
      // Refresh links
      const queryParams = new URLSearchParams({
        page: 1,
        limit: 10,
        isImportantLink: true,
      });
      if (semester) {
        queryParams.append("semester", semester);
      }
      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }
      const refreshResponse = await fetch(
        `https://ece-23-backend.onrender.com/api/notes?${queryParams}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const { notes: linksData, total, pages } = await refreshResponse.json();
      setImportantLinks(linksData || []);
      setTotalPages(pages || 1);
      setPage(1);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.message || "Failed to upload important link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Background />
      <div className="min-h-screen bg-black/60 backdrop-blur-sm flex flex-col p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-grow max-w-4xl mx-auto w-full"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/90 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded-lg backdrop-blur-sm text-sm sm:text-base flex items-center"
            >
              <FaTimes className="mr-2" />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-900/90 border-l-4 border-green-500 text-green-200 p-4 mb-6 rounded-lg backdrop-blur-sm text-sm sm:text-base flex items-center"
            >
              <FaUpload className="mr-2" />
              {success}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center flex items-center">
                <FaLink className="mr-2" />
                Important Links
              </h2>
              {currentUser && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="mt-4 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm sm:text-base hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
                  aria-label="Toggle Upload Form"
                >
                  <FaUpload className="mr-2" />
                  {showUploadForm ? "Cancel" : "Upload Link"}
                </motion.button>
              )}
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full">
                <div className="flex-1">
                  <label
                    htmlFor="semester"
                    className="block text-sm font-medium text-gray-200 flex items-center"
                  >
                    <FaLink className="mr-2" />
                    Select Semester
                  </label>
                  <select
                    id="semester"
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    className="mt-1 w-full p-2 sm:p-3 bg-gray-800/60 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    aria-label="Select semester"
                  >
                    <option value="">All Semesters</option>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-200 flex items-center"
                  >
                    <FaLink className="mr-2" />
                    Search Links
                  </label>
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by title or course..."
                    className="mt-1 w-full p-2 sm:p-3 bg-gray-800/60 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
                    aria-label="Search links"
                  />
                </div>
              </div>
            </div>
            {showUploadForm && currentUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-900/90 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 shadow-lg hover:shadow-blue-500/40 transition-shadow"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      className="mt-1 w-full p-2 sm:p-3 bg-gray-800/60 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
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
                      required
                      className="mt-1 w-full p-2 sm:p-3 bg-gray-800/60 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                      aria-label="Select semester"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map(sem => (
                        <option key={sem} value={sem}>
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
                      className="mt-1 w-full p-2 sm:p-3 bg-gray-800/60 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
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
                      disabled={file}
                      className="mt-1 w-full p-2 sm:p-3 bg-gray-800/60 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition disabled:opacity-50"
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
                      className="mt-1 w-full p-2 sm:p-3 bg-gray-800/60 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
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
                      disabled={file}
                      className="mt-1 w-full p-2 sm:p-3 bg-gray-800/60 text-white border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 disabled:opacity-50"
                      placeholder="https://drive.google.com/file/d/..."
                      aria-label="Google Drive URL"
                    />
                    <p className="mt-1 text-xs sm:text-sm text-gray-400">
                      Ensure the Google Drive link is publicly accessible or
                      shared with view permissions.
                    </p>
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 sm:p-3 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-purple-600 flex items-center justify-center"
                    aria-label="Upload link"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </span>
                    ) : (
                      <>
                        <FaUpload className="mr-2" />
                        Upload Link
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
            {loading && !importantLinks.length ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mb-4 items-center"
              >
                <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-2 text-blue-200 text-sm sm:text-base">
                  Loading links...
                </p>
              </motion.div>
            ) : importantLinks.length === 0 ? (
              <p className="text-gray-400 text-center text-sm sm:text-base flex items-center justify-center">
                <FaLink className="mr-2" />
                No important links available.
              </p>
            ) : (
              importantLinks.map(link => (
                <motion.div
                  key={link._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gray-900/90 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 shadow-lg hover:shadow-blue-500/40 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <a
                        href={link.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg sm:text-xl font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                      >
                        <FaLink className="mr-2" />
                        {link.title}
                      </a>
                      <p className="text-gray-400 mt-2 text-xs sm:text-sm">
                        Semester: {link.semester || "N/A"} | Course:{" "}
                        {link.courseNo || "N/A"}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Posted by:{" "}
                        <Link
                          to={`/profile/${link.userId?.roll || "unknown"}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {link.userId?.name || "Unknown"} (
                          {link.userId?.roll || "N/A"})
                        </Link>
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Posted on: {new Date(link.createdAt).toLocaleString()}
                      </p>
                      {link.updatedAt !== link.createdAt && (
                        <p className="text-gray-400 text-xs sm:text-sm">
                          Updated on:{" "}
                          {new Date(link.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <motion.a
                        href={link.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-green-600 rounded-lg text-white text-xs sm:text-sm hover:bg-green-700 transition-all flex items-center"
                        aria-label={`Download ${link.title}`}
                      >
                        <FaDownload className="mr-1" />
                        Download
                      </motion.a>
                      {currentUser?._id === link.userId?._id && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteLink(link._id)}
                          className="p-2 bg-red-600 rounded-lg text-white text-xs sm:text-sm hover:bg-red-700 transition-all flex items-center"
                          aria-label={`Delete ${link.title}`}
                        >
                          <FaTrash className="mr-1" />
                          Delete
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="p-2 bg-blue-600 rounded-lg text-white text-sm disabled:opacity-50 disabled:hover:bg-blue-600 transition-all flex items-center"
                aria-label="Previous page"
              >
                Previous
              </motion.button>
              <p className="text-gray-200 text-sm">
                Page {page} of {totalPages}
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 bg-blue-600 rounded-lg text-white text-sm disabled:opacity-50 disabled:hover:bg-blue-600 transition-all flex items-center"
                aria-label="Next page"
              >
                Next
              </motion.button>
            </div>
          )}
        </motion.div>
        <footer className="w-full py-4 bg-gray-900/80 backdrop-blur-sm mt-auto">
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

export default ImportantLinks;
