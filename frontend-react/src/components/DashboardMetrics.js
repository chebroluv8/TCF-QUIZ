import React, { useState, useEffect } from 'react';
import '../styles/DashboardMetrics.css'; 
import QuizHistory from '../components/QuizHistory';


const DashboardMetrics = ({ quizzesTaken, totalScore, loginCount, userData, quizHistory }) => {
    
    return (
        <div className="dashboard-metrics">
            <h3>Your Metrics</h3>
            <div className="metrics-container">
                <div className="metric">
                    <h4>Quizzes<br/>Taken</h4>
                    <p>{quizzesTaken}</p>
                </div>
                <div className="metric">
                    <h4>Total<br/>Score</h4>
                    <p>{totalScore}</p>
                </div>
                <div className="metric">
                    <h4>Lifetime<br/>Logins</h4>
                    <p>{loginCount}</p>
                </div>
                <div className="metric">
                    <h4>Average Score<br/>per Quiz</h4>
                    <p>{(totalScore / quizzesTaken).toFixed(2)}</p>
                </div>
                <div className="quiz-history">
                    <h4>Quiz History</h4>
                    <QuizHistory history={quizHistory} />
                </div>
            </div>
        </div>
    );
};

export default DashboardMetrics;        
