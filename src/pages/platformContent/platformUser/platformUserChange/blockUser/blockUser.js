import React, {useEffect, useState} from 'react';
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {fetchUserData} from "slices/usersProfileSlice";
import {setMessage} from "slices/messageSlice";

const BlockUser = ({userId}) => {

    const {user} = useSelector(state => state.usersProfile)




    const [isBlocked,setIsBlocked] = useState(false)

    useEffect(() => {
        if (user) {
            setIsBlocked(user.isBlocked)
        }
    },[user])

    const {request} = useHttp()
    const dispatch = useDispatch()

    const onClick = () => {

        request(`${BackUrl}add_blacklist/${userId}`,"GET",null,headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                    setIsBlocked(!isBlocked)
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
        <div className="block">


            <div
                onClick={onClick}
                className={classNames("block_btn",{
                    green: isBlocked
                })}
            >
                {
                    isBlocked ?
                        "Qora royhatdan chiqazish"
                        : "Qora royhatga solish"
                }

            </div>
        </div>
    );
};

export default BlockUser;