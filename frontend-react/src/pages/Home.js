import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import Header from '../components/header';
import '../styles/Home.css';
import DashboardMetrics from '../components/DashboardMetrics';
import Sets from '../components/Sets';



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

function Dashboard() {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    loginCount: 0,
    quizCount: 0,
    scoreCount: 0
  });
  const [userSets, setUserSets] = useState([]);
  const navigate = useNavigate();
  const [quizHistory, setQuizHistory] = useState([]);

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

    fetch(`http://127.0.0.1:5000/quiz-history/${parsedUser.id}`)
      .then(response => response.json())
      .then(data => setQuizHistory(data))
      .catch(error => console.error('Error fetching quiz history:', error));

    // Fetch user data including login count
    fetch(`http://127.0.0.1:5000/user/${parsedUser.id}`)
        .then(response => response.json())
        .then(userData => {
            setUserData(prevData => ({
                ...prevData,
                loginCount: userData.login_count,
                quizCount: userData.quiz_count,
                scoreCount: userData.lifetime_score
            }));
        })
        .catch(error => console.error('Error fetching user data:', error));
  }, [navigate]);

  

  return (
    <>
      <Header />
      <div className="home-page">
        <h1>Dashboard</h1>
        <h2>Welcome back, {userData.first_name}!</h2>

        <div className="dashboard-container">
            <Sets userSets={userSets} getDifficultyColor={getDifficultyColor} userData={userData} />
            <DashboardMetrics quizzesTaken={userData.quizCount} totalScore={userData.scoreCount} loginCount={userData.loginCount} quizHistory={quizHistory} />
          
          </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
