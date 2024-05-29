import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useHttp} from "hooks/http.hook";
import {useDispatch} from "react-redux";
import {useForm} from "react-hook-form";
import {motion} from "framer-motion";
import {BackUrl, headers} from "constants/global";

import "styles/components/_form.sass"
import "components/register/registerUser/registerUserStep1/registerUserStep1.sass"
import Message from "components/platform/platformMessage";
import {forTitle} from "frame-motion";
import {DatesList} from "constants/global";
import PlatformMessage from "components/platform/platformMessage";

const RegisterUserStep1 = ({updateUserData,userData}) => {


    const {
        register,
        formState: {errors},
        handleSubmit,
        clearErrors,
        setError
    } = useForm({
        mode: "onBlur"
    })
    const {days,months,years} = DatesList()





    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")


    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)



    const [activeError,setActiveError] = useState(false)
    const [errorMessage,setErrorMessage] = useState("")

    const {request} = useHttp()
    const navigate = useNavigate()


    const onSubmit = (data,e) => {
        e.preventDefault()
        updateUserData(data)
        navigate("/registerStudent/step_2")


    }

    const checkUsername = (username) => {
        request(`${BackUrl}check_username`,"POST", JSON.stringify(username))
            .then(res => {
                if (res.found) {
                    setError('username', {
                        type: "manual",
                        message: "username band"

                    },  { shouldFocus: true })
                    setActiveError(true)
                    setErrorMessage("Username band")
                }
            })
    }

    useEffect(() => {
        if (password !== confirmPassword) {
            setActiveError(true)
            setErrorMessage("Parollar har xil")
        } else {
            setActiveError(false)
        }
    },[password, confirmPassword])



    const classShowPassword = showPassword ?  "fas fa-eye" : "fas fa-eye-slash"
    const classShowConfirmPassword = showConfirmPassword ?  "fas fa-eye" : "fas fa-eye-slash"

    const typePassword = showPassword ? "text" : "password"
    const typeConfirmPassword = showConfirmPassword ? "text" : "password"


    const renderOptions = (list) => {
        return (
            list.map((item,index) => {
                return (
                    <option key={index} value={item.num}>{item.num}</option>
                )
            })
        )
    }

    return (
        <motion.div className="register__step-1">
            <PlatformMessage activeMsg={activeError} typeMessage={"error"}>
                {errorMessage}
            </PlatformMessage>
            <motion.form
                variants={forTitle}
                initial="hidden"
                animate="show"
                exit="exit"
                action=""
                onSubmit={handleSubmit(onSubmit)}
            >
                <h1 className="title">Register</h1>
                <label htmlFor="username">
                    <span className="name-field">Username</span>
                    <input
                        defaultValue={userData?.username}
                        id="username"
                        className="input-fields"
                        {...register("username",{
                            required: "Iltimos to'ldiring",
                            onBlur: event => checkUsername(event.target.value)
                        })}
                    />
                    {
                        errors?.username &&
                        <span className="error-field">
                            {errors?.username?.message}
                        </span>
                    }
                </label>
                <label htmlFor="name">
                    <span className="name-field">Ism</span>
                    <input
                        defaultValue={""}
                        id="name"
                        className="input-fields "
                        {...register("name",{
                            required: "Iltimos to'ldiring",
                            pattern: {
                                value: /^[a-zA-Z']+$/,
                                message: "Ism faqat harflardan iborat bo'lishi kerak"
                            },
                        })}
                    />
                    {
                        errors?.name &&
                        <span className="error-field">
                            {errors?.name?.message}
                        </span>
                    }
                </label>
                <label htmlFor="surname">
                    <span className="name-field">Familiya</span>
                    <input
                        defaultValue={""}
                        id="surname"
                        className="input-fields"
                        {...register("surname",{
                            required: "Iltimos to'ldiring",
                            pattern: {
                                value: /^[a-zA-Z']+$/,
                                message: "Familya faqat harflardan iborat bo'lishi kerak"
                            },
                        })}
                    />
                    {
                        errors?.surname &&
                        <span className="error-field">
                            {errors?.surname?.message}
                        </span>
                    }
                </label>
                <label htmlFor="fatherName">
                    <span className="name-field">Otasining ismi</span>
                    <input
                        defaultValue={""}
                        id="fatherName"
                        className="input-fields "
                        {...register("fatherName",{
                            required: "Iltimos to'ldiring"
                        })}
                    />
                    {
                        errors?.fatherName &&
                        <span className="error-field">
                            {errors?.fatherName?.message}
                        </span>
                    }
                </label>

                <h3>Tug'ulgan sana</h3>
                <div className="birth">

                    <label htmlFor="birthDay" className="selectLabel">
                        <span className="name-field">Kun</span>
                        <select
                            name="birthDay"
                            id="birthDay"
                            {...register("birthDay", { required: true })}
                        >
                            {
                                renderOptions(days)
                            }
                        </select>
                    </label>
                    <label htmlFor="birthMonth" className="selectLabel">
                        <span className="name-field">Oy</span>
                        <select
                            name="birthMonth"
                            id="birthMonth"
                            {...register("birthMonth", { required: true })}
                        >
                            {
                                renderOptions(months)
                            }
                        </select>
                    </label>
                    <label htmlFor="birthYear" className="selectLabel">
                        <span className="name-field">Yil</span>
                        <select
                            name="birthYear"
                            id="birthYear"
                            {...register("birthYear", { required: true })}
                        >
                            {
                                renderOptions(years)
                            }
                        </select>
                    </label>
                </div>


                <label htmlFor="phone">
                    <span className="name-field">Telefon raqam</span>
                    <input
                        defaultValue={""}
                        id="phone"
                        className="input-fields "
                        {...register("phone",{
                            required: "Iltimos to'ldiring",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Telefon raqami sonlar va maxsus belgilardan iborat bo'lishi kerak"
                            },
                        })}
                    />
                    {
                        errors?.phone &&
                        <span className="error-field">
                            {errors?.phone?.message}
                        </span>
                    }
                </label>
                <label htmlFor="phoneParent">
                    <span className="name-field">Ota-onaning telefon raqami</span>
                    <input
                        defaultValue={""}
                        id="phoneParent"
                        className="input-fields "
                        {...register("phoneParent",{
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Telefon raqami sonlar va maxsus belgilardan iborat bo'lishi kerak"
                            },
                        })}
                    />
                    {
                        errors?.phoneParent &&
                        <span className="error-field">
                            {errors?.phoneParent?.message}
                        </span>
                    }
                </label>
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
                        errors?.confirmPassword || activeError ?
                        <div className="error-field">
                            <span>{errors?.confirmPassword?.message}</span>
                            <span> {errorMessage}</span>

                        </div>
                            : null
                    }
                </label>

                <label htmlFor="comment">
                    <span className="name-field">Qo'shimcha ma'lumot (shart emas)</span>
                    <textarea

                        id="comment"
                        {...register("comment")}
                    />
                </label>
                <input disabled={activeError}  className="input-submit" type="submit" value="Next"/>

            </motion.form>
        </motion.div>

    );
};

export default RegisterUserStep1;