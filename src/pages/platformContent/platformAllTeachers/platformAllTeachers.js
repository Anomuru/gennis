import React, {useEffect, useMemo, useState} from 'react';


import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {
    deleteTeacher,
    fetchDeletedTeachersByLocation,
    fetchTeachers,
    fetchTeachersByLocation
} from "slices/teachersSlice";
import {fetchFilters} from "slices/filtersSlice";
import {
    deleteStudent,
    fetchNewStudents,
    fetchNewStudentsDeleted,
    setActiveBtn,
    setChecked
} from "slices/newStudentsSlice";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Confirm from "components/platform/platformModals/confirm/confirm";
import PlatformMessage from "components/platform/platformMessage";
import {setMessage} from "slices/messageSlice";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";


const SampleUsers = React.lazy(() => import("components/platform/platformSamples/sampleUsers/SampleUsers"))


const PlatformTeachers = () => {

    const {locationId} = useParams()

    const {teachers, btns, fetchTeachersStatus} = useSelector(state => state.teachers)
    const {filters} = useSelector(state => state.filters)
    const {isCheckedPassword} = useSelector(state => state.me)

    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [activeModal, setActiveModal] = useState(false)
    const [activeModalName, setActiveModalName] = useState(false)
    const [deleteStId, setDeleteStId] = useState()
    const [isConfirm, setIsConfirm] = useState(false)


    const dispatch = useDispatch()


    useEffect(() => {

        dispatch(fetchTeachers())

        const newData = {
            name: "teachers",
            location: locationId
        }
        dispatch(fetchFilters(newData))

    }, [dispatch, locationId])


    useEffect(() => {
        if (isCheckedPassword && activeModalName) {
            setActiveCheckPassword(false)
            setActiveModal(true)
        }
    }, [activeModalName, isCheckedPassword])

    const activeItems = useMemo(() => {
        return {
            name: true,
            surname: true,
            username: true,
            age: true,
            phone: true,
            reg_date: false,
            checked: false,
            comment: false,
            subjects: true,
            money: false,
        }
    }, [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onDelete = (id, type) => {
        setDeleteStId(id)
        setActiveModalName(type)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveModal(true)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps

    const {request} = useHttp()

    const getConfirm = (data) => {

        const newData = {
            ...data,
            typeLocation: "registerStudents",
            user_id: deleteStId
        }
        request(`${BackUrl}delete_teacher/${deleteStId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                } else {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "error",
                        active: true
                    }))
                }
            })

        dispatch(deleteTeacher({id: deleteStId}))
        setActiveModal(false)


    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getDeleted = (isActive) => {
        if (isActive) {
            dispatch(fetchDeletedTeachersByLocation(locationId))
        } else {
            dispatch(fetchTeachersByLocation(locationId))
        }
    }

    const funcsSlice = useMemo(() => {
        return {
            getDeleted,
            onDelete
        }
    }, [getDeleted, onDelete])

    return (
        <>
            <h1
                style={{
                    textAlign: "center",
                    margin: "2rem 0"
                }}
            >Hamma O'qituvchilar</h1>


            <SampleUsers
                isDeletedData={true}
                funcsSlice={funcsSlice}
                fetchUsersStatus={fetchTeachersStatus}
                activeRowsInTable={activeItems}
                users={teachers}
                filters={filters}
                btns={btns}
            />


            <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                <CheckPassword/>
            </Modal>
            {
                activeModalName === "delete" && isCheckedPassword ?
                    <>
                        <Modal activeModal={activeModal} setActiveModal={() => setActiveModal(false)}>
                            <Confirm
                                setActive={setActiveModal}
                                text={"O'qituvchini o'chirishni xohlaysizmi ?"}
                                getConfirm={setIsConfirm}
                            />
                        </Modal>
                        {
                            isConfirm === "yes" ?
                                <Modal
                                    activeModal={activeModal}
                                    setActiveModal={() => {
                                        setActiveModal(false)
                                        setIsConfirm(false)
                                    }}
                                >
                                    <ConfimReason  getConfirm={getConfirm} reason={true}/>
                                </Modal> : null
                        }
                    </>
                    : null
            }
        </>

    );
};

export default PlatformTeachers;