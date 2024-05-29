import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {useAuth} from "hooks/useAuth";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {setMessage} from "slices/messageSlice";

const BookPayment = () => {
    const {userId} = useParams()


    const {
        register,
        formState: {errors},
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur"
    })

    const dispatch = useDispatch()

    const {selectedLocation} = useAuth()


    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    },[selectedLocation])


    const {request} = useHttp()


    const onSubmit = (data) => {

        const newData = {
            ...data,
        }


        request(`${BackUrl}book_payment/${userId}`,"POST",JSON.stringify(newData),headers())
            .then( res => {

                if (res.success) {
                    reset()
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                } else {
                    dispatch(setMessage({
                        msg: "Serverda hatolik",
                        type: "error",
                        active: true
                    }))

                }
            })
    }






    return (
        <div className="formBox">
            <h1>Kitob Tolovi</h1>
            <form action="" onSubmit={handleSubmit(onSubmit)}>

                <label htmlFor="payment">
                    <div>
                        <span className="name-field">To'lov miqdori</span>
                        <input
                            defaultValue={""}
                                id="payment"
                            className="input-fields"
                            {...register("bookPayment",{
                                required: "Iltimos to'ldiring",
                            })}
                        />
                    </div>
                    {
                        errors?.payment &&
                        <span className="error-field">
                            {errors?.payment?.message}
                        </span>
                    }
                </label>

                <input className="input-submit" type="submit" value="Tasdiqlash"/>
            </form>

        </div>
    );
};

export default BookPayment;