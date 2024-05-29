import React, {useCallback, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import classNames from "classnames";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";


import "./collection.sass"
import Button from "components/platform/platformUI/button";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {fetchCollection} from "slices/accountingSlice";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {useAuth} from "hooks/useAuth";

const Collection = () => {

    const [activeRoute,setActiveRoute] = useState("studentPayment")
    const [activeFilter,setActiveFilter] = useState("cash")
    const [accountingData,setAccountingData] = useState([])
    const [dataResult,setDataResult] = useState(0)
    const [date,setDate] = useState({
        ot: "",
        do: ""
    })
    const {locationId} = useParams()


    const {collection} = useSelector(state => state.accounting)
    const {dataToChange} = useSelector(state => state.dataToChange)


    
    useEffect(() => {
        dispatch(fetchDataToChange(locationId))
    },[locationId])


    useEffect(() => {
        const keys = Object.keys(collection?.data)
        // eslint-disable-next-line array-callback-return
        keys?.map(item => {
            if (item === activeRoute) {
                setAccountingData(collection.data[item].list)
                setDataResult(collection.data[item].value)
            }
        })
    },[activeRoute, collection?.data])

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

    const activeRowsInTableOverheads = {
        name: true,
        payment: true,
        date: true,
    }



    const changeDate = (e) => {
        setDate( {
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
        if (activeRoute === "overheads" || activeRoute === "capitals") {
            return (
                <>
                    <h1>{dataResult}</h1>
                    <AccountingTable
                        studentAtt={true}
                        activeRowsInTable={activeRowsInTableOverheads}
                        users={accountingData}
                    />
                </>
            )
        }
    },[activeRoute, accountingData])


    const {request} = useHttp()

    useEffect(() => {
        const newData ={
            locationId,
            date,
            activeFilter
        }
        dispatch(fetchCollection(newData))
    },[activeFilter, date, locationId])
    

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
    },[activeFilter, dataToChange])


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
                    <form className="changeDate" >

                        <input
                            name="ot"
                            type="date"
                            className="input-fields"
                            onChange={changeDate}
                            value={date?.ot}
                        />

                        <input
                            name="do"
                            type="date"
                            className="input-fields"
                            onChange={changeDate}
                            value={date?.do}
                        />


                    </form>
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
                        className={classNames("collection__btns-item",{
                            active: activeRoute === "studentPayment"
                        })}
                    >
                        Studentlar to'lovlari
                    </div>
                    <div
                        onClick={() => setActiveRoute("teacherSalary")}
                        className={classNames("collection__btns-item",{
                            active: activeRoute === "teacherSalary"
                        })}
                    >
                        O'qituvchilar oyliklari
                    </div>
                    <div
                        onClick={() => setActiveRoute("employeeSalary")}
                        className={classNames("collection__btns-item",{
                            active: activeRoute === "employeeSalary"
                        })}
                    >
                        Ishchilar oyliklari
                    </div>
                    <div
                        onClick={() => setActiveRoute("overheads")}
                        className={classNames("collection__btns-item",{
                            active: activeRoute === "overheads"
                        })}
                    >
                        Qo'shimcha xarajatlar
                    </div>
                    <div
                        onClick={() => setActiveRoute("capitals")}
                        className={classNames("collection__btns-item",{
                            active: activeRoute === "capitals"
                        })}
                    >
                        Kapital xarajaltar
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