// src/pages/RulesPage.js

import React from "react";
import "../css/RulesPage.css";

export default function RulesPage() {
  return (
    <div className="rules-container">
      <h2>Rules of Battleship</h2>

      <div className="rules-content">
        <h3>General Rules</h3>
        <ol>
          <li>Each player has a 10x10 grid to place their fleet of 5 ships.</li>
          <li>
            Take turns guessing coordinates to hit your opponent's ships. Hits
            are marked as ✔, and misses as ❌.
          </li>
          <li>
            The first player to sink all of their opponent's ships is the
            winner.
          </li>
        </ol>
      </div>

      <div className="variations-content">
        <h3>Game Variations</h3>
        <p>Guess as many times as you have remaining ships.</p>
      </div>

      <div className="credits-content">
        <h3>Made By</h3>
        <p>
          Developed by
          <a href="https://github.com/zhuhaiweiyan"> ZHU HAI WEI YAN </a>
        </p>
        <p>
          Contact: <a href="mailto:ge.an2@northeastern.com">An Ge</a>
        </p>
      </div>
    </div>
  );
}
