import React, {useCallback, useEffect, useState} from 'react';


import styles from "./monthBookMoney.module.sass"
import {useParams} from "react-router-dom";
import Table from "components/platform/platformUI/table";
import BackButton from "components/platform/platformUI/backButton/backButton";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {setMessage} from "slices/messageSlice";
import {onSetChangedOrders} from "slices/booksSlice";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import Select from "components/platform/platformUI/select";
import Button from "components/platform/platformUI/button";

const MonthBookMoney = () => {

    const [monthMoneys, setMonthMoneys] = useState([])
    const [order, setOrder] = useState({})
    const [changingData, setChangingData] = useState({})

    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)

    const {isCheckedPassword} = useSelector(state => state.me)

    const {dataToChange} = useSelector(state => state.dataToChange)

    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    }, [activeChangeModalName, isCheckedPassword])


    const {id} = useParams()

    const {request} = useHttp()
    const dispatch = useDispatch()

    useEffect(() => {


        dispatch(fetchDataToChange())
        request(`${BackUrl}collected_by_month/${id}`, "GET", null, headers())
            .then(res => {
                setMonthMoneys(res.data.debt)
            })

    }, [])

    const changePaymentTypeTransfer = (id, value) => {
        setActiveChangeModal(false)
        request(`${BackUrl}change_collected_money2/${id}/${value}`, "GET", null, headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    // dispatch(onSetChangedOrders({books: res.order}))
                    setMonthMoneys(orders => orders.map(item => {
                        if (item.id === res.data.id) {
                            return {
                                ...res.data
                            }
                        }

                        return item
                    }))
                }
            })
    }


    console.log(changingData)
    return (
        <div className={styles.monthBookMoney}>
            <div className={styles.monthBookMoney__header}>
                <BackButton/>

                {/*<div className={styles.money} onClick={() => changeModal("money")}>*/}
                {/*    <i className="fas fa-money-check-alt"></i>*/}
                {/*</div>*/}
            </div>
            <div className={styles.monthBookMoney__wrapper}>
                <Table>
                    <tr>
                        <th></th>
                        <th>Qarz</th>
                        <th>Oy</th>
                        <th>Yil</th>
                        <th>Yaralgan sana</th>
                        <th>Olingan sana</th>
                        <th>Tolovi turi</th>
                    </tr>
                    {
                        monthMoneys.map((item, index) => {
                            return (
                                <tr onClick={() => {
                                    if (!item.status) {
                                        changeModal("money")
                                        setOrder(item)
                                    }
                                }}>
                                    <td>{index + 1}</td>
                                    <td>{item.debt}</td>
                                    <td>{item.month}</td>
                                    <td>{item.year}</td>
                                    <td>{item.created}</td>
                                    <td>{item.received}</td>
                                    <td onClick={() => {
                                            if (item.payment_type) {
                                                setChangingData({id:item.id,typePayment: item.payment_type.id})
                                                changeModal("changeTypePayment")
                                            }
                                        }}
                                    >
                                        {
                                            item.payment_type ?
                                                <span

                                                    className="typePayment"
                                                >
                                                    {item.payment_type.name}
                                                </span> : null
                                        }

                                    </td>
                                </tr>
                            )
                        })
                    }
                </Table>
            </div>


            <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                <CheckPassword/>
            </Modal>
            {
                activeChangeModalName === "money" && isCheckedPassword ?
                    <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                        <GetMoney order={order} setActiveChangeModal={setActiveChangeModal}/>
                    </Modal>
                    :
                    activeChangeModalName === "changeTypePayment" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <div className={styles.changeTypePayment}>
                                <Select
                                    options={dataToChange.payment_types}
                                    name={""}
                                    title={"Payment turi"}
                                    onChangeOption={changePaymentTypeTransfer}
                                    id={changingData.id}
                                    defaultValue={changingData.typePayment}
                                />
                            </div>
                        </Modal>
                        : null
            }

        </div>
    );
};

const GetMoney = ({setActiveChangeModal, order}) => {

    const {dataToChange} = useSelector(state => state.dataToChange)

    const {
        register,
        formState: {
            isValid,
            isDirty
        },
        handleSubmit,
    } = useForm({
        mode: "onBlur"
    })


    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmit = (data) => {

        const newData = {
            ...data,
            // books: books.filter(item => item.admin_confirm)
        }

        request(`${BackUrl}get_center_money/${order.id}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                    // dispatch(onSetChangedOrders({books : res.order}))
                    setActiveChangeModal(false)
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
    }, [dataToChange, register])

    const renderedPaymentTypes = renderPaymentType()


    return (
        <div className={styles.getMoney}>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <h1>Pul</h1>
                <h1 style={{marginTop: 10 + "px"}}>Qarz : {order.debt}</h1>
                <div>
                    {renderedPaymentTypes}
                </div>
                <input disabled={!isDirty || !isValid} className="input-submit" type="submit" value="Tasdiqlash"/>
            </form>


        </div>
    )
}

export default MonthBookMoney;