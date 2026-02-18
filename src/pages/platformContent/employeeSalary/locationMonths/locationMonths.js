import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, useParams } from "react-router-dom";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import { useDispatch, useSelector } from "react-redux";


import "./locationMonths.sass"
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import { useForm } from "react-hook-form";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers, ROLES } from "constants/global";
import { fetchDataToChange } from "slices/dataToChangeSlice";
import { fetchEmployeeSalaryMonth, changePaymentType, fetchDeletedEmployeeSalaryMonth } from "slices/teacherSalarySlice";
import Button from "components/platform/platformUI/button";
import LocationMoneys from "pages/platformContent/platformAccounting/locationMoneys/locationMoneys";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import { useAuth } from "hooks/useAuth";
import Select from "components/platform/platformUI/select";

const LocationMonths = () => {

    const { monthId, userId } = useParams()
    const dispatch = useDispatch()
    const { role } = useAuth()

    const { selectedMonth, fetchEmployeeSalaryStatus } = useSelector(state => state.teacherSalary)
    const { isCheckedPassword } = useSelector(state => state.me)

    const [activeDelete, setActiveDelete] = useState(false)
    const [activeFineReport, setActiveFineReport] = useState(false)
    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)

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
    }, [activeDelete, dispatch, monthId, userId])


    const { selectedLocation } = useAuth()

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    }, [selectedLocation])


    const activeItems = useMemo(() => {
        if (activeFineReport) {
            return {
                date: true,
                salary: true,
                // payment_type: !role.includes(ROLES.Teacher),
                // paymentTypeForTeacher: role.includes(ROLES.Teacher),
                // delete: !activeDelete && !role.includes(ROLES.Teacher),
                reason: true
            }
        } else {
            return {
                date: true,
                salary: true,
                payment_type: !role.includes(ROLES.Teacher),
                paymentTypeForTeacher: role.includes(ROLES.Teacher),
                delete: !activeDelete && !role.includes(ROLES.Teacher),
                reason: true
            }
        }
    }, [activeFineReport, activeDelete, role])



    const deleteSalary = (data) => {
        const { id } = data
        request(`${BackUrl}account/delete_salary_teacher/${id}/${userId}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                if (res.success) {
                    const data = {
                        userId,
                        monthId
                    }
                    dispatch(fetchEmployeeSalaryMonth(data))
                }
            })
    }

    const changePaymentTypeData = (id, value) => {
        request(`${BackUrl}account/change_teacher_salary/${id}/${value}/${userId}`, "GET", null, headers())
            .then(res => {
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
    }, [activeChangeModalName, isCheckedPassword])

    const { request } = useHttp()



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
                        <h1>Qarz: {selectedMonth?.salary_debt}</h1>
                        <h1>Jarima: -{selectedMonth?.total_fine}</h1>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "10px" }}>
                        <RequireAuthChildren allowedRules={[ROLES.Admin]}>
                            <div
                                onClick={() => changeModal("fine")}
                                className="payment"
                                style={{ marginRight: "10px" }}
                            >
                                <i className="fas fa-minus-circle" />
                            </div>
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
                        <Button
                            active={activeDelete}
                            onClickBtn={() => {
                                setActiveDelete(!activeDelete)
                                setActiveFineReport(false)
                            }}
                        >
                            O'chirilgan oyliklar
                        </Button>
                        <Button
                            active={activeFineReport}
                            onClickBtn={() => {
                                setActiveFineReport(!activeFineReport)
                                setActiveDelete(false)
                            }}
                        >
                            Jarima hisoboti
                        </Button>
                    </RequireAuthChildren>
                </div>
                <main>
                    <AccountingTable
                        funcSlice={funcSlice}
                        typeOfMoney={"teacherLocSalary"}
                        users={activeFineReport
                            ? selectedMonth?.fine_report
                            : selectedMonth?.data
                        }
                        activeRowsInTable={activeItems}
                        fetchUsersStatus={fetchEmployeeSalaryStatus}
                    />
                </main>

                <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                    <CheckPassword />
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
                        : null
                }
                {
                    activeChangeModalName === "fine" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <FineModal
                                setActiveChangeModal={setActiveChangeModal}
                                userId={userId}
                                monthId={monthId}
                            />
                        </Modal>
                        : null
                }
            </div>
        </>

    );
};



const PaymentModal = ({ monthId, salary, setActiveChangeModal, userId }) => {

    const { dataToChange } = useSelector(state => state.dataToChange)
    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)


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


    const { request } = useHttp()
    const dispatch = useDispatch()

    const onSubmit = (data) => {

        const newData = {
            ...data,
            month,
            day
        }


        request(`${BackUrl}account/salary_give_teacher/${monthId}/${userId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
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
    }, [dataToChange, register])


    const renderDate = useCallback(() => {
        return dataToChange?.data_days?.map((item, index) => {
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
    }, [dataToChange?.data_days, month, day])


    const renderedDays = renderDate()

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

                {
                    dataToChange?.data_days?.length >= 2 ?
                        <Select
                            name={"month"}
                            title={"Oy"}
                            defaultValue={month}
                            onChangeOption={setMonth}
                            options={dataToChange?.data_days}
                        /> :
                        null
                }

                {renderedDays}

                <input disabled={!isDirty || !isValid} className="input-submit" type="submit" value="Tasdiqlash" />

            </form>
        </div>
    )
}

const FineModal = ({ monthId, setActiveChangeModal, userId }) => {
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

    const { request } = useHttp()
    const dispatch = useDispatch()

    const onSubmit = (data) => {
        const newData = {
            sum_fine: data.sum_fine,
            reason: data.reason,
            salary_id: monthId,
            // user_id: userId
        }

        // console.log("Fine Data prepared:", newData);

        // Placeholder request as user said they will insert the endpoint
        request(`${BackUrl}account/refresh_salary/${userId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.status) {
                    reset()
                    setActiveChangeModal(false)
                    const data = {
                        userId,
                        monthId
                    }
                    dispatch(fetchEmployeeSalaryMonth(data))
                }
            })

        // For now just close the modal to simulate success
        setActiveChangeModal(false)
        reset()
    }

    return (
        <div className="paymentModal">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <h1>Jarima olib tashlash</h1>

                <label htmlFor="sum_fine">
                    <div>
                        <span className="name-field">Miqdor</span>
                        <input
                            defaultValue={""}
                            id="sum_fine"
                            type="number"
                            className="input-fields"
                            {...register("sum_fine", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                    </div>
                    {
                        errors?.sum_fine &&
                        <span className="error-field">
                            {errors?.sum_fine?.message}
                        </span>
                    }
                </label>

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

                <input disabled={!isDirty || !isValid} className="input-submit" type="submit" value="Tasdiqlash" />
            </form>
        </div>
    )
}

const FineReportModal = ({ fineReport, setActiveChangeModal }) => {
    return (
        <div className="paymentModal" style={{ width: "600px" }}>
            <h1>Jarima hisoboti</h1>
            <div style={{ overflowY: "auto", maxHeight: "400px", width: "100%", marginTop: "20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #ccc" }}>
                            <th style={{ padding: "10px" }}>ID</th>
                            <th style={{ padding: "10px" }}>Miqdor</th>
                            <th style={{ padding: "10px" }}>Sabab</th>
                            <th style={{ padding: "10px" }}>Sana</th>
                            <th style={{ padding: "10px" }}>Turi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fineReport?.length > 0 ? (
                            fineReport.map((item) => (
                                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "10px" }}>{item.id}</td>
                                    <td style={{ padding: "10px" }}>{item.amount}</td>
                                    <td style={{ padding: "10px" }}>{item.reason}</td>
                                    <td style={{ padding: "10px" }}>{item.date}</td>
                                    <td style={{ padding: "10px" }}>{item.type_name}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ padding: "20px", textAlign: "center" }}>Ma'lumot mavjud emas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LocationMonths;