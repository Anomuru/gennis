import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import Input from "components/platform/platformUI/input";
import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchCheckPassword} from "slices/meSlice";



import "./checkPassword.sass"

const CheckPassword = () => {
    const {checkingPassword,id} = useSelector(state => state.me)

    const [password,setPassword] = useState()
    const [showPassword,setShowPassword] = useState(false)

    const dispatch = useDispatch()

    const onSubmit = (e) => {
        e.preventDefault()
        const data = {
            id: id,
            password: password
        }
        dispatch(fetchCheckPassword(data))
    }


    if (checkingPassword === "loading") {
        return <DefaultLoader/>
    }

    const typePassword = showPassword ? "text" : "password"
    const classShowPassword = showPassword ?  "fas fa-eye" : "fas fa-eye-slash"
    return (
        <div className="checkPassword">
            <form action="" onSubmit={onSubmit}>
                <h1>Shaxsiylikni tekshirish</h1>
                <label htmlFor="password">
                    <div>
                        <span className="name-field">Parol</span>
                        <input
                            defaultValue={""}
                            id="password"
                            type={typePassword}
                            className="input-fields "
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <i className={classShowPassword} onClick={() => setShowPassword(!showPassword)}/>
                    </div>
                </label>
                <input type="submit" className={"input-submit"}/>
            </form>
        </div>
    );
};

export default CheckPassword;