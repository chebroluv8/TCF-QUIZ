import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/footer';
import Header from '../components/header';
import '../styles/PrivacyPolicy.css';

function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="privacy-policy-page">
        <h1>Privacy Policy</h1>
        <p>Last Updated: 04/03/2025</p>
        
        <div className="policy-content">
          <section>
            <h2>Introduction</h2>
            <p>We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and protect your data. Your privacy is of utmost importance to us, and we take necessary measures to ensure that your data remains secure and is used in compliance with the relevant privacy regulations.</p>
            <p>This policy applies to all users of our platform and covers how we handle your personal information, what rights you have concerning your data, and how you can manage your preferences. By using our services, you agree to the collection and use of information in accordance with this Privacy Policy.</p>
          </section>
          
          <section>
            <h2>Information We Collect</h2>
            <p>We collect various types of information, including:</p>
            <ul>
              <li><strong>Personal Information:</strong> When you register an account, we collect details such as your name, email address, and contact details.</li>
              <li><strong>Usage Data:</strong> Information on how you interact with our website, such as pages visited, time spent on pages, and device type.</li>
              <li><strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance your experience, remember preferences, and analyze site performance.</li>
            </ul>
            <p>We ensure that all collected data is used responsibly and in accordance with applicable privacy laws.</p>
          </section>
          
          <section>
            <h2>How We Use Your Information</h2>
            <p>Your data is used for various purposes, including but not limited to:</p>
            <ul>
              <li>Providing and improving our services.</li>
              <li>Personalizing your experience on our platform.</li>
              <li>Communicating updates, offers, and customer support.</li>
              <li>Ensuring security and fraud prevention.</li>
              <li>Complying with legal obligations.</li>
            </ul>
            <p>We do not sell or share your personal data with third-party advertisers without your consent.</p>
          </section>
          
          <section>
            <h2>Data Security</h2>
            <p>We take the security of your personal data seriously and implement appropriate technical and organizational measures to protect it from unauthorized access, alteration, or destruction. Our security measures include encryption, secure storage, and access controls.</p>
            <p>However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security. 
            </p>
            <p>We implement reasonable security measures to protect your data, but no method of transmission over the internet is 100% secure. We cannot guarantee the security of your data transmitted through our platform.</p>
          </section>
          
        </div>
        
      </div>
      <Link to="/home" className="back-btn">Back to Home</Link>
      <Footer />
    </>
  );
}
export default PrivacyPolicy;