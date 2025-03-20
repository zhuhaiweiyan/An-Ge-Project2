// src/contexts/GameContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { generateBoard } from "../utils/shipPlacement";

const GameContext = createContext();

export function GameProvider({ children }) {
  const [playerBoard, setPlayerBoard] = useState([]);
  const [aiBoard, setAiBoard] = useState([]);
  const [turn, setTurn] = useState("player");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (!gameOver) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameOver]);

  // Pure function to check if a board is fully defeated
  function isBoardDefeated(board) {
    for (let row of board) {
      for (let cell of row) {
        if (cell.hasShip && !cell.isHit) {
          return false;
        }
      }
    }
    return true;
  }

  // ------------------------------------------------
  // 1) Wrap checkWinCondition in useCallback
  // ------------------------------------------------
  const checkWinCondition = useCallback(() => {
    const playerDefeated = isBoardDefeated(playerBoard);
    const aiDefeated = isBoardDefeated(aiBoard);

    if (playerDefeated) {
      setGameOver(true);
      setWinner("AI");
    } else if (aiDefeated) {
      setGameOver(true);
      setWinner("Player");
    }
  }, [
    playerBoard,
    aiBoard,
    // If ESLint complains about setGameOver/setWinner, add them here as well.
  ]);

  // ------------------------------------------------
  // 2) aiMove uses checkWinCondition
  // ------------------------------------------------
  const aiMove = useCallback(() => {
    if (turn !== "ai" || gameOver) {
      console.log("aiMove aborted", { turn, gameOver });
      return;
    }
    console.log("aiMove called", { turn, gameOver });

    const newPlayerBoard = playerBoard.map((r) => r.map((c) => ({ ...c })));
    let possibleMoves = [];

    // Collect all unclicked cells
    for (let r = 0; r < newPlayerBoard.length; r++) {
      for (let c = 0; c < newPlayerBoard[r].length; c++) {
        const cell = newPlayerBoard[r][c];
        if (!cell.isHit && !cell.isMiss) {
          possibleMoves.push({ r, c });
        }
      }
    }

    if (possibleMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      const { r, c } = possibleMoves[randomIndex];
      const targetCell = newPlayerBoard[r][c];

      if (targetCell.hasShip) {
        targetCell.isHit = true;
        console.log("AI hit player's ship at", r, c);
      } else {
        targetCell.isMiss = true;
        console.log("AI missed at", r, c);
      }
      setPlayerBoard(newPlayerBoard);

      // Call the memoized checkWinCondition
      checkWinCondition();
    }

    if (!gameOver) {
      setTurn("player");
      console.log("Switch turn back to player");
    }
  }, [
    turn,
    gameOver,
    playerBoard,
    checkWinCondition, // Must include checkWinCondition as a dependency
  ]);

  // If turn === "ai" and not game over, AI moves after 500ms
  useEffect(() => {
    if (turn === "ai" && !gameOver) {
      const timer = setTimeout(aiMove, 500);
      return () => clearTimeout(timer);
    }
  }, [turn, gameOver, aiMove]);

  function resetGame() {
    const newPlayerBoard = generateBoard();
    const newAiBoard = generateBoard();
    setPlayerBoard(newPlayerBoard);
    setAiBoard(newAiBoard);
    setTurn("player");
    setGameOver(false);
    setWinner(null);
    setTime(0);
  }

  function playerMove(row, col, mode) {
    if (turn !== "player" || gameOver) return;
    const newAiBoard = aiBoard.map((r) => r.map((c) => ({ ...c })));
    const cell = newAiBoard[row][col];
    if (cell.isHit || cell.isMiss) return;

    if (cell.hasShip) {
      cell.isHit = true;
      console.log("Player hit AI ship at", row, col);
    } else {
      cell.isMiss = true;
      console.log("Player missed at", row, col);
    }
    setAiBoard(newAiBoard);

    // Inline check for immediate defeat of AI
    const aiDefeated = isBoardDefeated(newAiBoard);
    if (aiDefeated) {
      setGameOver(true);
      setWinner("Player");
      console.log("AI defeated immediately. Game over!");
    } else {
      const playerDefeated = isBoardDefeated(playerBoard);
      if (playerDefeated) {
        setGameOver(true);
        setWinner("AI");
      }
    }

    // If not over, switch turn to AI
    if (!gameOver && mode === "normal") {
      setTurn("ai");
      console.log("Switch turn to AI");
    }
  }

  return (
    <GameContext.Provider
      value={{
        playerBoard,
        aiBoard,
        turn,
        gameOver,
        winner,
        time,
        resetGame,
        playerMove,
        aiMove,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
