import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";

import Table from "components/platform/platformUI/table";
import Input from "components/platform/platformUI/input";
import Select from "components/platform/platformUI/select";
import Button from 'components/platform/platformUI/button';
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import { BackUrl, headers } from "constants/global";
import { useHttp } from "hooks/http.hook";

import cls from "./branchStatistics.module.sass";

export const BranchStatistics = () => {

    const lastType = localStorage.getItem("oneDayType")
    const { request } = useHttp()
    const { locationId } = useParams()
    const navigate = useNavigate()

    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [date, setDate] = useState({})
    const [loading, setLoading] = useState(false)

    const [paymentTypes, setPaymentTypes] = useState([])
    const [selectedType, setSelectedType] = useState(null)
    const [reportsList, setReportsList] = useState(null)

    const [titles, setTitles] = useState([])
    const [activeTitle, setActiveTitle] = useState("all")

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setFromDate(today)
        setToDate(today)
    }, [])

    useEffect(() => {
        if (lastType) {
            // const last = JSON.parse(lastType)
            setActiveTitle(lastType)
        }
    }, [lastType])

    useEffect(() => {
        if (locationId && fromDate && toDate) {
            setLoading(true)
            request(`${BackUrl}account/statistics?location_id=${locationId}&from_date=${fromDate}&to_date=${toDate}${selectedType && selectedType !== "all" ? `&payment_type_name=${selectedType}` : ""}`)
                .then(res => {
                    setDate(res)
                    setLoading(false)
                })
            localStorage.setItem("from_toData", JSON.stringify({ fromDate, toDate }))
        }
    }, [locationId, fromDate, toDate, selectedType])

    useEffect(() => {
        if (locationId) {
            request(`${BackUrl}base/block_information2/${locationId}`, "GET", null, headers())
                .then(res => {
                    setPaymentTypes(res?.data?.payment_types)
                })
        }
    }, [locationId])

    useEffect(() => {
        if (!!date) {
            const sectionTitles = {
                joined_students: "Guruhga qo‘shilgan o‘quvchilar",
                new_groups: "Yangi guruhlar",
                new_students: "Yangi o‘quvchilar",
                new_leads: "Yangi leadlar",
                teacher_salaries: "O‘qituvchilar maoshi",
                assistent_salaries: "Assistent maoshi",
                staff_salaries: "Xodimlar maoshi",
                payments: "To‘lovlar",
                overheads: "Xarajatlar",
                expenses: "Umumiy xarajatlar",
                overall: "Umumiy balans"
            }

            setTitles(
                Object.entries(date)
                    .map(([key, value]) => {
                        if (typeof value === "number") return null
                        if (typeof value === "object" && value.items) {
                            return ({
                                name: `${sectionTitles[key]} (count: ${value.count || value.items.length}${value.sum ? `, sum: ${value.sum}` : ""})`,
                                id: key,
                                sum: value.sum ?? ""
                            })
                        }
                    })
                    .filter(item => item)
            )
        }
    }, [date])

    const onChangeType = (type) => {
        localStorage.setItem("oneDayType", type)
        setActiveTitle(type)
    }

    const render = () => {
        const sectionTitles = {
            joined_students: "Guruhga qo‘shilgan o‘quvchilar",
            new_groups: "Yangi guruhlar",
            new_students: "Yangi o‘quvchilar",
            new_leads: "Yangi leadlar",
            teacher_salaries: "O‘qituvchilar maoshi",
            assistent_salaries: "Assistent maoshi",
            staff_salaries: "Xodimlar maoshi",
            payments: "To‘lovlar",
            overheads: "Xarajatlar",
            expenses: "Umumiy xarajatlar",
            overall: "Umumiy balans"
        };

        return Object.entries(date).map(([key, value]) => {
            if (typeof value === "number") return null

            if (typeof value === "object" && value.items) {
                // setTitles(prev => [...prev, {
                //     name: sectionTitles[key],
                //     sum: value.sum ?? "",
                //     id: key
                // }]);

                if (activeTitle !== key && activeTitle !== "all") return null;

                let columns = [];
                let headers = {};

                if (key.includes("new_students")) {
                    columns = ["name", "surname", "phone", "reg_date", "comment"];
                    headers = {
                        name: "Ism",
                        surname: "Familiya",
                        phone: "Telefon",
                        reg_date: "Ro‘yxatga olingan sana",
                        comment: "Izoh"
                    };
                } else if (key.includes("joined")) {
                    columns = ["name", "surname", "phone", "joined_date", "comment"];
                    headers = {
                        name: "Ism",
                        surname: "Familiya",
                        phone: "Telefon",
                        joined_date: "Guruhga qo‘shilgan sana",
                        comment: "Izoh"
                    };
                } else if (key.includes("salaries")) {
                    columns = ["name", "surname", "amount", "date", "reason", "payment_type"];
                    headers = {
                        name: "Ism",
                        surname: "Familiya",
                        amount: "Miqdori",
                        date: "Sana",
                        reason: "Sabab",
                        payment_type: "Turi"
                    };
                } else if (key.includes("payments")) {
                    columns = ["name", "surname", "amount", "date", "payment_type"];
                    headers = {
                        name: "Ism",
                        surname: "Familiya",
                        amount: "Miqdori",
                        date: "Sana",
                        payment_type: "Turi"
                    };
                } else if (key.includes("leads")) {
                    columns = ["name", "phone", "day", "status"];
                    headers = {
                        name: "Ism",
                        phone: "Telefon",
                        day: "Kun",
                        status: "Holati"
                    };
                } else if (key.includes("overheads")) {
                    columns = ["item_name", "amount", "date"];
                    headers = {
                        item_name: "Nomi",
                        amount: "Miqdori",
                        date: "Sana"
                    };
                } else if (key.includes("group")) {
                    columns = ["name", "students", "teacher_name", "teacher_surname"];
                    headers = {
                        name: "Nomi",
                        students: "O'quvchilar",
                        teacher_name: "O'qituvchi Ismi",
                        teacher_surname: "O'qituvchi Familiyasi",
                    };
                } else {
                    columns = Object.keys(value.items[0] || {}).filter(
                        (f) => f !== "id" && f !== "type_name" && !f.includes("id")
                    );
                    headers = Object.fromEntries(columns.map((c) => [c, c]));
                }

                return (
                    <div key={key} className={cls.item}>
                        <h2>
                            {sectionTitles[key] || key.replaceAll("_", " ")}{" "}
                            <span>
                                (count: {value.count || value.items.length}
                                {value.sum ? `, sum: ${value.sum}` : ""})
                            </span>
                        </h2>
                        <Table className={cls.item__table}>
                            <thead>
                                <tr>
                                    <th>№</th>
                                    {
                                        columns.map((field) => (
                                            <th key={field}>{headers[field] || field}</th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    value.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            {
                                                columns.map((field) => (
                                                    <td key={field}>
                                                        {
                                                            item[field] !== null && item[field] !== undefined
                                                                ? field === "status"
                                                                    ?
                                                                    <div className={cls.status}>
                                                                        <span
                                                                            className={classNames(cls.span, {
                                                                                [cls.red]: item[field] === "red"
                                                                            })}
                                                                        />
                                                                    </div>
                                                                    : String(item[field])
                                                                : "—"
                                                        }
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </div>
                );
            }
            return null;
        });
    };

    // const renderReport = () => {
    //     return (

    //     )
    // }

    return (
        <div className={cls.oneDay}>
            <div className={cls.oneDay__header}>
                <div className={cls.title}>
                    <h1>Hisob</h1>
                    <Select
                        options={[{ name: "Hammasi", id: "all" }, ...titles]}
                        // title
                        onChangeOption={onChangeType}
                        defaultValue={activeTitle}
                    />
                </div>
                <div className={cls.date}>
                    <Button
                        extraClass={cls.date__navigate}
                        onClickBtn={() => navigate("dailyReport")}
                    >
                        Kunlik Hisobotlar
                    </Button>
                    <Select
                        clazzLabel={cls.date__select}
                        options={[{ name: "all" }, ...paymentTypes]}
                        keyValue={"name"}
                        onChangeOption={setSelectedType}
                        title={"To'lov turi"}
                    />
                    <Input
                        title={"From"}
                        type={"date"}
                        onChange={setFromDate}
                        defaultValue={fromDate}
                    />
                    <Input
                        title={"To"}
                        type={"date"}
                        onChange={setToDate}
                        defaultValue={toDate}
                    />
                </div>
            </div>
            <div
                className={classNames(cls.oneDay__container, {
                    [cls.notActive]: !fromDate || !toDate
                })}
            >
                {
                    loading
                        ? <DefaultLoader />
                        :
                        !fromDate || !toDate
                            ? <h2 className={cls.notActive}>Sana tanlanmagan</h2>
                            : <div className={cls.items}>
                                <div className={classNames(cls.items__header, cls.item)}>
                                    <h2>
                                        <span>Umumiy balans: </span>
                                        {date.overall}
                                    </h2>
                                    <h2>
                                        <span>Umumiy xarajatlar: </span>
                                        {date.expenses}
                                    </h2>
                                </div>
                                {render()}
                            </div>
                }
            </div>
        </div>
    );
};

export default BranchStatistics;