import React from 'react';
import Footer from '../components/footer';
import Header from '../components/header';


function Dashboard() {
  return (
    <>
    <Header />
    <div>
      <h1>Home Page</h1>
      <p>This is where the user can see their metrics.</p>
    </div>

    <Footer />
    </>
  );
}

export default Dashboard;
