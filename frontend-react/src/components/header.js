import React from 'react';
import { Link } from 'react-router-dom';
import logoBrain from '../assets/Brain-logo.png';
import textLogo from '../assets/Text-logo.png';

function Header() {
  return (
    <header className="header">
      <Link to="/home" className="home-btn">
        <i className="fa-solid fa-house"></i>
      </Link>

      <div className="logo">
        <img className="logoBrain" src={logoBrain} alt="Logo" />
        <img className="logoText" src={textLogo} alt="Logo" />
      </div>

      <Link to="/profile" className="profile-pic-button">
        <i className="fa fa-user"></i>
      </Link>
    </header>
  );
}

export default Header;
