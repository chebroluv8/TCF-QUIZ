import React, { useState, useEffect } from 'react';
import '../styles/Quiz.css';
import Progress from './Progress';
import ScoreCounter from './Score-counter';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import { useNavigate } from 'react-router-dom';

function Quiz() {
  // State variables
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState(Array(quizData.length).fill(null));
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [setInfo, setSetInfo] = useState({
    title: "",
    description: "",
    category: "",
    date_created: ""
  });
  const [isFlipping, setIsFlipping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Quiz';
  }, []);
  
  useEffect(() => {
    const fetchQuizData = async () => {
      // Get the set_id from the URL parameters
      const setId = window.location.pathname.split('/').pop();
      
      try {
        // Fetch set information
        const setResponse = await fetch(`http://127.0.0.1:5000/set-info/${setId}`);
        if (setResponse.ok) {
          const setData = await setResponse.json();
          setSetInfo(setData);
        }

        // Fetch questions
        const questionsResponse = await fetch(`http://127.0.0.1:5000/set-questions/${setId}`);
        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json();
          // Transform the data to include options array
          const transformedData = questionsData.map(q => ({
            question: q.question,
            options: [q.option_a, q.option_b, q.option_c, q.option_d],
            correctAnswer: ['A', 'B', 'C', 'D'].indexOf(q.correct_answer)
          }));
          setQuizData(transformedData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    
    fetchQuizData();
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
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setAnswered(userAnswers[currentQuestion - 1] !== null);
        setSelectedOption(userAnswers[currentQuestion - 1]);
        setAnswerStatus(null);
        setIsFlipping(false);
      }, 300); // Half of our animation duration
    }
  };

  // Go to next question
  const goToNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setAnswered(null);
        setSelectedOption(userAnswers[currentQuestion + 1]);
        setAnswerStatus(null);
        setIsFlipping(false);
      }, 300); // Half of our animation duration
    }
  };

  return (
    <> 
      <Header />

      <div className="quiz-container">
        <div className="set-info">
          <div className="set-header">
            <h1>{setInfo.title}</h1>
            <button 
              className="edit-set-btn"
              onClick={() => navigate(`/add-questions/${window.location.pathname.split('/').pop()}`)}
            >
              <i className="fas fa-edit"></i>
            </button>
          </div>
          <div className="set-details">
            <p className="set-description">{setInfo.description}</p>
            <div className="set-metadata">
              <span className="category">
                <i className="fas fa-folder"></i> {setInfo.category}
              </span>
              <span className="date">
                <i className="fas fa-calendar"></i> 
                {setInfo.date_created ? new Date(setInfo.date_created).toLocaleDateString() : ''}
              </span>
            </div>
          </div>
        </div>

        <div className={`flashcard ${isFlipping ? 'flipping' : ''}`}>
          <h2 className="question">{quizData[currentQuestion]?.question}</h2> 
          <form onSubmit={handleSubmit}>
            {quizData[currentQuestion]?.options.map((option, index) => {
              let optionClass = "option";
              if (answered) {
                if (index === quizData[currentQuestion]?.correctAnswer) {
                  optionClass += " correct";
                } else if (index === selectedOption) {
                  optionClass += answerStatus === "incorrect" ? " incorrect" : "";
                }
              } else if (index === selectedOption) {
                optionClass += " selected";
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

      <Footer />
    </>
  );
}

export default Quiz;