import React from 'react';
import '../styles/MetricsDisplay.css'; // Import the CSS file for styling

const MetricsDisplay = ({ total, correct, incorrect, score, difficultyResults, onClose }) => {
    return (
        <div className="metrics-display">
            <h2>Quiz Completed!</h2>
            <p className="score">Your Score: {score}</p>
            <p>Total Questions: {total}</p>
            <p>Correct Answers: {correct}</p>
            <p>Incorrect Answers: {incorrect}</p>
            <h3>Difficulty Results:</h3>
            <ul>
                {Object.entries(difficultyResults).map(([difficulty, count]) => (
                    <li key={difficulty}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}: {count}
                    </li>
                ))}
            </ul>
            <button onClick={onClose} className="close-btn">Close</button>
        </div>
    );
};

export default MetricsDisplay;
