import React from "react";
import '../styles/Score-count.css'

export default function ScoreCounter(props) {
    const { score } = props;
    return <div className="score-counter">Score: {score}</div>;
}