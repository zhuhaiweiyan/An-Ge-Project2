// src/contexts/GameContext.js

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { generateBoard } from "../utils/ShipPlacement";

const GameContext = createContext();

export function GameProvider({ children }) {
  const [playerBoard, setPlayerBoard] = useState([]);
  const [aiBoard, setAiBoard] = useState([]);
  const [turn, setTurn] = useState("player");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [time, setTime] = useState(0);
  const [setupComplete, setSetupComplete] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [aiMemory, setAiMemory] = useState({
    hitsQueue: [],
  });

  // Load saved game state from localStorage when component mounts
  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setPlayerBoard(parsedState.playerBoard);
      setAiBoard(parsedState.aiBoard);
      setTurn(parsedState.turn);
      setGameOver(parsedState.gameOver);
      setWinner(parsedState.winner);
      setTime(parsedState.time);
      setSetupComplete(parsedState.setupComplete);
      setAiMemory(parsedState.aiMemory || { hitsQueue: [] });
    } else {
      resetGame();
    }
    setIsInitialized(true);
  }, []);

  // Save game state to localStorage after every state change if game is not over
  useEffect(() => {
    if (!isInitialized) return;
    if (gameOver) {
      localStorage.removeItem("gameState");
    } else {
      localStorage.setItem(
        "gameState",
        JSON.stringify({
          playerBoard,
          aiBoard,
          turn,
          gameOver,
          winner,
          time,
          setupComplete,
          aiMemory,
        })
      );
    }
  }, [
    playerBoard,
    aiBoard,
    turn,
    gameOver,
    winner,
    time,
    setupComplete,
    aiMemory,
    isInitialized,
  ]);

  // Timer increment while game is active
  useEffect(() => {
    if (!gameOver) {
      const id = setInterval(() => setTime((t) => t + 1), 1000);
      return () => clearInterval(id);
    }
  }, [gameOver]);

  // Check if all ships on a board are sunk
  function isBoardDefeated(board) {
    return board.every((row) =>
      row.every((cell) => !(cell.hasShip && !cell.isHit))
    );
  }

  // --------------------------
  // Focused Targeting in aiMove
  // --------------------------
  const aiMove = useCallback(() => {
    if (turn !== "ai" || gameOver) return;

    const newPlayerBoard = playerBoard.map((r) => r.map((c) => ({ ...c })));

    // If hitsQueue is not empty, pick the first from the queue
    // Otherwise, pick a random unclicked cell
    let { hitsQueue } = aiMemory;
    let move = hitsQueue.length ? hitsQueue.shift() : null;

    if (!move) {
      const candidates = [];
      newPlayerBoard.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (!cell.isHit && !cell.isMiss) candidates.push({ r, c });
        });
      });
      move = candidates[Math.floor(Math.random() * candidates.length)];
    }

    const target = newPlayerBoard[move.r][move.c];
    if (target.hasShip) {
      target.isHit = true;
      // add adjacent cells for focused targeting
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc]) => {
        const nr = move.r + dr, nc = move.c + dc;
        if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) {
          const adj = newPlayerBoard[nr][nc];
          if (!adj.isHit && !adj.isMiss) hitsQueue.push({ r: nr, c: nc });
        }
      });
    } else {
      target.isMiss = true;
    }

    setPlayerBoard(newPlayerBoard);
    setAiMemory({ hitsQueue });

    // Check win
    if (isBoardDefeated(newPlayerBoard)) {
      setGameOver(true);
      setWinner("AI");
      return;
    }

    if (!gameOver) {
      setTurn("player");
    }
  }, [turn, gameOver, playerBoard, aiMemory]);

  // If turn === "ai" and not game over, AI moves after 200ms
  useEffect(() => {
    if (turn === "ai" && !gameOver) {
      const timer = setTimeout(aiMove, 200);
      return () => clearTimeout(timer);
    }
  }, [turn, gameOver, aiMove]);

  // Reset game state
  function resetGame() {
    setPlayerBoard(generateBoard());
    setAiBoard(generateBoard());
    setTurn("player");
    setGameOver(false);
    setWinner(null);
    setTime(0);
    setSetupComplete(false);
    setAiMemory({ hitsQueue: [] });
    localStorage.removeItem("gameState");
  }

  function playerMove(row, col, mode) {
    if (turn !== "player" || gameOver) return;
    const newAiBoard = aiBoard.map((r) => r.map((c) => ({ ...c })));
    const cell = newAiBoard[row][col];
    if (cell.isHit || cell.isMiss) return;

    cell.hasShip ? cell.isHit = true : cell.isMiss = true;
    setAiBoard(newAiBoard);

    // check win
    if (isBoardDefeated(newAiBoard)) {
      setGameOver(true);
      setWinner("Player");
    }

    if (!gameOver && mode === "normal") {
      setTurn("ai");
    }
  }

  function completeSetup() {
    setSetupComplete(true);
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
        setPlayerBoard,
        completeSetup,
        setupComplete,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
