import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";

import "./studentGroupsHistory.sass"
import {useDispatch, useSelector} from "react-redux";
import {fetchHistoryData} from "slices/usersProfileSlice";
import Select from "components/platform/platformUI/select";
import StudentInfosHistoryTable from "components/platform/platformUI/tables/studentInfosHistoryTable";


const StudentBallHistory = () => {

    const {userId} = useParams()
    const {dataHistory} = useSelector(state => state.usersProfile)




    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchHistoryData(userId))
    },[])


    const activeRowsTable = {
        groupName: true,
        joinedDay: true,
        leftDay: true,
        reason: true,
        teacherName: true,
        teacherSurname: true,
    }



    return (
        <div className="ballHistory">
            <h1>Guruhlar tarixi</h1>
            <StudentInfosHistoryTable data={dataHistory.history_groups} activeRowsInTable={activeRowsTable}/>
        </div>
    );
};

export default StudentBallHistory;