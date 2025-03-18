import React, { useState } from 'react';
import '../styles/Quiz.css';
import Progress from './Progress';

function Quiz() {
  // Sample quiz data (this will later come from the backend)
  const quizData = [
    {
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correctAnswer: 1
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: 1
    },
    {
      question: "What is the largest mammal in the world?",
      options: ["Elephant", "Giraffe", "Blue Whale", "Polar Bear"],
      correctAnswer: 2
    },
    {
      question: "Which of these is not a programming language?",
      options: ["Java", "Python", "Cobra", "HTML"],
      correctAnswer: 3
    },
    {
      question: "What year was the first iPhone released?",
      options: ["2005", "2006", "2007", "2008"],
      correctAnswer: 2
    }
  ];

  // State variables
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState(Array(quizData.length).fill(null));
  const [selectedOption, setSelectedOption] = useState(null);

  // Handle option selection
  const handleOptionSelect = (optionIndex) => {
    console.log("Selected option:", optionIndex); // Debugging
    if (!answered) {
      setSelectedOption(optionIndex);
      
      // Force state update to ensure React re-renders correctly
      setUserAnswers((prevAnswers) => {
        const newAnswers = [...prevAnswers];
        newAnswers[currentQuestion] = optionIndex;
        return newAnswers;
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedOption === null) {
      alert('Please select an answer!');
      return;
    }
    
    // Check if answer is correct
    const isCorrect = selectedOption === quizData[currentQuestion].correctAnswer;
    
    // Update score if correct
    if (isCorrect && !answered) {
      setScore(score + 1);
    }
    
    setAnswered(true);
  };

  // Go to previous question
  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswered(userAnswers[currentQuestion - 1] !== null);
      setSelectedOption(userAnswers[currentQuestion - 1]);
    }
  };

  // Go to next question
  const goToNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(userAnswers[currentQuestion + 1] !== null);
      setSelectedOption(userAnswers[currentQuestion + 1]);
    }
  };
  
  return (
    <div>
    <button className="home-btn">
      <i className="fa-solid fa-house"></i>
    </button>


      <div className="header">
        <h1>Memora</h1>
        <button className="profile-pic-button"> 
          <i className="fa fa-user"></i>
        </button>
      </div>
      
      <div className="flashcard">
        <h2 className="question">
          {quizData[currentQuestion].question}
        </h2> 

        <form onSubmit={handleSubmit}>
          {quizData[currentQuestion].options.map((option, index) => (
            <label 
              key={index} 
              className={`answer-box ${selectedOption === index ? "selected" : ""}`}
              onClick={() => handleOptionSelect(index)}
            >
              <input 
                type="radio" 
                name="answer"
                value={index}
                checked={selectedOption === index}
                onChange={() => handleOptionSelect(index)}
              /> 
              {option}
            </label>
          ))}
          
          <input 
            className="submit-btn" 
            type="submit" 
            value="Check Answer"
            disabled={answered}
          />
        </form>
      </div>
      
      <Progress currentProgress={currentQuestion + 1} totalProgress={quizData.length} />

      <button 
        className="prev-btn" 
        onClick={goToPrevious}
        disabled={currentQuestion === 0}
      >
        <i className="fa fa-chevron-left"></i>
      </button>
      
      <button 
        className="next-btn" 
        onClick={goToNext}
        disabled={currentQuestion === quizData.length - 1}
      >
        <i className="fa fa-chevron-right"></i>
      </button>
    </div>
  );
}

export default Quiz;