import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import {useDispatch, useSelector} from "react-redux";


import "./locationMonths.sass"
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import {useForm} from "react-hook-form";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers, ROLES} from "constants/global";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {fetchEmployeeSalaryMonth, changePaymentType, fetchDeletedEmployeeSalaryMonth} from "slices/teacherSalarySlice";
import Button from "components/platform/platformUI/button";
import LocationMoneys from "pages/platformContent/platformAccounting/locationMoneys/locationMoneys";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import {useAuth} from "hooks/useAuth";

const LocationMonths = () => {

    const {monthId,userId} = useParams()
    const dispatch = useDispatch()
    const {role} = useAuth()

    const {selectedMonth,fetchEmployeeSalaryStatus} = useSelector(state => state.teacherSalary)
    const {isCheckedPassword} = useSelector(state => state.me)

    const [activeDelete,setActiveDelete] = useState(false)
    const [activeChangeModal,setActiveChangeModal] = useState(false)
    const [activeChangeModalName,setActiveChangeModalName] = useState("")
    const [activeCheckPassword,setActiveCheckPassword] = useState(false)

    useEffect(() => {
        const data = {
            monthId,
            userId
        }
        if (activeDelete) {
            dispatch(fetchDeletedEmployeeSalaryMonth(data))
        } else {
            dispatch(fetchEmployeeSalaryMonth(data))
        }
    },[activeDelete, dispatch, monthId, userId])


    const {selectedLocation} = useAuth()

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    },[selectedLocation])


    const activeItems = useMemo(()=> {
        return {
            date: true,
            salary: true,
            payment_type: !role.includes(ROLES.Teacher),
            paymentTypeForTeacher : role.includes(ROLES.Teacher),
            delete: !activeDelete && !role.includes(ROLES.Teacher),
            reason: true
        }
    },[activeDelete, role])



    const deleteSalary = (data) => {
        const {id} = data
        request(`${BackUrl}delete_salary_teacher/${id}/${userId}`,"POST",JSON.stringify(data),headers())
            .then( res => {
                if (res.success) {
                    const data = {
                        userId,
                        monthId
                    }
                    dispatch(fetchEmployeeSalaryMonth(data))
                }
            })
    }

    const changePaymentTypeData = (id,value) => {
        request(`${BackUrl}change_teacher_salary/${id}/${value}/${userId}`,"GET",null,headers())
            .then( res => {
                if (res.success) {
                    const data = {
                        userId,
                        monthId
                    }
                    dispatch(fetchEmployeeSalaryMonth(data))
                }
            })
    }


    const funcSlice = {
        onDelete: deleteSalary,
        changePaymentTypeData
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



    return (
        <>
            <div className="locationMonths">
                <header>
                    <div>
                        <h1>Oy: {selectedMonth?.month}</h1>
                        <h1>Qolgan oylik: {selectedMonth?.residue}</h1>
                        <h1>Olingan oylik: {selectedMonth?.taken_salary}</h1>
                        <h1>Black salary: {selectedMonth?.black_salary}</h1>
                    </div>
                    <div>
                        <RequireAuthChildren allowedRules={[ROLES.Admin]}>
                            <div
                                onClick={() => changeModal("payment")}
                                className="payment"
                            >
                                <i className="fas fa-dollar-sign" />
                            </div>
                        </RequireAuthChildren>

                    </div>
                </header>
                <LocationMoneys />
                <div className="subheader">
                    <RequireAuthChildren allowedRules={[ROLES.Admin]}>
                        <Button active={activeDelete} onClickBtn={() => setActiveDelete(!activeDelete)}>
                            O'chirilgan oyliklar
                        </Button>
                    </RequireAuthChildren>
                </div>
                <main>
                    <AccountingTable
                        funcSlice={funcSlice}
                        typeOfMoney={"teacherLocSalary"}
                        users={selectedMonth?.data}
                        activeRowsInTable={activeItems}
                        fetchUsersStatus={fetchEmployeeSalaryStatus}
                    />
                </main>

                <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                    <CheckPassword/>
                </Modal>
                {
                    activeChangeModalName === "payment" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <PaymentModal
                                setActiveChangeModal={setActiveChangeModal}
                                userId={userId}
                                salary={selectedMonth.exist_salary}
                                monthId={monthId}
                            />
                        </Modal>
                        :  null
                }
            </div>
        </>

    );
};



const PaymentModal = ({monthId,salary,setActiveChangeModal,userId}) => {

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


        request(`${BackUrl}salary_give_teacher/${monthId}/${userId}`,"POST",JSON.stringify(newData),headers())
            .then( res => {
                if (res.success) {
                    reset()
                    setActiveChangeModal(false)
                    const data = {
                        userId,
                        monthId
                    }
                    dispatch(fetchEmployeeSalaryMonth(data))
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
    },[dataToChange, register])

    const renderedPaymentTypes = renderPaymentType()

    return (
        <div className="paymentModal">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <h1>Oylik</h1>
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
                            {...register("reason",{
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
                            {...register("payment",{
                                required: "Iltimos to'ldiring",

                                max: {
                                    value: salary,
                                    message: `${salary} dan ko'p pul kiritish mumkin emas`
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

export default LocationMonths;