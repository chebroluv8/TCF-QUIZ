import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logoBrain from '../assets/Brain-logo.png';
import textLogo from '../assets/Text-logo.png';
import '../styles/Login.css';

function Login() {
  useEffect(() => {
    document.title = 'Login';
  }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        console.log("Attempting login with:", email); // Debug log

        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();
            console.log("Server response:", data); // Debug log

            if (response.ok) {
                // Store user data in localStorage for later use
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/profile');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div>
            <div className="login-page">
                <div className="logo">
                  <img className="logoBrain" src={logoBrain} alt="Logo" />
                  <img className="logoText" src={textLogo} alt="Logo" />
                </div>
                {error && <div className="error-message">{error}</div>}
                <form className="login-box" onSubmit={handleSubmit} autoComplete="off">
                    <div>
                    <p className="p5">Login</p>
                        <p>Email:</p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            data-form-type="other"
                        />
                    </div>
                    <div className="password-field">
                        <p>Password:</p>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                data-form-type="other"
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="login-btn">
                        Login
                    </button>
                    <Link className="create-account-link" to="/create-account">Create Account</Link>
                </form>
                
            </div>
        </div>
    );
}

export default Login;