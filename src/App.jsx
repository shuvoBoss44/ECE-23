import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Background from "./components/Background";
import Card from "./components/Card";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Precompute search strings for fetched users
  const precomputedData = useMemo(() => {
    return users.map(item => ({
      ...item,
      searchString: [
        item.name,
        item.roll,
        item.district,
        item.school,
        item.college,
      ]
        .filter(field => field)
        .map(field => field.toLowerCase())
        .join(" "),
    }));
  }, [users]);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          "https://ece-23-backend.onrender.com/api/users",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Fetch users error:", err);
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Scroll to card when returning from Profile
  useEffect(() => {
    if (location.state?.cardId) {
      const cardElement = document.getElementById(
        `card-${location.state.cardId}`
      );
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [location]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle input and debounce search
  const handleSearch = useCallback(e => {
    const value = e.target.value;
    setInputValue(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(
      () => setSearchTerm(value.toLowerCase().trim()),
      300
    );
  }, []);

  // Navigate to profile
  const goToProfile = useCallback(
    roll => {
      navigate(`/profile/${roll}`, { state: { from: "home", cardId: roll } });
      setInputValue("");
      setSearchTerm("");
    },
    [navigate]
  );

  // Filter data based on search term
  const filteredResults = useMemo(() => {
    if (!searchTerm) return [];
    const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);
    if (searchWords.length === 0) return [];

    return precomputedData.filter(item =>
      searchWords.every(word => item.searchString.includes(word))
    );
  }, [searchTerm, precomputedData]);

  // Memoize placeholder image
  const placeholderImage = useMemo(
    () =>
      "https://zeru.com/blog/wp-content/uploads/How-Do-You-Have-No-Profile-Picture-on-Facebook_25900",
    []
  );

  // Memoize scrollToTop
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Background />
      <div className="relative min-h-screen pt-16">
        <div className="relative z-10">
          {loading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-lg font-semibold">Loading...</p>
              </div>
            </div>
          ) : error ? (
            <div className="min-h-screen flex items-center justify-center">
              <p className="text-red-500 text-lg font-semibold">{error}</p>
            </div>
          ) : (
            <>
              {/* Logo */}
              <div className="flex justify-center pt-8">
                <div className="relative group">
                  <img
                    loading="lazy"
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/8/87/RUET_logo.svg/1200px-RUET_logo.svg.png"
                    alt="RUET logo"
                    className="w-36 h-auto transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Heading */}
              <div className="text-center my-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-neon-glow">
                  ECE-23 DETAILS
                </h1>
                <p className="mt-3 text-lg sm:text-xl text-gray-300 font-medium max-w-2xl mx-auto px-4">
                  Discover the students of Electrical and Computer Engineering
                </p>
                <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mt-4 opacity-80" />
              </div>

              {/* Search Input & Dropdown */}
              <div className="flex justify-center px-4 relative z-30 mb-8">
                <div className="relative w-full max-w-xl">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleSearch}
                    placeholder="Search by name, roll, district, school, college..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition-all duration-300 hover:shadow-xl"
                  />
                  {searchTerm && (
                    <ul className="absolute top-full mt-2 w-full bg-gray-800 text-white rounded-xl shadow-lg divide-y divide-gray-700 max-h-80 overflow-y-auto z-50">
                      {filteredResults.length > 0 ? (
                        filteredResults.map(item => (
                          <li
                            key={item.roll}
                            onClick={() => goToProfile(item.roll)}
                            className="flex items-center gap-4 p-3 hover:bg-blue-700 cursor-pointer transition"
                          >
                            <img
                              src={
                                item.image ? `/${item.image}` : placeholderImage
                              }
                              alt={item.name}
                              className="w-12 h-12 rounded-full border border-blue-400 object-cover"
                              loading="lazy"
                              onError={e => (e.target.src = placeholderImage)}
                            />
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm text-gray-300">
                                Roll: {item.roll} | {item.district}
                              </p>
                              <p className="text-xs text-gray-400">
                                {item.school}, {item.college}
                              </p>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-center py-3 text-red-400">
                          No matching results
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              {/* Card List */}
              <div className="flex flex-wrap justify-center gap-5 px-4 pb-8 items-stretch">
                {precomputedData.length > 0 ? (
                  precomputedData.map(elem => (
                    <div key={elem.roll} className="flex">
                      <Card
                        currElem={elem}
                        placeholderImage={placeholderImage}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-red-400 text-lg font-semibold">
                    No users available!
                  </p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-30">
                <button
                  onClick={scrollToTop}
                  className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  title="Go to Top"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
