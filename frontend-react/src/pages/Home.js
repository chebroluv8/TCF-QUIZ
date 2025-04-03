import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import Header from '../components/header';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });
  const [userSets, setUserSets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Home';
    // Get user data from localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      // If no user data found, redirect to login
      navigate('/');
      return;
    }

    // Parse and set user data
    const parsedUser = JSON.parse(user);
    setUserData(parsedUser);

    // Fetch user's question sets
    fetch(`http://127.0.0.1:5000/user-sets/${parsedUser.id}`)
      .then(response => response.json())
      .then(data => setUserSets(data))
      .catch(error => console.error('Error fetching sets:', error));
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="home-page">
        <h1>Dashboard</h1>
        <h2>Welcome back, {userData.first_name}!</h2>

        <div className="dashboard-container">
          {/* Left side - Metrics container */}
          <div className="metrics-container">
            <h3>Metrics</h3>
            {/* Metrics content will go here later */}
          </div>

          {/* Right side - Sets container */}
          <div className="sets-container">
            <h3>Your Question Sets</h3>
            <div className="sets-grid">
              {userSets.map(set => (
                <div key={set.set_id} className="set-card">
                  <h4>{set.title}</h4>
                  <p>{set.description}</p>
                  <p className="category">Category: {set.category}</p>
                  <button 
                    className="study-btn"
                    onClick={() => navigate(`/quiz/${set.set_id}`)}
                  >
                    Study This Set
                  </button>
                </div>
              ))}
              {/* Add New Set Card */}
              <div className="set-card add-set-card" onClick={() => navigate('/create-set')}>
                <div className="add-set-content">
                  <i className="fas fa-plus"></i>
                  <h4>Create New Set</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
