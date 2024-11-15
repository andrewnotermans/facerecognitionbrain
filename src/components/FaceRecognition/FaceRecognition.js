import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
    return (
        <div className='center'>
            <img  id='inputimage' src={imageUrl} alt="" style={{ width: '500px', height: 'auto' }}/>
            <div className='bounding-box'></div>
        </div>
    );
}

export default FaceRecognition;