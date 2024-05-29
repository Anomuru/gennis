import React, {useEffect, useMemo, useState} from 'react';
import {Route, Routes, useParams,Outlet} from "react-router-dom";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";

import "./locationSalary.sass"
import {useDispatch, useSelector} from "react-redux";
import {fetchEmployeeSalary} from "slices/teacherSalarySlice";


const LocationSalary = ({userId}) => {

    const {locationId} = useParams()
    const {locationMonths} = useSelector(state => state.teacherSalary)
    const dispatch = useDispatch()
    
    useEffect(() => {
        const data = {
            userId,
            locationId
        }
        dispatch(fetchEmployeeSalary(data))
    },[locationId, userId])

    const activeItems = useMemo(()=> {
        return {
            date: true,
            salary: true,
            residue: true,
            taken_salary: true,
            black_salary: true
        }
    },[])

    const extraInfo = {
        userId
    }

    return (
        <div className="locationSalary">
            <Outlet/>
            <AccountingTable
                typeOfMoney={"teacher"}
                activeRowsInTable={activeItems}
                users={locationMonths}
                extraInfo={extraInfo}
            />


        </div>
    );
};

export default LocationSalary;
