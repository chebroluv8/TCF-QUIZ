import React from 'react';
import '../styles/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About Us</h4>
          <p>Helping students learn through interactive quizzes</p>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: contact@memora.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Memora. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
