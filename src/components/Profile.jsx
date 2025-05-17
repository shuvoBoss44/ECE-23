import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaFacebook,
  FaPhone,
  FaInstagram,
  FaWhatsapp,
  FaArrowLeft,
  FaFilePdf,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import Background from "./Background";

const Profile = ({
  placeholderImage = "https://zeru.com/blog/wp-content/uploads/How-Do-You-Have-No-Profile-Picture-on-Facebook_25900",
}) => {
  const { roll } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);
  const [error, setError] = useState("");
  const [notesError, setNotesError] = useState("");

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "100px",
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Fetch user data by roll
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://ece-23-backend.onrender.com/api/users/${roll}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("User not found");
        }
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        console.error("Fetch user error:", err);
        setError(err.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    window.scrollTo(0, 0);
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }
  }, [roll]);

  // Fetch notes by userId
  useEffect(() => {
    if (!student?._id) return;

    const fetchNotes = async () => {
      setNotesLoading(true);
      setNotesError("");
      try {
        const response = await fetch(
          `https://ece-23-backend.onrender.com/api/notes/${student._id}?page=1&limit=10`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }
        const data = await response.json();
        setNotes(data.notes || []);
      } catch (err) {
        console.error("Fetch notes error:", err);
        setNotesError(err.message || "Failed to load notes");
      } finally {
        setNotesLoading(false);
      }
    };

    fetchNotes();
  }, [student?._id]);

  const handleImageLoad = () => {
    setTimeout(() => setIsImageLoaded(true), 300);
  };

  const handleImageError = e => {
    e.target.src = placeholderImage;
    setTimeout(() => setIsImageLoaded(true), 300);
  };

  const handleBack = () => {
    if (location.state?.from === "home" && location.state?.cardId) {
      navigate("/", { state: { cardId: location.state.cardId } });
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-blue-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-blue-900 flex items-center justify-center">
        <div className="text-center text-red-500 text-lg font-semibold py-8">
          {error || "Student not found!"}
        </div>
      </div>
    );
  }

  const { name, district, school, college, image, quote, socialMedia } =
    student;
  const { facebook, phone, instagram, whatsapp } = socialMedia || {};

  return (
    <>
      <Background />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-blue-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-grow p-3 sm:p-6 md:p-8 pt-3"
        >
          {/* Back Button */}
          <motion.button
            onClick={handleBack}
            className="mb-4 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Go back"
          >
            <FaArrowLeft className="text-white w-5 h-5" />
          </motion.button>

          <div className="max-w-4xl mx-auto bg-gray-900/85 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-blue-500/20">
            {/* Cover Photo */}
            <div className="relative h-48 sm:h-60 md:h-72 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-500/20 animate-pulse-slow"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              {quote && (
                <motion.blockquote
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-3/4 text-center text-white text-base sm:text-lg md:text-xl font-serif italic drop-shadow-lg px-3"
                >
                  <span className="text-blue-200">“</span>
                  {quote}
                  <span className="text-blue-200">”</span>
                </motion.blockquote>
              )}
            </div>

            {/* Profile Info Header */}
            <div className="relative -mt-20 sm:-mt-24 md:-mt-28 flex flex-col items-center px-3 sm:px-4">
              <motion.div
                ref={inViewRef}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 sm:border-6 border-blue-500/50 overflow-hidden shadow-lg relative group"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {(!inView || (inView && !isImageLoaded)) && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-800/80 z-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-3 border-b-3 border-blue-400" />
                  </div>
                )}
                <img
                  src={inView && image ? `/${image}` : placeholderImage}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-3 text-white text-2xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
              >
                {name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-blue-300 text-base sm:text-lg md:text-xl font-medium"
              >
                Roll: {roll}
              </motion.p>
            </div>

            {/* About Section */}
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-gray-800/70 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  About
                </h2>
                <div className="grid md:grid-cols-2 gap-3 text-gray-200 text-sm sm:text-base">
                  <p className="flex items-center gap-2">
                    <span className="text-blue-400 font-semibold">
                      Hometown:
                    </span>{" "}
                    {district || "Not provided"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-blue-400 font-semibold">School:</span>{" "}
                    {school || "Not provided"}
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-blue-400 font-semibold">
                      College:
                    </span>{" "}
                    {college || "Not provided"}
                  </p>
                </div>
              </motion.div>

              {/* Shared Notes Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="bg-gray-800/70 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Shared Notes
                </h2>
                {notesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : notesError ? (
                  <p className="text-red-400 text-center text-sm sm:text-base">
                    {notesError}
                  </p>
                ) : notes.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                    {notes.map(note => (
                      <motion.div
                        key={note._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition"
                      >
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm sm:text-base">
                            {note.title}
                          </p>
                          <p className="text-gray-300 text-xs sm:text-sm">
                            Semester: {note.semester} | Course: {note.courseNo}
                          </p>
                        </div>
                        <motion.a
                          href={note.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition relative group"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (!note.pdf) {
                              console.error(
                                "Invalid PDF URL for note:",
                                note._id
                              );
                              alert(
                                "Unable to open PDF. Please try again later."
                              );
                            }
                          }}
                          title="Open PDF"
                        >
                          <FaFilePdf
                            className="text-white w-4 h-4 sm:w-5 sm:h-5"
                            aria-label={`Open PDF for ${note.title}`}
                          />
                          <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                            Open PDF
                          </span>
                        </motion.a>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center text-sm sm:text-base">
                    No notes shared yet.
                  </p>
                )}
              </motion.div>

              {/* Social Media Links */}
              {(facebook || phone || instagram || whatsapp) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="bg-gray-800/70 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Connect
                  </h2>
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                    {facebook && (
                      <motion.a
                        href={facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 sm W:p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaFacebook className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.a>
                    )}
                    {phone && (
                      <motion.a
                        href={`tel:${phone}`}
                        className="p-2 sm:p-3 bg-green-600 rounded-full hover:bg-green-700 transition"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaPhone className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.a>
                    )}
                    {instagram && (
                      <motion.a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 sm:p-3 bg-pink-600 rounded-full hover:bg-pink-700 transition"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaInstagram className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.a>
                    )}
                    {whatsapp && (
                      <motion.a
                        href={whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 sm:p-3 bg-green-500 rounded-full hover:bg-green-600 transition"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaWhatsapp className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="w-full py-4 sm:py-6 bg-gradient-to-t from-slate-900 to-transparent">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs sm:text-sm text-gray-300">
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

export default Profile;
