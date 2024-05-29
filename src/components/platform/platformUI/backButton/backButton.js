import React from 'react';
import {useNavigate} from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate()
    return (
        <div onClick={() => navigate(-1)} className="backBtn">
            <i className="fas fa-arrow-left" />
            Ortga
        </div>
    );
};

export default BackButton;