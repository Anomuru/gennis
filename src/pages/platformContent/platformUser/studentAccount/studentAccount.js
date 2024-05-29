import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import classNames from "classnames";
import "./studentAccount.sass"
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import {changePaymentType,fetchStudentAccData,deletePayment} from "slices/studentAccountSlice";
import BackButton from "components/platform/platformUI/backButton/backButton";
import {setMessage} from "slices/messageSlice";

const StudentAccount = () => {
    const {studentId} = useParams()
    const {data} = useSelector(state => state.studentAccount)

    const [activeDays,setActiveDays] = useState("debt")

    const dispatch = useDispatch()

    useEffect(() => {

        dispatch(fetchStudentAccData(studentId))
    },[studentId])

    
    const activeRowsInTableDebt = {
        groupSubject: true,
        days: true,
        absent: true,
        present: true,
        discount: true,
        payment: true,
        month: true,
        remaining_debt: true,
        total_debt: true
    }

    let activeRowsInTablePayment = {
        payment: true,
        date: true,
        payment_type: true,
        delete: true
    }

    let activeRowsInTableBook = {
        payment: true,
        date: true
    }

    const {request} = useHttp()

    const onDelete = (data) => {
        dispatch(deletePayment({data}))
        const {id} = data
        request(`${BackUrl}delete_payment/${id}`, "POST", JSON.stringify(data),headers())
            .then( res => {
                if (res.success) {
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

    const changePaymentTypeData = (id,value) => {
        request(`${BackUrl}change_teacher_salary/${id}/${value}/${studentId}`,"GET",null,headers())
            .then( res => {
                if (res.success) {
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


    const funcSlice = {
        onDelete,
        changePaymentTypeData,
        changePaymentType
    }


    return (
        <div className="studentAcc">
            <header>
                <BackButton/>
            </header>
            <main>
                <h1 className="studentAcc__title">{data.name} attendance Hamma bali: {data.totalBall}</h1>
                <div className="studentAcc__btns">
                    <div
                        onClick={() => setActiveDays("debt")}
                        className={classNames("studentAcc__btns-item",{
                            active: activeDays === "debt"
                        })}
                    >
                        Qarzlar
                    </div>
                    <div
                        onClick={() => setActiveDays("payment")}
                        className={classNames("studentAcc__btns-item",{
                            active: activeDays === "payment"
                        })}
                    >
                        To'lovlar
                    </div>
                    <div
                        onClick={() => setActiveDays("discount")}
                        className={classNames("studentAcc__btns-item",{
                            active: activeDays === "discount"
                        })}
                    >
                        Chegirmalar
                    </div>
                    <div
                        onClick={() => setActiveDays("bookPayment")}
                        className={classNames("studentAcc__btns-item",{
                            active: activeDays === "bookPayment"
                        })}
                    >
                        Kitob to'lovlari
                    </div>
                </div>

                <div className="studentAcc__container">
                    {
                        activeDays === "debt" ?
                                <AccountingTable
                                    typeOfMoney={"studentDebt"}
                                    activeRowsInTable={activeRowsInTableDebt}
                                    funcSlice={funcSlice}
                                    users={data.debts}
                                />
                            : activeDays === "payment" ?
                                <AccountingTable
                                    typeOfMoney={"studentPayment"}
                                    activeRowsInTable={activeRowsInTablePayment}
                                    funcSlice={funcSlice}
                                    users={data.payments}
                                />
                            : activeDays === "bookPayment" ?
                                <AccountingTable
                                    typeOfMoney={"studentBookPayment"}
                                    activeRowsInTable={activeRowsInTableBook}
                                    funcSlice={funcSlice}
                                    users={data.bookPayments}
                                />
                            :
                                <AccountingTable
                                    typeOfMoney={"studentDiscount"}
                                    activeRowsInTable={activeRowsInTablePayment}
                                    funcSlice={funcSlice}
                                    users={data.discounts}
                                />
                    }
                </div>
            </main>

        </div>
    );
};

export default StudentAccount;