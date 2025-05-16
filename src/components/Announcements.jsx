import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Background from "./Background";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
          "https://ece-23-backend.vercel.app/api/users/me",
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
        setError("Failed to fetch user data. Please try again.");
        setCurrentUser(null);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://ece-23-backend.vercel.app/api/announcements?page=${page}&limit=10`,
          { method: "GET", credentials: "include" }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const { announcements, pages } = await response.json();
        setAnnouncements(announcements || []);
        setTotalPages(pages || 1);
      } catch (err) {
        setError("Failed to load announcements. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [page]);

  // Handle create or update announcement
  const handleSubmit = async e => {
    e.preventDefault();
    if (!currentUser?.canAnnounce) {
      setError("You are not authorized to create announcements.");
      return;
    }
    setError("");
    setSuccess("");
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `https://ece-23-backend.vercel.app/api/announcements/${editingId}`
        : "https://ece-23-backend.vercel.app/api/announcements";
      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save announcement");
      }
      const updatedAnnouncement = await response.json();
      if (editingId) {
        setAnnouncements(
          announcements.map(a =>
            a._id === editingId
              ? { ...updatedAnnouncement, creator: a.creator }
              : a
          )
        );
        setSuccess("Announcement updated successfully!");
      } else {
        setAnnouncements([
          {
            ...updatedAnnouncement,
            creator: {
              _id: currentUser._id,
              name: currentUser.name,
              roll: currentUser.roll,
            },
          },
          ...announcements,
        ]);
        setSuccess("Announcement created successfully!");
      }
      setTitle("");
      setContent("");
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit announcement
  const handleEdit = announcement => {
    setTitle(announcement.title);
    setContent(announcement.content);
    setEditingId(announcement._id);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to form
  };

  // Handle delete announcement
  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }
    try {
      const response = await fetch(
        `https://ece-23-backend.vercel.app/api/announcements/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete announcement");
      }
      setAnnouncements(announcements.filter(a => a._id !== id));
      setSuccess("Announcement deleted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Background />
      <div className="min-h-screen bg-black/50 backdrop-blur-sm flex flex-col relative mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-grow p-4 sm:p-6 lg:p-8 relative z-10"
        >
          <div className="max-w-4xl mx-auto w-full">
            {/* Error and Success Messages */}
            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 mb-6 rounded-lg backdrop-blur-sm text-sm sm:text-base ${
                  error
                    ? "bg-red-900/80 border-l-4 border-red-500 text-red-200"
                    : "bg-green-900/80 border-l-4 border-green-500 text-green-200"
                }`}
              >
                {error || success}
              </motion.div>
            )}

            {/* Create/Update Announcement Form */}
            {currentUser?.canAnnounce && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-gray-900 sm:bg-gray-900/80 backdrop-blur-lg rounded-xl p-4 sm:p-6 mb-8 border border-blue-500/20"
              >
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                  {editingId ? "Update Announcement" : "Create Announcement"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-200 text-sm sm:text-base mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 text-gray-200 rounded-lg border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
                      placeholder="Enter announcement title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-200 text-sm sm:text-base mb-1">
                      Content
                    </label>
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 text-gray-200 rounded-lg border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-40 text-sm sm:text-base"
                      placeholder="Enter announcement content"
                      required
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-sm sm:text-base hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      {editingId ? "Update" : "Create"}
                    </motion.button>
                    {editingId && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => {
                          setTitle("");
                          setContent("");
                          setEditingId(null);
                        }}
                        className="p-2 bg-gray-600 rounded-lg text-white text-sm sm:text-base hover:bg-gray-700 transition-all"
                      >
                        Cancel
                      </motion.button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {/* Announcements List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gray-900 sm:bg-gray-900/80 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-blue-500/20"
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                Announcements
              </h2>
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center mb-6"
                >
                  <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="ml-2 text-blue-200 text-sm sm:text-base">
                    Loading announcements...
                  </p>
                </motion.div>
              ) : announcements.length === 0 ? (
                <p className="text-gray-400 text-sm sm:text-base">
                  No announcements available.
                </p>
              ) : (
                <div className="space-y-6">
                  {announcements.map(announcement => (
                    <motion.div
                      key={announcement._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-gray-800/50 rounded-lg p-4 sm:p-6 hover:bg-gray-700/60 transition-all duration-300 border border-blue-500/20"
                    >
                      <div className="space-y-3">
                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-semibold text-white">
                          {announcement.title}
                        </h3>
                        {/* Content (Focused) */}
                        <p className="text-gray-200 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                          {announcement.content}
                        </p>
                        {/* Metadata */}
                        <div className="text-gray-400 text-xs sm:text-sm space-y-1">
                          <p>
                            Posted by: {announcement.creator?.name || "Unknown"}{" "}
                            {announcement.creator?.roll
                              ? `(${announcement.creator.roll})`
                              : ""}
                          </p>
                          <p>
                            Posted:{" "}
                            {new Date(announcement.createdAt).toLocaleString()}
                          </p>
                          {announcement.createdAt !==
                            announcement.updatedAt && (
                            <p>
                              Updated:{" "}
                              {new Date(
                                announcement.updatedAt
                              ).toLocaleString()}
                            </p>
                          )}
                        </div>
                        {/* Action Buttons */}
                        {currentUser?._id === announcement.creator?._id && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(announcement)}
                              className="p-2 bg-blue-600 rounded-lg text-white text-xs sm:text-sm hover:bg-blue-700 transition-all"
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(announcement._id)}
                              className="p-2 bg-red-600 rounded-lg text-white text-xs sm:text-sm hover:bg-red-700 transition-all"
                            >
                              Delete
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="p-2 bg-blue-600 rounded-lg text-white text-sm disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
                  >
                    Previous
                  </motion.button>
                  <p className="text-gray-200 text-sm">
                    Page {page} of {totalPages}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setPage(prev => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                    className="p-2 bg-blue-600 rounded-lg text-white text-sm disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
                  >
                    Next
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
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

export default Announcements;
