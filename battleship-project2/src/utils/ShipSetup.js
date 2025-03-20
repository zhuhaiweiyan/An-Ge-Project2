// src/utils/ShipSetup.js

import React, { useState } from "react";
import { useGameContext } from "../contexts/GameContext";

/**
 * ShipSetup allows user to place four ships (Carrier, Battleship, Cruiser, Destroyer) manually
 * or automatically. Ships are placed horizontally or vertically, without overlap.
 */
export default function ShipSetup() {
  const { setPlayerBoard, completeSetup } = useGameContext();

  const initialShips = [
    { id: "Carrier", name: "Carrier", length: 5 },
    { id: "Battleship", name: "Battleship", length: 4 },
    { id: "Cruiser", name: "Cruiser", length: 3 },
    { id: "Destroyer", name: "Destroyer", length: 2 },
  ];

  const [shipsToPlace, setShipsToPlace] = useState(initialShips);
  const [placedShips, setPlacedShips] = useState([]);
  const [orientation, setOrientation] = useState("horizontal");
  // State for hover preview:
  const [hoveredCells, setHoveredCells] = useState([]);
  const [hoverValid, setHoverValid] = useState(false);

  const isValidPlacement = (row, col, shipLength, orient) => {
    const newShipCells = [];
    if (orient === "horizontal") {
      if (col + shipLength > 10) return false;
      for (let c = col; c < col + shipLength; c++) {
        newShipCells.push(`${row}-${c}`);
      }
    } else {
      if (row + shipLength > 10) return false;
      for (let r = row; r < row + shipLength; r++) {
        newShipCells.push(`${r}-${col}`);
      }
    }
    for (let ship of placedShips) {
      const shipCells = [];
      if (ship.orientation === "horizontal") {
        for (let c = ship.col; c < ship.col + ship.length; c++) {
          shipCells.push(`${ship.row}-${c}`);
        }
      } else {
        for (let r = ship.row; r < ship.row + ship.length; r++) {
          shipCells.push(`${r}-${ship.col}`);
        }
      }
      for (let cell of newShipCells) {
        if (shipCells.includes(cell)) return false;
      }
    }
    return true;
  };

  // Handle drop event on a board cell
  const handleDrop = (e, row, col) => {
    e.preventDefault();
    const shipDataStr = e.dataTransfer.getData("shipData");
    if (!shipDataStr) return;
    const shipData = JSON.parse(shipDataStr);
    // If invalid placement, do nothing (no alert)
    if (!isValidPlacement(row, col, shipData.length, orientation)) {
      setHoveredCells([]);
      setHoverValid(false);
      return;
    }
    // Valid placement: add ship info to placedShips
    const newShip = { ...shipData, orientation, row, col };
    setPlacedShips([...placedShips, newShip]);
    setShipsToPlace(shipsToPlace.filter((ship) => ship.id !== shipData.id));
    setHoveredCells([]);
    setHoverValid(false);
  };

  // Handle drag start for a ship (from the list or for repositioning)
  const handleDragStart = (e, ship, fromPlaced = false) => {
    // Create an invisible image to replace the default drag image
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    e.dataTransfer.setDragImage(img, 0, 0);

    e.dataTransfer.setData("shipData", JSON.stringify(ship));
    if (fromPlaced) {
      setPlacedShips(placedShips.filter((s) => s.id !== ship.id));
      if (!shipsToPlace.find((s) => s.id === ship.id)) {
        setShipsToPlace([
          ...shipsToPlace,
          { id: ship.id, name: ship.name, length: ship.length },
        ]);
      }
    }
    setHoveredCells([]);
    setHoverValid(false);
  };

  // When dragging over a specific cell, update preview state
  const handleCellDragOver = (e, row, col) => {
    e.preventDefault();
    console.log("handleCellDragOver => row:", row, "col:", col);
    const shipDataStr = e.dataTransfer.getData("shipData");
    if (!shipDataStr) {
      setHoveredCells([]);
      setHoverValid(false);
      return;
    }
    const shipData = JSON.parse(shipDataStr);
    const newCells = [];
    if (orientation === "horizontal") {
      for (let c = col; c < col + shipData.length; c++) {
        newCells.push(`${row}-${c}`);
      }
    } else {
      for (let r = row; r < row + shipData.length; r++) {
        newCells.push(`${r}-${col}`);
      }
    }
    const valid = isValidPlacement(row, col, shipData.length, orientation);
    setHoveredCells(newCells);
    setHoverValid(valid);
    console.log("newCells:", newCells, "valid:", valid);
  };

  // Toggle placement orientation
  const toggleOrientation = () => {
    setOrientation(orientation === "horizontal" ? "vertical" : "horizontal");
  };

  // Auto place ships using a simple algorithm
  const handleAutoPlace = () => {
    const autoPlacedShips = [];
    setPlacedShips([]);
    const tryPlaceShip = (ship) => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const randomOrient = Math.random() < 0.5 ? "horizontal" : "vertical";
        const maxRow = randomOrient === "vertical" ? 10 - ship.length : 9;
        const maxCol = randomOrient === "horizontal" ? 10 - ship.length : 9;
        const row = Math.floor(Math.random() * (maxRow + 1));
        const col = Math.floor(Math.random() * (maxCol + 1));
        let conflict = false;
        const newShipCells = [];
        if (randomOrient === "horizontal") {
          for (let c = col; c < col + ship.length; c++) {
            newShipCells.push(`${row}-${c}`);
          }
        } else {
          for (let r = row; r < row + ship.length; r++) {
            newShipCells.push(`${r}-${col}`);
          }
        }
        for (let placedShip of autoPlacedShips) {
          const placedCells = [];
          if (placedShip.orientation === "horizontal") {
            for (
              let c = placedShip.col;
              c < placedShip.col + placedShip.length;
              c++
            ) {
              placedCells.push(`${placedShip.row}-${c}`);
            }
          } else {
            for (
              let r = placedShip.row;
              r < placedShip.row + placedShip.length;
              r++
            ) {
              placedCells.push(`${r}-${placedShip.col}`);
            }
          }
          if (newShipCells.some((cell) => placedCells.includes(cell))) {
            conflict = true;
            break;
          }
        }
        if (!conflict) {
          autoPlacedShips.push({
            ...ship,
            orientation: randomOrient,
            row,
            col,
          });
          placed = true;
        }
        attempts++;
      }
      return placed;
    };

    let success = true;
    for (let ship of initialShips) {
      const placed = tryPlaceShip(ship);
      if (!placed) {
        success = false;
        break;
      }
    }
    if (success) {
      setPlacedShips(autoPlacedShips);
      setShipsToPlace([]);
    } else {
      alert("Auto placement failed. Please try again.");
    }
  };

  // Clear board: cancel placements and restore initial ships
  const handleClearBoard = () => {
    setPlacedShips([]);
    setShipsToPlace(initialShips);
    setHoveredCells([]);
    setHoverValid(false);
  };

  // When complete setup is clicked, build final board and finish setup
  const handleCompleteSetup = () => {
    if (shipsToPlace.length > 0) {
      alert("Please place all ships before starting the game.");
      return;
    }
    const board = [];
    for (let r = 0; r < 10; r++) {
      const row = [];
      for (let c = 0; c < 10; c++) {
        row.push({
          hasShip: false,
          isHit: false,
          isMiss: false,
          shipName: null,
        });
      }
      board.push(row);
    }
    placedShips.forEach((ship) => {
      if (ship.orientation === "horizontal") {
        for (let c = ship.col; c < ship.col + ship.length; c++) {
          board[ship.row][c].hasShip = true;
          board[ship.row][c].shipName = ship.name;
        }
      } else {
        for (let r = ship.row; r < ship.row + ship.length; r++) {
          board[r][ship.col].hasShip = true;
          board[r][ship.col].shipName = ship.name;
        }
      }
    });
    setPlayerBoard(board);
    completeSetup();
  };

  // Render the 10x10 board with preview highlighting
  const renderBoard = () => {
    const boardGrid = [];
    for (let r = 0; r < 10; r++) {
      const rowCells = [];
      for (let c = 0; c < 10; c++) {
        let cellOccupied = false;
        let occupyingShip = null;
        placedShips.forEach((ship) => {
          if (ship.orientation === "horizontal") {
            if (ship.row === r && c >= ship.col && c < ship.col + ship.length) {
              cellOccupied = true;
              occupyingShip = ship;
            }
          } else {
            if (ship.col === c && r >= ship.row && r < ship.row + ship.length) {
              cellOccupied = true;
              occupyingShip = ship;
            }
          }
        });
        // Default cell background
        let backgroundColor = cellOccupied ? "gray" : "lightblue";
        // If this cell is within the hovered preview and not occupied,
        // use green for valid placement or red for invalid placement.
        const cellId = `${r}-${c}`;
        if (hoveredCells.includes(cellId) && !cellOccupied) {
          backgroundColor = hoverValid ? "green" : "red";
        }
        rowCells.push(
          <div
            key={`${r}-${c}`}
            style={{
              width: "30px",
              height: "30px",
              border: "1px solid black",
              backgroundColor,
              boxSizing: "border-box",
              position: "relative",
            }}
            // Use both onDragEnter and onDragOver to ensure preview updated
            onDragEnter={(e) => {
              e.preventDefault();
              handleCellDragOver(e, r, c);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              handleCellDragOver(e, r, c);
            }}
            onDrop={(e) => handleDrop(e, r, c)}
            onClick={() => {
              // Allow removal of a ship by clicking its occupied cell
              if (cellOccupied && occupyingShip) {
                setPlacedShips(
                  placedShips.filter((s) => s.id !== occupyingShip.id)
                );
                if (!shipsToPlace.find((s) => s.id === occupyingShip.id)) {
                  setShipsToPlace([
                    ...shipsToPlace,
                    {
                      id: occupyingShip.id,
                      name: occupyingShip.name,
                      length: occupyingShip.length,
                    },
                  ]);
                }
              }
            }}
            draggable={cellOccupied}
            onDragStart={(e) => {
              if (occupyingShip) handleDragStart(e, occupyingShip, true);
            }}
          ></div>
        );
      }
      boardGrid.push(
        <div key={r} style={{ display: "flex" }}>
          {rowCells}
        </div>
      );
    }
    return boardGrid;
  };

  const renderShipsList = () => {
    return (
      <div>
        <h3>Ships to Place:</h3>
        {shipsToPlace.map((ship) => (
          <div
            key={ship.id}
            draggable
            onDragStart={(e) => handleDragStart(e, ship)}
            style={{
              margin: "5px",
              padding: "5px",
              border: "1px solid #333",
              backgroundColor: "#ddd",
              cursor: "grab",
            }}
          >
            {ship.name} ({ship.length})
          </div>
        ))}
      </div>
    );
  };

  return (
    // Add a top-level container for styling
    <div className="ship-setup-container">
      {/* Left side: the board */}
      <div className="ship-setup-left">
        {renderBoard()}
      </div>

      {/* Right side: the ships list and buttons */}
      <div className="ship-setup-right">
        {renderShipsList()}

        <div className="setup-buttons">
          <button className="setup-btn" onClick={toggleOrientation}>
            Toggle Orientation (Current: {orientation})
          </button>
          <button className="setup-btn" onClick={handleAutoPlace}>
            Auto Place Ships
          </button>
          <button className="setup-btn" onClick={handleClearBoard}>
            Clear Board
          </button>
          <button
            className="setup-btn primary"
            onClick={handleCompleteSetup}
            disabled={shipsToPlace.length > 0}
          >
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  );
}
