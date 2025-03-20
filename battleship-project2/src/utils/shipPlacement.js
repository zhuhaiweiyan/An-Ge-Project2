// src/utils/shipPlacement.js
export function generateBoard() {
    const size = 10;
    const board = [];
  
    // Initialize empty board
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        row.push({
          hasShip: false,
          isHit: false,
          isMiss: false,
        });
      }
      board.push(row);
    }
  
    // Ship lengths: 5, 4, 3, 2
    const ships = [5, 4, 3, 2];
    for (let length of ships) {
      placeShipRandomly(board, length);
    }
  
    return board;
  }
  
  function placeShipRandomly(board, length) {
    const size = 10;
  
    while (true) {
      // orientation: "horizontal" or "vertical"
      const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
  
      if (orientation === "horizontal") {
        // Check if it fits horizontally
        if (col + length <= size) {
          // Check overlap
          let canPlace = true;
          for (let i = 0; i < length; i++) {
            if (board[row][col + i].hasShip) {
              canPlace = false;
              break;
            }
          }
          // If no overlap, place the ship
          if (canPlace) {
            for (let i = 0; i < length; i++) {
              board[row][col + i].hasShip = true;
            }
            break; // break the while loop
          }
        }
      } else {
        // vertical
        if (row + length <= size) {
          let canPlace = true;
          for (let i = 0; i < length; i++) {
            if (board[row + i][col].hasShip) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < length; i++) {
              board[row + i][col].hasShip = true;
            }
            break; // break the while loop
          }
        }
      }
      // if neither horizontal nor vertical placement is possible,
      // the while loop continues and tries a new random row/col/orientation
    }
  }
  