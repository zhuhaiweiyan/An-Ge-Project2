import React from "react";
import { useGameContext } from "../contexts/GameContext";
import Board from "../components/Board";
import "../css/GamePage.css"; // 导入优化后的 CSS

export default function GamePage({ mode }) {
  const { turn, gameOver, winner, time, resetGame } = useGameContext();

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

      <div className="boards-container">
        {mode === "normal" && (
          <div className="board-wrapper">
            <h3 className="board-title">Your Board (Player)</h3>
            <Board isPlayerBoard={true} hideShips={true} />
          </div>
        )}

        <div className="board-wrapper">
          <h3 className="board-title">Opponent Board (AI)</h3>
          <Board isPlayerBoard={false} hideShips={false} mode={mode} />
        </div>
      </div>

      <p className="turn-indicator">Current Turn: {turn}</p>
    </div>
  );
}
