import React from 'react';

const Table = ({children,className}) => {
    return (
        <div className={`tableBox ${className}`}>
            <table>
                {children}
            </table>
        </div>
    );
};

export default Table;