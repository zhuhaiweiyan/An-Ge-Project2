// src/utils/ShipPlacement.js

/**
 * Generate a 10x10 battleship board with ships placed randomly.
 * Returns a 2D array of cells { hasShip, isHit, isMiss }.
 */
export function generateBoard() {
  const SIZE = 10;
  const board = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({
      hasShip: false,
      isHit: false,
      isMiss: false,
    }))
  );

  // Ship lengths: Carrier(5), Battleship(4), Cruiser(3), Destroyer(2)
  const shipLengths = [5, 4, 3, 2];

  shipLengths.forEach((length) => placeShipRandomly(board, length));

  return board;
}

/**
 * Place a single ship of given length on board at a random valid location.
 * Retries until a non-overlapping position is found.
 */
function placeShipRandomly(board, length) {
  const SIZE = board.length;
  const MAX_ATTEMPTS = 100;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
    const startRow = Math.floor(Math.random() * SIZE);
    const startCol = Math.floor(Math.random() * SIZE);

    if (canPlaceShip(board, startRow, startCol, length, orientation)) {
      for (let offset = 0; offset < length; offset++) {
        const r = orientation === "horizontal" ? startRow : startRow + offset;
        const c = orientation === "horizontal" ? startCol + offset : startCol;
        board[r][c].hasShip = true;
      }
      return;
    }
  }

  console.warn(
    `Failed to place ship of length ${length} after ${MAX_ATTEMPTS} attempts.`
  );
}

/**
 * Check if a ship can fit at the specified position without overlapping or going out of bounds.
 */
function canPlaceShip(board, row, col, length, orientation) {
  const SIZE = board.length;

  if (orientation === "horizontal") {
    if (col + length > SIZE) return false;
    for (let i = 0; i < length; i++) {
      if (board[row][col + i].hasShip) return false;
    }
  } else {
    if (row + length > SIZE) return false;
    for (let i = 0; i < length; i++) {
      if (board[row + i][col].hasShip) return false;
    }
  }

  return true;
}
