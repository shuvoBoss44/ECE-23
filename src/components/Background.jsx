import { useState, useEffect } from "react";

const Background = ({ children }) => {
  const [stars, setStars] = useState([]);
  const [shooters, setShooters] = useState([]);

  // Generate stars
  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 200; i++) {
        newStars.push({
          id: i,
          size: Math.random() * 3,
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: Math.random() * 3 + 2,
        });
      }
      setStars(newStars);
    };

    generateStars();
    window.addEventListener("resize", generateStars);
    return () => window.removeEventListener("resize", generateStars);
  }, []);

  // Generate shooting stars
  useEffect(() => {
    const interval = setInterval(() => {
      setShooters(prev => [
        ...prev.slice(-2),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          angle: Math.random() * 90 - 45,
        },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Static stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDuration: `${star.duration}s`,
            opacity: 0.7,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shooters.map(shooter => (
        <div
          key={shooter.id}
          className="absolute h-[2px] w-[50px] bg-gradient-to-r from-transparent via-white to-transparent transform-gpu"
          style={{
            left: `${shooter.x}%`,
            top: `${shooter.y}%`,
            transform: `rotate(${shooter.angle}deg)`,
            animation: "shoot 1.5s linear forwards",
          }}
        />
      ))}

      {/* Nebula effect */}
      <div className="absolute inset-0 opacity-30 mix-blend-screen">
        <div
          className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops)]"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(94, 234, 212, 0.2) 0%, transparent 70%),
              radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 70%)
            `,
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-10 bg-repeat"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {children}

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(var(--angle));
            opacity: 1;
          }
          100% {
            transform: translateX(-100vw) translateY(100vh) rotate(var(--angle));
            opacity: 0;
          }
        }
        .animate-pulse {
          animation: pulse infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Background;
