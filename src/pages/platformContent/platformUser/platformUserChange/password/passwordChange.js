import React, {useEffect, useState} from 'react';

import {forTitle} from "frame-motion";
import {motion} from "framer-motion";

import {useHttp} from "hooks/http.hook";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {BackUrl, headers} from "constants/global";
import {setMessage} from "slices/messageSlice";


const PasswordChange = ({userId}) => {

    const {
        register,
        formState: {errors},
        handleSubmit,
        clearErrors,
        setError,
        reset
    } = useForm({
        mode: "onBlur"
    })




    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")


    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)



    const [activeError,setActiveError] = useState(false)

    const {request} = useHttp()
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const onSubmit = (data,e) => {
        e.preventDefault()

        const newData = {
            type: "password",
            password
        }

        // navigate("/register/step_2")
        request(`${BackUrl}change_student_info/${userId}`,"POST", JSON.stringify(newData),headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                    reset()
                }
                if (res.found) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "error",
                        active: true
                    }))

                }

            })
            .catch()

    }



    useEffect(() => {
        if (password !== confirmPassword || confirmPassword !== password) {
            setError('confirmPassword', {
                type: "manual",
                message: "parollar har xil"
            })
            dispatch(setMessage({
                msg: "Parollar har xil",
                type: "error",
                active: true
            }))

        } else {
            // clearErrors("confirmPassword")
            dispatch(setMessage({
                msg: "",
                type: "",
                active: false
            }))
        }
    },[password, confirmPassword, setError, clearErrors])



    const classShowPassword = showPassword ?  "fas fa-eye" : "fas fa-eye-slash"
    const classShowConfirmPassword = showConfirmPassword ?  "fas fa-eye" : "fas fa-eye-slash"

    const typePassword = showPassword ? "text" : "password"
    const typeConfirmPassword = showConfirmPassword ? "text" : "password"



    return (
        <div>

            <form
                action=""
                onSubmit={handleSubmit(onSubmit)}
            >
                <label htmlFor="password">
                    <div>
                        <span className="name-field">Parol</span>
                        <input
                            defaultValue={""}
                            id="password"
                            type={typePassword}
                            className="input-fields "
                            {...register("password",{
                                minLength: {
                                    value: 8,
                                    message : "Parolingiz 8 ta dan kam bo'lmasligi kerak"
                                },
                                required: "Iltimos to'ldiring",
                                onChange: event => setPassword(event.target.value)
                            })}
                        />
                        <i className={classShowPassword} onClick={() => setShowPassword(!showPassword)}/>
                    </div>
                    {
                        errors?.password &&
                        <span className="error-field">
                        {errors?.password?.message}
                    </span>
                    }
                </label>
                <label htmlFor="confirmPassword">
                    <div>
                        <span className="name-field">Parolni qaytaring</span>
                        <input
                            defaultValue={""}
                            id="confirmPassword"
                            type={typeConfirmPassword}
                            className="input-fields"
                            {...register("confirmPassword",{
                                minLength: {
                                    value :8,
                                    message : "Parolingiz 8 ta dan kam bo'lmasligi kerak"
                                },
                                required: "Iltimos to'ldiring",
                                onChange: event => setConfirmPassword(event.target.value)
                            })}
                        />
                        <i className={classShowConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)}/>
                    </div>
                    {
                        errors?.confirmPassword &&
                        <span className="error-field">
                        {errors?.confirmPassword?.message}
                    </span>
                    }
                </label>

                <input disabled={activeError}  className="input-submit" type="submit" />

            </form>
        </div>

    );
}

export default PasswordChange;