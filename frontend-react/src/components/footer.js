import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';
import logoBrain from '../assets/Brain-logo.png';
import textLogo from '../assets/Text-logo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/Home.js">Dashboard</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div className="footer-brand">
          <img src={logoBrain} alt="Memora Logo" className="footer-logo" />
          <img src={textLogo} alt="Memora Logo" className="footer-logo" />
          <p>© 2025 Memora. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
