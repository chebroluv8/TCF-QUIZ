import React from "react";

export default function ScoreCounter(props) {
    const { score } = props;
    return <div className="score-counter">Score: {score}</div>;
}