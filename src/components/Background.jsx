import { useState, useEffect } from "react";

const Background = ({ children }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      // Create fewer stars and optimize their creation
      for (let i = 0; i < 60; i++) {
        newStars.push({
          id: i,
          size: Math.random() * 1.5 + 1, // Smaller stars for smoother effect
          left: Math.random() * 100,
          top: Math.random() * 100,
          animationDuration: Math.random() * 5 + 2, // Increased duration for smoothness
        });
      }
      setStars(newStars);
    };

    generateStars();

    // Throttle resize events
    const resizeHandler = () => {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(generateStars, 300); // Throttle more aggressively
    };
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-black overflow-hidden">
      {/* Optimized stars with hardware acceleration */}
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
            transform: "translateZ(0)", // Promote to own layer
            willChange: "opacity, transform", // Hint browser for optimization
          }}
        />
      ))}

      {/* Simplified particle effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-full h-full bg-gradient-to-b from-transparent via-blue-400/5 to-transparent" />
      </div>

      {/* Reduced shooting stars with better animation */}
      {[...Array(1)].map((_, i) => (
        <div
          key={`shooting-${i}`}
          className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-transparent animate-shoot"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`, // Adjusted delay for smoothness
            transform: "translateZ(0)",
          }}
        />
      ))}

      {children}

      <style jsx global>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-100vmax) translateY(50vmin);
            opacity: 0;
          }
        }

        .animate-twinkle {
          animation: twinkle infinite ease-in-out;
        }

        .animate-shoot {
          animation: shoot 3s infinite linear;
          box-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Background;
