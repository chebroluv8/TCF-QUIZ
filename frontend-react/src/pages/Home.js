import React, { useEffect } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

function Dashboard() {
  useEffect(() => {
    document.title = 'Home';
  }, []);

  return (
    <>
    <Header />

    <div className="home-page">
    <h1>Dashboard</h1>

    <div className="box-row">
    <div className="metrics-field">
    <p className="p2">Metrics</p>
        <div className="box-row">
          <div className="metrics-box">
            <div className="accuracy-text">##%</div>
            <p>Accuracy</p>
          </div>
          <div className="metrics-box"> 
          <div className="accuracy-text"># / #</div>
          <p>Average Score</p>
          </div>
        </div>
     </div>
     <div className="sets-field">
      <p className="p2">Sets</p>
      <div className="sets-box">
        Set 1
      </div>
      <div className="sets-box">
        Set 2
      </div>
      <div className="sets-box">
        Set 3
      </div>
    
     </div>
    </div>
     
     
     <Link to="/quiz">
     <button className="dash-btn">
        <p>Start Quiz</p>
     </button>
     </Link>
     </div>
     
     

    <Footer />
    </>
  );
}

export default Dashboard;
