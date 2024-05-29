import React, {useEffect, useMemo, useState} from 'react';


import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deleteStudent, setActiveBtn, setChecked} from "slices/newStudentsSlice";
import {fetchFilters} from "slices/filtersSlice";
import {BackUrl, headers, ROLES} from "constants/global";
import {useHttp} from "hooks/http.hook";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Confirm from "components/platform/platformModals/confirm/confirm";
import {fetchDeletedStudent, setDisableOption} from "slices/deletedGroupStudentsSlice";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import "./platformDeletedGroupsStudents.sass"
import {resetState} from "slices/deletedGroupStudentsSlice";
import Select from "components/platform/platformUI/select";
import {setSelectedLocation} from "slices/meSlice";
import {useAuth} from "hooks/useAuth";

const SampleUsers = React.lazy(() => import("components/platform/platformSamples/sampleUsers/SampleUsers") )


const PlatformGroupDeletedStudents = () => {

    let {locationId} = useParams()

    const {students,btns,fetchDeletedStudentStatus} = useSelector(state => state.deletedGroupStudents)
    const {filters} = useSelector(state => state.filters)
    const {location,role} = useSelector(state => state.me)
    const {isCheckedPassword} = useSelector(state => state.me)

    const [activeCheckPassword,setActiveCheckPassword] = useState(false)
    const [activeModal,setActiveModal] = useState(false)
    const [deleteStId,setDeleteStId] = useState()
    const [activeOption,setActiveOption] = useState("Hammasi")



    const dispatch = useDispatch()

    const options = [
        {
            value: "O'qituvchi yoqmadi",
            name: "O'qituvchi yoqmadi",
            disabled: false
        },
        {
            value: "O'quvchi o'qishni eplolmadi",
            name: "O'quvchi o'qishni eplolmadi",
            disabled: false
        },
        {
            value: "Pul oilaviy sharoit",
            name: "Pul oilaviy sharoit",
            disabled: false
        },
        {
            value: "Boshqa",
            name: "Boshqa",
            disabled: false
        }
    ]
    useEffect(()=> {
        const newData = {
            name: "deletedGroupStudents",
            location: locationId
        }

        dispatch(fetchFilters(newData))
    },[dispatch,locationId])


    useEffect(()=> {
        if (activeOption) {
            const data = {
                type: activeOption,
                locationId
            }
            dispatch(fetchDeletedStudent(data))
        } else {
            const data = {
                type: "O'qituvchi yoqmadi",
                locationId
            }
            dispatch(fetchDeletedStudent(data))
        }

        dispatch(setSelectedLocation({id:locationId}))

    },[activeOption,dispatch, locationId])



    const navigate = useNavigate()

    useEffect(()=>{
        if (location !== +locationId && role !== ROLES["Director"]) {
            navigate(-1)
        }
    },[location, locationId, navigate, role])


    useEffect(() => {
        if (isCheckedPassword && deleteStId) {
            setActiveCheckPassword(false)
            setActiveModal(true)
        }
    },[deleteStId, isCheckedPassword])


    const activeItems = useMemo(() => {
        if (activeOption === "Boshqa") {
            return {
                name: true,
                surname : true,
                phone : true,
                reg_date: true,
                deleted_date: true,
                reason: true,
            }
        }
        return {
            name: true,
            surname : true,
            phone : true,
            reg_date: true,
            deleted_date: true
        }
        
    },[activeOption])



    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onDelete = (id) => {
        setDeleteStId(id)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveModal(true)
        }
    }


    const {request} = useHttp()

    const getConfirm = (data) => {
        if (data.confirm === "yes") {
            const newData = {
                ...data,
                typeLocation: "registerStudents",
                student_id: deleteStId
            }

            request(`${BackUrl}delete_student`,"POST",JSON.stringify(newData), headers())
                .then(res => console.log(res))

            dispatch(deleteStudent({id:deleteStId}))
            setActiveModal(false)
        }
        else {
            setActiveModal(false)
        }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const changeOption = (option) => {
        if (option === "all") {
            setActiveOption("Hammasi")
        } else {
            setActiveOption(option)
        }
        // request(`${BackUrl}delete_student`,"POST",JSON.stringify(newData), headers())
        //     .then(res => console.log(res))
    }


    const funcsSlice = useMemo(() => {
        return {
            setChecked,
            setActiveBtn,
            onDelete,
            changeOption,
            setDisableOption
        }
    },[changeOption, onDelete])




    return (
        <>
            {/*<div className="header">*/}
            {/*    <Select title={"Sahifalar"} defaultValue={"studentsPayments"} options={btns[0].options} onChangeOption={changeOption}/>*/}
            {/*</div>*/}
            <SampleUsers
                fetchUsersStatus={fetchDeletedStudentStatus}
                funcsSlice={funcsSlice}
                activeRowsInTable={activeItems}
                users={students}
                filters={filters}
                btns={btns}
                pageName={"newStudents"}
                locationId={locationId}
                isChangePage={true}
                options={options}
                selectedOption={activeOption}
            />


            <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                <CheckPassword/>
            </Modal>
            {
                isCheckedPassword && deleteStId ?
                    <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                        <CreateSubject/>
                    </Modal>
                    :
                    null
            }
        </>
    );
};



const CreateSubject = () => {

    const [subjects,setSubjects] = useState([])
    const [selectedSubjects,setSelectedSubjects] = useState([])
    const {dataToChange} = useSelector(state => state.dataToChange)

    const dispatch = useDispatch()

    const {selectedLocation} = useAuth()


    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    },[selectedLocation])

    const onGetSubject = (subjectName) => {
        if (subjectName !== "Fan tanla") {
            const filteredSubjects = subjects.find(item => item.name === subjectName)
            setSubjects(subjects => {
                return subjects.map(item => {
                    if (item.name === subjectName) {
                        return {...item,disabled: true}
                    }
                    return item
                })
            })
            setSelectedSubjects([...selectedSubjects,filteredSubjects])
        }
    }

    const onDeleteSubject = (subjectName) => {
        if (subjectName !== "Fan tanla" ) {
            setSubjects(subjects => {
                return subjects.map(item => {
                    if (item.name === subjectName) {
                        return {...item,disabled: false}
                    }
                    return item
                })
            })
            setSelectedSubjects(selectedSubjects.filter(item => item.name !== subjectName))
        }
    }

    const renderOptions = (list) => {
        return (
            list.map((item,index) => {
                return (
                    <option key={index} value={item.name}>{item.name}</option>
                )
            })
        )
    }


    const selectedSubjectLevel = (name,value) => {
        if (value !== "defaultLevel") {
            setSelectedSubjects(subjects => {
                return subjects.map(item => {
                    if (item.name === name) {
                        return {...item,selectedLevel: value}
                    }
                    return item
                })
            })
        }
    }

    const renderSubjects = (list) => {
        return (
            list.map((item,index) => {
                return (
                    <div

                        key={index}
                        className="subjects__item"
                    >
                        <div className="subjects__item-info">
                            <span>
                                {item.name}
                            </span>
                            <i
                                onClick={() => onDeleteSubject(item.name)}
                                className="fas fa-times"
                            />
                        </div>
                        {
                            item.levels ? (
                                <label htmlFor={item.name}>
                                    <span className="name-field">{item.name} Darajalari</span>
                                    <select
                                        id={item.name}
                                        className="input-fields"
                                        onChange={e => selectedSubjectLevel(item.name,e.target.value)}
                                    >
                                        <option value="defaultLevel">Darajani tanlang</option>
                                        {renderOptions(item.levels)}
                                    </select>
                                </label>
                            ) : null
                        }
                    </div>
                )
            })
        )
    }


    const {request} = useHttp()


    const onSubmit = (e) => {
        e.preventDefault()

        request(`${BackUrl}`, "POST", JSON.stringify({selectedSubjects}),headers())
            .then(() => console.log("hello"))

    }


    const disabled = !selectedSubjects.length

    return (
        <div className="createSubject">
            <form action="" onSubmit={onSubmit}>
                {
                    selectedSubjects.length < 3 ? (
                        <label htmlFor="subjects">
                            <select
                                id="subjects"
                                className="input-fields"
                                onChange={e => onGetSubject(e.target.value)}
                            >
                                <option value="Fan tanla" >Fan tanlang</option>
                                {
                                    subjects?.map(item => {
                                        return (
                                            <option disabled={item.disabled}  key={item.id} value={item.name}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </label>
                    ) : null
                }
                <div className="subjects">
                    <h3>Tanlangan fanlar:</h3>
                    <div className="subjects__wrapper">
                        {renderSubjects(selectedSubjects)}
                    </div>
                </div>

                <input type="submit" disabled={disabled} className="input-submit" />
            </form>
        </div>
    )
}

export default PlatformGroupDeletedStudents;