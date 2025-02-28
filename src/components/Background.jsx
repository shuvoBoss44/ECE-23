import { useState, useEffect } from "react";

const Background = ({ children }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 150; i++) {
        const star = {
          id: i,
          size: Math.random() * 3,
          left: Math.random() * 100,
          top: Math.random() * 100,
          animationDuration: Math.random() * 3 + 2,
        };
        newStars.push(star);
      }
      setStars(newStars);
    };

    generateStars();
    window.addEventListener("resize", generateStars);
    return () => window.removeEventListener("resize", generateStars);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-black overflow-hidden">
      {/* Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDuration: `${star.animationDuration}s`,
          }}
        />
      ))}

      {/* Animated particles */}
      <div className="absolute inset-0 animate-pulse">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-blue-900/20 to-transparent" />
      </div>

      {/* Shooting stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white animate-shoot"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {children}

      <style jsx global>{`
        @keyframes twinkle {
          0% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-100vw) translateY(100vh);
            opacity: 0;
          }
        }
        .animate-twinkle {
          animation: twinkle infinite linear;
        }
        .animate-shoot {
          animation: shoot 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Background;
