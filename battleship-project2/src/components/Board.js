// src/components/Board.js

import React from "react";
import { useGameContext } from "../contexts/GameContext";
import Cell from "./Cell";

export default function Board({ isPlayerBoard, hideShips, mode }) {

  const { playerBoard, aiBoard } = useGameContext();
  const boardData = isPlayerBoard ? playerBoard : aiBoard;

  return (
    <div
      className="board"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 30px)",
        gridTemplateRows: "repeat(10, 30px)",
        gap: "1px",
        backgroundColor: "white",
      }}
    >
      {boardData.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            isPlayerBoard={isPlayerBoard}
            hideShips={hideShips}
            mode={mode}
          />
        ))
      )}
    </div>
  );
}
