import React, { useState , useEffect } from 'react';
import '../styles/Quiz.css';
import Progress from './Progress';
import ScoreCounter from './Score-counter';
import logoBrain from '../assets/Brain-logo.png';
import textLogo from '../assets/Text-logo.png';
import { Link } from 'react-router-dom';


function Quiz() {
  // Sample quiz data

  // State variables
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState(Array(quizData.length).fill(null));
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null); 
  const [loading, setLoading] = useState(true);

  //
  useEffect(() => {
    const fetchQuizData = () => {
      fetch('http://127.0.0.1:5000/questions') 
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP error! Status: ${response.status}');
          }
          return response.json();
        })
        .then(data => {
          setQuizData(data)
        })
    }
    
    fetchQuizData(); // Fetch data on mount
  }, []);

  // Handle option selection
  const handleOptionSelect = (optionIndex) => {
    if (!answered) {
      setSelectedOption(optionIndex);
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
    
    const isCorrect = selectedOption === quizData[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 10);
      setAnswerStatus("correct");
    } else {
      setAnswerStatus("incorrect");
    }
    
    setAnswered(true);
  };

  // Go to previous question
  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswered(userAnswers[currentQuestion - 1] !== null);
      setSelectedOption(userAnswers[currentQuestion - 1]);
      setAnswerStatus(null);
    }
  };

  // Go to next question
  const goToNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(null);
      setSelectedOption(userAnswers[currentQuestion + 1]);
      setAnswerStatus(null);
    }
  };

  
  return (
    <div>
      <div className="header">
        <button className="home-btn">
          <i className="fa-solid fa-house"></i>
        </button>

        <Link to="/add-question" className="add-question-btn">
    <i className="fa-solid fa-plus"></i> Add Question
  </Link>

        <div className="logo">
            <img className = "logoBrain" src={logoBrain} alt="Logo"></img>
            <img className = "logoText" src={textLogo} alt="Logo"></img>
        </div>

        <button className="profile-pic-button"> 
          <i className="fa fa-user"></i>
        </button>
      </div>

      <div className="flashcard">
        <h2 className="question">
          {quizData[currentQuestion]?.question}
        </h2> 

        <form onSubmit={handleSubmit}>
          {quizData[currentQuestion]?.options.map((option, index) => {
            let optionClass = "option"; // Default class

            if (answered) {
              if (index === quizData[currentQuestion]?.correctAnswer) {
                optionClass += " correct"; // Correct answer highlighted
              } else if (index === selectedOption) {
                optionClass += answerStatus === "incorrect" ? " incorrect" : "";
              }
            } else if (index === selectedOption) {
              optionClass += " selected"; // Highlight selected option
            } 

            return (
              <label 
                key={index} 
                className={optionClass}
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
            );
          })}
          
          <input 
            className="submit-btn" 
            type="submit" 
            value="Check Answer"
            disabled={answered}
          />
        </form>
      </div>

      <Progress currentProgress={currentQuestion + 1} totalProgress={quizData.length} />
      <ScoreCounter score={score} />
      
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