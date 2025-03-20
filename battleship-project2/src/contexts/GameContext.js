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

// Helper function for AI's move, returns an array of valid neighbor cells (row,col) that are not yet hit or miss
function getNeighbors(r, c, board) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const neighbors = [];
  for (let [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) {
      const cell = board[nr][nc];
      if (!cell.isHit && !cell.isMiss) {
        neighbors.push({ r: nr, c: nc });
      }
    }
  }
  return neighbors;
}

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
    hitsQueue: [], // cells that AI wants to attack next
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

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (!gameOver) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameOver]);

  // Save game state to localStorage after every state change if game is not over
  useEffect(() => {
    if (!isInitialized) return;
    if (!gameOver) {
      const stateToSave = {
        playerBoard,
        aiBoard,
        turn,
        gameOver,
        winner,
        time,
        setupComplete,
        aiMemory,
      };
      localStorage.setItem("gameState", JSON.stringify(stateToSave));
    } else {
      localStorage.removeItem("gameState");
    }
  }, [playerBoard, aiBoard, turn, gameOver, winner, time, setupComplete, aiMemory, isInitialized]);

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
  // const checkWinCondition = useCallback(() => {
  //   const playerDefeated = isBoardDefeated(playerBoard);
  //   const aiDefeated = isBoardDefeated(aiBoard);

  //   if (playerDefeated) {
  //     setGameOver(true);
  //     setWinner("AI");
  //   } else if (aiDefeated) {
  //     setGameOver(true);
  //     setWinner("Player");
  //   }
  // }, [playerBoard, aiBoard]);

  // ------------------------------------------------
  // 2) aiMove uses checkWinCondition
  // ------------------------------------------------
  // const aiMove = useCallback(() => {
  //   if (turn !== "ai" || gameOver) {
  //     return;
  //   }

  //   const newPlayerBoard = playerBoard.map((r) => r.map((c) => ({ ...c })));
  //   let possibleMoves = [];

  //   // Collect all unclicked cells
  //   for (let r = 0; r < newPlayerBoard.length; r++) {
  //     for (let c = 0; c < newPlayerBoard[r].length; c++) {
  //       const cell = newPlayerBoard[r][c];
  //       if (!cell.isHit && !cell.isMiss) {
  //         possibleMoves.push({ r, c });
  //       }
  //     }
  //   }

  //   if (possibleMoves.length > 0) {
  //     const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  //     const { r, c } = possibleMoves[randomIndex];
  //     const targetCell = newPlayerBoard[r][c];

  //     if (targetCell.hasShip) {
  //       targetCell.isHit = true;
  //       console.log("AI hit player's ship at", r, c);
  //     } else {
  //       targetCell.isMiss = true;
  //       console.log("AI missed at", r, c);
  //     }
  //     setPlayerBoard(newPlayerBoard);

  //     // Call the memoized checkWinCondition
  //     checkWinCondition();
  //   }

  //   if (!gameOver) {
  //     setTurn("player");
  //     console.log("Switch turn back to player");
  //   }
  // }, [turn, gameOver, playerBoard, checkWinCondition]);

  // --------------------------
  // Focused Targeting in aiMove
  // --------------------------
  const aiMove = useCallback(() => {
    if (turn !== "ai" || gameOver) return;

    const newPlayerBoard = playerBoard.map((r) => r.map((c) => ({ ...c })));
    let { hitsQueue } = aiMemory; // current queue from state

    let move = null;

    // 1) If we have queued moves, pick the first from the queue
    if (hitsQueue.length > 0) {
      move = hitsQueue[0];
      hitsQueue = hitsQueue.slice(1); // remove from queue
    } else {
      // 2) Otherwise, pick a random unclicked cell
      let possibleMoves = [];
      for (let r = 0; r < newPlayerBoard.length; r++) {
        for (let c = 0; c < newPlayerBoard[r].length; c++) {
          const cell = newPlayerBoard[r][c];
          if (!cell.isHit && !cell.isMiss) {
            possibleMoves.push({ r, c });
          }
        }
      }
      if (possibleMoves.length === 0) {
        // No moves left (shouldn't happen if game not over)
        return;
      }
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      move = possibleMoves[randomIndex];
    }

    // Now attack the chosen move
    const targetCell = newPlayerBoard[move.r][move.c];
    if (targetCell.hasShip) {
      targetCell.isHit = true;
      console.log("AI hit player's ship at", move.r, move.c);

      // Focused targeting: add neighbors to hitsQueue
      const neighbors = getNeighbors(move.r, move.c, newPlayerBoard);
      // Merge them in. We can do simple concatenation:
      hitsQueue = hitsQueue.concat(neighbors);
    } else {
      targetCell.isMiss = true;
      console.log("AI missed at", move.r, move.c);
    }

    setPlayerBoard(newPlayerBoard);
    setAiMemory({ hitsQueue });

    // Check win
    // checkWinCondition();
    if (isBoardDefeated(newPlayerBoard)) {
      setGameOver(true);
      setWinner("AI");
      console.log("AI wins! Game over.");
      return;
    }

    // Switch turn back to player if game not over
    if (!gameOver) {
      setTurn("player");
    }
  }, [turn, gameOver, playerBoard, aiMemory]);

  // If turn === "ai" and not game over, AI moves after 500ms
  useEffect(() => {
    if (turn === "ai" && !gameOver) {
      const timer = setTimeout(aiMove, 500);
      return () => clearTimeout(timer);
    }
  }, [turn, gameOver, aiMove]);

  // Modified resetGame to clear localStorage and reset setupComplete flag
  function resetGame() {
    const newPlayerBoard = generateBoard();
    const newAiBoard = generateBoard();
    setPlayerBoard(newPlayerBoard);
    setAiBoard(newAiBoard);
    setTurn("player");
    setGameOver(false);
    setWinner(null);
    setTime(0);
    setSetupComplete(false);
    localStorage.removeItem("gameState");
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

  // Function to mark manual ship placement as complete (for bonus 功能)
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
        setPlayerBoard, // needed for ship placement
        completeSetup, // flag to indicate ship placement is done
        setupComplete, // current status of ship placement
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
