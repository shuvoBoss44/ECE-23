import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { createContext, useContext, useState, useEffect } from "react";
import App from "./App";
import IntroGenerator from "./components/IntroGenerator";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import NotesPage from "./components/NotesPage";
import Login from "./components/Login";
import NoteUploadPage from "./components/NoteUploadPage";
import ChangePassword from "./components/ChangePassword";
import Announcements from "./components/Announcements";
import ImportantLinks from "./components/ImportantLinks";
import UploadImportantLinks from "./components/UploadImportantLinks";

// User Context to cache authentication and user data
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

// PrivateRoute component to protect routes requiring authentication
const PrivateRoute = ({ children, isAuthenticated, setIsAuthenticated }) => {
  const { user, setUser } = useUser();

  useEffect(() => {
    const checkAuth = async (retries = 3, delay = 1000) => {
      try {
        const response = await fetch(
          "https://ece-23-backend.onrender.com/api/users/me",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.status === 429 && retries > 0) {
          console.warn(`Rate limit hit, retrying after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return checkAuth(retries - 1, delay * 2); // Exponential backoff
        }
        if (response.ok) {
          const userData = await response.json();
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    if (isAuthenticated === null || !user) {
      checkAuth();
    }
  }, [isAuthenticated, setIsAuthenticated, setUser]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Check authentication only on initial mount or logout
  useEffect(() => {
    const checkAuth = async (retries = 3, delay = 1000) => {
      try {
        const response = await fetch(
          "https://ece-23-backend.onrender.com/api/users/me",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.status === 429 && retries > 0) {
          console.warn(`Rate limit hit, retrying after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return checkAuth(retries - 1, delay * 2);
        }
        if (response.ok) {
          const userData = await response.json();
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    if (isAuthenticated === null) {
      checkAuth();
    }
  }, [isAuthenticated]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/intro-generator" element={<IntroGenerator />} />
        <Route path="/profile/:roll" element={<Profile />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route
          path="/notes/upload"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            >
              <NoteUploadPage />
            </PrivateRoute>
          }
        />
        <Route path="/important-links" element={<ImportantLinks />} />
        <Route
          path="/important-links/upload"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            >
              <UploadImportantLinks />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            >
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route path="/announcements" element={<Announcements />} />
      </Routes>
    </UserContext.Provider>
  );
};

// Wrap Root with BrowserRouter
const RootWithRouter = () => (
  <BrowserRouter>
    <Root />
  </BrowserRouter>
);

export default RootWithRouter;
