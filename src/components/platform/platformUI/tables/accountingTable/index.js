import Select from "components/platform/platformUI/select";
import React, {useCallback, useEffect, useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";


import "../tables.sass"
import {changePaymentType, deleteAccData, deleteAccDataItem} from "slices/accountingSlice";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Confirm from "components/platform/platformModals/confirm/confirm";
import {useNavigate} from "react-router-dom";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import {Logger} from "sass";


const AccountingTable = React.memo(({
                                        funcSlice,
                                        sum,
                                        typeOfMoney,
                                        users = [],
                                        activeRowsInTable,
                                        fetchUsersStatus,
                                        extraInfo,
                                        cache
                                    }) => {

    const {isCheckedPassword} = useSelector(state => state.me)

    const [usersList, setUsersList] = useState([])
    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [changingData, setChangingData] = useState({})
    const [isConfirm, setIsConfirm] = useState(false)


    useEffect(() => {
        setUsersList(users)
    }, [users])

    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    }, [activeChangeModalName, isCheckedPassword])


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const options = [
        {
            value: "cash",
            name: "Cash"
        },
        {
            value: "bank",
            name: "Bank"
        },
        {
            value: "click",
            name: "Click"
        }
    ]


    const dispatch = useDispatch()


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }


    const LinkToUser = (e, id) => {
        if (cache) {
            if (
                e.target.type !== "checkbox" &&
                !e.target.classList.contains("delete") &&
                !e.target.classList.contains("fa-times") &&
                !e.target.classList.contains("typePayment")
            ) {
                navigate(`../profile/${id}`)
            }
        } else {
            if (
                e.target.type !== "checkbox" &&
                !e.target.classList.contains("delete") &&
                !e.target.classList.contains("fa-times") &&
                !e.target.classList.contains("typePayment")
            ) {
                navigate(`../../profile/${id}`)
            }
        }
    }

    const navigate = useNavigate()

    const LinkToMonthTeacher = (id) => {
        navigate(`../../employeeMonthSalary/${id}/${extraInfo?.userId}`)
    }

    const LinkToMonthBook = (id) => {
        navigate(`../monthAccountingBook/${id}`)
    }

    const getConfirmDelete = (data) => {


        const newData = {
            id: changingData.id,
            userId: changingData.userId,
            type: changingData.type,
            ...data
        }

        funcSlice?.onDelete(newData)
        setActiveChangeModal(false)

    }


    const changePayment = (id, value) => {
        if (funcSlice?.changePaymentType) {
            dispatch(funcSlice?.changePaymentType({id: id, typePayment: value}))
        }
        funcSlice?.changePaymentTypeData(id, value, changingData.userId)
        setActiveChangeModal(false)
    }


    const renderElements = useCallback(() => {
        return usersList?.map((item, index) => {
            if (typeOfMoney === 'user') {
                return (
                    <tr key={index} onClick={e => LinkToUser(e, item.user_id ? item.user_id : item.id)}>
                        <td>{index + 1}</td>
                        {activeRowsInTable.name ? <td>{item.name}</td> : null}
                        {activeRowsInTable.surname ? <td>{item.surname}</td> : null}
                        {activeRowsInTable.payment ? <td>{item.payment}</td> : null}
                        {activeRowsInTable.salary ? <td>{item.salary}</td> : null}
                        {activeRowsInTable.reason ?
                            <td>
                                {item.reason?.substring(0, 15)}
                                <div className="popup">
                                    {item.reason}
                                </div>
                            </td>
                            : null
                        }
                        {activeRowsInTable.month ? <td>{item.month}</td> : null}
                        {activeRowsInTable.discount ? <td>{item.discount}</td> : null}
                        {activeRowsInTable.date ? <td>{item.date}</td> : null}
                        {activeRowsInTable.phone ? <td>{item.phone}</td> : null}
                        {
                            activeRowsInTable.debts ?
                                <td>
                                   <span
                                       className={`money ${item.moneyType}`}
                                   >
                                        {item.balance}
                                    </span>

                                </td> : null
                        }
                        {
                            activeRowsInTable.job ?
                                <td>
                                    <span
                                        className="typePayment"
                                    >
                                        {item.job}
                                    </span>
                                </td> : null
                        }
                        {
                            activeRowsInTable.typePayment ?
                                <td
                                    onClick={() => {

                                        changeModal("changeTypePayment")
                                        setChangingData({
                                            id: item.id,
                                            typePayment: item.typePayment,
                                            userId: item.user_id,
                                        })

                                    }}
                                >
                                    <span
                                        className="typePayment"
                                    >
                                        {item.typePayment}
                                    </span>
                                </td> : null
                        }
                        {
                            activeRowsInTable.delete ?
                                <td>
                                    <span
                                        onClick={() => {
                                            changeModal("deletePayment")
                                            setChangingData({
                                                id: item.id,
                                                userId: item.user_id,
                                                type: "payments",
                                                msg: "Tolovni ochirishni hohlaysizmi"
                                            })
                                        }}
                                        key={index}
                                        className="delete"
                                    >
                                        <i className="fas fa-times"/>
                                    </span>
                                </td> : null
                        }
                        {
                            activeRowsInTable.deleteDebt ?
                                item.isNotDelete ?
                                    <td>
                                        <span
                                            onClick={() => {
                                                changeModal("deletePayment")
                                                setChangingData({
                                                    id: item.id,
                                                    userId: item.user_id,
                                                    msg: "Qarzni ochirishni hohlaysizmi"
                                                })
                                            }}
                                            key={index}
                                            className="delete"
                                        >
                                            <i className="fas fa-times"/>
                                        </span>
                                    </td> : null : null
                        }
                    </tr>
                )
            } else if (typeOfMoney === 'teacher') {
                return (
                    <tr key={index} onClick={() => LinkToMonthTeacher(item.id)}>
                        <td>{index + 1}</td>
                        {activeRowsInTable.date ? <td>{item.date}</td> : null}
                        {activeRowsInTable.salary ? <td>{item.salary}</td> : null}
                        {activeRowsInTable.residue ? <td>{item.residue}</td> : null}
                        {activeRowsInTable.taken_salary ? <td>{item.taken_salary}</td> : null}
                        {activeRowsInTable.black_salary ? <td>{item.black_salary}</td> : null}
                    </tr>
                )
            } else if (typeOfMoney === 'book') {
                return (
                    <tr key={index} onClick={() => LinkToMonthBook(item.id)}>
                        <td>{index + 1}</td>
                        {activeRowsInTable.month ? <td>{item.month}</td> : null}
                        {activeRowsInTable.total_money ? <td>{item.total_money}</td> : null}
                        {activeRowsInTable.taken_money ? <td>{item.taken_money}</td> : null}
                        {activeRowsInTable.exist ? <td>{item.exist_money}</td> : null}
                    </tr>
                )
            } else if (typeOfMoney === 'teacherLocSalary') {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        {activeRowsInTable.salary ? <td>{item.salary}</td> : null}
                        {activeRowsInTable.reason ? <td>{item.reason}</td> : null}
                        {
                            activeRowsInTable.payment_type ?
                                <td
                                    onClick={() => {
                                        if (item.payment_type) {
                                            changeModal("changeTypePayment")
                                            setChangingData({id: item.id, typePayment: item.payment_type})
                                        }
                                    }}
                                >
                                    {
                                        item.payment_type ?
                                            <span
                                                className="typePayment"
                                            >
                                                {item.payment_type}
                                            </span> : null
                                    }

                                </td>
                                : null
                        }
                        {
                            activeRowsInTable.paymentTypeForTeacher ?
                                <td>
                                    <span
                                        className="typePayment"
                                    >
                                        {item.payment_type}
                                    </span>

                                </td>
                                : null
                        }
                        {activeRowsInTable.date ? <td>{item.date}</td> : null}
                        {
                            activeRowsInTable.delete ?
                                <td>
                                    {
                                        !item.status ?
                                            <span
                                                onClick={() => {
                                                    changeModal("deletePayment")
                                                    setChangingData({
                                                        id: item.id,
                                                        msg: "Oylikni ochirishni hohlaysizmi"
                                                    })
                                                }}
                                                key={index}
                                                className="delete"
                                            >
                                            <i className="fas fa-times"/>
                                        </span> : null
                                    }
                                </td> : null
                        }

                    </tr>
                )
            } else if (typeOfMoney === 'studentDebt') {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        {activeRowsInTable.groupSubject ? <td>{item.group_name}</td> : null}
                        {activeRowsInTable.days ? <td>{item.days}</td> : null}
                        {activeRowsInTable.absent ? <td>{item.absent}</td> : null}
                        {activeRowsInTable.present ? <td>{item.present}</td> : null}
                        {activeRowsInTable.discount ? <td>{item.discount}</td> : null}
                        {activeRowsInTable.payment ? <td>{item.payment}</td> : null}
                        {activeRowsInTable.month ? <td>{item.month}</td> : null}
                        {activeRowsInTable.remaining_debt ? <td>{item.remaining_debt}</td> : null}
                        {activeRowsInTable.total_debt ? <td>{item.total_debt}</td> : null}
                    </tr>
                )
            } else if (typeOfMoney === 'studentPayment') {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        {activeRowsInTable.payment ? <td>{item.payment}</td> : null}
                        {activeRowsInTable.date ? <td>{item.date}</td> : null}
                        {
                            activeRowsInTable.payment_type ?
                                <td
                                    onClick={() => {
                                        changeModal("changeTypePayment")
                                        setChangingData({id: item.id, typePayment: item.type_payment})
                                    }}
                                >
                                    <span
                                        className="typePayment"
                                    >
                                        {item.type_payment}
                                    </span>

                                </td> : null
                        }
                        {
                            activeRowsInTable.delete ?
                                <td>
                                    <span
                                        onClick={() => {
                                            changeModal("deletePayment")
                                            setChangingData({
                                                id: item.id,
                                                type: "payments",
                                                msg: "Tolovni ochirishni hohlaysizmi"
                                            })
                                        }}
                                        key={index}
                                        className="delete"
                                    >
                                        <i className="fas fa-times"/>
                                    </span>
                                </td> : null
                        }
                    </tr>
                )
            }
                // else if (typeOfMoney === 'studentBookPayment') {
                //     return (
                //         <tr key={index} >
                //             <td>{index + 1}</td>
                //             {activeRowsInTable.payment ? <td>{item.payment}</td> : null}
                //             {activeRowsInTable.price ? <td>{item.price}</td> : null}
                //             {activeRowsInTable.date ? <td>{item.date}</td> : null}
                //             {
                //                 activeRowsInTable.delete ?
                //                     <td >
                //                         <span
                //                             onClick={() => {
                //                                 changeModal("deletePayment")
                //                                 setChangingData({
                //                                     id: item.id,
                //                                     type: "bookPayment",
                //                                     msg: "Kitob Tolovini o'chirishni hohlaysizmi"
                //                                 })
                //                             }}
                //                             key={index}
                //                             className="delete"
                //                         >
                //                             <i className="fas fa-times"/>
                //                         </span>
                //                     </td> : null
                //             }
                //         </tr>
                //     )
            // }
            else if (typeOfMoney === 'studentDiscount') {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        {activeRowsInTable.payment ? <td>{item.payment}</td> : null}
                        {activeRowsInTable.date ? <td>{item.date}</td> : null}
                        {
                            activeRowsInTable.delete ?
                                <td>
                                    <span
                                        onClick={() => {
                                            changeModal("deletePayment")
                                            setChangingData({
                                                id: item.id,
                                                type: "discounts",
                                                msg: "Tolovni ochirishni hohlaysizmi"
                                            })
                                        }}
                                        key={index}
                                        className="delete"
                                    >
                                        <i className="fas fa-times"/>
                                    </span>
                                </td> : null
                        }
                    </tr>
                )
            } else {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        {activeRowsInTable.month ? <td>{item.month}</td> : null}
                        {activeRowsInTable.income ? <td>{item.income}</td> : null}
                        {activeRowsInTable.old_cash ? <td>{item.old_cash}</td> : null}
                        {activeRowsInTable.current_cash ? <td>{item.current_cash}</td> : null}
                        {activeRowsInTable.discount ? <td>{item.discount}</td> : null}
                        {activeRowsInTable.charity ? <td>{item.charity}</td> : null}
                        {activeRowsInTable.paymentStudents ? <td>{item.paymentStudents}</td> : null}
                        {activeRowsInTable.debts ? <td>{item.debts}</td> : null}
                        {activeRowsInTable.teacherSalary ? <td>{item.teacherSalary}</td> : null}
                        {activeRowsInTable.employeesSalary ? <td>{item.employeesSalary}</td> : null}
                        {activeRowsInTable.overheads ? <td>{item.overheads}</td> : null}
                        {activeRowsInTable.capitalExpenditures ? <td>{item.capitalExpenditures}</td> : null}
                        {activeRowsInTable.allBenefits ? <td>{item.allBenefits}</td> : null}
                        {activeRowsInTable.name ? <td>{item.name}</td> : null}
                        {activeRowsInTable.price ? <td>{item.price}</td> : null}
                        {activeRowsInTable.payment ? <td>{item.payment}</td> : null}
                        {activeRowsInTable.date ? <td>{item.date}</td> : null}

                        {activeRowsInTable.type ? <td>{item.type}</td> : null}
                        {
                            activeRowsInTable.typePayment ?
                                <td
                                    onClick={() => {

                                        if (item.type !== "book" && activeRowsInTable.delete) {
                                            setChangingData({id: item.id, typePayment: item.typePayment})
                                            changeModal("changeTypePayment")
                                        }
                                    }}
                                >
                                    <span
                                        className="typePayment"
                                    >
                                        {item.typePayment}
                                    </span>

                                </td> : null
                        }
                        {
                            activeRowsInTable.delete && item.type !== "book" ?
                                <td>
                                    <span
                                        onClick={() => {
                                            changeModal("deletePayment")
                                            setChangingData({id: item.id, msg: "Buyumni ochirishni hohlaysizmi"})
                                        }}
                                        key={index}
                                        className="delete"
                                    >
                                        <i className="fas fa-times"/>
                                    </span>
                                </td> : null
                        }
                        {
                            activeRowsInTable.update ?
                                <td>
                                    <span
                                        onClick={() => {
                                            funcSlice.updateData(item.period_id)
                                        }}
                                        key={index}
                                        className="update"
                                    >
                                        Yangilash
                                    </span>
                                </td> : null
                        }
                    </tr>
                )
            }
        })
    }, [activeRowsInTable, changeModal, options, typeOfMoney, usersList, funcSlice])


    const renderedUsers = renderElements()

    if (fetchUsersStatus === "loading") {
        return <DefaultLoader/>
    } else if (fetchUsersStatus === "error") {
        console.log('error')
    }


    return (
        <div className="tableBox">
            <table>
                <caption>
                    {sum?.toLocaleString()}
                </caption>
                <thead>
                {
                    typeOfMoney === "user" ?
                        <tr className="tbody_th" key={1000000}>
                            <th/>
                            {activeRowsInTable.name ? <th>Ism</th> : null}
                            {activeRowsInTable.surname ? <th>Familya</th> : null}
                            {activeRowsInTable.payment ? <th>To'lov</th> : null}
                            {activeRowsInTable.salary ? <th>Oylik</th> : null}
                            {activeRowsInTable.reason ? <th>Sabab</th> : null}
                            {activeRowsInTable.month ? <th>Oy</th> : null}
                            {activeRowsInTable.discount ? <th>Chegirma</th> : null}
                            {activeRowsInTable.date ? <th>Sana</th> : null}
                            {activeRowsInTable.phone ? <th>Tel</th> : null}
                            {activeRowsInTable.debts ? <th>Qarz</th> : null}
                            {activeRowsInTable.job ? <th>Kasb</th> : null}
                            {activeRowsInTable.typePayment ? <th>To'lov turi</th> : null}
                            {activeRowsInTable.delete ? <th>O'chirish</th> : null}
                        </tr>
                        :
                        typeOfMoney === "teacher" ?
                            <tr className="tbody_th" key={1000000}>
                                <th/>
                                {activeRowsInTable.date ? <th>Sana</th> : null}
                                {activeRowsInTable.salary ? <th>Oylik</th> : null}
                                {activeRowsInTable.residue ? <th>Qolgan</th> : null}
                                {activeRowsInTable.taken_salary ? <th>Olingan oylik</th> : null}
                                {activeRowsInTable.black_salary ? <th>Black salary</th> : null}

                            </tr>
                            :
                            typeOfMoney === "book" ?
                                <tr className="tbody_th" key={1000000}>
                                    <th/>
                                    {activeRowsInTable.month ? <th>Sana</th> : null}
                                    {activeRowsInTable.exist ? <th>Pul</th> : null}
                                    {activeRowsInTable.taken_money ? <th>Olingan pul</th> : null}
                                    {activeRowsInTable.total_money ? <th>Qolgan pul</th> : null}
                                </tr>
                                :
                                typeOfMoney === "teacherLocSalary" ?
                                    <tr className="tbody_th" key={1000000}>
                                        <th/>
                                        {activeRowsInTable.salary ? <th>Зарплата</th> : null}
                                        {activeRowsInTable.reason ? <th>Причина</th> : null}
                                        {activeRowsInTable.payment_type ? <th>Tип</th> : null}
                                        {activeRowsInTable.date ? <th>Дата</th> : null}
                                        {activeRowsInTable.delete ? <th>Удалять</th> : null}
                                    </tr>
                                    :
                                    typeOfMoney === "studentDebt" ?
                                        <tr className="tbody_th" key={1000000}>
                                            <th/>
                                            {activeRowsInTable.groupSubject ? <th>Guruh fani</th> : null}
                                            {activeRowsInTable.days ? <th>Kunlar</th> : null}
                                            {activeRowsInTable.absent ? <th>Kemagan kunlar</th> : null}
                                            {activeRowsInTable.present ? <th>Kegan kunlar</th> : null}
                                            {activeRowsInTable.discount ? <th>Chegirma</th> : null}
                                            {activeRowsInTable.payment ? <th>Tolov</th> : null}
                                            {activeRowsInTable.month ? <th>Oy</th> : null}
                                            {activeRowsInTable.remaining_debt ? <th>Qolgan qarz</th> : null}
                                            {activeRowsInTable.total_debt ? <th>Hamma qarzi</th> : null}
                                        </tr>
                                        :
                                        typeOfMoney === "studentPayment" ?
                                            <tr className="tbody_th" key={1000000}>
                                                <th/>
                                                {activeRowsInTable.payment ? <th>To'lov</th> : null}
                                                {activeRowsInTable.date ? <th>Sana</th> : null}
                                                {activeRowsInTable.payment_type ? <th>To'lov turi</th> : null}
                                                {activeRowsInTable.delete ? <th>O'chirish</th> : null}
                                            </tr>
                                            :
                                            typeOfMoney === "studentDiscount" ?
                                                <tr className="tbody_th" key={1000000}>
                                                    <th/>
                                                    {activeRowsInTable.payment ? <th>To'lov</th> : null}
                                                    {activeRowsInTable.date ? <th>Sana</th> : null}
                                                    {activeRowsInTable.delete ? <th>O'chirish</th> : null}
                                                </tr>
                                                :
                                                <tr className="tbody_th" key={1000000}>
                                                    <th/>
                                                    {activeRowsInTable.month ? <th>Oy</th> : null}
                                                    {activeRowsInTable.income ? <th>Доход</th> : null}
                                                    {activeRowsInTable.old_cash ? <th>Oldingi summa</th> : null}
                                                    {activeRowsInTable.current_cash ? <th>Hozirgi summa</th> : null}
                                                    {activeRowsInTable.discount ? <th>Chegirma</th> : null}
                                                    {activeRowsInTable.charity ? <th>Charity</th> : null}
                                                    {activeRowsInTable.paymentStudents ?
                                                        <th>Оплата студентов </th> : null}
                                                    {activeRowsInTable.debts ? <th>Долги</th> : null}
                                                    {activeRowsInTable.teacherSalary ?
                                                        <th>O'qituvchilar oyligi</th> : null}
                                                    {activeRowsInTable.employeesSalary ?
                                                        <th>Ishchilar oyligi</th> : null}
                                                    {activeRowsInTable.overheads ?
                                                        <th>Qo'shimcha xarajatlar</th> : null}
                                                    {activeRowsInTable.capitalExpenditures ?
                                                        <th>Kapital xarajatlar</th> : null}
                                                    {activeRowsInTable.allBenefits ? <th>Все преимущества</th> : null}
                                                    {activeRowsInTable.name ? <th>Nomi</th> : null}
                                                    {activeRowsInTable.price ? <th>Narxi</th> : null}
                                                    {activeRowsInTable.payment ? <th>To'lov</th> : null}
                                                    {activeRowsInTable.date ? <th>Sana</th> : null}
                                                    {activeRowsInTable.typePayment ? <th>To'lov turi</th> : null}
                                                    {activeRowsInTable.type ? <th>Turi</th> : null}
                                                    {activeRowsInTable.delete ? <th>O'chirish</th> : null}
                                                    {activeRowsInTable.update ? <th>Yangilamoq</th> : null}
                                                </tr>
                }
                </thead>
                <tbody>
                {renderedUsers}
                </tbody>
            </table>


            <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                <CheckPassword/>
            </Modal>
            {
                activeChangeModalName === "deletePayment" && isCheckedPassword ?
                    <>
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <Confirm setActive={setActiveChangeModal} text={changingData.msg}
                                     getConfirm={setIsConfirm}/>
                        </Modal>
                        {
                            isConfirm === "yes" ?
                                <Modal
                                    activeModal={activeChangeModal}
                                    setActiveModal={() => {
                                        setActiveChangeModal(false)
                                        setIsConfirm("")
                                    }}
                                >
                                    <ConfimReason getConfirm={getConfirmDelete} reason={true}/>
                                </Modal> : null
                        }
                    </>
                    : activeChangeModalName === "changeTypePayment" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <div className="changeTypePayment">
                                <Select
                                    options={options}
                                    name={""}
                                    title={"Payment turi"}
                                    onChangeOption={changePayment}
                                    id={changingData.id}
                                    defaultValue={changingData.typePayment}
                                />
                            </div>
                        </Modal> : null
            }
        </div>
    )
        ;
})


export default AccountingTable;