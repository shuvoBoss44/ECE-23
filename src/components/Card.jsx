import { FaFacebook, FaPhone, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useState, memo, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Card = memo(({ currElem }) => {
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [loadImage, setLoadImage] = useState(false);
  const placeholderImage =
    "https://zeru.com/blog/wp-content/uploads/How-Do-You-Have-No-Profile-Picture-on-Facebook_25900";

  const { facebook, phone, instagram, whatsapp } = currElem.socialMedia;

  useEffect(() => {
    if (inView) setLoadImage(true);
  }, [inView]);

  return (
    <div
      ref={inViewRef}
      className="w-[90vw] max-w-md sm:w-96 md:w-80 p-6 transition-all duration-300 ease-in-out hover:-translate-y-2 bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl shadow-xl relative overflow-hidden group"
    >
      {inView && (
        <>
          {/* Subtle animated border layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl" />
          <div className="absolute inset-0 border border-white/5 rounded-2xl group-hover:border-white/20 transition-all duration-300" />

          {/* Profile image */}
          <div className="relative z-10 flex justify-center mb-6">
            <div className="relative w-64 h-64 sm:w-56 sm:h-56">
              {!loadImage && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-800/40 border-4 border-white/10 z-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-400" />
                </div>
              )}
              <div className="absolute inset-0 before:absolute before:-inset-1.5 before:bg-gradient-to-r before:from-blue-400 before:via-purple-400 before:to-pink-400 before:rounded-full before:animate-rotate before:opacity-50 z-0" />
              <img
                className={`w-64 h-64 sm:w-56 sm:h-56 object-cover rounded-full border-4 border-white/20 shadow-2xl transition-opacity duration-300 relative z-10 ${
                  loadImage ? "opacity-100" : "opacity-0"
                }`}
                src={
                  loadImage && currElem.image
                    ? `./${currElem.image}`
                    : placeholderImage
                }
                alt={currElem.name}
                onError={e => {
                  e.target.src = placeholderImage;
                }}
              />
            </div>
          </div>

          {/* Name and info */}
          <div className="relative z-10 text-left space-y-4">
            <div className="text-center">
              <h2 className="text-3xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent drop-shadow-md">
                {currElem.name}
              </h2>
              <p className="text-2xl sm:text-xl font-semibold text-blue-300 mt-1">
                {currElem.roll}
              </p>
            </div>

            <div className="space-y-2 text-sm text-gray-200">
              <p>
                <strong className="text-blue-400">College:</strong>{" "}
                {currElem.college}
              </p>
              <p>
                <strong className="text-purple-400">School:</strong>{" "}
                {currElem.school}
              </p>
              <p>
                <strong className="text-pink-400">District:</strong>{" "}
                {currElem.district}
              </p>
            </div>

            <blockquote className="text-sm italic text-gray-300 mt-4 pl-4 border-l-4 border-blue-400/50 transition-all duration-300 group-hover:border-blue-400">
              "{currElem.quote}"
            </blockquote>

            {/* Social media icons */}
            <div className="flex justify-center space-x-4 mt-6">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-blue-500/20 transition-transform duration-300 hover:scale-110"
                >
                  <FaFacebook className="size-6 text-blue-400" />
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="p-2 rounded-full bg-white/5 hover:bg-green-500/20 transition-transform duration-300 hover:scale-110"
                >
                  <FaPhone className="size-6 text-green-400" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-pink-500/20 transition-transform duration-300 hover:scale-110"
                >
                  <FaInstagram className="size-6 text-pink-400" />
                </a>
              )}
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/5 hover:bg-green-500/20 transition-transform duration-300 hover:scale-110"
                >
                  <FaWhatsapp className="size-6 text-green-400" />
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default Card;
