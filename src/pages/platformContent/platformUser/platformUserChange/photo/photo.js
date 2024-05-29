import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {useHttp} from "hooks/http.hook";
import {BackUrl, BackUrlForDoc} from "constants/global";

import defoultImg from "assets/user-interface/user_image.png"

import "./photo.sass"
import {useDispatch, useSelector} from "react-redux";
import BackButton from "components/platform/platformUI/backButton/backButton";
import {setMessage} from "slices/messageSlice";


const Photo = () => {


    const {userId} = useParams()
    const {id} = useSelector(state => state.me)
    const {user} = useSelector(state => state.usersProfile)



    const [img,setImg] = useState()
    const [userImg,setUserImg] = useState()
    const [activeError,setActiveError] = useState()
    const [errorMsg,setErrorMsg] = useState()
    const inputRef = useRef()


    useEffect(() => {
        if (+userId === +id) {
            setUserImg(user.photo_profile)
        } else if (+userId === +user.id){
            setUserImg(user.photo_profile)
        }
    },[id, userId])
    const {request} = useHttp()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onSubmit = (e) => {
        e.preventDefault()

        let data = new FormData();
        data.append('file', img[0]);

        const token = sessionStorage.getItem("token")
        const headers = {
            "Authorization": "Bearer " + token,
        }
        request(`${BackUrl}update_photo_profile/${userId}`, "POST",data,headers)
            .then(res => {
                if (res.success) {
                    navigate(-1)
                }
                else {
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


    const Open = (e) => {
        inputRef.current.click()
    }


    const disabled = !img || img?.length === 0
    return (
        <div className="photo">

            <header>
                <BackButton/>
            </header>
            <h1>Rasm o'zgartirish</h1>
            <main>
                <form onSubmit={onSubmit}>

                    <div className="photo__input" onClick={Open}>
                        <img
                            src={
                                img?.length > 0 ? URL.createObjectURL(img[0]) : userImg ? `${BackUrlForDoc}${userImg}` :  defoultImg
                            }
                            alt="userImg"
                        />
                        <input ref={inputRef}  onChange={(e) => setImg(e.target.files)} type="file" />
                    </div>

                    <input type="submit" disabled={disabled}  className="input-submit"/>
                </form>

            </main>



        </div>
    );
};

export default Photo;
