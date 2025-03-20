import React, { useState } from "react";
import { useGameContext } from "../contexts/GameContext";

export default function Cell({ row, col, isPlayerBoard, hideShips, mode }) {
  const { playerBoard, aiBoard, playerMove, turn, gameOver } = useGameContext();
  const [hovered, setHovered] = useState(false);

  const cellData = isPlayerBoard ? playerBoard[row][col] : aiBoard[row][col];

  function handleClick() {
    if (gameOver) return;
    if (!isPlayerBoard && turn === "player") {
      playerMove(row, col, mode);
    }
  }

  let cellStyle = {
    width: "30px",
    height: "30px",
    border: "1px solid black",
    boxSizing: "border-box",
    cursor:
      !isPlayerBoard && turn === "player" && !gameOver ? "pointer" : "default",
    transition: "background-color 0.2s ease",
  };

  if (cellData.isHit) {
    cellStyle.backgroundColor = "red";
  } else if (cellData.isMiss) {
    cellStyle.backgroundColor = "green";
  } else if (cellData.hasShip && isPlayerBoard) {
    cellStyle.backgroundColor = "black";
  } else if (cellData.hasShip && !isPlayerBoard && !hideShips) {
    cellStyle.backgroundColor = "gray";
  } else if (!isPlayerBoard && hovered) {
    cellStyle.backgroundColor = "lightblue";
  }

  return (
    <div
      style={cellStyle}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    ></div>
  );
}
