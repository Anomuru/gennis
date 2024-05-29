import React, {memo, useCallback, useEffect, useState} from 'react';


import "./CreateGroupModal.sass"
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {fetchCreateGroupTools, setActiveAllBtn, setActiveBtn, setChecked,deleteCheckedStudents} from "slices/newStudentsSlice";
import {fetchTeachersByLocation} from "slices/teachersSlice";
import {BackUrl, headers} from "constants/global";
import Input from "components/platform/platformUI/input";
import Modal from "components/platform/platformUI/modal";
import Select from "components/platform/platformUI/select";
import classNames from "classnames";
import PlatformMessage from "components/platform/platformMessage";


const CreateGroupModal = memo( ({btnName,activeModal,setMsg,setTypeMsg,setActiveMessage}) => {

    const {teachers} = useSelector(state => state.teachers)
    const {createGroupTools,checkedUsers} = useSelector(state => state.newStudents)
    const {location} = useSelector(state => state.me)

    const [subject,setSubject] = useState(null)
    const [filteredTeachers,setFilteredTeachers] = useState([])
    const [checkedStudents,setCheckedStudents] = useState()
    const [selectedTeachers,setSelectedTeachers] = useState(null)
    const [selectedTypeCourse,setSelectedTypeCourse] = useState(null)
    const [nameGroup,setNameGroup] = useState(null)
    const [priceCourse,setPriceCourse] = useState(null)
    const [teacherDolya,setTeacherDolya] = useState(null)
    // const [attendanceDays,setAttendanceDays] = useState(null)
    const [isSubmit,setIsSubmit] = useState(false)

    const {request} = useHttp()
    const dispatch = useDispatch()

    

    useEffect(()=> {
        dispatch(fetchTeachersByLocation(location))
        dispatch(fetchCreateGroupTools())
    },[dispatch])



    useEffect(() => {
        if (subject) {
            setFilteredTeachers(teachers.filter(item => item.subjects.includes(subject)))
        } else {
            setFilteredTeachers(teachers)
        }
    },[subject, teachers])


    useEffect(() => {
        setCheckedStudents(checkedUsers)
    },[checkedUsers])

    const onChecked = (id) => {
        dispatch(setChecked({id}))
    }
    const changeActiveAllBtn = () => {
        dispatch(setActiveAllBtn())
    }


    const renderCheckedStudents = useCallback( () => {
        if (checkedStudents?.length !== 0) {
            return checkedStudents?.map(st => {
                return (
                    <div
                        key={st.id}
                        className={classNames("CheckedStudent",{
                            selectedSubject: st.subjects.some( item =>  item.toLowerCase() === subject?.toLowerCase())
                        })}
                    >
                        <h2>{st.name}</h2>
                        <h2>{st.surname}</h2>
                        <input
                            onChange={() => onChecked(st.id)}
                            type="checkbox"
                            checked={st.checked}
                        />
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

    },[checkedStudents, subject])


    useEffect(() => {
        if (subject && checkedStudents?.length) {

            const isTrueEvery = checkedStudents.every( item => {
                return item.subjects.some( item =>  item.toLowerCase() === subject?.toLowerCase())
            })

            if (isTrueEvery) {
                setActiveMessage(false)
                setIsSubmit(false)
            } else {
                setIsSubmit(true)
                setMsg("O'quvchilarni fanlari tog'ri kelmadi")
                setActiveMessage(true)
                setTypeMsg("error")
            }


        }
    },[checkedStudents, setActiveMessage, setMsg, setTypeMsg, subject])






    const onSubmit =  (e) => {
        e.preventDefault()
        const data = {
            checkedStudents,
            groupName : nameGroup,
            groupPrice : priceCourse,
            subject:  subject,
            teacher : selectedTeachers,
            typeCourse: selectedTypeCourse,
            teacherDolya: teacherDolya,
            // attendanceDays
        }

        dispatch(deleteCheckedStudents({checkedStudents}))
        
        request(`${BackUrl}create_group`,"POST",JSON.stringify(data),headers())
            .then( () => {
                changeActive(btnName)
                dispatch(deleteCheckedStudents({checkedStudents}))
                setTypeMsg("success")
                setMsg("Guruh ochildi")
                setActiveMessage(true)
                
            })
            .catch(err => {
                setMsg("Internetda yoki Serverda Hatolik")
                setActiveMessage(true)
                setTypeMsg("error")
            })
    }

    const changeActive = (name) => {
        dispatch(setActiveBtn({name:name}))
    }

    const renderedCheckedSt = renderCheckedStudents()

    return (
        <Modal activeModal={activeModal} setActiveModal={changeActiveAllBtn}>
            <div className="addGroupModal">
                <form className="modal-form" action="" onSubmit={onSubmit}>
                    <h1>Gruppa ochish</h1>
                    <Select
                        name={'subjects'}
                        title={"Fanlar"}
                        options={createGroupTools?.subjects}
                        onChangeOption={setSubject}
                    />
                    <Select
                        teachers={true}
                        name={'teachers'}
                        title={"Teachers"}
                        options={filteredTeachers}
                        onChangeOption={setSelectedTeachers}
                    />
                    <Input
                        required={true}
                        type={`text`}
                        name={`name-of-group`}
                        title={`Gruppa nomi`}
                        onChange={setNameGroup}
                    />
                    <Select
                        name={"type-course"}
                        title={"Kurs turi"}
                        options={createGroupTools?.course_types}
                        onChangeOption={setSelectedTypeCourse}
                    />
                    <Input
                        required={true}
                        type={`number`}
                        name={`price-of-group`}
                        title={`Gruppa narxi`}
                        onChange={setPriceCourse}
                    />
                    <Input
                        required={true}
                        type={`number`}
                        name={`dolya-of-teacher`}
                        title={`O'qituvchi ulushi`}
                        onChange={setTeacherDolya}
                    />
                    {/*<Input*/}
                    {/*    required={true}*/}
                    {/*    type={`number`}*/}
                    {/*    name={`attendance-days`}*/}
                    {/*    title={`Davomat kunlari`}*/}
                    {/*    onChange={setAttendanceDays}*/}
                    {/*/>*/}
                    <input
                        className="input-submit"
                        disabled={isSubmit}
                        type="submit"
                    />
                </form>
                <div className="checkedStudents">
                    <h1>Tanlangan O'quvchilar</h1>
                    {renderedCheckedSt}
                </div>
            </div>

        </Modal>
    )

})

export default CreateGroupModal;