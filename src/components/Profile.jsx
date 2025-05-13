import { useParams, useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaPhone,
  FaInstagram,
  FaWhatsapp,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import Background from "./Background";

const Profile = ({
  data,
  placeholderImage = "https://zeru.com/blog/wp-content/uploads/How-Do-You-Have-No-Profile-Picture-on-Facebook_25900",
}) => {
  const { roll } = useParams();
  const navigate = useNavigate();
  const student = data.find(item => item.roll === roll);

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "100px", // Preload 100px before visibility
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Scroll to top and disable scroll restoration
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual"; // Disable browser scroll restoration
    }
  }, [roll]);

  const handleImageLoad = () => {
    setTimeout(() => setIsImageLoaded(true), 300); // Minimum spinner display time
  };

  const handleImageError = e => {
    e.target.src = placeholderImage;
    setTimeout(() => setIsImageLoaded(true), 300); // Minimum spinner display time
  };

  if (!student) {
    return (
      <div className="text-center text-red-500 text-xl font-semibold py-10">
        Student not found!
      </div>
    );
  }

  const { name, district, school, college, image, quote, socialMedia } =
    student;
  const { facebook, phone, instagram, whatsapp } = socialMedia || {};

  return (
    <>
      <Background />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-screen p-4 md:p-8 pt-4 bg-gradient-to-tr from-slate-900 to-gray-800"
      >
        <div className="max-w-5xl mx-auto bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
          {/* Cover Photo */}
          <div className="relative h-64 md:h-80 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500">
            <div className="absolute inset-0 bg-black/40" />

            {/* Quote at Top */}
            {quote && (
              <motion.blockquote
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 md:w-3/4 text-center text-white text-xl md:text-2xl font-semibold italic drop-shadow-lg px-2"
              >
                “{quote}”
              </motion.blockquote>
            )}
          </div>

          {/* Profile Info Header */}
          <div className="relative -mt-28 flex flex-col items-center px-4">
            <motion.div
              ref={inViewRef}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-40 h-40 md:w-56 md:h-56 rounded-full border-8 border-gray-900 overflow-hidden shadow-lg"
            >
              {(!inView || (inView && !isImageLoaded)) && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-700 z-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-400" />
                </div>
              )}
              <img
                src={inView && image ? `/${image}` : placeholderImage}
                alt={name}
                className="w-full h-full object-cover"
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mt-4 text-white text-3xl md:text-4xl font-bold text-center"
            >
              {name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-blue-300 text-lg md:text-xl font-medium"
            >
              Roll: {roll}
            </motion.p>

            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)} // Changed from navigate("/") to navigate(-1)
              className="mt-4 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <FaArrowLeft className="text-white w-5 h-5" />
              <span className="text-white text-sm font-medium">Back</span>
            </motion.button>
          </div>

          {/* About Section */}
          <div className="p-6 md:p-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-gray-800/60 rounded-xl p-6 md:p-8 shadow-md"
            >
              <h2 className="text-2xl font-bold text-white mb-4">About</h2>
              <div className="grid md:grid-cols-2 gap-4 text-gray-200 text-lg">
                <p>
                  <span className="text-blue-400 font-semibold">District:</span>{" "}
                  {district || "Not provided"}
                </p>
                <p>
                  <span className="text-blue-400 font-semibold">School:</span>{" "}
                  {school || "Not provided"}
                </p>
                <p>
                  <span className="text-blue-400 font-semibold">College:</span>{" "}
                  {college || "Not provided"}
                </p>
              </div>
            </motion.div>

            {/* Social Media Links */}
            {(facebook || phone || instagram || whatsapp) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="bg-gray-800/60 rounded-xl p-6 md:p-8 shadow-md"
              >
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                  Connect
                </h2>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  {facebook && (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 sm:p-4 bg-blue-600 rounded-full hover:bg-blue-700 transition"
                    >
                      <FaFacebook className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="p-3 sm:p-4 bg-green-600 rounded-full hover:bg-green-700 transition"
                    >
                      <FaPhone className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                  )}
                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 sm:p-4 bg-pink-600 rounded-full hover:bg-pink-700 transition"
                    >
                      <FaInstagram className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                  )}
                  {whatsapp && (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 sm:p-4 bg-green-500 rounded-full hover:bg-green-600 transition"
                    >
                      <FaWhatsapp className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 bg-gradient-to-t from-black/80 to-transparent mt-8">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-sm text-gray-300">
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
      </motion.div>
    </>
  );
};

export default Profile;
