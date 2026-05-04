import React from 'react';


import "./input.sass"


const InputForm = ({title, name, type, required, register, defaultValue, placeholder, value, error, onChange, onBlur, clazzLabel}) => {


    return (
        <label className={`input-label${clazzLabel ? ` ${clazzLabel}` : ""}`} htmlFor={name}>
            <span className="name-field">{title}</span>
            <input
                {...register(`${name}`, {
                    onChange: onChange ? (e) => onChange(e.target.value) : null,
                    onBlur: onBlur ? (e) => onBlur(e.target.value) : null
                })}
                value={value}
                placeholder={placeholder}
                required={required}
                type={type}
                defaultValue={defaultValue}
                id={name}
                className="input-fields"
            />
            {
                error?.length &&
                <span className="error-field">{error?.[name].message}</span>
            }
        </label>
    );
};

export default InputForm;