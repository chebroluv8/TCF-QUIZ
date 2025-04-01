import React from 'react';
import Footer from '../components/footer';
import Header from '../components/header';

import React from 'react';
import Footer from '../components/footer';
import Header from '../components/header';

import React, { useState } from 'react';
import '../styles/AddQuestion.css';

function AddQuestion() {
  const [questionData, setQuestionData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    setQuestionData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return {
        ...prev,
        options: newOptions
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://127.0.0.1:5000/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData)
      });

      if (!response.ok) {
        throw new Error('Failed to add question');
      }

      // Clear form after successful submission
      setQuestionData({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: null
      });

      alert('Question added successfully!');
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to add question. Please try again.');
    }
  };

  return (
    <div className="add-question-container">
      <h2>Add a New Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Question:</label>
          <textarea
            name="question"
            value={questionData.question}
            onChange={handleInputChange}
            required
            placeholder="Enter your question here"
          />
        </div>

        <div className="form-group">
          <label>Options:</label>
          {questionData.options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
          ))}
        </div>

        <div className="form-group">
          <label>Correct Answer:</label>
          <select
            name="correctAnswer"
            value={questionData.correctAnswer || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Select correct answer</option>
            {questionData.options.map((_, index) => (
              <option key={index} value={index}>
                Option {index + 1}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">
          Add Question
        </button>
      </form>
    </div>
  );
}

export default AddQuestion;
