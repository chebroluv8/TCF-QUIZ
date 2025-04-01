import React, { useState } from "react";
import Footer from '../components/footer';
import Header from '../components/header';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/Login.css';
import '../styles/Quiz.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    // Use navigate for routing
    const navigate = useNavigate();
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
    
      try {
        // Use the login endpoint instead of getting all users
        const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Login successful
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/profile'); // or your dashboard page
        } else {
          // Login failed
          setError(data.message || 'Invalid credentials');
        }
      } catch (err) {
        console.error("Login error:", err);
        setError('Server error. Please try again later.');
      }
    };
  
  
    return (
      <div>
        <Header />
        <h1>Login</h1>
        <div className="login-page">
          <form className="login-box" onSubmit={handleSubmit}>
            <div>
              <p>Email:</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <p>Password:</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Link to="/home">
            <button className="login-btn">
              Login
            </button>
            </Link>
            <Link to="/create-account">Create Account</Link>
          </form>
        <Footer />
      </div>
      </div>
    );
  }
  
  export default Login;
  