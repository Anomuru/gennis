import React, {useCallback, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";
import {useDispatch, useSelector} from "react-redux";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {useAuth} from "hooks/useAuth";
import {setMessage} from "slices/messageSlice";
import Select from "components/platform/platformUI/select";
import Input from "../../../../../components/platform/platformUI/input";

const Payment = () => {

    const {userId} = useParams()
    const {dataToChange} = useSelector(state => state.dataToChange)
    const [day, setDay] = useState(null)
    // const [month, setMonth] = useState(null)
    // const [date, setDate] = useState(null)


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
    }, [selectedLocation])


    const {request} = useHttp()


    const onSubmit = (data) => {

        console.log(data.date)

        const [year, month, day] = data.date.split("-")
        const newData = {
            type: "payment",
            ...data,
            month,
            day
        }


        request(`${BackUrl}account/get_payment/${userId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {


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
                    <input className="radio" {...register("typePayment", {required: true})} type="radio"
                           value={item.id}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange?.payment_types, register])

    // const renderDate = useCallback(() => {
    //     return dataToChange?.data_days?.map((item, index) => {
    //         if (item.value === month) {
    //             return (
    //                 <div className="date__item" key={index}>
    //                     <Select
    //                         number={true}
    //                         name={"day"}
    //                         title={"Kun"}
    //                         defaultValue={day}
    //                         onChangeOption={setDay}
    //                         options={item?.days}
    //                     />
    //                 </div>
    //             )
    //         }
    //     })
    // }, [dataToChange?.data_days, month, day])


    // const renderedDays = renderDate()


    const renderedPaymentTypes = renderPaymentType()


    return (
        <div className="formBox">
            <h1>Tolov</h1>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                {/*{*/}
                {/*    dataToChange?.data_days?.length >= 2 ?*/}
                {/*        <Select*/}
                {/*            name={"month"}*/}
                {/*            title={"Oy"}*/}
                {/*            defaultValue={month}*/}
                {/*            onChangeOption={setMonth}*/}
                {/*            options={dataToChange?.data_days}*/}
                {/*        /> :*/}
                {/*        null*/}
                {/*}*/}

                {/*{renderedDays}*/}

                <div>
                    {renderedPaymentTypes}
                </div>
                <label htmlFor="date">
                    <div>
                        <span className="name-field">To'lov sanasi</span>
                        <input
                            type="date"
                            defaultValue={""}
                            id="date"
                            className="input-fields"
                            {...register("date", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                    </div>
                    {
                        errors?.date &&
                        <span className="error-field">
                            {errors?.date?.message}
                        </span>
                    }
                </label>


                <label htmlFor="payment">
                    <div>
                        <span className="name-field">To'lov miqdori</span>
                        <input
                            defaultValue={""}
                            id="payment"
                            className="input-fields"
                            {...register("payment", {
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