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
    date_created: "",
    set_difficulty: "medium"
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
          const transformedData = questionsData.map(q => ({
            question: q.question,
            options: [q.option_a, q.option_b, q.option_c, q.option_d],
            correctAnswer: ['A', 'B', 'C', 'D'].indexOf(q.correct_answer),
            question_difficulty: q.question_difficulty
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

  // Add this helper function to get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy':
        return '#48BB78';  // green
      case 'hard':
        return '#F56565';  // red
      case 'medium':
      default:
        return '#e3d326';  // blue
    }
  };

  const handleDeleteSet = async () => {
    if (window.confirm('Are you sure you want to delete this set? This action cannot be undone.')) {
      const setId = window.location.pathname.split('/').pop();
      try {
        const response = await fetch(`http://127.0.0.1:5000/delete-set/${setId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('Set deleted successfully');
          navigate('/home'); // Redirect to home page after deletion
        } else {
          alert('Failed to delete set');
        }
      } catch (error) {
        console.error('Error deleting set:', error);
        alert('Error deleting set');
      }
    }
  };

  return (
    <> 
      <Header />

      <div className="quiz-container">
        <div className="set-info">
          <div className="set-header">
            <h1>{setInfo.title}</h1>
            <div className="set-actions">
              <button 
                className="edit-set-btn"
                onClick={() => navigate(`/add-questions/${window.location.pathname.split('/').pop()}`)}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                className="delete-set-btn"
                onClick={handleDeleteSet}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
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
              <span className="difficulty" style={{ 
                backgroundColor: getDifficultyColor(setInfo.set_difficulty),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                marginLeft: '10px',
                fontWeight: '500'
              }}>
                <i className="fas fa-layer-group"></i> {setInfo.set_difficulty?.charAt(0).toUpperCase() + setInfo.set_difficulty?.slice(1) || 'Medium'}
              </span>
              
            </div>
          </div>
        </div>

        <div className={`flashcard ${isFlipping ? 'flipping' : ''}`}>
          <div className="question-header">
            <h2 className="question">{quizData[currentQuestion]?.question}</h2>
            <span 
              className="difficulty-badge"
              style={{ 
                backgroundColor: getDifficultyColor(quizData[currentQuestion]?.question_difficulty),
                fontWeight: '500'
              }}
            >
              {quizData[currentQuestion]?.question_difficulty?.charAt(0).toUpperCase() + 
               quizData[currentQuestion]?.question_difficulty?.slice(1) || 'Medium'}
            </span>
          </div>
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