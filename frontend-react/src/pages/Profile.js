import React, { useEffect } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';

function ProfilePage() {
  useEffect(() => {
    document.title = 'Profile';
  }, []);

  return (
    <>
    <Header />
    
    <div>
      <h1>Profile Page</h1>
      <p>This is where the user profile information will go.</p>
    </div>

    <Footer />
    </>
  );
}

export default ProfilePage;
