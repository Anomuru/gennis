import React from 'react';
import "./style.sass"

const Column = (props) => {
    const {children,type} = props


    const renderType = (type) => {



        if (!type) return "col"

        let clazz = ""
        const keys = Object.keys(type)
        for (let i = 0; i < keys.length; i++) {
            if (typeof type[keys[i]] === "boolean") {
                clazz += ` col-${keys[i]}-auto`
            } else if (typeof type[keys[i]] === "object") {
                if (type[keys[i]].span) {
                    clazz += ` col-${keys[i]}-${type[keys[i]].span}`
                }
                if (type[keys[i]].offset) {
                    clazz += ` offset-${keys[i]}-${type[keys[i]].offset}`
                }
            }
            else {
                clazz += ` col-${keys[i]}-${type[keys[i]]}`
            }
        }
        return clazz
    }


    return (
        <div
            className={renderType(type)}
        >
            {children}
        </div>
    );
};

export default Column;