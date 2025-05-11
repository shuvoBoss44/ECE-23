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
          <div className="flex justify-center pt-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/8/87/RUET_logo.svg/1200px-RUET_logo.svg.png"
              alt="RUET logo"
              className="w-32 h-auto drop-shadow-logo"
            />
          </div>

          {/* Heading */}
          <h1 className="text-center text-3xl font-bold text-white my-6 neon-text">
            ECE-23 DETAILS
          </h1>

          {/* Profile Cards */}
          <div className="flex flex-wrap justify-center gap-5 px-4 pb-8">
            {data && data.length > 0 ? (
              data.map((elem, index) => <Card key={index} currElem={elem} />)
            ) : (
              <p className="text-center text-red-400">No data available!</p>
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
