import React, { useState } from 'react';
import '../styles/Progress.css';
import '../styles/Score-count.css';

function Progress(props) {
    const { currentProgress, totalProgress } = props;
    const TotalProgressPercent = totalProgress ? Math.round((currentProgress/totalProgress) * 100) : 0;

    return (
        <section>
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${TotalProgressPercent}%` }}></div>
            </div>
            <p className="score-counter"> {currentProgress}/{totalProgress}</p>
        </section>
    );
}

export default Progress;