// src/pages/GamePage.js

import React from "react";
import { useGameContext } from "../contexts/GameContext";
import Board from "../components/Board";
import ShipSetup from "../utils/ShipSetup";
import "../css/GamePage.css";

export default function GamePage({ mode }) {
  const { turn, gameOver, winner, time, resetGame, setupComplete } =
    useGameContext();

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }

  return (
    <div className="game-page-container">
      <div className="top-bar">
        <h2 className="page-title">Current Mode: {mode}</h2>
        <div className="info-section">
          <span className="timer">Time: {formatTime(time)}</span>
          {(setupComplete || mode === "easy") && (
            <button className="reset-btn" onClick={resetGame}>
              Restart
            </button>
          )}
        </div>
      </div>

      {/* Only show current turn during active gameplay */}
      {setupComplete && !gameOver && (
        <p className="turn-indicator">Current Turn: {turn}</p>
      )}

      {/* Display game over banner when game ends */}
      {gameOver && (
        <div className="game-over-banner">
          <span>Game Over! {winner} won!</span>
        </div>
      )}

      {/* Show ship setup if not completed; otherwise render boards */}
      {!setupComplete && mode === "normal" ? (
        <div className="ship-setup-info">
          <h3>Place your ships</h3>
          <ShipSetup />
        </div>
      ) : (
        <div className="boards-container">
          {mode === "normal" && (
            <div className="board-wrapper">
              <h3 className="board-title">Your Board (Player)</h3>
              <Board isPlayerBoard={true} hideShips={true} />
            </div>
          )}

          <div className="board-wrapper">
            <h3 className="board-title">Opponent Board (AI)</h3>
            <Board isPlayerBoard={false} hideShips={true} mode={mode} />
          </div>
        </div>
      )}
    </div>
  );
}
