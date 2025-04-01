import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Quiz from './components/Quiz';
import AddQuestion from './components/AddQuestion';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/add-question" element={<AddQuestion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;