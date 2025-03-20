// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import RulesPage from "./pages/RulesPage";
import HighScoresPage from "./pages/HighScoresPage";

import "./css/App.css"; // Global layout styles

function App() {
  return (
    <Router>
      {/* Fixed Navbar */}
      <NavBar />

      {/* Main wrapper for content, with top/bottom padding to avoid overlap */}
      <div className="app-wrapper">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/normal" element={<GamePage mode="normal" />} />
            <Route path="/game/easy" element={<GamePage mode="easy" />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/highscores" element={<HighScoresPage />} />
          </Routes>
        </div>
      </div>

      {/* Fixed Footer */}
      <Footer />
    </Router>
  );
}

export default App;
