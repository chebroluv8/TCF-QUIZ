import React, { useEffect } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import '../styles/Profile.css';

function ProfilePage() {
  useEffect(() => {
    document.title = 'Profile';
  }, []);

  const fname = "[first name]";
  const lname = "[last name]";
  const email = "[email]";

  return (
    <>
    <Header />
    <div className="profile_page">
      <div className="profile_container">
      <p className="p5">Profile</p>
      <div className="container_content">
      <div className="smaller_field">
      <p className="profile-text">First Name: {fname}</p> </div>

      <div className="smaller_field">
      <p className="profile-text">Last Name: {lname}</p> </div>
     

      <div className="smaller_field">
      <p className="profile-text">Email: {email}</p> </div>
      </div>
      </div>
      </div>
    

    <Footer />
    </>
  );
}

export default ProfilePage;
