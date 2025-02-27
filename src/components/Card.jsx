import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const ProfileCard = props => {
  const { currElem } = props;

  // Destructuring the social media links for better readability
  const { facebook, twitter, linkedin, whatsapp } = currElem.socialMedia;

  return (
    <div className="profile-card">
      {currElem.image ? (
        <img className="profile-image" src={currElem.image} />
      ) : (
        <img
          className="profile-image"
          src="https://zeru.com/blog/wp-content/uploads/How-Do-You-Have-No-Profile-Picture-on-Facebook_25900"
        />
      )}
      <div className="profile-content">
        <div className="name-roll">
          <h2 className="profile-name glass-text">{currElem.name}</h2>
        </div>
        <div className="roll">
          <span className="profile-roll glass-text">{currElem.roll}</span>
        </div>
        <div className="details">
          <p className="profile-colleg glass-text">
            <strong>College:</strong> {currElem.college}
          </p>
          <p className="profile-school glass-text">
            <strong>School:</strong> {currElem.school}
          </p>
          <p className="profile-district glass-text">
            <strong>District:</strong> {currElem.district}
          </p>
        </div>
        <blockquote className="profile-quote glass-text">
          &quot;{currElem.quote}&quot;
        </blockquote>
        <div className="social-media-links">
          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="design"
            >
              <FaFacebook size={30} style={{ cursor: "pointer" }} />
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="design"
            >
              <FaTwitter size={30} style={{ cursor: "pointer" }} />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="design"
            >
              <FaLinkedin size={30} style={{ cursor: "pointer" }} />
            </a>
          )}
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="design"
            >
              <FaWhatsapp size={30} style={{ cursor: "pointer" }} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
