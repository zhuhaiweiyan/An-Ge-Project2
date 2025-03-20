import React, { useState } from "react";
import "../css/ShipPlacement.css";

export default function ShipPlacement({ onComplete }) {
  const [placedShips, setPlacedShips] = useState([]);

  function placeShip(row, col) {
    if (placedShips.length < 5) {
      setPlacedShips([...placedShips, { row, col }]);
    }
  }

  function startGame() {
    if (placedShips.length === 5) {
      onComplete(placedShips);
    } else {
      alert("Place all 5 ships first!");
    }
  }

  return (
    <div className="ship-placement-container">
      <h2>Place Your Ships</h2>
      <div className="board">
        {[...Array(10)].map((_, row) =>
          [...Array(10)].map((_, col) => (
            <div
              key={`${row}-${col}`}
              className={`board-cell ${
                placedShips.some((s) => s.row === row && s.col === col)
                  ? "cell-ship"
                  : ""
              }`}
              onClick={() => placeShip(row, col)}
            />
          ))
        )}
      </div>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
}
