import { useSelector } from "react-redux";
import { newAccountingSelectOptionValue } from "pages/platformContent/platformAccounting2.0/model/accountingSelector";
import React from "react";

export const RenderTh = () => {
    const selectOptionValue = useSelector(newAccountingSelectOptionValue)

    switch (selectOptionValue) {
        case "bookPayment": {
            return <>
                <th>#</th>
                <th>Nomi</th>
                <th>Narxi</th>
                <th>Sana</th>
            </>
        }

        case "debtStudents": {
            return <>
                <th>#</th>
                <th>Ism Familiya</th>
                <th>Sabab</th>
                <th>Sana</th>
                <th>Tel</th>
                <th>Qarz</th>
            </>
        }

        case "prepayment": {
            return <>
                <th>#</th>
                <th>Ism Familiya</th>
                {/* <th>Sabab</th> */}
                {/* <th>Sana</th> */}
                <th>Tel</th>
                <th>Balans</th>
            </>
        }

        case "overhead": {
            return <>
                <th>#</th>
                <th>Nomi</th>
                <th>Narxi</th>
                <th>Sana</th>
                <th>To‘lov turi</th>
                <th>O‘chirish</th>
            </>
        }

        case "dividends": {
            return <>
                <th>#</th>
                <th>Amount</th>
                <th>Sana</th>
                <th>Location</th>
            </>
        }

        case "investments": {
            return <>
                <th>#</th>
                <th>Nomi</th>
                <th>To‘lov</th>
                <th>Sana</th>
                <th>To‘lov turi</th>
                <th>O‘chirish</th>
            </>
        }

        case "studentsPayments": {
            return <>
                <th>#</th>
                <th>Ism</th>
                <th>Familiya</th>
                <th>To‘lov</th>
                <th>Sana</th>
                <th>To‘lov turi</th>
                <th>O‘chirish</th>
            </>
        }

        case "teachersSalary": {
            return <>
                <th>#</th>
                <th>Ism</th>
                <th>Familiya</th>
                <th>To‘lov</th>
                <th>Sana</th>
                <th>To‘lov turi</th>
                <th>O‘chirish</th>
            </>
        }
        case "studentsDiscounts": {
            return <>
                <th>#</th>
                <th>Ism</th>
                <th>Familiya</th>
                <th>To‘lov</th>
                <th>Sana</th>
                <th>O‘chirish</th>
            </>
        }

        case "employeesSalary": {
            return <>
                <th>#</th>
                <th>Ism</th>
                <th>Familiya</th>
                <th>To‘lov</th>
                <th>Sana</th>
                <th>To‘lov turi</th>
                <th>O‘chirish</th>
            </>
        }

        case "capital": {
            return <>
                <th>#</th>
                <th>Nomi</th>
                <th>Narxi</th>
                <th>Sana</th>
                <th>To‘lov turi</th>
                <th>O‘chirish</th>
            </>
        }



    }

}