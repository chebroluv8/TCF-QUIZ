import React from 'react';
import '../styles/QuizHistory.css'; // optional styling

const QuizHistory = ({ history }) => {
  return (
    <div className="quiz-history">
      <table>
        <thead>
          <tr>
            <th>Set</th>
            <th>Date</th>
            <th>Score</th>
            <th>Correct</th>
            <th>Incorrect</th>
            <th>Accuracy</th>
            <th className="easy-column">Easy</th>
            <th className="medium-column">Medium</th>
            <th className="hard-column">Hard</th>
          </tr>
        </thead>
        <tbody>
          {history.map((quiz, index) => {
            const accuracy = quiz.correct + quiz.incorrect > 0
              ? ((quiz.correct / (quiz.correct + quiz.incorrect)) * 100).toFixed(1)
              : "N/A";

            return (
                <tr key={index}>
                <td>{quiz.set_title}</td>
                <td>{new Date(quiz.date_taken).toLocaleDateString()}</td>
                <td>{quiz.score}</td>
                <td>{quiz.correct}</td>
                <td>{quiz.incorrect}</td>
                <td>{accuracy}%</td>
                <td>{quiz.easy_correct}</td>
                <td>{quiz.medium_correct}</td>
                <td>{quiz.hard_correct}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default QuizHistory;

