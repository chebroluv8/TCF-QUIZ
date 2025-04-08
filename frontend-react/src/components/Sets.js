import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sets.css'; // Assuming you have a CSS file for styling

const Sets = ({ userSets, getDifficultyColor, userData }) => {
    const navigate = useNavigate();

    return (
        <div className="sets-container">
            <h3>Your Question Sets</h3>
            <div className="sets-grid">
                {userSets.map(set => (
                    <div key={set.set_id} className="set-card">
                        <h4>{set.title}</h4>
                        <p>{set.description}</p>
                        <div className="set-metadata">
                            <span className="category">
                                <i className="fas fa-folder"></i> {set.category}
                            </span>
                            <span className="date">
                                <i className="fas fa-calendar"></i> {set.date_created ? new Date(set.date_created).toLocaleDateString() : ''}
                            </span>
                            <span className="difficulty" style={{ 
                                backgroundColor: getDifficultyColor(set.set_difficulty),
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                marginLeft: '10px',
                                fontWeight: '500'
                            }}>
                                <i className="fas fa-layer-group"></i> {set.set_difficulty?.charAt(0).toUpperCase() + set.set_difficulty?.slice(1) || 'Medium'}
                            </span>
                        </div>
                        <button 
                            className="study-btn"
                            onClick={() => navigate(`/quiz/${set.set_id}`, { state: { userData } })}
                        >
                            Study This Set
                        </button>
                    </div>
                ))}
                {/* Add New Set Card */}
                <div className="set-card add-set-card" onClick={() => navigate('/create-set')}>
                    <div className="add-set-content">
                        <i className="fas fa-plus"></i>
                        <h4>Create New Set</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sets;
