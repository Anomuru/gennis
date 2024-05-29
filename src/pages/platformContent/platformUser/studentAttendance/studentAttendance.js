import React, {useEffect, useState} from 'react';
import AttendanceTable from "components/platform/platformUI/tables/attendanceTable";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import classNames from "classnames";
import "pages/platformContent/platformUser/studentAttendance/studentAttendance.sass"
import {useHttp} from "hooks/http.hook";
import {deleteAtt, fetchStudentAccData} from "slices/studentAttendanceSlice";
import {BackUrl, headers, ROLES} from "constants/global";
import BackButton from "../../../../components/platform/platformUI/backButton/backButton";

const StudentAttendance = () => {

    const {studentId,month,groupId,year} = useParams()

    const {data} = useSelector(state => state.studentAttendance)
    const {role} = useSelector(state => state.me)

    const [activeDays,setActiveDays] = useState("present")

    const dispatch = useDispatch()

    useEffect(() => {
        const data = {
            studentId,month,groupId,year
        }
        dispatch(fetchStudentAccData(data))
    },[dispatch, groupId, month, studentId, year])

    
    const activeRowsInTablePresent = {
        homework: true,
        dictionary: true,
        activeness: true,
        averageBall: true,
        date: true,
        // eslint-disable-next-line no-mixed-operators
        delete: !data.status && role === ROLES.Admin || role === ROLES.Director
    }

    let activeRowsInTableAbsent = {
        date: true,
        // eslint-disable-next-line no-mixed-operators
        delete: !data.status && role === ROLES.Admin || role === ROLES.Director
    }

    const {request} = useHttp()


    const onDelete = (id) => {
        dispatch(deleteAtt({name: activeDays,id:id}))
        request(`${BackUrl}attendance_delete/${id}/${studentId}/${groupId}/${data.main_attendance}`, "GET", null,headers())
    }


    const funcSlice = {
        onDelete
    }



    return (
        <div className="studentAtt">
            <header>
                <BackButton/>
            </header>
            <main>
                <h1 className="studentAtt__title">{data.name} attendance Hamma bali: {data.totalBall}</h1>
                <div className="studentAtt__btns">
                    <div
                        onClick={() => setActiveDays("present")}
                        className={classNames("studentAtt__btns-item",{
                            active: activeDays === "present"
                        })}

                    >
                        Kelgan kunlari
                    </div>
                    <div
                        onClick={() => setActiveDays("absent")}
                        className={classNames("studentAtt__btns-item",{
                            active: activeDays === "absent"
                        })}
                    >
                        Kelmagan kunlari
                    </div>

                </div>

                <div className="studentAtt__container">
                    {
                        activeDays === "present" ?
                            <AttendanceTable
                                studentAtt={true}
                                activeRowsInTable={activeRowsInTablePresent}
                                funcsSlice={funcSlice}
                                data={data.present}
                            />
                            :
                            <AttendanceTable
                                studentAtt={true}
                                activeRowsInTable={activeRowsInTableAbsent}
                                funcsSlice={funcSlice}
                                data={data.absent}
                            />
                    }
                </div>
            </main>
        </div>
    );
};

export default StudentAttendance;