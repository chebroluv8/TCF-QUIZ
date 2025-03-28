import React from 'react';
import Quiz from './pages/Quiz';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Progress from './pages/Progress';

function App() {
  return (
    <div className="App">
      <Quiz />
    </div>
  );
}

export default App;