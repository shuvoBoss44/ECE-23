import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import IntroGenerator from "./components/IntroGenerator";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import data from "./api/data.json";

const Root = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/intro-generator" element={<IntroGenerator />} />
        <Route path="/profile/:roll" element={<Profile data={data} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
