const Background = () => {
  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/80 to-black"></div>

      {/* Animated Geometric Grid */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse"></div>
      </div>

      {/* Floating Particles Animation */}
      <div className="absolute inset-0 animate-fade-in">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-gray-600/20 to-gray-400/20 shadow-xl"
            style={{
              width: Math.random() * 12 + 6 + "px",
              height: Math.random() * 12 + 6 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animation: `float ${
                10 + Math.random() * 10
              }s infinite linear alternate`,
            }}
          />
        ))}
      </div>

      {/* Subtle Radial Gradient Center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-900/80 to-black"></div>

      {/* Animated Blobs */}
      <div className="absolute -top-[250px] -left-[450px] w-[750px] h-[750px] bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-full opacity-50 mix-blend-soft-light animate-blob animate-delay-2000 filter blur-3xl"></div>
      <div className="absolute -top-[150px] -right-[350px] w-[650px] h-[650px] bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-full opacity-50 mix-blend-soft-light animate-blob animate-delay-4000 filter blur-3xl"></div>
    </div>
  );
};

export default Background;
