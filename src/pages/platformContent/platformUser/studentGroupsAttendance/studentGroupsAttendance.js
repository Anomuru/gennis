import React, {useCallback, useEffect, useMemo, useState} from 'react';
import AttendanceTable from "components/platform/platformUI/tables/attendanceTable";
import "pages/platformContent/platformUser/studentGroupsAttendance/studentGroupsAttendance.sass"
import {useDispatch, useSelector} from "react-redux";
import {
    fetchAttendancesStudent,
    fetchStudentGroupDates,
    setStudentFilteredAttendances
} from "slices/attendancesSlice";
import {Link, useNavigate, useParams} from "react-router-dom";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import Select from "components/platform/platformUI/select";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";


const StudentGroupsAttendance = () => {
    
    const {studentId} = useParams()
    
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(fetchAttendancesStudent(studentId))
        dispatch(fetchStudentGroupDates(studentId))

    },[studentId])




    const {studentAtt,fetchAttendancesStatus,studentDates} = useSelector(state => state.attendances)

    const [year,setYear] = useState()
    const [month,setMonth] = useState()

    useEffect(() => {
        const currentMonth = studentDates.current_month
        const currentYear = studentDates.current_year
        if (currentMonth && currentYear) {
            setYear(
                studentDates.years.includes(currentYear) ? currentYear : null
            )
            setMonth(
                studentDates.months.filter(item => item.year === currentYear)[0]?.months?.includes(currentMonth)
                    ? currentMonth : null
            )
        }
    },[studentDates.current_year, studentDates.current_month])


    useEffect(() => {
        if (studentDates.years?.length === 1) {
            setYear(studentDates.years[0])
        }
    },[studentAtt])



    const {request} = useHttp()

    useEffect(() =>{
        if (year && month) {
            const data = {
                studentId,
                year,
                month
            }
            request(`${BackUrl}combined_attendances/${studentId}`, "POST", JSON.stringify(data),headers())
                .then(res => {
                    console.log(res)
                    dispatch(setStudentFilteredAttendances(res))
                })
        }

    },[year, month, dispatch,studentId])

    const navigate = useNavigate()

    const linkTo = (id) => {

        navigate(`../../studentAttendance/${studentId}/${month}/${year}/${id}`)
    }

    const funcsSlice = {
        linkTo
    }


    const renderMonths = useCallback((dates) => {
        // eslint-disable-next-line array-callback-return
        return dates?.map(item => {
            if (item.year === year) {
                return (
                    <Select
                        name={"month"}
                        title={"Oy"}
                        options={item.months}
                        defaultValue={month}
                        onChangeOption={setMonth}
                        number={true}
                    />
                )
            }
        })
    },[year])


    const onChangeYear = (year) => {
        setMonth(null)
        setYear(year)
    }


    if (fetchAttendancesStatus === "loading") {
        return <DefaultLoader/>
    }



    return (
        <div className="listAtt">
            <header>
                <div>
                    <Link to={-1} className="backBtn">
                        <i className="fas fa-arrow-left" />
                        Ortga
                    </Link>
                </div>
                <div>
                    {
                        studentDates.years?.length > 1 ?
                            <Select
                                name={"year"}
                                title={"Yil"}
                                options={studentDates.years}
                                defaultValue={year}
                                onChangeOption={onChangeYear}
                                number={true}
                            /> : null
                    }
                    {renderMonths(studentDates.months)}
                </div>
            </header>
            <main>
                {
                    month ?
                        <AttendanceTable groups={true} funcsSlice={funcsSlice} data={studentAtt}/>
                        :
                        <h1>Oy tanlang</h1>
                }

            </main>
        </div>
    );
};

export default StudentGroupsAttendance;