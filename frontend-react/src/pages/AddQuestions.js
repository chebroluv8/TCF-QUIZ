import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/footer';
import Header from '../components/header';
import '../styles/AddQuestions.css';

function AddQuestions() {
  const { setId } = useParams();
  const navigate = useNavigate();
  
  const [setInfo, setSetInfo] = useState({
    title: '',
    description: '',
    category: '',
    set_difficulty: 'medium'
  });
  
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: '',
    question_difficulty: 'medium'
  });

  useEffect(() => {
    if (setId) {
      // Fetch set information
      fetch(`http://127.0.0.1:5000/set-info/${setId}`)
        .then(res => res.json())
        .then(data => {
          setSetInfo(data);
          document.title = `Edit ${data.title}`;
        })
        .catch(err => {
          console.error('Error fetching set info:', err);
          navigate('/home');
        });

      // Fetch existing questions
      fetch(`http://127.0.0.1:5000/set-questions/${setId}`)
        .then(res => res.json())
        .then(data => {
          // Make sure we include question_id in the state
          const questionsWithIds = data.map(q => ({
            question_id: q.question_id,
            question: q.question,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_answer: q.correct_answer,
            question_difficulty: q.question_difficulty
          }));
          setQuestions(questionsWithIds);
        })
        .catch(err => console.error('Error fetching questions:', err));
    }
  }, [setId, navigate]);

  const handleSetInfoChange = (e) => {
    const { name, value } = e.target;
    setSetInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const handleNewQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSetInfo = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/update-set/${setId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setInfo)
      });
      if (response.ok) {
        alert('Set information updated successfully!');
      }
    } catch (error) {
      console.error('Error updating set:', error);
    }
  };

  const saveQuestion = async (question, index) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/update-question/${question.question_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(question)
      });
      if (response.ok) {
        alert('Question updated successfully!');
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const addNewQuestion = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/add-question/${setId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion)
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions([...questions, data]);
        setNewQuestion({
          question: '',
          option_a: '',
          option_b: '',
          option_c: '',
          option_d: '',
          correct_answer: '',
          question_difficulty: 'medium'
        });
        alert('Question added successfully!');
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  return (
    <>
    <Header />
      <div className="add-questions-container">
        <button 
          className="back-btn"
          onClick={() => navigate(`/quiz/${setId}`)}
        >
          <i className="fas fa-arrow-left"></i> Back to Set
        </button>

        <div className="set-editor">
          <h2>Edit Set Information</h2>
          <div className="set-info-editor">
            <input
              type="text"
              name="title"
              value={setInfo.title}
              onChange={handleSetInfoChange}
              placeholder="Set Title"
            />
            <input
              type="text"
              name="category"
              value={setInfo.category}
              onChange={handleSetInfoChange}
              placeholder="Category"
            />
            <textarea
              name="description"
              value={setInfo.description}
              onChange={handleSetInfoChange}
              placeholder="Description"
            />
            <div className="difficulty-selector">
              <label htmlFor="set_difficulty">Set Difficulty:</label>
              <select
                id="set_difficulty"
                name="set_difficulty"
                value={setInfo.set_difficulty}
                onChange={handleSetInfoChange}
                className="difficulty-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <button onClick={saveSetInfo}>Save Set Info</button>
          </div>
    </div>

        <div className="questions-editor">
          <h2>Edit Questions</h2>
          {questions.map((question, index) => (
            <div key={index} className="question-editor">
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                placeholder="Question"
              />
              <div className="options-grid">
                <input
                  type="text"
                  value={question.option_a}
                  onChange={(e) => handleQuestionChange(index, 'option_a', e.target.value)}
                  placeholder="Option A"
                />
                <input
                  type="text"
                  value={question.option_b}
                  onChange={(e) => handleQuestionChange(index, 'option_b', e.target.value)}
                  placeholder="Option B"
                />
                <input
                  type="text"
                  value={question.option_c}
                  onChange={(e) => handleQuestionChange(index, 'option_c', e.target.value)}
                  placeholder="Option C"
                />
                <input
                  type="text"
                  value={question.option_d}
                  onChange={(e) => handleQuestionChange(index, 'option_d', e.target.value)}
                  placeholder="Option D"
                />
              </div>
              <div className="question-actions">
                <select
                  value={question.correct_answer}
                  onChange={(e) => handleQuestionChange(index, 'correct_answer', e.target.value)}
                >
                  <option value="">Select Correct Answer</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
                <select
                  value={question.question_difficulty}
                  onChange={(e) => handleQuestionChange(index, 'question_difficulty', e.target.value)}
                  className="difficulty-select"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <button onClick={() => saveQuestion(question, index)}>Save Question</button>
              </div>
            </div>
          ))}

          <div className="add-new-question">
            <h3>Add New Question</h3>
            <input
              type="text"
              name="question"
              value={newQuestion.question}
              onChange={handleNewQuestionChange}
              placeholder="New Question"
            />
            <div className="options-grid">
              <input
                type="text"
                name="option_a"
                value={newQuestion.option_a}
                onChange={handleNewQuestionChange}
                placeholder="Option A"
              />
              <input
                type="text"
                name="option_b"
                value={newQuestion.option_b}
                onChange={handleNewQuestionChange}
                placeholder="Option B"
              />
              <input
                type="text"
                name="option_c"
                value={newQuestion.option_c}
                onChange={handleNewQuestionChange}
                placeholder="Option C"
              />
              <input
                type="text"
                name="option_d"
                value={newQuestion.option_d}
                onChange={handleNewQuestionChange}
                placeholder="Option D"
              />
            </div>
            <div className="question-actions">
              <select
                name="correct_answer"
                value={newQuestion.correct_answer}
                onChange={handleNewQuestionChange}
              >
                <option value="">Select Correct Answer</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              <select
                name="question_difficulty"
                value={newQuestion.question_difficulty}
                onChange={handleNewQuestionChange}
                className="difficulty-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button onClick={addNewQuestion}>Add Question</button>
            </div>
          </div>
        </div>
      </div>
    <Footer />
    </>
  );
}

export default AddQuestions;
