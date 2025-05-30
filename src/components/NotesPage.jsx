import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Background from "./Background";
import { FaHeart, FaDownload, FaTrash, FaEye, FaTimes } from "react-icons/fa";

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
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [viewedNoteId, setViewedNoteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
          console.log("No user logged in or unauthorized:", response.status);
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
      if (!selectedSemester || !selectedCourse) {
        console.log("Skipping fetch: Semester or Course not selected");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const courseCode = selectedCourse.split(" - ")[0].trim();
        const queryParams = new URLSearchParams({
          page,
          limit: 10,
          semester: selectedSemester,
          courseNo: courseCode,
          isImportantLink: "false",
        });
        console.log("Fetching notes with params:", queryParams.toString());
        const response = await fetch(
          `https://ece-23-backend.onrender.com/api/notes?${queryParams}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Fetch error response:", errorData);
          throw new Error(
            errorData.message || `HTTP error: ${response.status}`
          );
        }
        const { notes: notesData, total, pages } = await response.json();
        console.log(
          "Fetched Notes:",
          notesData,
          "Total:",
          total,
          "Pages:",
          pages
        );
        setNotes(notesData || []);
        setTotalPages(pages || 1);
      } catch (err) {
        setError("Failed to load notes: " + err.message);
        console.error("Notes fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [page, selectedSemester, selectedCourse]);

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

  const handleLoveToggle = async noteId => {
    if (!currentUser) {
      setError("You must be logged in to love a note.");
      return;
    }

    // Store original notes for rollback in case of error
    const originalNotes = [...notes];

    // Optimistically update the state
    setNotes(
      notes.map(note => {
        if (note._id === noteId) {
          const userLoved = note.loves?.includes(currentUser._id);
          const updatedLoves = userLoved
            ? note.loves.filter(id => id !== currentUser._id)
            : [...(note.loves || []), currentUser._id];
          return { ...note, loves: updatedLoves };
        }
        return note;
      })
    );

    // Send request to server
    try {
      const response = await fetch(
        `https://ece-23-backend.onrender.com/api/notes/${noteId}/love`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to toggle love");
      }
      const updatedNote = await response.json();
      setNotes(
        notes.map(note =>
          note._id === noteId ? { ...note, loves: updatedNote.loves } : note
        )
      );
    } catch (err) {
      console.error("Toggle love error:", err);
      setNotes(originalNotes);
      setError("Failed to toggle love: " + err.message);
    }
  };

  // Convert Google Drive URL to embeddable preview URL
  const getGoogleDrivePreviewUrl = (url, fileType) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!fileIdMatch) return url;
    const fileId = fileIdMatch[1];
    if (fileType?.toLowerCase() === "pdf") {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    // Use Google Docs Viewer for non-PDF files (e.g., Word, Excel)
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

  // Filter notes based on search query
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Background />
      <div className="min-h-screen bg-black/50 backdrop-blur-sm flex flex-col p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-grow max-w-6xl mx-auto w-full"
        >
          {/* Error and Success Messages */}
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
              <FaHeart className="mr-2" />
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
                  className="flex justify-center mb-4 items-center"
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
                            File Type:{" "}
                            {note.fileType?.toUpperCase() || "Unknown"}
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            Uploaded by:{" "}
                            <Link
                              to={`/profile/${note.userId?.roll || "unknown"}`}
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
                          <p className="text-gray-400 text-xs sm:text-sm flex items-center">
                            <FaHeart className="mr-1" />
                            Loves: {note.loves?.length || 0}
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
                            className="p-2 bg-blue-600 rounded-lg text-white text-xs sm:text-sm hover:bg-blue-700 transition-all flex items-center"
                            aria-label={
                              viewedNoteId === note._id
                                ? "Hide File"
                                : "View File"
                            }
                          >
                            <FaEye className="mr-1" />
                            {viewedNoteId === note._id ? "Hide" : "View"}
                          </motion.button>
                          <motion.a
                            href={getGoogleDriveDownloadUrl(note.fileUrl)}
                            download
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-green-600 rounded-lg text-white text-xs sm:text-sm hover:bg-green-700 transition-all flex items-center"
                            aria-label={`Download ${note.title}`}
                          >
                            <FaDownload className="mr-1" />
                            Download
                          </motion.a>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLoveToggle(note._id)}
                            disabled={!currentUser}
                            className={`p-2 rounded-lg text-white text-xs sm:text-sm transition-all flex items-center ${
                              note.loves?.includes(currentUser?._id)
                                ? "bg-pink-600 hover:bg-pink-700"
                                : "bg-gray-600 hover:bg-gray-700"
                            } ${
                              !currentUser
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            aria-label={
                              note.loves?.includes(currentUser?._id)
                                ? "Unlike"
                                : "Love"
                            }
                          >
                            <FaHeart className="mr-1" />
                            {note.loves?.includes(currentUser?._id)
                              ? "Unlike"
                              : "Love"}
                          </motion.button>
                          {currentUser?._id === note.userId?._id && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteNote(note)}
                              className="p-2 bg-red-600 rounded-lg text-white text-xs sm:text-sm hover:bg-red-700 transition-all flex items-center"
                              aria-label={`Delete ${note.title}`}
                            >
                              <FaTrash className="mr-1" />
                              Delete
                            </motion.button>
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
        </motion.div>

        <footer className="w-full py-4 bg-gray-900/80 backdrop-blur-sm">
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
