import React, {useEffect, useState} from 'react';
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {setMessage} from "slices/messageSlice";


import cls from "./makeObserver.module.sass"


const MakeObserver = ({userId}) => {

    const {user} = useSelector(state => state.usersProfile)
    const {location} = useSelector(state => state.me)
    const [isChanged,setIsChanged] = useState(false)


    useEffect(() => {
        if (user) {
            setIsChanged(user.observer)
        }
    },[user])

    const {request} = useHttp()
    const dispatch = useDispatch()
    const onClick = () => {
        request(`${BackUrl}set_observer/${userId}`,"GET",null,headers())
            // request(`${BackUrl}hello/${userId}`,"GET",null,headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    setIsChanged(!isChanged)
                } else {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "error",
                        active: true
                    }))
                }
            })
            .catch(() => {
                dispatch(setMessage({
                    msg: "Serverda yoki internetingizda hatolik",
                    type: "error",
                    active: true
                }))
            })
    }


    return (
        <div className={cls.change}>


            <div
                onClick={onClick}
                className={classNames(cls.change_btn,{
                    [cls.green]: isChanged
                })}
            >
                {
                    isChanged ?
                        "O'qituvchini Observer olib tashlash"
                        : "O'qituvchini Observer qilish"
                }
            </div>
        </div>
    );
};

export default MakeObserver;