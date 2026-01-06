import React, { useState } from 'react';

import "./login.sass"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { fetchMyInfo, setUser } from "slices/meSlice";

import Logo from "assets/logo/Gennis logo.png"

import Message from "components/platform/platformMessage";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import { useHttp } from "hooks/http.hook";
import { BackUrl, ClassroomUrl } from "constants/global";
import { setMessage } from "slices/messageSlice";
import Input from "components/platform/platformUI/input";


const Login = () => {

    const { meLoadingStatus } = useSelector(state => state.me)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)

    const [activeError, setActiveError] = useState(false)
    const [messageError, setMessageError] = useState(null)
    const [postDataStatus, setPostDataStatus] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { request } = useHttp()

    const onSubmit = (e) => {
        e.preventDefault()

        const user = {
            username: username,
            password: password,
        }

        setPostDataStatus("loading")
        request(`${BackUrl}base/login`, "POST", JSON.stringify(user))
            // request(`${BackUrl}login2`,"POST",JSON.stringify(user))
            .then(res => {
                if (res.success) {
                    console.log(res, "login");

                    localStorage.setItem("userData", JSON.stringify(res.data))
                    dispatch(setUser(res.data))
                    dispatch(fetchMyInfo(res.user.id))
                    return { success: true }
                } else {
                    setActiveError(true)
                    dispatch(setMessage({
                        msg: "Parol yoki Username hato berilgan",
                        type: "error",
                        active: true
                    }))
                }
            })
            .then(res => {
                const isNav = localStorage.getItem("navigate")

                if (res.success && !isNav) {
                    navigate("/platform")
                } else {
                    navigate(`/platform/${isNav}`)
                    localStorage.removeItem("navigate")
                }
            })
            .catch(() => {
                setPostDataStatus("error")
                setActiveError(true)
                setMessageError("Serverda yoki internetingizda hatolik")
            })
    }

    // useEffect(() =>{
    //     if (meLoadingStatus === "error") {
    //         setActiveError(true)
    //         setMessageError("Parol yoki Username hato berilgan")
    //     } else if (meLoadingStatus === "success") {
    //         navigate('/platform')
    //     }
    // },[meLoadingStatus])


    const renderForm = () => {
        if (postDataStatus === "loading") {
            return (
                <DefaultLoader />
            )
        } else {
            return (
                <>
                    <h1 className="title">Login Admin</h1>
                    <Input
                        name={"username"}
                        title={"Username"}
                        type={"text"}
                        required
                        clazz={activeError ? "input-fields-error" : null}
                        // value={username}
                        onChange={(e) => {
                            setUsername(e)
                            setActiveError(false)
                        }}
                    />
                    <Input
                        name={"password"}
                        title={"Password"}
                        type={"password"}
                        required
                        clazz={activeError ? "input-fields-error" : null}
                        // value={password}
                        onChange={(e) => {
                            setPassword(e)
                            setActiveError(false)
                        }}
                    />
                    {/*<label htmlFor="username">*/}
                    {/*    <span className="name-field">Username</span>*/}
                    {/*    <input*/}
                    {/*        id="username"*/}
                    {/*        type="text"*/}
                    {/*        name="login"*/}
                    {/*        className="input-fields "*/}
                    {/*        */}
                    {/*        value={username}*/}
                    {/*    />*/}
                    {/*</label>*/}
                    {/*<label htmlFor="password">*/}
                    {/*    <span className="name-field">Password</span>*/}
                    {/*    <input*/}
                    {/*        id="password"*/}
                    {/*        type={typePassword}*/}
                    {/*        name="password"*/}
                    {/*        className="input-fields"*/}
                    {/*        onChange={(e) => {*/}
                    {/*            setPassword(e.target.value)*/}
                    {/*            setActiveError(false)*/}
                    {/*        }}*/}
                    {/*        value={password}*/}
                    {/*    />*/}
                    {/*    <i className={classShowPassword} onClick={() => setShowPassword(!showPassword)}/>*/}
                    {/*</label>*/}
                    <input type="submit" className="input-submit" value="Submit" />

                    <div className="link__register">
                        Agar accountingiz mavjud bolmasa:
                        <span>
                            <Link to="/register">
                                Register
                            </Link>
                        </span>
                    </div>
                </>
            )
        }
    }

    return (
        <div className="login">

            <Link to="/">
                <img className="login__logo" src={Logo} alt="Logo" />
            </Link>

            <form action="" onSubmit={onSubmit}>
                {renderForm()}
            </form>
            <Message />
        </div>
    );
};

export default Login;
