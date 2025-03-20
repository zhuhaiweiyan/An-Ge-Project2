// src/pages/GamePage.js
import React from "react";
import { useGameContext } from "../contexts/GameContext";
import Board from "../components/Board";
import ShipSetup from "../utils/ShipSetup";
import "../css/GamePage.css";

export default function GamePage({ mode }) {
  const { turn, gameOver, winner, time, resetGame, setupComplete } = useGameContext();
  return (
    <div className="game-page-container">
      {gameOver && (
        <div className="game-over-banner">
          <span>Game Over! {winner} won!</span>
        </div>
      )}

      <div className="top-bar">
        <h2 className="page-title">Game Page - Mode: {mode}</h2>
        <div className="info-section">
          <span className="timer">Time: {time} seconds</span>
          <button className="reset-btn" onClick={resetGame}>
            Reset
          </button>
        </div>
      </div>

      {/* If manual ship placement is not yet complete and mode is "normal", show the ShipSetup screen */}
      {!setupComplete && mode === "normal" ? (
        <div>
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

      <p className="turn-indicator">Current Turn: {turn}</p>
    </div>
  );
}
