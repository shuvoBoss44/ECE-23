import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import App from "./App";
import IntroGenerator from "./components/IntroGenerator";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import NotesPage from "./components/NotesPage";
import Login from "./components/Login";
import NoteUploadPage from "./components/NoteUploadPage";
import ChangePassword from "./components/ChangePassword";
import Announcements from "./components/Announcements";

// PrivateRoute component to protect routes requiring authentication
const PrivateRoute = ({ children, isAuthenticated, setIsAuthenticated }) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "https://ece-23-backend.onrender.com/api/users/me",
          {
            method: "GET",
            credentials: "include",
          }
        );
        setIsAuthenticated(response.ok);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [setIsAuthenticated]);

  if (isAuthenticated === null) {
    return null; // Or a loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation(); // Track route changes

  // Check authentication on mount and route change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "https://ece-23-backend.onrender.com/api/users/me",
          {
            method: "GET",
            credentials: "include",
          }
        );
        setIsAuthenticated(response.ok);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [location.pathname]); // Re-run on route change

  return (
    <>
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
    </>
  );
};

// Wrap Root with BrowserRouter
const RootWithRouter = () => (
  <BrowserRouter>
    <Root />
  </BrowserRouter>
);

export default RootWithRouter;
