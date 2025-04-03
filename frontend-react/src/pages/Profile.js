import React, { useState, useEffect } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/default-avatar.png'; // Add a default avatar image
import '../styles/Profile.css';

function ProfilePage() {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profile_pic: "default.png"
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Profile';
    
    // Get user data from localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      console.log("No user data found in localStorage");  // Debug log
      navigate('/');
      return;
    }

    try {
      // Parse and set user data
      const parsedUser = JSON.parse(user);
      console.log("Loaded user data:", parsedUser);  // Debug log
      
      // Ensure profile_pic exists
      if (!parsedUser.profile_pic) {
        console.log("No profile_pic found, setting default");  // Debug log
        parsedUser.profile_pic = 'default.png';
      }
      
      setUserData(parsedUser);

      // Update the preview image
      updateProfilePicture(parsedUser.profile_pic);
      
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/');
    }
  }, [navigate]);

  // Helper function to update profile picture
  const updateProfilePicture = (filename) => {
    console.log("Updating profile picture with filename:", filename);  // Debug log
    const previewImg = document.getElementById('preview');
    if (previewImg) {
      const timestamp = new Date().getTime();
      const imageUrl = filename === 'default.png' 
        ? defaultAvatar 
        : `http://127.0.0.1:5000/profile-pics/${filename}?t=${timestamp}`;
      console.log("Setting image URL to:", imageUrl);  // Debug log
      previewImg.src = imageUrl;
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file);  // Debug log
      setSelectedFile(file);
    
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewImg = document.getElementById('preview');
        if (previewImg) {
          previewImg.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    console.log("Starting upload for file:", selectedFile);  // Debug log

    const formData = new FormData();
    formData.append('profile_pic', selectedFile);
    formData.append('email', userData.email);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload-profile-pic', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);  // Debug log

      if (response.ok) {
        // Get current user data from localStorage
        const currentUser = JSON.parse(localStorage.getItem('user'));
        console.log("Current user data:", currentUser);  // Debug log
        
        // Create updated user data
        const updatedUser = {
          ...currentUser,
          profile_pic: data.profile_pic
        };
        console.log("Updated user data:", updatedUser);  // Debug log
        
        // Update state
        setUserData(updatedUser);
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update the profile picture
        updateProfilePicture(data.profile_pic);

        alert('Profile picture updated successfully!');
      } else {
        console.error("Upload failed:", data.message);  // Debug log
        alert('Failed to upload profile picture: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading profile picture');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
        try {
            const response = await fetch('http://127.0.0.1:5000/delete-user', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userData.email  // assuming userData contains the current user's info
                })
            });

            if (response.ok) {
                // Clear local storage
                localStorage.removeItem('user');
                // Redirect to login page
                navigate('/');
            } else {
                alert('Failed to delete account');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting account');
        }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        // Redirect to login page
        navigate('/');
      } else {
        alert('Failed to logout');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error logging out');
    }
  };

  const getProfilePicUrl = () => {
    if (!userData.profile_pic || userData.profile_pic === 'default.png') {
      return defaultAvatar;
    }
    return `http://127.0.0.1:5000/profile-pics/${userData.profile_pic}`;
  };

  return (
    <>
      <Header />
      <div className="profile_page">
        <div className="profile_container">
        <p className="p5">Profile</p>
          <div className="profile-pic-section">
            <img
              id="preview"
              src={getProfilePicUrl()}
              alt="Profile"
              className="profile-pic"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = defaultAvatar; // Fallback to default avatar if load fails
              }}
            />
            <div className="profile-pic-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
                id="file-input"
              />
              <label htmlFor="file-input" className="file-input-label">
                Choose Photo
              </label>
              {selectedFile && (
                <button onClick={handleUpload} className="upload-btn">
                  Upload Photo
                </button>
              )}
            </div>
          </div>
          
          <div className="container_content">
            <div className="smaller_field">
                <p className="profile-text">{userData.first_name} {userData.last_name}</p>
            </div>

            <div className="smaller_field">
                <p className="profile-text">{userData.email}</p>
            </div>
          </div>
          <div className="profile-buttons">
            <button className="logout-button" onClick={handleLogout}>
              Log Out
            </button>
            <button className="delete-button" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProfilePage;