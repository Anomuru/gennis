import React from 'react';
import "./style.sass"

const Container = ({children}) => {
    return (
        <div className="container">
            {children}
        </div>
    );
};

export default Container;