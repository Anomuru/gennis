import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";


import "./changeGroupInfo.sass"
import Select from "components/platform/platformUI/select";
import { useDispatch, useSelector } from "react-redux";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Modal from "components/platform/platformUI/modal";

import { fetchTeachers, fetchTeachersByLocation } from "slices/teachersSlice";
import { fetchDataToChange } from "slices/dataToChangeSlice";
import { fetchGroup } from "slices/groupSlice";
import { Link, useParams } from "react-router-dom";
import { BackUrl, headers } from "constants/global";
import { removeCheckedStudent, requestStudent } from "slices/makeAttendanceSlice";
import { useHttp } from "hooks/http.hook";
import { fetchCreateGroupTools } from "slices/newStudentsSlice";
import Button from "components/platform/platformUI/button";
import { setMessage } from "slices/messageSlice";

const ChangeGroupInfo = () => {

    const { groupId } = useParams()

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm({
        mode: "onBlur"
    })



    const { dataToChange } = useSelector(state => state.dataToChange)
    const { teachers } = useSelector(state => state.teachers)
    const { teacherId, data, subject, groupStatus, level, levels } = useSelector(state => state.group)
    const { location } = useSelector(state => state.me)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchDataToChange(location))
        dispatch(fetchTeachersByLocation(location))
        dispatch(fetchGroup(groupId))
    }, [dispatch, groupId, location])



    const { isCheckedPassword } = useSelector(state => state.me)

    const [eduLang, setEduLang] = useState("")
    const [teacher, setTeacher] = useState("")
    const [filteredTeachers, setFilteredTeachers] = useState("")
    const [courseType, setCourseType] = useState("")
    const [selectedLevel, setSelectedLevel] = useState("")
    const [status, setStatus] = useState(false)
    const [color, setColor] = useState(null)

    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)

    useEffect(() => {
        if (data) {
            setEduLang(data?.information?.eduLang?.id)
            setCourseType(data?.information?.groupCourseType?.id)
            setStatus(groupStatus)
            setTeacher(teacherId)
            setSelectedLevel(level.id)
        }
    }, [data, groupStatus, teacherId])

    useEffect(() => {
        if (subject) {
            setFilteredTeachers(teachers.filter(item => item.subjects.every(i => i.toLowerCase() === subject.toLowerCase())))
        } else {
            setFilteredTeachers(teachers)
        }
    }, [subject, teachers])


    const { request } = useHttp()

    const onSubmit = (data) => {
        const newData = {
            ...data,
            teacher,
            eduLang,
            courseType,
            status,
            color,
            level_id: selectedLevel
        }




        request(`${BackUrl}group_change/change_group_info/${groupId}`, "POST", JSON.stringify(newData), headers())
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

    return (
        isCheckedPassword && Object.keys(data).length ?
            <div className="changeGroupInfo">
                <form
                    action=""
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="title"> Ma'lumotlarini o'zgartirish</h1>
                    <label htmlFor="name">
                        <span className="name-field">Gruppa nomi</span>
                        <input
                            defaultValue={data.information?.groupName?.value}
                            id="name"
                            className="input-fields"
                            // value={userData?.username}
                            {...register("name", {
                                required: "Iltimos to'ldiring"
                            })}
                        />
                        {
                            errors?.name &&
                            <span className="error-field">
                                {errors?.name?.message}
                            </span>
                        }
                    </label>

                    <label htmlFor="teacherQuota">
                        <span className="name-field">O'qituvchi ulushi</span>
                        <input
                            type="number"
                            id="teacherQuota"
                            className="input-fields "
                            {...register("teacherQuota", {
                                required: "Iltimos to'ldiring",
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: " Gruppa narxi sonlar dan iborat bo'lishi kerak"
                                },
                            })}
                            defaultValue={data.information.teacherSalary.value}
                        />
                        {
                            errors?.teacherQuota &&
                            <span className="error-field">
                                {errors?.teacherQuota?.message}
                            </span>
                        }
                    </label>
                    <label htmlFor="groupCost">
                        <span className="name-field">Gruppa narxi</span>
                        <input
                            type="number"
                            defaultValue={data.information.groupPrice.value}
                            id="groupCost"
                            className="input-fields"
                            {...register("groupCost", {
                                required: "Iltimos to'ldiring",
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: " Gruppa narxi sonlar dan iborat bo'lishi kerak"
                                },
                            })}
                        />
                        {
                            errors?.groupCost &&
                            <span className="error-field">
                                {errors?.groupCost?.message}
                            </span>
                        }
                    </label>
                    <Select
                        options={dataToChange?.langs}
                        onChangeOption={setEduLang}
                        name={'eduLang'}
                        title={"Ta'lim tili"}
                        defaultValue={eduLang}
                    />
                    {/*{*/}
                    {/*    filteredTeachers.length ?*/}
                    {/*        <Select*/}
                    {/*            options={filteredTeachers}*/}
                    {/*            onChangeOption={setTeacher}*/}
                    {/*            name={"teachers"}*/}
                    {/*            title={"O'qituvchilar"}*/}
                    {/*            defaultValue={teacher}*/}
                    {/*            teachers={true}*/}
                    {/*        /> : null*/}
                    {/*}*/}

                    <Select
                        options={dataToChange?.course_types}
                        onChangeOption={setCourseType}
                        name={"courseTypes"}
                        title={"Kurs turlari"}
                        defaultValue={courseType}
                    />
                    <Select
                        group={true}
                        options={levels}
                        onChangeOption={setSelectedLevel}
                        name={"level"}
                        title={"Kurs darajalari"}
                        defaultValue={level?.id}
                    />
                    {/* <Select
                        group={true}
                        options={levels}
                        onChangeOption={setSelectedLevel}
                        name={"asistant"}
                        title={"Asistent"}
                        defaultValue={asistant?.id}
                    /> */}

                    <Link to={`../changeGroupTime`}>
                        <Button>
                            Change Time
                        </Button>
                    </Link>

                    <Link to={`../changeGroupTeacher`}>
                        <Button>
                            Change Teacher
                        </Button>
                    </Link>
                    <Link to={`../changeGroupAssistent`}>
                        <Button>
                            Change Assistent
                        </Button>
                    </Link>
                    <label htmlFor="" className="checkbox">
                        <input checked={status} onChange={() => setStatus(!status)} type="checkbox" />
                        <span>Gruh statusi</span>
                    </label>

                    {/*<label htmlFor="time-label">*/}
                    {/*    <span className="name-field">Boshlanish vaqti</span>*/}
                    {/*    <input onChange={e => setStartTime(e.target.value)} value={startTime} className="input-fields" type="time"/>*/}
                    {/*</label>*/}

                    {/*<label htmlFor="time-label">*/}
                    {/*    <span className="name-field">Tugash vaqti</span>*/}
                    {/*    <input onChange={e => setEndTime(e.target.value)} value={endTime} className="input-fields" type="time"/>*/}
                    {/*</label>*/}

                    {/*<Select*/}
                    {/*    defaultValue={selectedRoom}*/}
                    {/*    name={"rooms"}*/}
                    {/*    title={"Honalar"}*/}
                    {/*    options={dataToChange?.rooms}*/}
                    {/*    onChangeOption={setSelectedRoom}*/}
                    {/*/>*/}

                    <input className="input-submit" type="submit" />
                </form>
            </div> :
            <Modal activeModal={!isCheckedPassword} link={-1} >
                <CheckPassword />
            </Modal>
    );
};

export default ChangeGroupInfo;