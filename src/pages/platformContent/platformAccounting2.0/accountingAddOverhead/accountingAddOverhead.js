import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import Select from "components/platform/platformUI/select";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {setMessage} from "slices/messageSlice";
import {newAccountingOverheadTools} from "pages/platformContent/platformAccounting2.0/model/accountingSelector";
import {useParams} from "react-router-dom";
import {onAddItem} from "pages/platformContent/platformAccounting2.0/model/accountingSlice";

export const AccountingAddOverhead = ({setActive}) => {
    const {
        register,
        formState: {errors},
        handleSubmit,
        reset,
        setValue
    } = useForm({mode: "onBlur"})

    const {dataToChange} = useSelector(state => state.dataToChange)
    const overheadTools = useSelector(newAccountingOverheadTools)
    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)
    const [selectedCommunal, setSelectedComunal] = useState(null)
    const [overheadTypes, setOverheadTypes] = useState([])
    const [selectedType, setSelectedType] = useState(null)
    const dispatch = useDispatch()
    const {locationId} = useParams()
    const {request} = useHttp()

    useEffect(() => {
        dispatch(fetchDataToChange(locationId))
    }, [locationId])

    useEffect(() => {
        request(`${BackUrl}account/overhead_type?location_id=${locationId}`, "GET", null, headers())
            .then(res => { if (res.success) setOverheadTypes(res.data) })
            .catch(() => {})
    }, [locationId])

    useEffect(() => {
        if (selectedCommunal) {
            const type = overheadTypes.find(t => String(t.id) === String(selectedCommunal))
            setSelectedType(type || null)
            if (type && type.cost != null) {
                setValue("price", type.cost)
            } else {
                setValue("price", "")
            }
        } else {
            setSelectedType(null)
        }
    }, [selectedCommunal, overheadTypes, setValue])

    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map((item, index) => (
            <label key={index} className="radioLabel" htmlFor="">
                <input className="radio" {...register("typePayment", {required: true})} type="radio" value={item.id}/>
                <span>{item.name}</span>
            </label>
        ))
    }, [dataToChange?.payment_types])

    const renderedPaymentType = renderPaymentType()

    const onSubmit = (data, e) => {
        e.preventDefault()
        const newData = {
            ...data,
            typeItem: Number(selectedCommunal),
            month,
            day
        }

        request(`${BackUrl}account/add_overhead/${locationId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    reset()
                    dispatch(setMessage({msg: res.msg, type: "success", active: true}))
                    dispatch(onAddItem(res?.data))
                    setActive(false)
                } else {
                    dispatch(setMessage({msg: res.msg, type: "success", active: true}))
                }
            })
    }

    useEffect(() => {
        if (overheadTools?.length < 2) {
            setMonth(overheadTools[0]?.value)
        }
    }, [overheadTools])

    const isPriceLocked = selectedType && selectedType.cost != null

    return (
        <div className="overhead">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <Select
                    name={"communal"}
                    title={"Komunal"}
                    defaultValue={selectedCommunal}
                    onChangeOption={setSelectedComunal}
                    options={overheadTypes}
                />

                <label htmlFor="date">
                    <div>
                        <span className="name-field">Sanasi</span>
                        <input
                            defaultValue={""}
                            id="date"
                            className="input-fields"
                            type={"date"}
                            {...register("date", {required: "Iltimos to'ldiring"})}
                        />
                    </div>
                    {errors?.date && <span className="error-field">{errors?.date?.message}</span>}
                </label>

                <label htmlFor="price">
                    <div>
                        <span className="name-field">Narxi</span>
                        <input
                            id="price"
                            className="input-fields"
                            type={"number"}
                            readOnly={isPriceLocked}
                            style={isPriceLocked ? {backgroundColor: "#f0f0f0", cursor: "not-allowed"} : {}}
                            {...register("price", {required: "Iltimos to'ldiring"})}
                        />
                    </div>
                    {errors?.price && <span className="error-field">{errors?.price?.message}</span>}
                </label>

                <div>
                    {renderedPaymentType}
                </div>

                <input className="input-submit" type="submit" value="Tasdiqlash"/>
            </form>
        </div>
    )
}
