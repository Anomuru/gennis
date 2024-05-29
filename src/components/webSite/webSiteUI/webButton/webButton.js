import React from 'react';
import classNames from "classnames";

import cls from "./style.module.sass";

const WebButton = ({children, onClick, style,form}) => {
    return (
        <button
            form={form}
            onClick={onClick}
            className={classNames(cls.webBtn, {
                [cls.blackWhite]: style ===  "blackWhite",
                [cls.light]: style === "light"
            })}
        >
            {children}
        </button>
    );
};

export default WebButton;