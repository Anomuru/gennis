import { useEffect } from "react";
import {
    newAccountingSelectOption,
    newAccountingSelectOptionValue
} from "pages/platformContent/platformAccounting2.0/model/accountingSelector";
import { useSelector } from "react-redux";

export const RenderRoute = ({ setRenderRoute }) => {
    const selectOption = useSelector(newAccountingSelectOptionValue);

    const render = (() => {
        switch (selectOption) {
            case "studentsPayments":
                return {
                    change: "change_teacher_salary",
                    delete: "delete_payment",
                };
            case "bookPayment":
                return {
                    change: "change_teacher_salary",
                    delete: "delete_payment",
                };
            case "teachersSalary":
                return {
                    change: "change_teacher_salary",
                    delete: "delete_salary_teacher",
                };
            case "assistentSalary":
                return {
                    change: "change_teacher_salary",
                    delete: "delete_salary_teacher",
                };
            case "employeesSalary":
                return {
                    change: "change_teacher_salary",
                    delete: "delete_salary_teacher",
                };
            case "studentsDiscounts":
                return {
                    change: "change_teacher_salary",
                    delete: "delete_payment",
                };
            case "debtStudents":
                return {
                    change: "salary-change",
                    delete: "salary-delete",
                };
            case "overhead":
                return {
                    change: "change_overhead",
                    delete: "delete_overhead",
                };
            case "capital":
                return {
                    change: "change_capital",
                    delete: "delete_capital",
                };
            case "investments":
                return {
                    change: "update_payment_type",
                    delete: "delete_investment",
                };


        }
    })();

    useEffect(() => {
        if (render) setRenderRoute(render);
    }, [selectOption, setRenderRoute]);

    return null;
};
