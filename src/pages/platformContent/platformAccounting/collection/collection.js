import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import classNames from "classnames";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";

import "./collection.sass"
import Button from "components/platform/platformUI/button";
import Table from "components/platform/platformUI/table";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "hooks/http.hook";
import { fetchCollection } from "slices/accountingSlice";
import { fetchDataToChange } from "slices/dataToChangeSlice";
import { useAuth } from "hooks/useAuth";
import { BackUrl, headers } from "constants/global";

const now = new Date();
const MONTHS = [
    { value: 1, name: "Yanvar" }, { value: 2, name: "Fevral" },
    { value: 3, name: "Mart" }, { value: 4, name: "Aprel" },
    { value: 5, name: "May" }, { value: 6, name: "Iyun" },
    { value: 7, name: "Iyul" }, { value: 8, name: "Avgust" },
    { value: 9, name: "Sentyabr" }, { value: 10, name: "Oktyabr" },
    { value: 11, name: "Noyabr" }, { value: 12, name: "Dekabr" },
];
const YEARS = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

const Collection = () => {

    const [activeRoute, setActiveRoute] = useState("studentPayment")
    const [activeFilter, setActiveFilter] = useState("cash")
    const [accountingData, setAccountingData] = useState([])
    const [dataResult, setDataResult] = useState(0)
    const [date, setDate] = useState({ ot: "", do: "" })
    const { locationId } = useParams()

    // ── Branch transactions ──
    const [txMonth, setTxMonth] = useState(now.getMonth() + 1);
    const [txYear, setTxYear] = useState(now.getFullYear());
    const [txs, setTxs] = useState([]);
    const [txSummary, setTxSummary] = useState(null);
    const [txLoading, setTxLoading] = useState(false);


    const { collection } = useSelector(state => state.accounting)
    const { dataToChange } = useSelector(state => state.dataToChange)



    useEffect(() => {
        dispatch(fetchDataToChange(locationId))
    }, [locationId])


    useEffect(() => {
        const keys = Object.keys(collection?.data)
        // eslint-disable-next-line array-callback-return
        keys?.map(item => {
            if (item === activeRoute) {
                setAccountingData(collection.data[item].list)
                setDataResult(collection.data[item].value)
            }
        })
    }, [activeRoute, collection?.data])

    const activeRowsInTableStudentPayment = {
        name: true,
        surname: true,
        payment: true,
        date: true,
    }
    const activeRowsInTableTeacherSalary = {
        name: true,
        surname: true,
        salary: true,
        month: true,
        reason: true,
        date: true,
    }

    const activeRowsInTableEmployeeSalary = {
        name: true,
        surname: true,
        payment: true,
        month: true,
        date: true,
    }

    const activeRowsInTableAssistentSalary = {
        name: true,
        surname: true,
        salary: true,
        month: true,
        date: true,
    }

    const activeRowsInTableOverheads = {
        name: true,
        payment: true,
        date: true,
    }


    const activeRowsInTableInvestment = {
        name: true,
        payment_type: true,
        payment: true,
        // date: true,
        // amount: true
    }


    const activeRowsInTableDividend = {
        date: true,
        amount: true,
        typePayment_new: true
    }

    const changeDate = (e) => {
        setDate({
            ...date,
            [e.target.name]: e.target.value
        })
    }

    const renderTables = useCallback(() => {
        if (activeRoute === "studentPayment") {
            return (
                <>
                    <h1>{dataResult}</h1>
                    <AccountingTable
                        typeOfMoney={"user"}
                        studentAtt={true}
                        activeRowsInTable={activeRowsInTableStudentPayment}
                        users={accountingData}
                    />
                </>
            )
        }
        if (activeRoute === "teacherSalary") {
            return (
                <>
                    <h1>{dataResult}</h1>
                    <AccountingTable
                        typeOfMoney={"user"}
                        studentAtt={true}
                        activeRowsInTable={activeRowsInTableTeacherSalary}
                        users={accountingData}
                    />
                </>

            )
        }
        if (activeRoute === "employeeSalary") {
            return (
                <>
                    <h1>{dataResult}</h1>
                    <AccountingTable
                        typeOfMoney={"user"}
                        studentAtt={true}
                        activeRowsInTable={activeRowsInTableEmployeeSalary}
                        users={accountingData}
                    />
                </>

            )
        }
        if (activeRoute === "assistentSalary") {
            return (
                <>
                    <h1>{dataResult}</h1>
                    <AccountingTable
                        typeOfMoney={"user"}
                        studentAtt={true}
                        activeRowsInTable={activeRowsInTableAssistentSalary}
                        users={accountingData}
                    />
                </>

            )
        }
        if (activeRoute === "overheads" || activeRoute === "capitals") {
            return (
                <>
                    <h1>{dataResult}</h1>
                    <AccountingTable
                        typeOfMoney={""}
                        studentAtt={true}
                        activeRowsInTable={activeRowsInTableOverheads}
                        users={accountingData}
                    />
                </>
            )
        }
        if (activeRoute === "investments") {
            return (
                <>

                    <h1>{dataResult}</h1>
                    <AccountingTable
                        // typeOfMoney={"user"}
                        studentAtt={true}
                        activeRowsInTable={activeRowsInTableInvestment}
                        users={accountingData}
                    />
                </>

            )
        }
        if (activeRoute === "dividends") {
            return (
                <>
                    <h1>{dataResult}</h1>
                    <AccountingTable
                        studentAtt={true}
                        activeRowsInTable={activeRowsInTableDividend}
                        users={accountingData}
                    />
                </>
            )
        }
        if (activeRoute === "branchTransactions") {
            return (
                <div className="branch-tx">
                    {txSummary && (
                        <div className="branch-tx__summary">
                            <div className="branch-tx__card branch-tx__card--give"><span>Berildi</span><strong>{txSummary.total_given?.toLocaleString() ?? 0}</strong></div>
                            <div className="branch-tx__card branch-tx__card--receive"><span>Qabul qilindi</span><strong>{txSummary.total_received?.toLocaleString() ?? 0}</strong></div>
                            <div className={`branch-tx__card ${txSummary.net < 0 ? "branch-tx__card--give" : "branch-tx__card--receive"}`}><span>Saldo</span><strong>{txSummary.net?.toLocaleString() ?? 0}</strong></div>
                        </div>
                    )}
                    {txLoading ? <DefaultLoaderSmall /> : (
                        <Table>
                            <thead><tr><th>#</th><th>Shaxs</th><th>Telefon</th><th>Miqdor</th><th>Yo'nalish</th><th>Sabab</th><th>To'lov turi</th><th>Sana</th></tr></thead>
                            <tbody>
                                {txs.length === 0 ? (
                                    <tr><td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "#999" }}>Ma'lumot yo'q</td></tr>
                                ) : txs.map((tx, i) => (
                                    <tr key={tx.id}>
                                        <td>{i + 1}</td>
                                        <td>{tx.person ? `${tx.person.name} ${tx.person.surname}` : "—"}</td>
                                        <td>{tx.person?.phone ?? "—"}</td>
                                        <td>{tx.amount?.toLocaleString()}</td>
                                        <td><span className={tx.is_give ? "tag-variable" : "tag-fixed"}>{tx.is_give ? "Berildi" : "Qabul qilindi"}</span></td>
                                        <td>{tx.reason}</td>
                                        <td>{tx.payment_type}</td>
                                        <td>{tx.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            )
        }
    }, [activeRoute, accountingData, txs, txSummary, txLoading, txMonth, txYear])


    const { request } = useHttp()

    useEffect(() => {
        const newData = { locationId, date, activeFilter }
        if (date.do && date.ot && locationId) {
            dispatch(fetchCollection(newData))
        }
    }, [activeFilter, date, locationId])

    useEffect(() => {
        if (activeRoute === "branchTransactions") fetchBranchTxs();
    }, [activeRoute, locationId, txMonth, txYear])

    const fetchBranchTxs = () => {
        setTxLoading(true);
        request(`${BackUrl}account/branch_transaction/${txMonth}/${txYear}?location_id=${locationId}`, "GET", null, headers())
            .then(res => { if (res.success) { setTxs(res.data); setTxSummary(res.summary); } })
            .catch(() => {})
            .finally(() => setTxLoading(false));
    };


    const renderTypes = useCallback(() => {
        if (dataToChange) {
            return dataToChange?.payment_types?.map(item => {
                return (
                    <Button
                        name={item.name}
                        onClickBtn={setActiveFilter}
                        active={item.name === activeFilter}
                    >
                        {item.name}
                    </Button>
                )
            })
        }
    }, [activeFilter, dataToChange])


    const dispatch = useDispatch()


    return (
        <div className="collection">
            <header>
                <div>
                    <Link to={-1} className="backBtn">
                        <i className="fas fa-arrow-left" />
                        Ortga
                    </Link>
                </div>
                <div>
                    {activeRoute === "branchTransactions" ? (
                        <form className="changeDate">
                            <select className="input-fields" value={txMonth} onChange={e => setTxMonth(Number(e.target.value))}>
                                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                            </select>
                            <select className="input-fields" value={txYear} onChange={e => setTxYear(Number(e.target.value))}>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </form>
                    ) : (
                        <form className="changeDate">
                            <input name="ot" type="date" className="input-fields" onChange={changeDate} value={date?.ot} />
                            <input name="do" type="date" className="input-fields" onChange={changeDate} value={date?.do} />
                        </form>
                    )}
                </div>
            </header>
            <div className="subheader">
                {renderTypes()}
            </div>
            <div className="subheader">
                <h1>{collection?.data?.result}</h1>
            </div>
            <main>
                {/*<h1 className="studentAtt__title">{data.name} attendance Hamma bali: {data.totalBall}</h1>*/}
                <div className="collection__btns">
                    <div
                        onClick={() => setActiveRoute("studentPayment")}
                        className={classNames("collection__btns-item", {
                            active: activeRoute === "studentPayment"
                        })}
                    >
                        Studentlar to'lovlari
                    </div>
                    <div
                        onClick={() => setActiveRoute("teacherSalary")}
                        className={classNames("collection__btns-item", {
                            active: activeRoute === "teacherSalary"
                        })}
                    >
                        O'qituvchilar oyliklari
                    </div>
                    <div
                        onClick={() => setActiveRoute("assistentSalary")}
                        className={classNames("collection__btns-item", {
                            active: activeRoute === "assistentSalary"
                        })}
                    >
                        Asistentlar oyligi
                    </div>
                    <div
                        onClick={() => setActiveRoute("employeeSalary")}
                        className={classNames("collection__btns-item", {
                            active: activeRoute === "employeeSalary"
                        })}
                    >
                        Ishchilar oyliklari
                    </div>
                    <div
                        onClick={() => setActiveRoute("overheads")}
                        className={classNames("collection__btns-item", {
                            active: activeRoute === "overheads"
                        })}
                    >
                        Qo'shimcha xarajatlar
                    </div>
                    <div
                        onClick={() => setActiveRoute("capitals")}
                        className={classNames("collection__btns-item", {
                            active: activeRoute === "capitals"
                        })}
                    >
                        Kapital xarajaltar
                    </div>
                    <div
                        onClick={() => setActiveRoute("investments")}
                        className={classNames("collection__btns-item", {
                            active: activeRoute === "investments"
                        })}
                    >
                        Invistitsiya
                    </div>
                    <div
                        onClick={() => setActiveRoute("dividends")}
                        className={classNames("collection__btns-item", {
                            active: activeRoute === "dividends"
                        })}
                    >
                        Dividends
                    </div>
                    <div
                        onClick={() => setActiveRoute("branchTransactions")}
                        className={classNames("collection__btns-item", {
                            active: activeRoute === "branchTransactions"
                        })}
                    >
                        Filial tranzaksiyalari
                    </div>
                </div>

                <div className="collection__container">
                    {renderTables()}
                </div>
            </main>
        </div>
    );
};

export default Collection;