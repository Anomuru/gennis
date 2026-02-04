import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import Select from "components/platform/platformUI/select";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {setMessage} from "slices/messageSlice";
import {fetchAccData} from "slices/accountingSlice";
import {newAccountingOverheadTools} from "pages/platformContent/platformAccounting2.0/model/accountingSelector";
import {useParams} from "react-router-dom";
import {onAddItem} from "pages/platformContent/platformAccounting2.0/model/accountingSlice";

export const AccountingAddOverhead = ({setActive}) => {
    const {
        register,
        formState: {errors},
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur"
    })


    const {dataToChange} = useSelector(state => state.dataToChange)
    const overheadTools = useSelector(newAccountingOverheadTools)
    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)
    const [selectedCommunal, setSelectedComunal] = useState(null)
    const dispatch = useDispatch()
    const {locationId} = useParams()


    useEffect(() => {
        dispatch(fetchDataToChange(locationId))
    }, [locationId])

    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map((item, index) => {
            return (
                <label key={index} className="radioLabel" htmlFor="">
                    <input className="radio" {...register("typePayment", {required: true})} type="radio"
                           value={item.id}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange?.payment_types])


    const renderDate = useCallback(() => {
        return overheadTools?.map((item, index) => {
            if (item.value === month) {
                return (
                    <div className="date__item" key={index}>
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
    }, [overheadTools, month, day])


    const renderedDays = renderDate()
    const renderedPaymentType = renderPaymentType()

    const {request} = useHttp()

    const onSubmit = (data, e) => {
        e.preventDefault()
        let newData
        if (selectedCommunal === "boshqa") {
            newData = {
                ...data,
                month,
                day
            }
        } else {
            newData = {
                ...data,
                typeItem: selectedCommunal,
                month,
                day
            }
        }

        request(`${BackUrl}account/add_overhead/${locationId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    reset()
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true

                    }))
                    dispatch(onAddItem(res?.data))

                    setActive(false)

                    const data = {
                        locationId,
                        type: "overhead"
                    }

                } else {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                }
            })
    }


    useEffect(() => {
        if (overheadTools?.length < 2) {
            setMonth(overheadTools[0]?.value)
        }
    }, [overheadTools])

    const communal = ["gaz", "svet", "suv", "arenda", "boshqa"]

    return (
        <div className="overhead">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <Select
                    name={"communal"}
                    title={"Komunal"}
                    defaultValue={selectedCommunal}
                    onChangeOption={setSelectedComunal}
                    options={communal}
                />
                {
                    selectedCommunal === "boshqa" ?
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
                        : null

                }

                <label htmlFor="date">
                    <div>
                        <span className="name-field">Sanasi</span>
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
                <div>
                    {renderedPaymentType}
                </div>
                {/*{*/}
                {/*    overheadTools?.length >= 2 ?*/}
                {/*        <Select*/}
                {/*            name={"month"}*/}
                {/*            title={"Oy"}*/}
                {/*            defaultValue={month}*/}
                {/*            onChangeOption={setMonth}*/}
                {/*            options={overheadTools}*/}
                {/*        /> :*/}
                {/*        null*/}
                {/*}*/}

                {/*{renderedDays}*/}

                <input className="input-submit" type="submit" value="Tasdiqlash"/>


            </form>
        </div>
    )
}
