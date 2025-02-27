import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const ProfileCard = ({ currElem }) => {
  const { facebook, twitter, linkedin, whatsapp } = currElem.socialMedia;

  return (
    <div className="w-80 p-6 transition-all duration-300 ease-in-out hover:-translate-y-2 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-2xl"></div>

      {/* Profile Image */}
      <div className="relative z-10 flex justify-center">
        <img
          className="w-40 h-40 object-cover rounded-full border-4 border-white/50 shadow-md hover:scale-105 transition-transform duration-300"
          src={
            currElem.image ||
            "https://zeru.com/blog/wp-content/uploads/How-Do-You-Have-No-Profile-Picture-on-Facebook_25900"
          }
          alt={currElem.name}
        />
      </div>

      {/* Profile Content */}
      <div className="p-5 relative z-10 text-left">
        {/* Name and Roll Number */}
        <h2 className="text-2xl font-bold text-center text-white drop-shadow-md">
          {currElem.name}
        </h2>
        <p className="text-xl font-semibold text-center text-blue-400 drop-shadow-md mt-1">
          {currElem.roll}
        </p>

        {/* Details */}
        <div className="space-y-1 mt-4">
          <p className="text-sm text-gray-300">
            <strong className="text-blue-400">College:</strong>{" "}
            {currElem.college}
          </p>
          <p className="text-sm text-gray-300">
            <strong className="text-blue-400">School:</strong> {currElem.school}
          </p>
          <p className="text-sm text-gray-300">
            <strong className="text-blue-400">District:</strong>{" "}
            {currElem.district}
          </p>
        </div>

        {/* Quote */}
        <blockquote className="text-sm italic text-gray-400 mt-4 border-l-4 border-blue-500 pl-3">
          "{currElem.quote}"
        </blockquote>

        {/* Social Links */}
        <div className="flex justify-center space-x-4 mt-5">
          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-blue-500 transition-transform duration-200 hover:scale-110"
            >
              <FaFacebook className="size-6" />
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-blue-400 transition-transform duration-200 hover:scale-110"
            >
              <FaTwitter className="size-6" />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-blue-600 transition-transform duration-200 hover:scale-110"
            >
              <FaLinkedin className="size-6" />
            </a>
          )}
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-green-400 transition-transform duration-200 hover:scale-110"
            >
              <FaWhatsapp className="size-6" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
