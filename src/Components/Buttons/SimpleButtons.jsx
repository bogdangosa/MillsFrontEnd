import React from 'react';
import './SimpleButton.css';

const SimpleButton = ({children,onClick}) => {
    return (
        <button className='simple-button' onClick={()=>onClick()}>
            {children}
        </button>
    );
};

export default SimpleButton;
