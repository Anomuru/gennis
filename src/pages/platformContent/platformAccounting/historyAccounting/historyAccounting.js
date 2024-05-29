import React, {useCallback, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import {
    fetchCollection,
    fetchHistoryAccounting,
    fetchHistoryAccountingGet,
    fetchHistoryAccountingPost
} from "slices/accountingSlice";
import Button from "components/platform/platformUI/button";

import "./historyAccounting.sass"
import Select from "components/platform/platformUI/select";
import {useHttp} from "hooks/http.hook";
import {BackUrl} from "constants/global";
import {useAuth} from "hooks/useAuth";


const HistoryAccounting = () => {

    const [activeFilter,setActiveFilter] = useState("")
    const [year,setYear] = useState(null)
    const {locationId} = useParams()


    const {history} = useSelector(state => state.accounting)
    const {dataToChange} = useSelector(state => state.dataToChange)


    useEffect(() => {
        dispatch(fetchDataToChange(locationId))
    },[locationId])


    const activeRowsInTableStudentPayment = {
        old_cash: true,
        current_cash: true,
        discount: true,
        overheads: true,
        capitalExpenditures: true,
        month: true,
        payment: true,
        teacherSalary: true,
        employeesSalary: true,
        type: true,
        update: true
    }

    useEffect(() => {
        if (history.year) {
            setYear(history?.year[0])
        }

    },[history?.year])

    useEffect(() => {
        const newData ={
            locationId,
        }
        dispatch(fetchHistoryAccountingGet(newData))
    },[locationId])

    useEffect(() => {
        if (activeFilter && year) {
            const newData = {
                locationId,
                activeFilter,
                year
            }
            dispatch(fetchHistoryAccountingPost(newData))
        }
    },[activeFilter,year])


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
    const {request} = useHttp()

    const updateData = (monthId) => {

        request(`${BackUrl}refresh_account/${locationId}/${monthId}/${activeFilter}`)
            .then(() => {
                const newData = {
                    locationId,
                    activeFilter,
                    year
                }
                dispatch(fetchHistoryAccountingPost(newData))
            })
    }


    const funcSlice = {
        updateData
    }


    return (
        <div className="collection">
            <header>
                <div>
                    <Link to={-1} className="backBtn">
                        <i className="fas fa-arrow-left" />
                        Ortga
                    </Link>
                </div>
            </header>
            <div className="subheader">
                {renderTypes()}
            </div>
            <div className="subheader">
                <Select
                    options={history.years}
                    title={"Yillar"}
                    onChangeOption={setYear}
                    defaultValue={year}
                    number={true}
                />
            </div>
            <div className="subheader">
                <h1>{history?.data?.result}</h1>
            </div>
            <main>
                {/*<h1 className="studentAtt__title">{data.name} attendance Hamma bali: {data.totalBall}</h1>*/}


                <div className="collection__container">
                    <AccountingTable
                        activeRowsInTable={activeRowsInTableStudentPayment}
                        users={history.data}
                        funcSlice={funcSlice}
                    />
                </div>
            </main>
        </div>
    );
};

export default HistoryAccounting;