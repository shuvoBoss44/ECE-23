import { FaFacebook, FaPhone, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

// Utility function to transform Google Drive URLs
const getGoogleDriveImageUrl = url => {
  if (url && url.includes("drive.google.com")) {
    const fileIdMatch = url.match(/id=([^&]+)/);
    return fileIdMatch
      ? `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`
      : url;
  }
  return url;
};

const Card = ({ currElem }) => {
  const { facebook, phone, linkedin, whatsapp } = currElem.socialMedia;
  const [imageSrc, setImageSrc] = useState(
    getGoogleDriveImageUrl(currElem.image)
  );

  // Fallback image when the original fails to load
  const handleImageError = () => {
    setImageSrc(
      "https://zeru.com/blog/wp-content/uploads/How-Do-You-Have-No-Profile-Picture-on-Facebook_25900"
    );
  };

  return (
    <div className="w-80 sm:w-90 md:w-80 p-6 transition-all duration-300 ease-in-out hover:-translate-y-2 bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-3xl relative overflow-hidden group">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 animate-background-flow rounded-2xl" />

      {/* Glowing Border Effect */}
      <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-white/30 transition-all duration-300" />

      {/* Larger Profile Image Container */}
      <div className="relative z-10 flex justify-center mb-6">
        <div className="relative inline-block before:absolute before:-inset-1.5 before:bg-gradient-to-r before:from-blue-400 before:via-purple-400 before:to-pink-400 before:rounded-full before:animate-rotate before:opacity-50">
          <img
            className="w-56 h-56 object-cover rounded-full border-4 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300 relative z-10"
            src={imageSrc}
            alt={currElem.name}
            onError={handleImageError}
          />
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative z-10 text-left space-y-4">
        {/* Name and Roll Number */}
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent drop-shadow-md">
            {currElem.name}
          </h2>
          <p className="text-xl font-semibold text-blue-300 mt-1">
            {currElem.roll}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <p className="text-sm text-gray-200">
            <strong className="text-blue-400">College:</strong>{" "}
            {currElem.college}
          </p>
          <p className="text-sm text-gray-200">
            <strong className="text-purple-400">School:</strong>{" "}
            {currElem.school}
          </p>
          <p className="text-sm text-gray-200">
            <strong className="text-pink-400">District:</strong>{" "}
            {currElem.district}
          </p>
        </div>

        {/* Quote */}
        <blockquote className="text-sm italic text-gray-300 mt-4 pl-4 border-l-4 border-blue-400/50 transform transition-all duration-300 group-hover:border-blue-400">
          "{currElem.quote}"
        </blockquote>

        {/* Social Links with Phone */}
        <div className="flex justify-center space-x-4 mt-6">
          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 hover:bg-blue-500/20 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-blue-500/30"
            >
              <FaFacebook className="size-6 text-blue-400" />
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="p-2 rounded-full bg-white/5 hover:bg-green-500/20 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-green-500/30"
            >
              <FaPhone className="size-6 text-green-400" />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 hover:bg-blue-600/20 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-blue-600/30"
            >
              <FaLinkedin className="size-6 text-blue-300" />
            </a>
          )}
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 hover:bg-green-500/20 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-green-500/30"
            >
              <FaWhatsapp className="size-6 text-green-400" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
