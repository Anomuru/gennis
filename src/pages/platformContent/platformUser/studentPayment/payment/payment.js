import React, {useCallback, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";
import {useDispatch, useSelector} from "react-redux";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {useAuth} from "hooks/useAuth";
import {setMessage} from "slices/messageSlice";

const Payment = () => {

    const {userId} = useParams()
    const {dataToChange} = useSelector(state => state.dataToChange)



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
            type: "payment",
            ...data,
        }


        request(`${BackUrl}get_payment/${userId}`,"POST",JSON.stringify(newData),headers())
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

    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map(item => {
            return (
                <label className="radioLabel" htmlFor="">
                    <input className="radio" {...register("typePayment", { required: true })} type="radio" value={item.id} />
                    <span>{item.name}</span>
                </label>
            )
        })
    },[dataToChange?.payment_types, register])



    const renderedPaymentTypes = renderPaymentType()


    return (
        <div className="formBox">
            <h1>Tolov</h1>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {renderedPaymentTypes}
                </div>


                <label htmlFor="payment">
                    <div>
                        <span className="name-field">To'lov miqdori</span>
                        <input
                            defaultValue={""}
                            id="payment"
                            className="input-fields"
                            {...register("payment",{
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

export default Payment;