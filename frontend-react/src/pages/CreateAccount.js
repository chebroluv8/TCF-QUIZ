// src/pages/CreateAccount.js
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

function CreateAccount() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Update the fetch URL and request body to match your Flask backend
const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
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
                // Adjust property names to match what your Flask backend expects
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password
            })
        });

        // Rest of the function remains the same
        const data = await response.json();

        if (response.ok) {
            alert('Account created successfully!');
            navigate('/login');
        } else {
            setError(data.message || 'Failed to create account');
        }
    } catch (err) {
        setError('Server error. Please try again later.');
        console.error(err);
    }
};

    return (
        <div className="auth-container">
            <h1>Create Account</h1>
            <div className="login-page">
                {error && <div className="error-message">{error}</div>}
                <form className="login-box" onSubmit={handleSubmit}>
                    <div>
                        <p>First Name:</p>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
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
                        />
                    </div>
                    <div>
                        <p>Password:</p>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <p>Confirm Password:</p>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <Link to="/home"> 
                    <button type="submit" className="login-btn">
                        Create Account
                    </button>
                    </Link>
                </form>
                
            </div>
        </div>
    );
}

export default CreateAccount;