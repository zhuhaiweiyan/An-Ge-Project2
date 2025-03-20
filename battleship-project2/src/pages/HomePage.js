// src/pages/HomePage.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import battleshipImage from "../assets/images/battleship.jpg";
import "../css/HomePage.css";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  // Toggle the game mode selection modal
  const handleStartGame = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="container">
      <h1 className="title">Welcome to An Ge's Battleship!</h1>

      <div className="content">
        <p>
          A classic naval combat game where strategy and skill determine the
          winner.
        </p>
        <p>Get ready to outwit your opponent and sink their fleet!</p>
      </div>

      <div className="image-container">
        <img
          src={battleshipImage}
          alt="Battleship"
          className="battleship-image"
        />
      </div>

      <div className="button">
        <button className="start-btn" onClick={handleStartGame}>
          Start Game
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Select Game Mode</h3>
            <div className="modal-buttons">
              <Link to="/game/normal" className="mode-btn" onClick={closeModal}>
                Normal Mode
              </Link>
              <Link to="/game/easy" className="mode-btn" onClick={closeModal}>
                Free Play
              </Link>
            </div>
            <button className="close-btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
