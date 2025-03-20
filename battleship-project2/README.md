# Battleship Game (Project 2)

## Overview

This project implements a web-based version of the classic **Battleship** board game using **JavaScript** and **React**. Players compete against an AI opponent in two distinct gameplay modes:

- **Normal Mode**: Players and AI alternate turns.
- **Free Play Mode**: Players freely target cells on the AI's board without AI retaliation.

## Project Structure

The project follows a **React-driven architecture**, leveraging:

- **React Hooks** (`useState`, `useEffect`, `useCallback`)
- **Context API** for global state management
- **React Router** for routing between pages
- **CSS Flexbox** for responsive styling
- **Local Storage** for game state persistence (Bonus)

### Key Components and Pages

- **`HomePage.js`**: Landing page with options for gameplay mode.
- **`GamePage.js`**: Main gameplay interface.
- **`RulesPage.js`**: Contains the rules and instructions.
- **`HighScoresPage.js`**: Placeholder for high scores.
- **`Board.js`**: Visualizes player and AI boards.
- **`Cell.js`**: Interactive board cells with different states.
- **`NavBar.js`**: Navigation component between different pages.
- **`Footer.js`**: Consistent footer across the site.
- **`ShipSetup.js` and `ShipPlacement.js`**: Handles ship placement logic and UI.

---

## Features

### Core Features:
- ✅ Two gameplay modes (**Normal** and **Free Play**)
- ✅ 10x10 player and AI boards
- ✅ Random and manual (**drag-and-drop**) ship placements
- ✅ Interactive AI opponent (**random and focused targeting**)
- ✅ **Win condition detection** and announcement
- ✅ **Reset functionality** to restart gameplay
- ✅ **Timer** showing elapsed game duration in `hh:mm:ss` format

### Bonus Implementations:
#### **Local Storage**
- 📌 Persist game state across browser refreshes.
- 📌 Restore game state upon reopening the app.

#### **Click and Drag Setup**
- 📌 Players manually arrange ships via a **drag-and-drop** interface.

#### **Focused Targeting**
- 📌 AI intelligently selects **adjacent cells** after a successful hit.

---

## Installation and Running

To run the project locally, follow these steps:

```sh
git clone https://github.com/zhuhaiweiyan/An-Ge-Project2.git
cd battleship-project2
npm install
npm start
```

## Deployment
- The project is deployed on Render and available online:

- 🔗 Deployment Link: https://an-ge-project2.onrender.com/