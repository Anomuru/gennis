import React from 'react';
import "./style.sass"



const Row = ({children,className}) => {
    return (
        <div className={`row ${className}`}>
            {children}
        </div>
    );
};

export default Row;