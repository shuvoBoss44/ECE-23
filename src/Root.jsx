import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import IntroGenerator from "./components/IntroGenerator";
import Navbar from "./components/Navbar";

const Root = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/intro-generator" element={<IntroGenerator />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
