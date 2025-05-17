import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Background from "./Background";

// Semesters data with provided courses
export const semesters = [
  {
    name: "1st Year Odd",
    courses: [
      "ECE 1101 - Circuits and Systems - I",
      "ECE 1102 - Circuits and Systems - I Sessional",
      "ECE 1103 - Computer Programming",
      "ECE 1104 - Computer Programming Sessional",
      "Math 1117 - Calculus and Co-ordinate Geometry",
      "Phy 1117 - Optics and Modern Physics",
      "Phy 1118 - Optics and Modern Physics Sessional",
      "Hum 1117 - Technical English",
      "Hum 1118 - Technical English Sessional",
      "ECE 1100 - Introduction to Computer System",
    ],
  },
  {
    name: "1st Year Even",
    courses: [
      "ECE 1201 - Circuits and Systems - II",
      "ECE 1202 - Circuits and Systems - II Sessional",
      "ECE 1203 - Object Oriented Programming",
      "ECE 1204 - Object Oriented Programming Sessional",
      "ECE 1205 - Analog Electronic Circuits - I",
      "ECE 1206 - Analog Electronic Circuits - I Sessional",
      "Math 1217 - Transform Methods, Statistics & Complex Variable",
      "Hum 1217 - Government, Sociology, Environment Protection & History of Independence",
      "ECE 1200 - Engineering Ethics",
    ],
  },
];

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [importantLinks, setImportantLinks] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [viewedNoteId, setViewedNoteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [linkPage, setLinkPage] = useState(1);
  const [totalLinkPages, setTotalLinkPages] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [linkSearchQuery, setLinkSearchQuery] = useState("");

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
          console.log("Current User:", userData);
        } else {
          setCurrentUser(null);
          console.log("No user logged in or unauthorized");
        }
      } catch (err) {
        setError("Failed to fetch user data: " + err.message);
        setCurrentUser(null);
        console.error("User fetch error:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch notes from backend with filters
  useEffect(() => {
    const fetchNotes = async () => {
      if (!selectedCourse) return;
      setLoading(true);
      setError("");
      try {
        const courseCode = selectedCourse.split(" - ")[0].trim();
        const queryParams = new URLSearchParams({
          page,
          limit: 10,
          semester: selectedSemester,
          courseNo: courseCode,
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
          throw new Error(errorData.message || "Failed to fetch notes");
        }
        const { notes: notesData, total, pages } = await response.json();
        setNotes(notesData || []);
        setTotalPages(pages || 1);
        console.log("Fetched Notes:", notesData);
      } catch (err) {
        setError("Failed to load notes: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [page, selectedSemester, selectedCourse]);

  // Fetch important links
  useEffect(() => {
    const fetchImportantLinks = async () => {
      setLoading(true);
      setError("");
      try {
        const queryParams = new URLSearchParams({
          page: linkPage,
          limit: 10,
        });
        const response = await fetch(
          `https://ece-23-backend.onrender.com/api/important-links?${queryParams}`,
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
        const { importantLinks, total, pages } = await response.json();
        setImportantLinks(importantLinks || []);
        setTotalLinkPages(pages || 1);
        console.log("Fetched Important Links:", importantLinks);
      } catch (err) {
        setError("Failed to load important links: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchImportantLinks();
  }, [linkPage]);

  const handleDeleteNote = async note => {
    if (
      window.confirm(
        `Are you sure you want to delete the note "${note.title}"?`
      )
    ) {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const response = await fetch(
          `https://ece-23-backend.onrender.com/api/notes/${note._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete note");
        }
        setNotes(notes.filter(n => n._id !== note._id));
        setViewedNoteId(null);
        setSuccess("Note deleted successfully!");
      } catch (err) {
        setError("Failed to delete note: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteLink = async link => {
    if (
      window.confirm(
        `Are you sure you want to delete the important link "${link.title}"?`
      )
    ) {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const response = await fetch(
          `https://ece-23-backend.onrender.com/api/important-links/${link._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to delete important link"
          );
        }
        setImportantLinks(importantLinks.filter(l => l._id !== link._id));
        setSuccess("Important link deleted successfully!");
      } catch (err) {
        setError("Failed to delete important link: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Convert Google Drive URL to embeddable preview URL
  const getGoogleDrivePreviewUrl = (url, fileType) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!fileIdMatch) return url;
    const fileId = fileIdMatch[1];
    if (fileType === "pdf") {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    // Use Google Docs Viewer for other file types
    return `https://docs.google.com/gview?url=https://drive.google.com/uc?id=${fileId}&embedded=true`;
  };

  // Convert Google Drive URL to download URL
  const getGoogleDriveDownloadUrl = url => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
    }
    return url;
  };

  // Filter notes and links based on search queries
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredLinks = importantLinks.filter(link =>
    link.title.toLowerCase().includes(linkSearchQuery.toLowerCase())
  );

  return (
    <>
      <Background />
      <div className="min-h-screen bg-black/50 backdrop-blur-sm flex flex-col relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-grow p-4 sm:p-6 lg:p-8 relative z-10"
        >
          <div className="max-w-6xl mx-auto w-full">
            {/* Error and Success Messages */}
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

            {/* Semester Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-4 sm:p-6 mb-6 border border-blue-500/20 shadow-lg hover:shadow-blue-500/30 transition-shadow"
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                Select Semester
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {semesters.map(sem => (
                  <motion.button
                    key={sem.name}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedSemester(sem.name);
                      setSelectedCourse("");
                      setNotes([]);
                      setViewedNoteId(null);
                      setPage(1);
                      setSearchQuery("");
                    }}
                    className={`p-3 rounded-lg text-sm sm:text-base ${
                      selectedSemester === sem.name
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-800/50 text-gray-200 hover:bg-gray-700/60"
                    } transition-all duration-200 border border-blue-500/30`}
                  >
                    {sem.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Course Selection */}
            {selectedSemester && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-4 sm:p-6 mb-6 border border-blue-500/20 shadow-lg hover:shadow-blue-500/30 transition-shadow"
              >
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                  Select Course
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {semesters
                    .find(sem => sem.name === selectedSemester)
                    ?.courses.map(course => (
                      <motion.button
                        key={course}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedCourse(course);
                          setNotes([]);
                          setViewedNoteId(null);
                          setPage(1);
                          setSearchQuery("");
                        }}
                        className={`p-3 rounded-lg text-sm sm:text-base ${
                          selectedCourse === course
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "bg-gray-800/50 text-gray-200 hover:bg-gray-700/60"
                        } transition-all duration-200 border border-blue-500/30`}
                      >
                        {course}
                      </motion.button>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Notes List */}
            {selectedCourse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-4 sm:p-6 mb-6 border border-blue-500/20 shadow-lg hover:shadow-blue-500/30 transition-shadow"
              >
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                  Notes for {selectedCourse}
                </h2>
                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="mb-4"
                >
                  <input
                    type="text"
                    placeholder="Search notes by title..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800/50 text-gray-200 placeholder-gray-400 border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                    aria-label="Search notes by title"
                  />
                </motion.div>
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="ml-2 text-blue-200 text-sm sm:text-base">
                      Loading notes...
                    </p>
                  </motion.div>
                ) : filteredNotes.length === 0 ? (
                  <p className="text-gray-400 text-sm sm:text-base">
                    No notes match your search or available for this course.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredNotes.map(note => (
                      <motion.div
                        key={note._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/60 transition-all duration-300 border border-blue-500/20"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-white">
                              {note.title}
                            </h3>
                            <p className="text-gray-400 text-xs sm:text-sm">
                              File Type: {note.fileType.toUpperCase()}
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm">
                              Uploaded by:{" "}
                              <Link
                                to={`/profile/${
                                  note.userId?.roll || "unknown"
                                }`}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                {note.userId?.name || "Unknown"} (
                                {note.userId?.roll || "N/A"})
                              </Link>
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm">
                              Uploaded on:{" "}
                              {new Date(note.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                setViewedNoteId(
                                  viewedNoteId === note._id ? null : note._id
                                )
                              }
                              className="p-2 bg-blue-600 rounded-lg text-white text-xs sm:text-sm hover:bg-blue-700 transition-all"
                              aria-label={
                                viewedNoteId === note._id
                                  ? "Hide File"
                                  : "View File"
                              }
                            >
                              {viewedNoteId === note._id
                                ? "Hide File"
                                : "View File"}
                            </motion.button>
                            <motion.a
                              href={getGoogleDriveDownloadUrl(note.fileUrl)}
                              download
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 bg-green-600 rounded-lg text-white text-xs sm:text-sm hover:bg-green-700 transition-all"
                              aria-label={`Download ${note.title}`}
                            >
                              Download
                            </motion.a>
                            {currentUser &&
                            currentUser._id === note.userId?._id ? (
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteNote(note)}
                                className="p-2 bg-red-600 rounded-lg text-white text-xs sm:text-sm hover:bg-red-700 transition-all"
                                aria-label={`Delete ${note.title}`}
                              >
                                Delete
                              </motion.button>
                            ) : (
                              !currentUser && (
                                <p className="text-xs sm:text-sm text-gray-400"></p>
                              )
                            )}
                          </div>
                        </div>
                        {/* File Viewer */}
                        {viewedNoteId === note._id && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mt-4"
                          >
                            <iframe
                              src={getGoogleDrivePreviewUrl(
                                note.fileUrl,
                                note.fileType
                              )}
                              className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg border border-blue-500/30"
                              title={`File Viewer: ${note.title}`}
                              allowFullScreen
                            />
                            <div className="flex justify-between items-center mt-2">
                              <a
                                href={note.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-green-600 rounded-lg text-white text-xs sm:text-sm hover:bg-green-700 transition-all"
                              >
                                Open File in New Tab
                              </a>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setViewedNoteId(null)}
                                className="p-2 bg-red-600 rounded-lg text-white text-xs sm:text-sm hover:bg-red-700 transition-all"
                                aria-label="Close File"
                              >
                                Close File
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
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
                      onClick={() =>
                        setPage(prev => Math.min(prev + 1, totalPages))
                      }
                      disabled={page === totalPages}
                      className="p-2 bg-blue-600 rounded-lg text-white text-sm disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
                      aria-label="Next page"
                    >
                      Next
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Important Links Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-4 sm:p-6 mb-6 border border-blue-500/20 shadow-lg hover:shadow-blue-500/30 transition-shadow"
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                Important Links
              </h2>
              {/* Search Bar for Links */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mb-4"
              >
                <input
                  type="text"
                  placeholder="Search links by title..."
                  value={linkSearchQuery}
                  onChange={e => setLinkSearchQuery(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800/50 text-gray-200 placeholder-gray-400 border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                  aria-label="Search links by title"
                />
              </motion.div>
              {loading ? (
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
              ) : filteredLinks.length === 0 ? (
                <p className="text-gray-400 text-sm sm:text-base">
                  No important links match your search or are available.
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredLinks.map(link => (
                    <motion.div
                      key={link._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/60 transition-all duration-300 border border-blue-500/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-white">
                            {link.title}
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            Uploaded by:{" "}
                            <Link
                              to={`/profile/${link.userId?.roll || "unknown"}`}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {link.userId?.name || "Unknown"} (
                              {link.userId?.roll || "N/A"})
                            </Link>
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            Uploaded on:{" "}
                            {new Date(link.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <motion.a
                            href={getGoogleDriveDownloadUrl(link.link)}
                            download
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-green-600 rounded-lg text-white text-xs sm:text-sm hover:bg-green-700 transition-all"
                            aria-label={`Download ${link.title}`}
                          >
                            Download
                          </motion.a>
                          {currentUser &&
                          currentUser._id === link.userId?._id ? (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteLink(link)}
                              className="p-2 bg-red-600 rounded-lg text-white text-xs sm:text-sm hover:bg-red-700 transition-all"
                              aria-label={`Delete ${link.title}`}
                            >
                              Delete
                            </motion.button>
                          ) : (
                            !currentUser && (
                              <p className="text-xs sm:text-sm text-gray-400"></p>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {/* Pagination for Links */}
              {totalLinkPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLinkPage(prev => Math.max(prev - 1, 1))}
                    disabled={linkPage === 1}
                    className="p-2 bg-blue-600 rounded-lg text-white text-sm disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
                    aria-label="Previous page"
                  >
                    Previous
                  </motion.button>
                  <p className="text-gray-200 text-sm">
                    Page {linkPage} of {totalLinkPages}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setLinkPage(prev => Math.min(prev + 1, totalLinkPages))
                    }
                    disabled={linkPage === totalLinkPages}
                    className="p-2 bg-blue-600 rounded-lg text-white text-sm disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
                    aria-label="Next page"
                  >
                    Next
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        <footer className="w-full py-4 bg-gray-900/80 backdrop-blur-sm relative z-10">
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

export default NotesPage;
