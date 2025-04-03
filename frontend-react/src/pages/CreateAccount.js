// src/pages/CreateAccount.js
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logoBrain from '../assets/Brain-logo.png';
import textLogo from '../assets/Text-logo.png';
import '../styles/Login.css';
import Header from '../components/header';
import Footer from '../components/footer';

function CreateAccount() {
    useEffect(() => {
        document.title = 'Create Account';
    }, []);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Check password length
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();
            console.log("Server response:", data);

            if (response.ok) {
                alert('Account created successfully!');
                navigate('/');
            } else {
                setError(data.message || 'Failed to create account');
            }
        } catch (err) {
            console.error("Error creating account:", err);
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
                        <p className="p5">Create Account</p>
                        <p>First Name:</p>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <p>Last Name:</p>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <p>Email:</p>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="password-field">
                        <p>Password:</p>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                minLength="8"
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
                    <div className="password-field">
                        <p>Confirm Password:</p>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                minLength="8"
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="login-btn">
                        Create Account
                    </button>
                    <Link className="create-account-link" to="/">Back to Login</Link>
                </form>
            </div>
        </div>
    );
}

export default CreateAccount;