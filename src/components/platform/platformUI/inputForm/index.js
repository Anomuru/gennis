import React from 'react';


import "./input.sass"


const InputForm = ({title,name,type,required,register,defaultValue,placeholder}) => {


    return (
        <label className="input-label" htmlFor={name}>
            <span className="name-field">{title}</span>
            <input
                {...register(`${name}`)}
                placeholder={placeholder}
                required={required}
                type={type}
                defaultValue={defaultValue}
                id={name}
                className="input-fields"
            />
        </label>
    );
};

export default InputForm;