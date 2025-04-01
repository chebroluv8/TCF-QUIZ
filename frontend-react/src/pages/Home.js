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
        <p>Metrics</p>
     </div>
     <div className="sets-field">
        <p>Sets</p>
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
