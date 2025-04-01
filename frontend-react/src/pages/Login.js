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
  
    // Use navigate for routing
    const navigate = useNavigate();
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch('http://localhost:4001/users/'); // Replace with your actual endpoint
        const data = await response.json();
        console.log(data);
  
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch users');
        }
  
        // Find a user that matches both email and password
        const matchedUser = data.users.find(user => user.email === email && user.password === password);
  
        if (matchedUser) {
          navigate(`/profile`);
        } else {
          alert('Invalid email or password');
        }
  
        setEmail("");
        setPassword("");
      } catch (err) {
        alert('Error: ' + err.message);
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
          </form>
        <Footer />
      </div>
      </div>
    );
  }
  
  export default Login;
  