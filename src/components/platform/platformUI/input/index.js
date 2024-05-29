import React, {useEffect, useState} from 'react';


import "./input.sass"
import classNames from "classnames";


const Input = (props) => {


    const {
        title,
        name,
        onChange,
        type,
        required,
        defaultValue,
        value,
        others,
        clazz
    } = props


    const [input,setInput] = useState(null)
    const [showPassword,setShowPassword] = useState(false)

    useEffect(() => {
        if (input && input !== defaultValue && type !== "submit") {
            onChange(input)
        }
    },[input])

    useEffect(() => {
        setInput(value)
    },[value])

    useEffect(() => {
        if (defaultValue) {
            setInput(defaultValue)
        }
    },[defaultValue])




    const classShowPassword = showPassword ?  "fas fa-eye" : "fas fa-eye-slash"
    const typePassword = showPassword ? "text" : "password"



    return (
        <label className={classNames("input-label")} htmlFor={name}>
            <span className="name-field">{title}</span>
            <input
                {...others}
                required={required}
                type={type === "password" ? typePassword : type}
                id={name}
                className={classNames("input-fields",clazz)}
                value={input}
                onChange={e => setInput(e.target.value)}
            />


            {
                type === "password" ? <i className={classShowPassword} onClick={() => setShowPassword(!showPassword)}/> : null

            }

        </label>
    );
}
export default Input;