import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Background from "./Background";

const ImportantLinks = () => {
  const [importantLinks, setImportantLinks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch current user to check canAnnounce status
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

  // Fetch important links
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
  }, [page]);

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

  return (
    <>
      <Background />
      <div className="min-h-screen bg-black/50 backdrop-blur-sm flex flex-col p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-grow max-w-4xl mx-auto w-full"
        >
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/80 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded-lg backdrop-blur-sm text-sm sm:text-base"
            >
              {error}
            </motion.div>
          )}

          {/* Important Links List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center">
                Important Links
              </h2>
              {currentUser?.canAnnounce && (
                <Link to="/important-links/upload">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm sm:text-base hover:from-blue-700 hover:to-purple-700 transition-all"
                    aria-label="Upload Important Link"
                  >
                    Upload Important Link
                  </motion.button>
                </Link>
              )}
            </div>
            {loading && !importantLinks.length ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mb-4"
              >
                <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-2 text-blue-200 text-sm sm:text-base">
                  Loading important links...
                </p>
              </motion.div>
            ) : importantLinks.length === 0 ? (
              <p className="text-gray-400 text-center text-sm sm:text-base">
                No important links available.
              </p>
            ) : (
              importantLinks.map(link => (
                <motion.div
                  key={link._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <a
                        href={link.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg sm:text-xl font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {link.title}
                      </a>
                      <p className="text-gray-300 mt-2 text-sm sm:text-base">
                        File Type: {link.fileType.toUpperCase()}
                      </p>
                      <p className="text-gray-400 mt-2 text-xs sm:text-sm">
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
                    {currentUser?._id === link.userId?._id && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteLink(link._id)}
                        className="p-2 bg-red-600 rounded-lg text-white text-xs sm:text-sm hover:bg-red-700 transition-all"
                        aria-label={`Delete ${link.title}`}
                      >
                        Delete
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="p-2 bg-blue-600 rounded-lg text-white text-sm disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
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
                className="p-2 bg-blue-600 rounded-lg text-white text-sm disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
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
