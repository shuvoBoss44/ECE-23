import Background from "./components/Background";
import Card from "./components/Card";
import data from "./api/data.json";

const App = () => {
  return (
    <>
      <Background />
      <div className="relative min-h-screen">
        {/* Content container with higher z-index */}
        <div className="relative z-10">
          {/* Logo Section */}
          <div className="flex justify-center pt-8">
            <div className="relative group">
              <img
                loading="lazy"
                src="https://upload.wikimedia.org/wikipedia/en/thumb/8/87/RUET_logo.svg/1200px-RUET_logo.svg.png"
                alt="RUET logo"
                className="w-36 h-auto transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
              {/* Glowing Ring Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Heading Section */}
          <div className="text-center my-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-neon-glow">
              ECE-23 DETAILS
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-gray-300 font-medium max-w-2xl mx-auto px-4">
              Discover the students of Electrical and Computer Engineering
            </p>
            {/* Underline Accent */}
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mt-4 opacity-80" />
          </div>

          {/* Profile Cards */}
          <div className="flex flex-wrap justify-center gap-5 px-4 pb-8">
            {data && data.length > 0 ? (
              data.map((elem, index) => (
                <Card key={elem.id || index} currElem={elem} />
              ))
            ) : (
              <p className="text-center text-red-400 text-lg font-semibold">
                No data available!
              </p>
            )}
          </div>

          {/* Footer */}
          <footer className="text-center py-6 bg-gradient-to-t from-black/80 to-transparent">
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
        </div>
      </div>
    </>
  );
};

export default App;
