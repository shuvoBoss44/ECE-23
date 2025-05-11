import Background from "./components/Background";
import Card from "./components/Card";
import data from "./api/data.json";

const App = () => {
  return (
    <div className="relative min-h-screen">
      {/* Fixed fullscreen background */}
      <Background fullscreen={true} />

      {/* Content container with Flexbox to push footer to bottom */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1">
          {/* Logo */}
          <div className="flex justify-center pt-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/8/87/RUET_logo.svg/1200px-RUET_logo.svg.png"
              alt="RUET logo"
              className="w-32 h-auto drop-shadow-logo"
            />
          </div>

          {/* Enhanced Heading */}
          <h1 className="text-center text-2xl sm:text-3xl font-bold text-white my-6 neon-text">
            ECE-23 DETAILS
          </h1>

          {/* Profile Cards with max-width container */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6">
              {data && data.length > 0 ? (
                data.map((elem, index) => (
                  <div
                    key={index}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card currElem={elem} />
                  </div>
                ))
              ) : (
                <p className="text-center text-red-400">No data available!</p>
              )}
            </div>
          </div>
        </main>

        {/* Styled Footer */}
        <footer className="text-center py-6 bg-gray-900 border-t border-gray-700">
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
  );
};

export default App;
