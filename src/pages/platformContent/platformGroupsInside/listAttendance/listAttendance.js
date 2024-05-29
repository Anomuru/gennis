import React, {useCallback, useEffect, useMemo, useState} from 'react';
import AttendanceTable from "components/platform/platformUI/tables/attendanceTable";
import "./listAttendance.sass"
import "styles/components/_form.sass"
import {useDispatch, useSelector} from "react-redux";
import {fetchAttendances, fetchGroupDates, setFilteredAttendances} from "slices/attendancesSlice";
import {Link, useNavigate, useParams} from "react-router-dom";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import Select from "components/platform/platformUI/select";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {setActiveBtn, setChecked} from "slices/newStudentsSlice";
import {onDelete} from "slices/groupSlice";
import {current} from "@reduxjs/toolkit";
import Modal from "components/platform/platformUI/modal";
import Button from "components/platform/platformUI/button";
import {domMax} from "framer-motion";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import classNames from "classnames";
import BackButton from "components/platform/platformUI/backButton/backButton";


const ListAttendance = () => {

    const {groupId} = useParams()

    const dispatch = useDispatch()
    const [activeModal, setActiveModal] = useState(false)
    const [activeModalName, setActiveModalName] = useState("")


    useEffect(() => {
        dispatch(fetchAttendances(groupId))
        dispatch(fetchGroupDates(groupId))
    }, [groupId])


    const {groupAtt, fetchAttendancesStatus, groupDates} = useSelector(state => state.attendances)

    const [year, setYear] = useState()
    const [month, setMonth] = useState()

    useEffect(() => {
        const currentMonth = groupDates.current_month
        const currentYear = groupDates.current_year
        if (currentMonth && currentYear) {
            setYear(
                groupDates.years.includes(currentYear) ? currentYear : null
            )
            setMonth(
                groupDates.months.filter(item => item.year === currentYear)[0]?.months?.includes(currentMonth)
                    ? currentMonth : null
            )
        }
    }, [groupDates.current_year, groupDates.current_month])


    useEffect(() => {
        if (groupDates.years?.length === 1) {
            setYear(groupDates.years[0])
        }
    }, [groupAtt])


    const {request} = useHttp()

    useEffect(() => {
        if (year && month) {
            const data = {
                groupId,
                year,
                month
            }
            request(`${BackUrl}attendances/${groupId}`, "POST", JSON.stringify(data), headers())
                .then(res => {
                    dispatch(setFilteredAttendances({data: res.data.attendance_filter}))
                })
        }
    }, [year, month, dispatch])

    const navigate = useNavigate()

    const linkTo = (id) => {
        navigate(`../../../studentAttendance/${id}/${month}/${year}/${groupId}`)
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
    }, [year])


    const onChangeYear = (year) => {
        setMonth(null)
        setYear(year)
    }


    if (fetchAttendancesStatus === "loading") {
        return <DefaultLoader/>
    }


    const renderedMonth = renderMonths(groupDates.months)


    return (
        <div className="listAtt">
            <header>
                <div>
                    <BackButton/>
                </div>
                <div>
                    {
                        groupDates.years?.length > 1 ?
                            <Select
                                name={"year"}
                                title={"Yil"}
                                options={groupDates.years}
                                defaultValue={year}
                                onChangeOption={onChangeYear}
                                number={true}
                            /> : null
                    }
                    {renderedMonth}
                    <div className="add" onClick={() => setActiveModal(!activeModal)}>
                        <i className="fas fa-plus"></i>
                    </div>
                </div>
            </header>
            <main>
                {
                    month ?
                        <AttendanceTable funcsSlice={funcsSlice} data={groupAtt.attendance_filter}/>
                        :
                        <h1>Oy tanlang</h1>
                }

            </main>

            <Modal activeModal={activeModal} setActiveModal={() => setActiveModal(!activeModal)}>
                <SubMakeAttendance data={groupAtt} groupId={groupId}/>
            </Modal>

        </div>
    );
};


const SubMakeAttendance = React.memo(({data, groupId}) => {

    const [modalName, setModalName] = useState()
    const [activeModal, setActiveModal] = useState(false)
    const [studentId, setStudentId] = useState()
    const [reason, setReason] = useState("")
    const [students, setStudents] = useState([])
    const [date, setDate] = useState([])
    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)


    useEffect(() => {
        if (data) {

            setStudents(data?.students)
            setDate(data?.date)
        }
    }, [data])

    useEffect(() => {
        if (date && date.length === 1) {
            setMonth(date[0].value)
        }
    }, [date])


    const renderDate = useCallback(() => {
        return date?.map(item => {
            if (item.value === month) {
                return (
                    <div className="date__item">
                        <Select
                            number={true}
                            name={"day"}
                            title={"Kun"}
                            defaultValue={day}
                            onChangeOption={setDay}
                            options={item?.days}
                        />
                    </div>
                )
            }
        })
    }, [date, day, month, setDay])


    const renderStudents = useCallback(() => {
        if (students?.length > 0) {
            // eslint-disable-next-line array-callback-return
            return students.map(item => {
                if (!item.attended) {
                    return (
                        <div className="subAttendance__item">
                            <div className="info">
                                <h1>{item.name}</h1>
                                <h1>{item.surname}</h1>
                            </div>


                            <div className="check">
                                <div
                                    onClick={() => onClickYes(item.id)}
                                    className="check__btn yes"
                                >
                                    <i className="fas fa-check"/>
                                </div>
                                <div
                                    onClick={() => {
                                        setModalName("absent")
                                        setActiveModal(true)
                                        setStudentId(item.id)
                                    }}
                                    className="check__btn no"
                                ><
                                    i className="fas fa-times"/>
                                </div>
                            </div>


                        </div>
                    )
                }
            })
        } else {
            return <h1>Studentlar yoq</h1>
        }


    }, [students])

    const returnStudent = (id) => {
        setStudents(students => {
            return students.map(item => {
                if (item.id === id) {
                    setReason(item.reason)
                    return {...item, attended: false}
                }
                return item
            })
        })
    }

    const renderCheckedStudents = useCallback(() => {

        if (students.length > 0) {
            // eslint-disable-next-line array-callback-return
            return students.map(item => {
                if (item.attended) {
                    return (
                        <div className="checkedStudents__item" onClick={() => returnStudent(item.id)}>
                            <div className="infoStudent">
                                <div className="info">
                                    <span>{item.name}</span>
                                    <span>{item.surname}</span>
                                </div>

                                <div className="typeChecked">
                                    {

                                        item.typeChecked === "yes"
                                            ?
                                            <i className="fas fa-plus-circle green"/>
                                            :
                                            <i className="fas fa-minus-circle red"/>
                                    }
                                </div>
                                <div>
                                    {
                                        item?.requestType === "loading" ?
                                            <DefaultLoaderSmall/> : null
                                    }
                                </div>
                            </div>
                            {
                                item.reason ?
                                    <div className="reason">{item.reason}</div> : null
                            }
                            <div
                                className={classNames("error", {
                                    errorActive: item.requestType === "error"
                                })}
                            >
                                {item.requestMsg}
                            </div>

                        </div>
                    )
                }
            })
        } else {
            return <h1>Studentlar yoq</h1>
        }
    }, [students])


    const onClickYes = (id) => {
        setStudents(students => {
            return students.map(item => {

                if (item.id === id) {

                    return {...item, attended: true, typeChecked: "yes", reason: "", date: {}, scores: {}}
                }
                return item
            })
        })
    }


    const onSubmitAbsent = (e) => {
        e.preventDefault()
        setStudents(students => {
            return students.map(item => {
                if (item.id === studentId) {
                    return {...item, attended: true, typeChecked: "no", reason, date: {day, month}, scores: {}}
                }
                return item
            })
        })
        setActiveModal(false)
    }

    const updateStatusStudent = ({id, requestType, requestMsg}) => {
        setStudents(students => {
            return students.map(item => {
                if (id === item.id) {
                    return {...item, requestType: requestType, requestMsg: requestMsg}
                }
                return item
            })
        })
    }


    const {request} = useHttp()

    const onCheckedStudents = (e) => {
        e.preventDefault()

        students.map(student => {
            if (student.attended) {
                const data = {
                    student: {...student, date: {day, month}},
                    groupId,

                    // teacherId
                }

                updateStatusStudent({id: student.id, requestType: "loading"})
                request(`${BackUrl}make_attendance`, "POST", JSON.stringify(data), headers())
                    .then(res => {
                        if (res.success) {
                            // removeSuccessStudent(res.student_id)
                            setStudents(students => students.filter(item => item.id !== res.student_id))
                            // dispatch(removeCheckedStudent({id:res.student_id}))
                            setActiveModal(false)
                            // setTypeMsg("success")
                            // setMsg(res.msg)
                            // setActiveMessage(true)
                        }
                        if (res.error) {
                            updateStatusStudent({id: res.student_id, requestType: res.requestType, requestMsg: res.msg})
                        }
                    })
                    .catch(() => {
                        // setTypeMsg("error")
                        // setMsg("Serverda yoki internetingizda hatolik")
                        // setActiveMessage(true)
                    })

            }
        })
    }


    const renderedStudents = renderStudents()
    const renderedCheckedStudents = renderCheckedStudents()
    const renderedDays = renderDate()


    const isDisabled = students.filter(item => item.attended).length !== 0 && day !== null


    return (
        <div className="subAttendance">
            <div className="subAttendance__wrapper">
                <div className="subAttendance__header">
                    {
                        date?.length >= 2 ?
                            <Select
                                name={"month"}
                                title={"Oy"}
                                onChangeOption={setMonth}
                                options={date}
                            /> :
                            null
                    }
                    {renderedDays}
                    <Button onClickBtn={() => {
                        setModalName("checked")
                        setActiveModal(true)
                    }}>
                        Davomat qilinganlar
                    </Button>
                </div>
                <div className="subAttendance__content">
                    {renderedStudents}
                </div>

            </div>

            {
                modalName === "absent" ?
                    <Modal id={"1"} activeModal={activeModal} setActiveModal={() => setActiveModal(!activeModal)}>
                        <div className="absent">
                            <form onSubmit={onSubmitAbsent}>
                                <label htmlFor="comment">
                                    <span className="name-field">Izoh qoshish</span>
                                    <textarea
                                        value={reason}

                                        id="comment"
                                        onChange={e => setReason(e.target.value)}
                                    />
                                </label>
                                <input type="submit" className="input-submit" value="Kiritish"/>
                            </form>
                        </div>
                    </Modal> :
                    modalName === "checked" ?
                        <Modal id={"1"} activeModal={activeModal} setActiveModal={() => {
                            setActiveModal(false)
                        }}>
                            <div className="checked">

                                <form onSubmit={onCheckedStudents}>
                                    <h1>Davomat qilinganlar</h1>
                                    <div className="checkedStudents">
                                        {students.filter(item => item.attended).length === 0 ?
                                            <h1>Studentlar davomat qilinmagan</h1> : null}
                                        {renderedCheckedStudents}
                                    </div>
                                    <input disabled={!isDisabled} type="submit" className="input-submit"
                                           value="Kiritish"/>
                                </form>
                            </div>
                        </Modal> : null
            }
        </div>
    )
})

export default ListAttendance;