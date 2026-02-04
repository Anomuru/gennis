import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import {useAuth} from "hooks/useAuth";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import Select from "components/platform/platformUI/select";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {setMessage} from "slices/messageSlice";

import {useParams} from "react-router-dom";
import {
    newAccountingCapitalTools,
    newAccountingData
} from "pages/platformContent/platformAccounting2.0/model/accountingSelector";
import {onAddItem} from "pages/platformContent/platformAccounting2.0/model/accountingSlice";

export const AccountingAddCapital = ({setActive}) => {

    const {
        register,
        formState: {errors},
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur"
    })


    const {dataToChange} = useSelector(state => state.dataToChange)
    const capitalTools = useSelector(newAccountingCapitalTools)
    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)
    const dispatch = useDispatch()
    const {locationId} = useParams()

    const {selectedLocation} = useAuth()

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    }, [selectedLocation])

    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map((item, i) => {
            return (
                <label key={i} className="radioLabel" htmlFor="">
                    <input className="radio" {...register("typePayment", {required: true})} type="radio"
                           value={item.id}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange?.payment_types])


    const renderDate = useCallback(() => {
        return capitalTools?.map((item, index) => {
            if (item.value === month) {
                return (
                    <div key={index} className="date__item">
                        <Select
                            number={true}
                            name={"day"}
                            title={"Kun"}
                            defaultValue={day}
                            onChangeOption={setDay}
                            options={item?.days}
                        />
                    </div>
                )
            }
        })
    }, [capitalTools, month, day])


    const renderedDays = renderDate()
    const renderedPaymentType = renderPaymentType()

    const {request} = useHttp()

    const onSubmit = (data, e) => {
        e.preventDefault()
        const newData = {
            ...data,
            month,
            day
        }



        request(`${BackUrl}account/add_capital/${locationId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    reset()
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    setActive(false)

                    dispatch(onAddItem(res?.data))
                    // setActiveChangeModal(false)
                    const data = {
                        locationId,
                        type: "capital"
                    }

                } else {
                    dispatch(setMessage({
                        msg: "Serverda hatolik",
                        type: "error",
                        active: true
                    }))
                    // setActiveChangeModal(false)
                }
            })
    }


    useEffect(() => {
        if (capitalTools?.length < 2) {
            setMonth(capitalTools[0]?.value)
        }
    }, [capitalTools])

    return (
        <div className="overhead">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="typeItem">
                    <div>
                        <span className="name-field">Narsa turi</span>
                        <input
                            defaultValue={""}
                            id="typeItem"
                            className="input-fields"
                            {...register("typeItem", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                    </div>
                    {
                        errors?.typeItem &&
                        <span className="error-field">
                            {errors?.typeItem?.message}
                        </span>
                    }
                </label>
                <label htmlFor="price">
                    <div>
                        <span className="name-field">Narxi</span>
                        <input
                            defaultValue={""}
                            id="price"
                            className="input-fields"
                            type={"number"}
                            {...register("price", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                    </div>
                    {
                        errors?.price &&
                        <span className="error-field">
                            {errors?.price?.message}
                        </span>
                    }
                </label>
                <label htmlFor="date">
                    <div>
                        <span className="name-field">Narxi</span>
                        <input
                            defaultValue={""}
                            id="date"
                            className="input-fields"
                            type={"date"}
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
                <div>
                    {renderedPaymentType}
                </div>
                {/*{*/}
                {/*    capitalTools?.length >= 2 ?*/}
                {/*        <Select*/}
                {/*            name={"month"}*/}
                {/*            title={"Oy"}*/}
                {/*            defaultValue={month}*/}
                {/*            onChangeOption={setMonth}*/}
                {/*            options={capitalTools}*/}
                {/*        /> :*/}
                {/*        null*/}
                {/*}*/}
                {/*{renderedDays}*/}

                <input className="input-submit" type="submit" value="Tasdiqlash"/>

            </form>
        </div>
    )
}
