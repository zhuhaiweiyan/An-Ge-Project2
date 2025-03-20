// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import "../css/HomePage.css";
import battleshipImage from "../assets/images/battleship.jpg";

export default function HomePage() {
  return (
    <div className="container">
      <h1 className="title">Welcome to Battleship!</h1>

      <div className="content">
        <p>
          A classic naval combat game where strategy and skill determine the
          winner.
        </p>
        <p>Get ready to outwit your opponent and sink their fleet!</p>
      </div>

      <div className="image-container">
        <img
          src={battleshipImage}
          alt="Battleship"
          className="battleship-image"
        />
      </div>

      <div className="button">
        <Link to="/game/normal" className="start-btn">
          Start Game
        </Link>
      </div>
    </div>
  );
}
