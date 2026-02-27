import React, { useCallback, useEffect, useMemo, useState } from 'react';


import "./changeGroupTime.sass"
import "styles/components/_form.sass"
import img from "assets/user-interface/user_image.png"
import Select from "components/platform/platformUI/select";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataToChange } from "slices/dataToChangeSlice";
import group, { fetchGroup } from "slices/groupSlice";
import { useParams } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";
import { logout } from "slices/meSlice";
import Input from "components/platform/platformUI/input";
import { setMessage } from "slices/messageSlice";

const ChangeGroupTime = () => {

    const { groupId } = useParams()
    const { dataToChange } = useSelector(state => state.dataToChange)
    const { data, time_table } = useSelector(state => state.group)
    const dispatch = useDispatch()

    const { selectedLocation } = useAuth()

    const [students, setStudents] = useState([])
    const [days, setDays] = useState([])
    const [groupError, setGroupError] = useState("")
    const [teacherError, setTeacherError] = useState("")
    const [lessons, setLessons] = useState([
        {
            id: 1,
            selectedDay: null,
            selectedRoom: null,
            startTime: null,
            endTime: null
        }
    ])




    // const [selectedDays,setSelectedDays] = useState([])

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
        dispatch(fetchGroup(groupId))
    }, [dispatch, groupId, selectedLocation])





    useEffect(() => {
        if (dataToChange) {
            if (time_table?.length > 0) {
                const mappedLessons = time_table.map((day, index) => {
                    const filteredRoom = dataToChange?.rooms?.find(item => item.name === day.room || item.id === day.room || item.id === +day.room);
                    const filteredDay = dataToChange?.days?.find(item => item.name === day.day || item.id === day.day || item.id === +day.day);

                    return {
                        id: index + 1,
                        selectedDay: filteredDay,
                        selectedRoom: filteredRoom,
                        startTime: day.start_time,
                        endTime: day.end_time,
                        timeId: day.time_id
                    }
                });

                setLessons(mappedLessons);

                const activeDays = mappedLessons.map(lesson => ({ name: lesson.selectedDay?.name, id: lesson.id }));
                setDays(dataToChange?.days?.map(item => {
                    const activeMatch = activeDays.find(d => d.name === item.name);
                    if (activeMatch) {
                        return { ...item, disabled: true, isActive: activeMatch.id };
                    }
                    return { ...item, disabled: false, isActive: null };
                }));

            } else {
                setDays(dataToChange?.days);
            }
        }
    }, [time_table, dataToChange])

    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [isDisabled, setIsDisabled] = useState(false)



    const { request } = useHttp()
    const onSubmit = (e) => {
        e.preventDefault()
        const data = {
            lessons
        }

        request(`${BackUrl}group_change/check_time_group/${groupId}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                console.log(res)
                if (res.success) {
                    setStudents(res.students)
                    setGroupError(res.group)
                    setTeacherError(res.teacher)
                } else {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "error",
                        active: true
                    }))
                }
            })
    }

    const onChangeSubmit = (e) => {
        e.preventDefault()
        const data = {
            lessons,
        }


        request(`${BackUrl}group_change/change_time_group/${groupId}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                }
            })

    }

    // useEffect(() => {
    //
    //     const data = {
    //         startTime,
    //         endTime,
    //         selectedRoom,
    //         selectedDays
    //     }
    //
    //     request(`${BackUrl}check_time_group/${groupId}`, "POST",JSON.stringify(data),headers())
    //         .then(res => {
    //             if (res.success) {
    //                 setStudents(res.students)
    //                 setGroupError(res.group)
    //             } else {
    //                 console.log(res)
    //                 setTypeMsg("error")
    //                 setMsg(res.msg)
    //                 setActiveMessage(true)
    //             }
    //
    //         })
    // },[selectedDays, endTime, groupId, selectedRoom, startTime])


    // useEffect(() => {
    //     if (students.length !== 0) {
    //         // eslint-disable-next-line react-hooks/exhaustive-deps
    //         setIsDisabled(students.some(item => item.shift[0].length !== 0))
    //     }
    // },[students])

    // useEffect(() => {
    //     if (!startTime && !endTime && !selectedDays.length && !selectedRoom) {
    //         setIsDisabled(true)
    //     } else if (startTime && endTime && selectedDays.length > 0 && selectedRoom) {
    //         setIsDisabled(false)
    //     }
    // },[endTime, selectedDays.length, selectedRoom, startTime])



    const renderStudents = useCallback(() => {
        // eslint-disable-next-line array-callback-return
        if (students.length !== 0) {
            return students.map((st, i) => {
                return (
                    <div key={st.id || i} className={`students__item ${st.color}`}>
                        <div className="students__item-info">
                            <img src={img} alt="" />
                            <div>
                                {st.name}
                            </div>
                            <div>
                                {st.surname}
                            </div>
                            <div>
                                {st.phone}
                            </div>
                        </div>
                        {
                            st.shift ?
                                <div className="students__item-comments">
                                    {st.shift}
                                </div> : null
                        }

                        {/*{*/}
                        {/*    st.shift[0]?.length !== 0 ?*/}
                        {/*        */}
                        {/*            <ol>*/}
                        {/*                {st?.shift?.map(item => {*/}
                        {/*                    return (*/}
                        {/*                        <li>{item}</li>*/}
                        {/*                    )*/}
                        {/*                })}*/}
                        {/*            </ol>*/}

                        {/*       : null*/}
                        {/*}*/}
                    </div>
                )
            })
        }

    }, [students])

    const onSetDay = (subjectName, id) => {

        if (subjectName !== "Fan tanla") {
            const filteredDays = days.filter(item => item.name === subjectName)
            setDays(subjects => {
                return subjects.map(item => {
                    if (item.name === subjectName && !item.isActive) {
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


    //
    // const onDeleteDay = (subjectName) => {
    //     if (subjectName !== "Fan tanla" ) {
    //         setDays(subjects => {
    //             return subjects.map(item => {
    //                 if (item.name === subjectName) {
    //                     return {...item,disabled: false}
    //                 }
    //                 return item
    //             })
    //         })
    //         setSelectedDays(selectedDays.filter(item => item.name !== subjectName))
    //     }
    // }



    // const renderDays = (list) => {
    //     return (
    //         list.map((item,index) => {
    //             return (
    //                 <div
    //                     key={index}
    //                     className="subjects__item"
    //                 >
    //                     <div className="subjects__item-info">
    //                         <span>
    //                             {item.name}
    //                         </span>
    //                         <i
    //                             onClick={() => onDeleteDay(item.name)}
    //                             className="fas fa-times"
    //                         />
    //                     </div>
    //                 </div>
    //             )
    //         })
    //     )
    // }

    const onAddBtn = () => {
        const lastElem = lessons.filter((item, index) => index === lessons.length - 1)

        setLessons([...lessons, { id: lastElem[0].id + 1, selectedDay: null, selectedRoom: null }])

    }

    const delFromLesson = (id) => {

        const lesson = lessons.filter(item => item.id === id)

        if (lesson[0].selectedDay) {
            setDays(subjects => {
                return subjects.map(item => {
                    if (item.name === lesson[0].selectedDay.name) {
                        return { ...item, disabled: false, isActive: null }
                    }
                    return item
                })
            })
        }


        setLessons(lessons => lessons.filter(item => item.id !== id))
    }

    const onDelLesson = (id, timeId) => {

        const lesson = lessons.filter(item => item.id === id)


        request(`${BackUrl}group_change/delete_time_table/${timeId}`, "GET", null, headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                }
            })

        if (lesson[0].selectedDay) {
            setDays(subjects => {
                return subjects.map(item => {
                    if (item.name === lesson[0].selectedDay.name) {
                        return { ...item, disabled: false, isActive: null }
                    }
                    return item
                })
            })
        }


        setLessons(lessons => lessons.filter(item => item.id !== id))

    }

    const renderDays = useCallback(() => {
        console.log(days, "days")
        console.log(dataToChange?.rooms, "dataToChange?.rooms")
        // console.log(lessons)
        return lessons.map((item, index) => {
            return (
                <div className="days__item" key={item.id || item.timeId || index}>
                    <Select
                        keyValue={"name"}
                        options={days}
                        onChangeOption={(e) => onSetDay(e, item.id)}
                        name={`days-${index}`}
                        title="Kunlar"
                        defaultValue={item.selectedDay?.name}
                    />

                    <Select
                        group={true}
                        name={`rooms-${index}`}
                        title={`Honalar`}
                        options={dataToChange?.rooms}
                        onChangeOption={(e) => onSetRoom(e, item.id)}
                        defaultValue={item.selectedRoom?.id}
                    />


                    <Input onChange={(e) => onSetStartTime(e, item.id)} defaultValue={item.startTime} name={`start-${index}`} title={"Boshlanish vaqti"} type={"time"} />
                    <Input onChange={(e) => onSetEndTime(e, item.id)} defaultValue={item.endTime} name={`end-${index}`} title={"Tugash vaqti"} type={"time"} />

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
                            <div className="days__item-del" onClick={() => delFromLesson(item.id)}>
                                <i className="fas fa-minus" />
                            </div> : null
                    }
                    {
                        item.timeId ?
                            <div className="days__item-del" onClick={() => onDelLesson(item.id, item.timeId)}>
                                <i className="fas fa-times" />
                            </div> : null
                    }

                </div>
            )
        })
    }, [lessons, days, dataToChange, delFromLesson])


    useEffect(() => {
        if (students.filter(item => item.error).length > 0) {
            setIsDisabled(true)
        } else if (groupError !== "") {
            setIsDisabled(true)
        } else if (teacherError !== "") {
            setIsDisabled(true)
        } else if (students.length === 0) {
            setIsDisabled(true)
        } else {
            setIsDisabled(false)
        }
    }, [groupError, students])


    const renderedStudents = renderStudents()


    return (
        <div className="changeGroupTime">
            <form className="changeGroupTime__buttons" onSubmit={onChangeSubmit}>
                <input disabled={isDisabled} type="submit" value="O'zgartirish" className="input-submit" />
            </form>
            <div className="changeGroupTime__header">

                <form action="" onSubmit={onSubmit}>
                    <div className="time">
                        {/*<label className="time-label" htmlFor="time-label">*/}
                        {/*    <span className="name-field">Boshlanish vaqti</span>*/}
                        {/*    <input onChange={e => setStartTime(e.target.value)} value={startTime} className="input-fields" type="time"/>*/}
                        {/*</label>*/}
                        {/*<label className="time-label" htmlFor="time-label">*/}
                        {/*    <span className="name-field">Tugash vaqti</span>*/}
                        {/*    <input onChange={e => setEndTime(e.target.value)} value={endTime} className="input-fields" type="time"/>*/}
                        {/*</label>*/}
                    </div>



                    {/*<Select*/}
                    {/*    group={true}*/}
                    {/*    defaultValue={selectedRoom}*/}
                    {/*    name={"rooms"}*/}
                    {/*    title={"Honalar"}*/}
                    {/*    options={dataToChange?.rooms}*/}
                    {/*    onChangeOption={setSelectedRoom}*/}
                    {/*/>*/}


                    {/*{*/}
                    {/*    selectedDays.length < 3 ? (*/}
                    {/*        // <label htmlFor="subjects">*/}
                    {/*        //     <select*/}
                    {/*        //         id="subjects"*/}
                    {/*        //         className="input-fields"*/}
                    {/*        //         onChange={e => onGetDay(e.target.value)}*/}
                    {/*        //     >*/}
                    {/*        //         <option value="Fan tanla" >Kun tanlang</option>*/}
                    {/*        //         {*/}
                    {/*        //             days?.map(item => {*/}
                    {/*        //                 return (*/}
                    {/*        //                     <option disabled={item.disabled}  key={item.id} value={item.name}>{item.name}</option>*/}
                    {/*        //                 )*/}
                    {/*        //             })*/}
                    {/*        //         }*/}
                    {/*        //     </select>*/}
                    {/*        //*/}
                    {/*        // </label>*/}

                    {/*        */}

                    {/*    ) : null*/}
                    {/*}*/}


                    <div className="days" >

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

                    {/*<div className="subjects">*/}
                    {/*    <h3>Tanlangan kunlar:</h3>*/}
                    {/*    <div className="subjects__wrapper">*/}
                    {/*        {renderDays(selectedDays)}*/}
                    {/*    </div>*/}
                    {/*</div>*/}



                    <input type="submit" value="Tekshirmoq" className="input-submit" />





                </form>
            </div>


            <div className="changeGroupTime__content">
                <div className="error">
                    <div>{groupError ? groupError : null}</div>
                    <div>{teacherError ? teacherError : null}</div>
                </div>
                <div className="students">
                    {renderedStudents}
                </div>
            </div>




            <div className="changeGroupTime__footer">

            </div>

        </div>
    );
};


export default ChangeGroupTime;