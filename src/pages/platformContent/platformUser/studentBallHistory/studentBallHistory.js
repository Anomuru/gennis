import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";

import "./studentBallHistory.sass"
import {useDispatch, useSelector} from "react-redux";
import {fetchHistoryData} from "slices/usersProfileSlice";
import Select from "components/platform/platformUI/select";
import StudentInfosHistoryTable from "components/platform/platformUI/tables/studentInfosHistoryTable";


const StudentBallHistory = () => {

    const {userId} = useParams()
    const {dataHistory} = useSelector(state => state.usersProfile)

    const [filteredStudents,setFilteredStudents] = useState([])


    const dispatch = useDispatch()

    useEffect(() => {
       dispatch(fetchHistoryData(userId))
    },[])


    const activeRowsTable = {
        degree: true,
        groupName: true,
        month: true,
        subject: true,
        teacherName: true,
        teacherSurname: true,
    }

    const filterSt = (value) => {
        setFilteredStudents(dataHistory.history_rate.filter(item => item.year === value))
    }

    return (
        <div className="ballHistory">
            <h1>Hamma baholar</h1>
            <div className="ballHistory_wrapper">
                <Select
                    title={"Yillar"}
                    number={true}
                    options={dataHistory?.years}
                    onChangeOption={filterSt}
                />
            </div>
            <StudentInfosHistoryTable data={filteredStudents} activeRowsInTable={activeRowsTable}/>
        </div>
    );
};

export default StudentBallHistory;