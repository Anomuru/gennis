import React, {useEffect, useState} from 'react';
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {setMessage} from "slices/messageSlice";

const ChangeLocTeacher = ({userId}) => {

    const {user} = useSelector(state => state.usersProfile)
    const {location} = useSelector(state => state.me)



    const [isChanged,setIsChanged] = useState(false)

    useEffect(() => {
        if (user) {
            setIsChanged(user.location_list.includes(location))
        }
    },[user])

    const {request} = useHttp()
    const dispatch = useDispatch()
    const onClick = () => {
        request(`${BackUrl}add_teacher_to_branch/${userId}/${location}`,"GET",null,headers())
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
        <div className="change">


            <div
                onClick={onClick}
                className={classNames("change_btn",{
                    green: isChanged
                })}
            >
                {
                    isChanged ?
                        "O'z filialingizdan olib tashlash"
                        : "O'z filialingizga qo'shish"
                }
            </div>
        </div>
    );
};

export default ChangeLocTeacher;