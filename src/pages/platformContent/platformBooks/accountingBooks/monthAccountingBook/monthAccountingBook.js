import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {
    fetchEmployeeSalaryMonth
} from "slices/teacherSalarySlice";
import {useParams} from "react-router-dom";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import Button from "components/platform/platformUI/button";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";


import "./monthAccountingBook.sass"
import {fetchMonthBooksAcc} from "slices/booksSlice";
import Table from "components/platform/platformUI/table";
import {setMessage} from "slices/messageSlice";
import Select from "components/platform/platformUI/select";
import Confirm from "components/platform/platformModals/confirm/confirm";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";

const MonthAccountingBook = () => {
    const {monthId} = useParams()
    const dispatch = useDispatch()


    const {monthBooksAcc} = useSelector(state => state.books)
    const {isCheckedPassword} = useSelector(state => state.me)

    const [activeDelete, setActiveDelete] = useState(false)
    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)


    const [changingData,setChangingData] = useState({})

    useEffect(() => {
        const data = {monthId}
        dispatch(fetchMonthBooksAcc(data))
    }, [dispatch, monthId])



    useEffect(() => {
        dispatch(fetchDataToChange())
    }, [])





    const filteredMoneys = useMemo(() => {
        if (activeDelete) {
            return monthBooksAcc?.balance_overheads_deleted
        }
        return monthBooksAcc?.balance_overheads
    },[monthBooksAcc,activeDelete])


    const deleteSalary = (data) => {
        if (data.confirm === "yes") {

            const newData = {
                id: changingData.id,
                userId: changingData.userId,
                type: changingData.type,
                ...data
            }
            request(`${BackUrl}delete_campus_money/${changingData.id}`,"POST",JSON.stringify(newData),headers())
                .then( res => {
                    if (res.success) {
                        dispatch(setMessage({
                            msg: res.msg,
                            type: "success",
                            active: true
                        }))


                        const data = {
                            monthId
                        }
                        dispatch(fetchMonthBooksAcc(data))
                    }
                })
            setActiveChangeModal(false)
        } else {
            setActiveChangeModal(false)
        }


    }

    const changePaymentTypeData = (id,value) => {
        setActiveChangeModal(false)
        request(`${BackUrl}change_campus_money2/${id}/${value}`,"GET",null,headers())
            .then( res => {
                if (res.success) {

                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                    const data = {
                        monthId
                    }
                    dispatch(fetchMonthBooksAcc(data))
                }
            })
    }





    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    },[activeChangeModalName, isCheckedPassword])

    const {request} = useHttp()

    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    const {dataToChange} = useSelector(state => state.dataToChange)





    return (
        <>
            <div className="locationMonths">
                <header>
                    <div>
                        <h1>Oy: {monthBooksAcc?.month_balance?.month}</h1>
                        <h1>Qolgan pul: {monthBooksAcc?.month_balance?.exist_money}</h1>
                        <h1>Olingan pul: {monthBooksAcc?.month_balance?.taken_money}</h1>
                    </div>
                    <div>
                        <div
                            onClick={() => changeModal("payment")}
                            className="payment"
                        >
                            <i className="fas fa-dollar-sign"/>
                        </div>
                    </div>
                </header>
                <div className="subheader">
                    <Button active={activeDelete} onClickBtn={() => setActiveDelete(!activeDelete)}>
                        O'chirilgan pullar
                    </Button>
                </div>
                <main>
                    <Table>
                        <tr>
                            <th></th>
                            <th>Pul</th>
                            <th>Sabab</th>
                            <th>Turi</th>
                            <th>Sana</th>
                            <th>O'chirish</th>
                        </tr>

                        {
                            filteredMoneys?.map((item,index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.payment_sum}</td>
                                        <td>{item.reason}</td>

                                        <td
                                            onClick={() => {
                                                changeModal("changeTypePayment")
                                                setChangingData({id: item.id, typePayment: item.payment_type.id})
                                            }}
                                        >
                                            <span className="typePayment">
                                                {item.payment_type.name}
                                            </span>
                                        </td>
                                        <td>{item.day}</td>
                                        <td>
                                            <span
                                                onClick={() => {
                                                    changeModal("deletePayment")
                                                    setChangingData({id:item.id,msg: "Oylikni ochirishni hohlaysizmi"})
                                                }}
                                                key={index}
                                                className="delete"
                                            >
                                                <i className="fas fa-times"/>
                                            </span>
                                        </td>


                                    </tr>
                                )
                            })
                        }


                    </Table>



                </main>

                <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                    <CheckPassword/>
                </Modal>
                {
                    activeChangeModalName === "payment" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <PaymentModal
                                setActiveChangeModal={setActiveChangeModal}
                                money={monthBooksAcc?.month_balance?.exist_money}
                                monthId={monthId}
                            />
                        </Modal>
                    : activeChangeModalName === "changeTypePayment" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <div className="changeTypePayment">
                                <Select
                                    group={true}
                                    options={dataToChange.payment_types}
                                    name={""}
                                    title={"Payment turi"}
                                    onChangeOption={changePaymentTypeData}
                                    id={changingData.id}
                                    defaultValue={changingData.typePayment}
                                />
                            </div>
                        </Modal>
                    : activeChangeModalName === "deletePayment" && isCheckedPassword ?
                        <>
                            <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                                <Confirm setActive={setActiveChangeModal} text={changingData.msg} getConfirm={setIsConfirm}/>
                            </Modal>
                            {
                                isConfirm === "yes" ?
                                    <Modal
                                        activeModal={activeChangeModal}
                                        setActiveModal={() => {
                                            setActiveChangeModal(false)
                                            setIsConfirm(false)
                                        }}
                                    >
                                        <ConfimReason getConfirm={deleteSalary} reason={true}/>
                                    </Modal> : null
                            }
                        </> : null
                }
            </div>
        </>

    );
};


const PaymentModal = ({monthId, money, setActiveChangeModal}) => {

    const {dataToChange} = useSelector(state => state.dataToChange)

    const {
        register,
        formState: {
            errors,
            isValid,
            isDirty
        },
        handleSubmit,
        reset,
    } = useForm({
        mode: "onBlur"
    })


    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmit = (data) => {
        const newData = {
            ...data,
        }
        request(`${BackUrl}campus_money/${monthId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    reset()
                    setActiveChangeModal(false)
                    const data = {
                        monthId
                    }
                    dispatch(fetchMonthBooksAcc(data))
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
        <div className="paymentModal">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <h1>Pul</h1>
                <div>
                    {renderedPaymentTypes}
                </div>
                <label htmlFor="reason">
                    <div>
                        <span className="name-field">Sabab</span>
                        <input
                            defaultValue={""}
                            id="reason"
                            className="input-fields"
                            {...register("reason", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                    </div>
                    {
                        errors?.reason &&
                        <span className="error-field">
                            {errors?.reason?.message}
                        </span>
                    }
                </label>
                <label htmlFor="payment">
                    <div>
                        <span className="name-field">To'lov miqdori</span>
                        <input
                            defaultValue={""}
                            id="payment"
                            type="number"
                            className="input-fields"
                            {...register("payment", {
                                required: "Iltimos to'ldiring",
                                max: {
                                    value: money,
                                    message: `${money} dan ko'p pul kiritish mumkin emas`
                                },
                                min: {
                                    value: 0,
                                    message: `0 dan kam pul kiritish mumkin emas`
                                }
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

                <input disabled={!isDirty || !isValid} className="input-submit" type="submit" value="Tasdiqlash"/>

            </form>
        </div>
    )
}

export default MonthAccountingBook;