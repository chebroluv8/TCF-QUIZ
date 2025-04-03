import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/CreateSet.css';

function CreateSet() {
  const navigate = useNavigate();
  const [setInfo, setSetInfo] = useState({
    title: '',
    description: '',
    category: '',
    set_difficulty: 'medium'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get user data from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch('http://127.0.0.1:5000/create-set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...setInfo,
          user_id: user.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to add questions page for the new set
        navigate(`/add-questions/${data.set_id}`);
      }
    } catch (error) {
      console.error('Error creating set:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="create-set-container">
        <button 
          className="back-btn"
          onClick={() => navigate('/home')}
        >
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>

        <div className="create-set-form">
          <h2>Create New Set</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Set Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={setInfo.title}
                onChange={handleChange}
                required
                placeholder="Enter set title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={setInfo.category}
                onChange={handleChange}
                placeholder="Enter category"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={setInfo.description}
                onChange={handleChange}
                placeholder="Enter set description"
                rows="4"
              />
            </div>

            <div className="difficulty-selector">
              <label htmlFor="set_difficulty">Set Difficulty:</label>
              <select
                id="set_difficulty"
                name="set_difficulty"
                value={setInfo.set_difficulty}
                onChange={handleChange}
                className="difficulty-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button type="submit" className="create-btn">
              Create Set
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CreateSet;