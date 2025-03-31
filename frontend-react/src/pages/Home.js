import React from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <>
    <Header />
    <div className="home-page">
    <h1>Dashboard</h1>
     <div className="metrics-field">
        <p>Metrics</p>
     </div>
     
     <div className="button-row">
     <Link to="/add-questions">
     <button className="dash-btn">
        <p>Add Questions</p>
     </button>
     </Link>
     <Link to="/quiz">
     <button className="dash-btn">
        <p>Start Quiz</p>
     </button>
     </Link>
     </div>
     
     </div>

    <Footer />
    </>
  );
}

export default Dashboard;
