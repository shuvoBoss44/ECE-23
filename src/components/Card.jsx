import { FaFacebook, FaPhone, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const Card = ({ currElem }) => {
  const [data, setData] = useState(null);
  const [imageSrc, setImageSrc] = useState(
    currElem?.image ? `./${currElem.image}` : ""
  );
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // Intersection Observer to detect when Card enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the Card is visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Simulate data fetching when Card is visible
  useEffect(() => {
    if (isVisible && !data) {
      // Simulate async data fetch (replace with actual API call if needed)
      const fetchData = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate 1s delay
        setData(currElem);
        setImageSrc(`./${currElem.image}`);
      };
      fetchData();
    }
  }, [isVisible, currElem, data]);

  // Fallback to void image if the original image doesn't exist
  const handleImageError = () => {
    setImageSrc(
      "https://zeru.com/blog/wp-content/uploads/How-Do-You-Have-No-Profile-Picture-on-Facebook_25900"
    );
  };

  // Skeleton Loader for Card
  if (!data) {
    return (
      <div
        ref={cardRef}
        className="w-[90vw] max-w-md sm:w-96 md:w-80 p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl shadow-2xl animate-pulse"
      >
        <div className="flex justify-center mb-6">
          <div className="w-64 h-64 sm:w-56 sm:h-56 bg-gray-700/50 rounded-full"></div>
        </div>
        <div className="space-y-4">
          <div className="text-center">
            <div className="h-8 bg-gray-700/50 rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-gray-700/50 rounded w-1/2 mx-auto mt-2"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700/50 rounded"></div>
            <div className="h-4 bg-gray-700/50 rounded"></div>
            <div className="h-4 bg-gray-700/50 rounded"></div>
          </div>
          <div className="h-12 bg-gray-700/50 rounded"></div>
          <div className="flex justify-center space-x-4">
            <div className="h-10 w-10 bg-gray-700/50 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-700/50 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-700/50 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const { facebook, phone, instagram, whatsapp } = data.socialMedia;

  return (
    <div
      ref={cardRef}
      className="w-[90vw] max-w-md sm:w-96 md:w-80 p-6 transition-all duration-300 ease-in-out hover:-translate-y-2 bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-3xl relative overflow-hidden group"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 animate-background-flow rounded-2xl" />

      {/* Glowing Border Effect */}
      <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-white/30 transition-all duration-300" />

      {/* Profile Image Container */}
      <div className="relative z-10 flex justify-center mb-6">
        <div className="relative inline-block before:absolute before:-inset-1.5 before:bg-gradient-to-r before:from-blue-400 before:via-purple-400 before:to-pink-400 before:rounded-full before:animate-rotate before:opacity-50">
          <img
            className="w-64 h-64 sm:w-56 sm:h-56 object-cover rounded-full border-4 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300 relative z-10"
            src={imageSrc}
            alt={data.name}
            onError={handleImageError}
            loading="lazy"
          />
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative z-10 text-left space-y-4">
        {/* Name and Roll Number */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent drop-shadow-md">
            {data.name}
          </h2>
          <p className="text-2xl sm:text-xl font-semibold text-blue-300 mt-1">
            {data.roll}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <p className="text-sm text-gray-200">
            <strong className="text-blue-400">College:</strong> {data.college}
          </p>
          <p className="text-sm text-gray-200">
            <strong className="text-purple-400">School:</strong> {data.school}
          </p>
          <p className="text-sm text-gray-200">
            <strong className="text-pink-400">District:</strong> {data.district}
          </p>
        </div>

        {/* Quote */}
        <blockquote className="text-sm italic text-gray-300 mt-4 pl-4 border-l-4 border-blue-400/50 transform transition-all duration-300 group-hover:border-blue-400">
          "{data.quote}"
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
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 hover:bg-pink-500/20 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-pink-500/30"
            >
              <FaInstagram className="size-6 text-pink-400" />
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
