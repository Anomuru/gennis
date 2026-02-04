import { useSelector } from "react-redux";
import { newAccountingSelectOptionValue } from "../model/accountingSelector";
import React, { useState } from "react";
import cls from "pages/platformContent/platformAccounting2.0/accountingTable/accountingTable.module.sass";
import { useNavigate } from "react-router-dom";

export const RenderTd = ({ item, index, setConfirmModal, setItem, setChangeActive }) => {
    const selectOptionValue = useSelector(newAccountingSelectOptionValue)
    const formatNumber = (number) => {
        return number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }


    const navigate = useNavigate()

    switch (selectOptionValue) {

        case "bookPayment": {
            return <>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{formatNumber(item.price)}</td>
                <td>{item.date}</td>
            </>
        }

        case "debtStudents": {
            return <>
                <td>{index + 1}</td>
                <td onClick={() => navigate(`../profile/${item?.user_id || item?.id}`)}>{item?.name} {item?.surname}</td>
                <td className={cls.mono}>
                    <div className={cls.tooltipWrapper}>
                        <span className={cls.text}>
                            {item?.reason?.length > 20
                                ? item.reason.slice(0, 20) + "..."
                                : item.reason}
                        </span>
                        {item?.reason?.length > 20 && (
                            <span className={cls.tooltip}>{item.reason}</span>
                        )}
                    </div>
                </td>
                <td className={cls.muted}>{item?.date}</td>
                <td>
                    {item?.phone}
                </td>
                <td>
                    <div className={cls.debtStudent} style={{ boxShadow: `0 0 8px 2px ${item?.moneyType}` }}>
                        {formatNumber(item?.balance)}
                    </div>
                </td>
            </>
        }

        case "prepayment": {
            return <>
                <td>{index + 1}</td>
                <td onClick={() => navigate(`../profile/${item?.user_id || item?.id}`)}>{item?.name} {item?.surname}</td>
                {/* <td className={cls.mono}>
                    <div className={cls.tooltipWrapper}>
                        <span className={cls.text}>
                            {item?.reason?.length > 20
                                ? item.reason.slice(0, 20) + "..."
                                : item.reason}
                        </span>
                        {item?.reason?.length > 20 && (
                            <span className={cls.tooltip}>{item.reason}</span>
                        )}
                    </div>
                </td> */}
                {/* <td className={cls.muted}>{item?.date}</td> */}
                <td>
                    {item?.phone}
                </td>
                <td>
                    <div className={cls.debtStudent} style={{ boxShadow: `0 0 8px 2px ${item?.moneyType}` }}>
                        {formatNumber(item?.balance)}
                    </div>
                </td>
            </>
        }

        case "overhead": {
            return <>
                <td>{index + 1}</td>
                <td>{item?.name}</td>
                <td className={cls.mono}>{formatNumber(item?.price)}</td>
                <td className={cls.muted}>{item?.date}</td>
                <td>
                    <button onClick={() => {
                        setChangeActive(true)
                        setItem(item)
                    }} className={cls.paymentType}>
                        {item?.typePayment}
                    </button>
                </td>
                <td>
                    <button
                        onClick={() => {
                            setConfirmModal(true)
                            setItem(item)
                        }}
                        className={cls.deleteBtn}
                    >
                        {/*<X />*/}x
                    </button>
                </td>
            </>
        }

        case "dividends": {
            return <>
                <td>{index + 1}</td>
                <td>{item.amount}</td>
                {/*<td className={cls.mono}>{formatNumber(item?.price)}</td>*/}
                <td className={cls.muted}>{item?.date}</td>
                {/*<td>*/}
                {/*    <button className={cls.paymentType}>*/}
                {/*        {item?.payment_type?.name}*/}
                {/*    </button>*/}
                {/*</td>*/}
                <td>
                    {item?.location}
                </td>
            </>
        }

        case "investments": {
            return <>
                <td>{index + 1}</td>
                <td>{item?.name}</td>
                <td className={cls.mono}>{formatNumber(item?.price)}</td>
                <td className={cls.muted}>{item?.date}</td>
                <td>
                    <button className={cls.paymentType}>
                        {item?.typePayment}
                    </button>
                </td>
                <td>
                    <button
                        // onClick={() => handleDelete(payment.id)}
                        className={cls.deleteBtn}
                    >
                        {/*<X />*/}x
                    </button>
                </td>
            </>
        }

        case "studentsPayments": {
            return <>
                <td>{index + 1}</td>
                <td onClick={() => navigate(`../profile/${item?.user_id}`)}>{item?.name}</td>
                <td>{item?.surname}</td>
                <td className={cls.mono}>{formatNumber(item?.payment)}</td>
                <td className={cls.muted}>{item?.date}</td>
                <td>
                    <button onClick={() => {
                        setChangeActive(true)
                        setItem(item)
                    }} className={cls.paymentType}>
                        {item?.typePayment}
                    </button>
                </td>
                <td>
                    <button
                        onClick={() => {
                            setConfirmModal(true)
                            setItem(item)
                        }}
                        className={cls.deleteBtn}
                    >
                        {/*<X />*/}x
                    </button>
                </td>
            </>
        }

        case "teachersSalary": {
            return <>
                <td>{index + 1}</td>
                <td onClick={() => navigate(`../profile/${item?.user_id}`)}>{item?.name}</td>
                <td>{item?.surname}</td>
                <td className={cls.mono}>{formatNumber(item?.salary)}</td>
                <td className={cls.muted}>{item?.date}</td>
                <td>
                    <button onClick={() => {
                        setChangeActive(true)
                        setItem(item)
                    }} className={cls.paymentType}>
                        {item?.typePayment}
                    </button>
                </td>
                <td>
                    <button
                        onClick={() => {
                            setConfirmModal(true)
                            setItem(item)
                        }}
                        className={cls.deleteBtn}
                    >
                        {/*<X />*/}x
                    </button>
                </td>
            </>
        }
        case "studentsDiscounts": {
            return <>
                <td>{index + 1}</td>
                <td onClick={() => navigate(`../profile/${item?.user_id}`)}>{item?.name}</td>
                <td>{item?.surname}</td>
                <td className={cls.mono}>{formatNumber(item?.payment)}</td>
                <td className={cls.muted}>{item?.date}</td>
                <td>
                    <button
                        onClick={() => {
                            setConfirmModal(true)
                            setItem(item)
                        }}
                        className={cls.deleteBtn}
                    >
                        {/*<X />*/}x
                    </button>
                </td>
            </>
        }

        case "employeesSalary": {
            return <>
                <td>{index + 1}</td>
                <td onClick={() => navigate(`../profile/${item?.user_id}`)}>{item?.name}</td>
                <td>{item?.surname}</td>
                <td className={cls.mono}>{formatNumber(item?.salary)}</td>
                <td className={cls.muted}>{item?.date}</td>
                <td>
                    <button onClick={() => {
                        setChangeActive(true)
                        setItem(item)
                    }} className={cls.paymentType}>
                        {item?.typePayment}
                    </button>
                </td>
                <td>
                    <button
                        onClick={() => {
                            setConfirmModal(true)
                            setItem(item)
                        }}
                        className={cls.deleteBtn}
                    >
                        {/*<X />*/}x
                    </button>
                </td>
            </>
        }

        case "capital": {
            return <>
                <td>{index + 1}</td>
                <td>{item?.name}</td>
                <td className={cls.mono}>{formatNumber(item?.price)}</td>
                <td className={cls.muted}>{item?.date}</td>
                <td>
                    <button onClick={() => {
                        setChangeActive(true)
                        setItem(item)
                    }} className={cls.paymentType}>
                        {item?.typePayment}
                    </button>
                </td>
                <td>
                    <button
                        onClick={() => {
                            setConfirmModal(true)
                            setItem(item)
                        }}
                        className={cls.deleteBtn}
                    >
                        {/*<X />*/}x
                    </button>
                </td>
            </>
        }
    }
}