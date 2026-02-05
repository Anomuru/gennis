import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import "./platformCreateGroup.sass"
import Button from "components/platform/platformUI/button";
import Input from "components/platform/platformUI/input";
import Select from "components/platform/platformUI/select";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "hooks/http.hook";

import {
    fetchCreateGroupTools, fetchNewStudents,
    setActiveBtn,
    setPage
} from "slices/newStudentsSlice";


import { BackUrl, headers } from "constants/global";
import UsersTable from "components/platform/platformUI/tables/usersTable";
import PlatformSearch from "components/platform/platformUI/search";
import Filters from "components/platform/platformUI/filters";
import { fetchFilters } from "slices/filtersSlice";
import { useParams } from "react-router-dom";
import Modal from "components/platform/platformUI/modal";
import classNames from "classnames";
import { fetchDataToChange } from "slices/dataToChangeSlice";
import { useAuth } from "hooks/useAuth";
import PlatformMessage from "components/platform/platformMessage";
import { setMessage } from "slices/messageSlice";
import { fetchTeachers, fetchTeachersByLocation } from "../../../slices/teachersSlice";
import { fetchAssistantByTeacher } from 'slices/assistantSlice';


const PlatformCreateGroup = () => {


    const { locationId } = useParams()


    const [activeModal, setActiveModal] = useState(false)
    const [groupData, setGroupData] = useState({
        teacher: {},
        students: [],
        asistant: {},
        groupInfo: {},
        time: []
    })
    const [getErrors, setGetErrors] = useState([])


    return (
        <div className="create">
            <div className="create__header">
                <div disabled={getErrors.length > 0} className="checkedSt" onClick={() => !getErrors.length > 0 && setActiveModal(!activeModal)}>
                    <i className="fas fa-bars" />
                </div>
            </div>
            <div className="create__wrapper">
                <Users setGetErrors={setGetErrors} locationId={locationId} setGroupData={setGroupData} groupData={groupData} />
            </div>

            <Modal id={"checkedStudents"} activeModal={activeModal} setActiveModal={() => setActiveModal(false)}>
                <CheckedStudents setActiveModal={setActiveModal} groupData={groupData} setGroupData={setGroupData} />
            </Modal>

        </div>
    );
};


const Users = ({ locationId, setGroupData, groupData, setGetErrors }) => {


    const { newStudents, fetchFilteredStudentsStatus } = useSelector(state => state.newStudents)
    const { filters } = useSelector(state => state.filters)
    const { data: assistantsList, loading, error } = useSelector(state => state.assistantSlice);


    const [users, setUsers] = useState([])
    const [checkedUsers, setCheckedUsers] = useState([])
    const [students, setStudents] = useState([])
    const [teachers, setTeachers] = useState([])
    const [assistants, setAssistants] = useState([])
    const [groupError, setGroupError] = useState([])
    const { teacherss, btns, fetchTeachersStatus } = useSelector(state => state.teachers)
    const [currentPage, setCurrentPage] = useState(1);

    const { selectedLocation } = useAuth()

    const filterRef = useRef()
    const [activeOthers, setActiveOthers] = useState(false)
    const [pageSize, setPageSize] = useState(50)
    const [heightOtherFilters, setHeightOtherFilters] = useState(0)
    const [search, setSearch] = useState("")
    const [days, setDays] = useState([])
    const [lessons, setLessons] = useState([
        {
            id: 1,
            selectedDay: null,
            selectedRoom: null,
            startTime: null,
            endTime: null
        }
    ])


    const [activeModal, setActiveModal] = useState()
    const [activeType, setActiveType] = useState("students")

    const { dataToChange } = useSelector(state => state.dataToChange)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    }, [])

    useEffect(() => {
        if (activeType === "students") {
            const newData = {
                name: "newStudents",
                location: locationId,
            }
            dispatch(fetchNewStudents({ locationId }))
            setUsers(students)
        } else if (activeType === "teachers") {
            const newData = {
                name: "teachers",
                location: locationId
            }
            dispatch(fetchTeachersByLocation({ locationId }))
            setUsers(teachers)
        } else if (activeType === "asistant") {
            setUsers(assistants)
        }
    }, [locationId, activeType])


    useEffect(() => {
        if (activeType === "asistant" && groupData.teacher) {

            dispatch(fetchAssistantByTeacher({ locationId, teacher: groupData.teacher.teacher_id, lessons }))
        }
    }, [groupData.teacher, activeType])

    useEffect(() => {
        if (assistantsList?.length) {

            setAssistants(assistantsList)
        }
    }, [assistantsList?.length])

    useEffect(() => {
        if (assistants) {
            setUsers(assistants)
        }
    }, [assistants])

    useEffect(() => {
        if (Object.keys(dataToChange).length > 0) {
            setDays(dataToChange.days)
        }
    }, [dataToChange])


    const multiPropsFilter = useMemo(() => {
        const filterKeys = Object.keys(filters);
        return users.filter(user => {
            return filterKeys.every(key => {
                if (!filters[key]?.activeFilters && filters[key]?.fromTo) {
                    if (filters[key]?.fromTo.from && filters[key]?.fromTo.to) {
                        return user[key] >= filters[key].fromTo.from && user[key] <= filters[key]?.fromTo.to
                    }
                    return true
                }
                if (!filters[key]?.activeFilters?.length) return true;
                if (Array.isArray(user[key])) {
                    return user[key]?.some(keyEle =>
                        filters[key].activeFilters?.some(
                            keyFil => keyFil.toLowerCase().includes(keyEle.toLowerCase())
                        )
                    );
                }
                return filters[key]?.activeFilters?.includes(user[key]);
            });
        });
    }, [filters, users]);


    const searchedUsers = useMemo(() => {
        const filteredHeroes = multiPropsFilter.slice()
        return filteredHeroes.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.surname.toLowerCase().includes(search.toLowerCase()) ||
            item.username.toLowerCase().includes(search.toLowerCase())
        )
    }, [multiPropsFilter, search])


    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        return searchedUsers.slice(firstPageIndex, lastPageIndex);
    }, [pageSize, currentPage, searchedUsers]);


    const activeItems = useMemo(() => {
        if (activeType === "teachers" || activeType === "asistant") {
            return {
                name: true,
                surname: true,
                subjects: true,
                color: true,
                shift: true,
                radio: true
            }
        }
        return {
            name: true,
            surname: true,
            age: true,
            reg_date: true,
            checked: true,
            comment: true,
            subjects: true,
            color: true,
            shift: true
        }
    }, [activeType])



    useEffect(() => {
        const filteredUsers = students.filter(item => item.checked)
        const filteredTeachers = teachers.filter(item => item.radioChecked)
        const filteredAssistants = assistants.filter(item => item.radioChecked)

        setGroupData(item => {
            return { ...item, students: filteredUsers, teacher: filteredTeachers[0], asistant: filteredAssistants[0] }
        })
    }, [setGroupData, students, teachers, assistants])

    useEffect(() => {
        const filteredUsers = users.filter(item => item.checked)
        setCheckedUsers(filteredUsers)
    }, [users])

    useEffect(() => {
        if (groupData.isChanged) {
            setUsers(users => users.map(item => {
                if (groupData.students.some(st => st.id === item.id)) {
                    return item
                } else {
                    return { ...item, checked: false }
                }
            }))
            setStudents(users => users.map(item => {
                if (groupData.students.some(st => st.id === item.id)) {
                    return item
                } else {
                    return { ...item, checked: false }
                }
            }))
            setGroupData(data => ({ ...data, isChanged: false }))
        }
    }, [groupData.isChanged])


    const setChecked = useCallback((id) => {
        if (activeType === "students") {
            setUsers(users => users.map(item => {
                if (item.id === id) {
                    return { ...item, checked: !item.checked }
                }
                return item
            }))
            setStudents(users => users.map(item => {
                if (item.id === id) {
                    return { ...item, checked: !item.checked }
                }
                return item
            }))
        } else if (activeType === "teachers") {
            setUsers(users => users.map(item => {
                if (item.id === id) {
                    return { ...item, radioChecked: true }
                }
                return { ...item, radioChecked: false }
            }))
            setTeachers(users => users.map(item => {
                if (item.id === id) {
                    return { ...item, radioChecked: true }
                }
                return { ...item, radioChecked: false }
            }))
        } else if (activeType === "asistant") {
            setUsers(users => users.map(item => {
                if (item.id === id) {
                    return { ...item, radioChecked: true }
                }
                return { ...item, radioChecked: false }
            }))
            setAssistants(users => users.map(item => {
                if (item.id === id) {
                    return { ...item, radioChecked: true }
                }
                return { ...item, radioChecked: false }
            }))
        }
    }, [activeType])


    const funcsSlice = useMemo(() => {
        return {
            setChecked: { func: setChecked, type: "simpleFunc" },
            setActiveBtn,
            setPage
        }
    }, [setChecked])


    const onLoadMore = () => {
        if (pageSize < searchedUsers.length) setPageSize(pageSize + 50)
    }


    const renderDays = useCallback(() => {

        if (lessons.length > 0 && days.length > 0)
            return lessons.map((item, index) => {
                return (
                    <div className="days__item">
                        <Select
                            options={days}
                            onChangeOption={(e) => onSetDay(e, item.id)}
                            name={`days-${index}`}
                            title="Kunlar"
                            defaultValue={item.selectedDay?.id}
                        />

                        <Select
                            group={true}
                            name={`rooms-${index}`}
                            title={`Honalar`}
                            options={dataToChange?.rooms}
                            onChangeOption={(e) => onSetRoom(e, item.id)}
                            defaultValue={item.selectedRoom?.id}
                        />


                        <Input onChange={(e) => onSetStartTime(e, item.id)} defaultValue={item.startTime}
                            name={`start-${index}`} title={"Boshlanish vaqti"} type={"time"} />
                        <Input onChange={(e) => onSetEndTime(e, item.id)} defaultValue={item.endTime}
                            name={`end-${index}`} title={"Tugash vaqti"} type={"time"} />

                        {/*<label className="time-label" htmlFor="time-label">*/}
                        {/*    <span className="name-field">Boshlanish vaqti</span>*/}
                        {/*    <input onChange={(e) => onSetStartTime(e,item.id)} value={startTime} className="input-fields" type="time"/>*/}
                        {/*</label>*/}

                        {/*<label className="time-label" htmlFor="time-label">*/}
                        {/*    <span className="name-field">Tugash vaqti</span>*/}
                        {/*    <input onChange={(e) => onSetEndTime(e,item.id)} value={endTime} className="input-fields" type="time"/>*/}
                        {/*</label>*/}

                        {
                            index !== 0 ?
                                <div className="days__item-del" onClick={() => delLesson(item.id)}>
                                    <i className="fas fa-minus" />
                                </div> : null
                        }
                    </div>
                )
            })
    }, [lessons, days])

    const delLesson = (id) => {

        const lesson = lessons.filter(item => item.id === id)

        if (lesson[0].selectedDay) {
            setDays(days => {
                return days.map(item => {
                    if (item.name === lesson[0].selectedDay.name) {
                        return { ...item, disabled: false, isActive: null }
                    }
                    return item
                })
            })
        }


        setLessons(lessons => lessons.filter(item => item.id !== id))
    }

    const onSetDay = (day, id) => {

        if (day !== "Fan tanla") {
            const filteredDays = days.filter(item => item.id === +day)
            setDays(days => {
                return days.map(item => {
                    if (item.id === +day && !item.isActive) {
                        return { ...item, disabled: true, isActive: id }
                    }
                    if (item?.isActive !== id) {
                        return item
                    }
                    return { ...item, disabled: false, isActive: null }
                })
            })

            setLessons(lessons => {
                return lessons.map(item => {
                    if (item.id === id) {
                        return { ...item, selectedDay: filteredDays[0] }
                    }
                    return item
                })
            })
        }
    }

    const onSetRoom = (roomId, id) => {
        const filteredRoom = dataToChange.rooms.filter(item => item.id === +roomId)
        setLessons(lessons => {
            return lessons.map(item => {
                if (item.id === id) {
                    return { ...item, selectedRoom: filteredRoom[0] }
                }
                return item
            })
        })
    }

    const onSetStartTime = (value, id) => {
        setLessons(lessons => {
            return lessons.map(item => {
                if (item.id === id) {
                    return { ...item, startTime: value }
                }
                return item
            })
        })
    }

    const onSetEndTime = (value, id) => {
        setLessons(lessons => {
            return lessons.map(item => {
                if (item.id === id) {
                    return { ...item, endTime: value }
                }
                return item
            })
        })
    }

    const onAddBtn = () => {
        const lastElem = lessons.filter((item, index) => index === lessons.length - 1)

        setLessons([...lessons, {
            id: lastElem[0].id + 1,
            selectedDay: null,
            selectedRoom: null,
            startTime: null,
            endTime: null
        }])

    }

    const { request } = useHttp()


    const onSubmit = (e) => {
        e.preventDefault()
        const data = {
            lessons
        }

        request(`${BackUrl}create_group/get_students/${locationId}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                if (res.success) {
                    setGroupError(res.data.gr_errors)
                    setGetErrors(res.data.gr_errors)
                    activeType === "students" ? setUsers(res.data.students) : setUsers(res.data.teachers)
                    setStudents(res.data.students)
                    setTeachers(res.data.teachers)
                    setGroupData({
                        teacher: {},
                        students: [],
                        asistant: {},
                        groupInfo: {},
                        time: lessons
                    })


                    setLessons(lessons => {
                        return lessons.map(item => {
                            return { ...item, isChecked: true }
                        })
                    })
                    setActiveModal(false)

                } else {
                    // setTypeMsg("error")
                    // setMsg(res.msg)
                    // setActiveMessage(true)
                }
            })
    }


    const isSubmit = !lessons.every(item => item.selectedDay && item.selectedRoom && item.endTime && item.startTime)

    return (
        <section className="section create__section">
            <header className="section__header">
                <div key={1}>
                    <PlatformSearch search={search} setSearch={setSearch} />
                    <Button onClickBtn={() => setActiveModal(true)}>
                        Vaqt kiritish
                    </Button>
                </div>
                <div key={2}>
                    <Button
                        onClickBtn={() => {
                            setActiveOthers(!activeOthers)
                            setHeightOtherFilters(filterRef.current.scrollHeight)
                        }}
                        active={activeOthers}
                    >
                        Filterlar
                    </Button>

                </div>
                <Filters key={3} filterRef={filterRef} filters={filters} heightOtherFilters={heightOtherFilters}
                    activeOthers={activeOthers} />
            </header>

            <div className="links">
                <Button name={"students"} onClickBtn={setActiveType} active={activeType === "students"}>
                    O'quvchilar
                </Button>

                <Button name={"teachers"} onClickBtn={setActiveType} active={activeType === "teachers"}>
                    O'qituvchilar
                </Button>

                <Button name={"asistant"} onClickBtn={setActiveType} active={activeType === "asistant"}>
                    Asistentlar
                </Button>
            </div>
            <div className="error">
                {groupError.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '10px',
                            marginBottom: '8px',
                            backgroundColor: '#fee',
                            borderLeft: '3px solid #f00',
                            borderRadius: '4px'
                        }}
                    >
                        {item}
                    </div>
                ))}
            </div>
            <main className="section__main">
                {
                    !users.length
                        ? typeof assistantsList === "object"
                            ? <h1 className="error">{assistantsList.error}</h1> : <h1 className="error">O'quvchilar yoq</h1>
                        :
                        <UsersTable
                            fetchUsersStatus={fetchFilteredStudentsStatus}
                            funcsSlice={funcsSlice}
                            activeRowsInTable={activeItems}
                            users={currentTableData}
                            pageName={"newStudents"}
                            checkedUsers={checkedUsers}
                        />
                }
                {
                    searchedUsers.length > pageSize ?
                        <div className="loadMore">
                            <Button onClickBtn={onLoadMore}><i className="fas fa-plus" /></Button>
                        </div> : null
                }
            </main>
            <Modal
                activeModal={activeModal}
                setActiveModal={() => {
                    if (lessons.every(item => item.isChecked)) setActiveModal(false)
                }}
            >
                <div className="changeTime">
                    <form action="" onSubmit={onSubmit}>
                        <div className="days">
                            <div className="days__wrapper">
                                {renderDays()}
                            </div>
                            {
                                lessons.length < 7 ?
                                    <div className="days__btn">
                                        <i onClick={onAddBtn} className="fas fa-plus"></i>
                                    </div> : null
                            }
                        </div>
                        <input disabled={isSubmit} type="submit" value="Tekshirmoq" className="input-submit" />
                    </form>
                </div>
            </Modal>
        </section>
    )
}


const CheckedStudents = ({ groupData, setGroupData, setActiveModal }) => {
    const [error, setError] = useState(false)

    const renderCheckedStudents = useCallback(() => {
        if (groupData?.students?.length !== 0) {
            return groupData?.students?.map(st => {
                return (
                    <div
                        key={st}
                        className={classNames("checkedStudents__item", {
                            isShift: st.color === "green" && st.subjects?.includes(groupData?.subject),
                        })}
                    >
                        <div>
                            <h2>{st.name}</h2>
                            <h2>{st.surname}</h2>
                            <input
                                onChange={() => onChecked(st.id)}
                                type="checkbox"
                                checked={st.checked}
                            />
                        </div>
                        <span className="error">
                            {!st.subjects?.includes(groupData?.subject) ? "Tanlangan fan student faniga tog'ri kelmaydi" : null}
                        </span>
                    </div>
                )
            })
        } else {
            return (
                <h1 className="error">
                    Studentlar tanlanmagan !
                </h1>
            )
        }
    }, [groupData?.students, groupData?.subject])

    useEffect(() => {
        setError(!groupData?.students?.every(item => item.subjects.some(sub => sub === groupData?.subject) && item.color === "green"))

    }, [groupData?.students, groupData?.subject])


    const renderedCheckedSt = renderCheckedStudents()

    const onChecked = (id) => {
        setGroupData(data => {
            return { ...data, students: data.students.filter(item => item.id !== id), isChanged: true }
        })
    }

    // const isShift = checkedStudents.every(item => item.color === "green")

    return (
        <div className="checkedStudents">
            <GroupInfo
                setActiveModal={setActiveModal}
                groupData={groupData}
                setGroupData={setGroupData}

                error={error}
                setError={setError}
            />
            <div className="checkedStudents__wrapper">
                <form action="">
                    <h1>Tanlangan O'quvchilar</h1>
                    {renderedCheckedSt}
                    {/*<input disabled={!isShift} type="submit" className={"input-submit"} />*/}
                </form>
            </div>
        </div>
    )
}


const GroupInfo = React.memo(({ groupData, setGroupData, error, setError, setActiveModal }) => {

    const { createGroupTools } = useSelector(state => state.newStudents)

    const [subject, setSubject] = useState()

    const [selectedTypeCourse, setSelectedTypeCourse] = useState(null)
    const [nameGroup, setNameGroup] = useState(null)
    const [priceCourse, setPriceCourse] = useState(null)
    const [teacherDolya, setTeacherDolya] = useState(null)
    const [assistantSalary, setAssistantSalary] = useState(null)
    // const [attendanceDays,setAttendanceDays] = useState(null)

    const [errorMsg, setErrorMsg] = useState("")

    const [innerError, setInnerError] = useState(false)

    const { selectedLocation } = useAuth()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCreateGroupTools(selectedLocation))
    }, [dispatch, selectedLocation])

    // useEffect(() => {
    //     if (groupData) {
    //         setSubject(groupData.subject)
    //         setNameGroup(groupData.groupName)
    //         setSelectedTypeCourse(groupData.typeCourse)
    //         setPriceCourse(groupData.groupPrice)
    //         setTeacherDolya(groupData.teacherDolya)
    //     }
    // },[groupData])


    const { request } = useHttp()

    const onSubmit = (e) => {

        e.preventDefault()

        let data = {
            ...groupData,
            groupInfo: {
                groupName: nameGroup,
                groupPrice: priceCourse,
                subject,
                typeCourse: selectedTypeCourse,
                teacherDolya,
            }
        }

        if (groupData.asistant) {
            data = {
                ...data,
                groupInfo: {
                    ...data.groupInfo,
                    assistent_id: groupData.asistant.id,
                    assistentSalary: assistantSalary
                }
            }
        }



        // dispatch(deleteCheckedStudents({ checkedStudents }))
        // dispatch(fetchFilteredStudents(data))

        request(`${BackUrl}create_group/create_group_time/${selectedLocation}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    setActiveModal(false)
                } else {
                    dispatch(setMessage({
                        msg: `Serverda hatolik`,
                        type: "error",
                        active: true
                    }))

                }
            })
    }


    useEffect(() => {
        if (subject) {
            setGroupData(item => {
                return { ...item, subject }
            })
        }
    }, [setGroupData, subject])


    useEffect(() => {
        if (subject && groupData.teacher) {
            setInnerError(!groupData?.teacher?.subjects.includes(subject))
            setErrorMsg("O'qituvchining fani tanlangan fanga tog'ri kelmaydi")
            dispatch(setMessage({
                msg: "O'qituvchining fani tanlangan fanga tog'ri kelmaydi",
                type: "error",
                active: !groupData?.teacher?.subjects.includes(subject)
            }))
        } else {
            setErrorMsg("O'qituvchi tanlanmagan")
            setInnerError(true)
        }
    }, [groupData, setError, subject])


    return (
        <div className="groupInfo">
            <form className="groupInfo__form" onSubmit={onSubmit}>
                <h1>Gruppa ochish</h1>

                {/*<label htmlFor="time-label">*/}
                {/*    <span className="name-field">Boshlanish vaqti</span>*/}
                {/*    <input onChange={e => setStartTime(e.target.value)} value={startTime} className="input-fields" type="time"/>*/}
                {/*</label>*/}

                {/*<label htmlFor="time-label">*/}
                {/*    <span className="name-field">Tugash vaqti</span>*/}
                {/*    <input onChange={e => setEndTime(e.target.value)} value={endTime} className="input-fields" type="time"/>*/}
                {/*</label>*/}


                <Select
                    keyValue={"name"}
                    defaultValue={subject}
                    name={'subjects'}
                    title={"Fanlar"}
                    options={createGroupTools?.subjects}
                    onChangeOption={(e) => {
                        setSubject(e)
                        setGroupData(item => {
                            return { ...item, subject: e }
                        })
                    }}
                />


                <div className="teacher">
                    <div>
                        <span>O'qituvchi:</span>
                        <span> {groupData?.teacher?.name} {groupData?.teacher?.surname}</span>
                    </div>
                    <div>
                        <span>Assistent:</span>
                        <span> {groupData?.asistant?.name} {groupData?.asistant?.surname}</span>
                    </div>
                    <span className="error">
                        {
                            innerError ? errorMsg : null
                        }
                    </span>
                </div>


                {/*<Select*/}
                {/*    defaultValue={groupData?.teacher}*/}
                {/*    teachers={true}*/}
                {/*    name={'teachers'}*/}
                {/*    title={"Teachers"}*/}
                {/*    options={filteredTeachers}*/}
                {/*    onChangeOption={setSelectedTeachers}*/}
                {/*/>*/}
                <Input
                    defaultValue={nameGroup}
                    required={true}
                    type={`text`}
                    // name={`name-of-group`}
                    title={`Gruppa nomi`}
                    onChange={setNameGroup}
                />
                <Select
                    required={true}
                    keyValue={"name"}
                    defaultValue={selectedTypeCourse}
                    name={"type-course"}
                    title={"Kurs turi"}
                    options={createGroupTools?.course_types}
                    onChangeOption={setSelectedTypeCourse}
                />
                {/*<Select*/}
                {/*    defaultValue={groupData?.selectedRoom}*/}
                {/*    name={"rooms"}*/}
                {/*    title={"Honalar"}*/}
                {/*    options={createGroupTools?.rooms}*/}
                {/*    onChangeOption={setSelectedRoom}*/}
                {/*/>*/}
                <Input
                    defaultValue={priceCourse}
                    required={true}
                    type={`number`}
                    name={`price-of-group`}
                    title={`Gruppa narxi`}
                    onChange={setPriceCourse}
                />
                <Input
                    defaultValue={teacherDolya}
                    required={true}
                    type={`number`}
                    name={`dolya-of-teacher`}
                    title={`O'qituvchi ulushi`}
                    onChange={setTeacherDolya}
                />
                <Input
                    defaultValue={assistantSalary}
                    required={true}
                    type={`number`}
                    name={`assistentSalary`}
                    title={`Asistent ulushi`}
                    onChange={setAssistantSalary}
                />

                <input
                    className="input-submit"
                    disabled={error || innerError}
                    type="submit"
                />

            </form>
        </div>
    )
})


export default PlatformCreateGroup;