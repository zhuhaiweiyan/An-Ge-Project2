// src/components/NavBar.js

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/NavBar.css";

export default function NavBar() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          An Ge's Battleship
        </Link>
      </div>

      <nav className="navbar-links">
        <Link
          to="/"
          className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>

        <div className="nav-item dropdown" ref={dropdownRef}>
          <button className="dropdown-btn" onClick={toggleDropdown}>
            Game
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/game/normal" className="dropdown-link">
                Normal
              </Link>
              <Link to="/game/easy" className="dropdown-link">
                Free Play
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/rules"
          className={`nav-item ${
            location.pathname === "/rules" ? "active" : ""
          }`}
        >
          Rules
        </Link>

        <Link
          to="/highscores"
          className={`nav-item ${
            location.pathname === "/highscores" ? "active" : ""
          }`}
        >
          History
        </Link>
      </nav>
    </header>
  );
}
