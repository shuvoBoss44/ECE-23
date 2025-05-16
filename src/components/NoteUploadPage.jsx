import React, { useState, useEffect } from "react";
import { semesters } from "./NotesPage";
import Background from "./Background";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NoteUploadPage = () => {
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("");
  const [courseNo, setCourseNo] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrlValid, setPdfUrlValid] = useState(true);

  const navigate = useNavigate();

  // Debug state changes
  useEffect(() => {
    console.log("Semester:", semester, "CourseNo:", courseNo);
  }, [semester, courseNo]);

  // Validate Google Drive URL in real-time
  useEffect(() => {
    const googleDriveRegex =
      /^https:\/\/(drive\.google\.com\/file\/d\/|docs\.google\.com\/.*id=)[a-zA-Z0-9_-]+/;
    setPdfUrlValid(
      pdfUrl.trim() === "" || googleDriveRegex.test(pdfUrl.trim())
    );
  }, [pdfUrl]);

  const getCourseCode = fullCourseName => {
    return fullCourseName.split(" - ")[0].trim();
  };

  const fetchWithBackoff = async (url, options, retries = 5, delay = 1000) => {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 && retries > 0) {
        const retryAfter = response.headers.get("Retry-After") || delay / 1000;
        console.log(`Rate limited. Retrying after ${retryAfter}s`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return fetchWithBackoff(url, options, retries - 1, delay * 2);
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }
      return response.json();
    } catch (error) {
      if (retries > 0) {
        console.log(`Error. Retrying after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithBackoff(url, options, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  const getCookie = name => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Sanitize inputs
    const trimmedTitle = title.trim();
    const trimmedPdfUrl = pdfUrl.trim();

    if (!trimmedTitle || !semester || !courseNo || !trimmedPdfUrl) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (!pdfUrlValid) {
      setError("Please provide a valid Google Drive URL");
      setLoading(false);
      return;
    }

    const courseCode = getCourseCode(courseNo);

    const noteData = {
      title: trimmedTitle,
      semester,
      courseNo: courseCode,
      pdf: trimmedPdfUrl,
    };

    try {
      const token = getCookie("token");
      console.log("Token:", token); // Debug token
      if (!token) {
        setError("No authentication token found. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
        setLoading(false);
        return;
      }

      const response = await fetchWithBackoff(
        "https://ece-23-backend.onrender.com/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(noteData),
          credentials: "include",
        }
      );

      setSuccess("Note uploaded successfully!");
      setTitle("");
      setSemester("");
      setCourseNo("");
      setPdfUrl("");
    } catch (err) {
      console.error("Upload error:", err);
      if (
        err.message.includes("token") ||
        err.message.includes("401") ||
        err.message.includes("Unauthorized")
      ) {
        setError("Authentication failed. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.message.includes("429")) {
        setError("Too many requests. Please try again later.");
      } else {
        setError(err.message || "Failed to upload note. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Get courses for the selected semester
  const selectedSemester = semesters.find(sem => sem.name === semester);
  const courses = selectedSemester?.courses || [];

  // Dismiss error/success messages
  const dismissMessage = () => {
    setError("");
    setSuccess("");
  };

  return (
    <>
      <Background />
      <div className="min-h-screen bg-black/50 backdrop-blur-sm flex flex-col p-4 sm:p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900/90 backdrop-blur-md rounded-2xl max-w-md w-full p-6 sm:p-8 border border-blue-500/30 shadow-xl hover:shadow-blue-500/40 transition-shadow z-10 mx-auto mt-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-8 text-center">
            Upload a Note
          </h2>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/90 border-l-4 border-red-500 text-red-100 p-4 mb-6 rounded-lg flex justify-between items-center text-sm sm:text-base"
            >
              <span>{error}</span>
              <button
                onClick={dismissMessage}
                className="text-red-100 hover:text-red-300 focus:outline-none"
                aria-label="Dismiss error"
              >
                &times;
              </button>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-900/90 border-l-4 border-green-500 text-green-100 p-4 mb-6 rounded-lg flex justify-between items-center text-sm sm:text-base"
            >
              <span>{success}</span>
              <button
                onClick={dismissMessage}
                className="text-green-100 hover:text-green-300 focus:outline-none"
                aria-label="Dismiss success"
              >
                &times;
              </button>
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full p-3 bg-gray-800/70 text-white border border-blue-500/40 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 text-sm sm:text-base"
                placeholder="Enter note title"
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="semester"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Semester
              </label>
              <select
                id="semester"
                value={semester}
                onChange={e => {
                  setSemester(e.target.value);
                  setCourseNo("");
                }}
                required
                className="w-full p-3 bg-gray-800/70 text-white border border-blue-500/40 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition appearance-none cursor-pointer text-sm sm:text-base"
                aria-required="true"
              >
                <option value="" disabled className="bg-gray-800">
                  Select a semester
                </option>
                {semesters.map(sem => (
                  <option
                    key={sem.name}
                    value={sem.name}
                    className="bg-gray-800"
                  >
                    {sem.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="courseNo"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Course
              </label>
              <select
                id="courseNo"
                value={courseNo}
                onChange={e => setCourseNo(e.target.value)}
                required
                disabled={!semester || courses.length === 0}
                className="w-full p-3 bg-gray-800/70 text-white border border-blue-500/40 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition appearance-none cursor-pointer disabled:bg-gray-700/50 disabled:text-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                aria-required="true"
              >
                <option value="" disabled className="bg-gray-800">
                  {semester && courses.length === 0
                    ? "No courses available"
                    : "Select a course"}
                </option>
                {courses.map(course => (
                  <option key={course} value={course} className="bg-gray-800">
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="pdfUrl"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Google Drive URL
              </label>
              <input
                type="url"
                id="pdfUrl"
                value={pdfUrl}
                onChange={e => setPdfUrl(e.target.value)}
                required
                className={`w-full p-3 bg-gray-800/70 text-white border ${
                  pdfUrlValid ? "border-blue-500/40" : "border-red-500/40"
                } rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 text-sm sm:text-base`}
                placeholder="https://drive.google.com/file/d/..."
                aria-required="true"
                aria-invalid={!pdfUrlValid}
              />
              <p className="mt-1 text-xs text-gray-400">
                Ensure the Google Drive link is publicly accessible or shared
                with view permissions.
              </p>
              {!pdfUrlValid && pdfUrl.trim() && (
                <p className="mt-1 text-xs text-red-400">
                  Invalid Google Drive URL
                </p>
              )}
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              aria-disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </span>
              ) : (
                "Upload Note"
              )}
            </motion.button>
          </form>
        </motion.div>
        <footer className="w-full py-4 bg-gray-900/90 backdrop-blur-md mt-auto relative z-10">
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
        {loading && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default NoteUploadPage;
