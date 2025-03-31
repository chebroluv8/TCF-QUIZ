import React from 'react';
import Quiz from './pages/Quiz';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Progress from './pages/Progress';
import Footer from './components/footer';

function App() {
  return (
    <div className="app">
      <main className="main-content">
        <Quiz />
      </main>
      <Footer />
    </div>
  );
}

export default App;