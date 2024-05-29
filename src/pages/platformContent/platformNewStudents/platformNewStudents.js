import React, {useEffect, useMemo, useState} from 'react';

import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deleteStudent, fetchNewStudents, fetchNewStudentsDeleted, setPage} from "slices/newStudentsSlice";
import {fetchFilters} from "slices/filtersSlice";
import {setChecked, setActiveBtn} from "slices/newStudentsSlice";
import {BackUrl, headers, ROLES} from "constants/global";
import Confirm from "components/platform/platformModals/confirm/confirm";
import Modal from "components/platform/platformUI/modal";
import {useHttp} from "hooks/http.hook";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import {setSelectedLocation} from "slices/meSlice";
import {setMessage} from "slices/messageSlice";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";


const SampleUsers = React.lazy(() => import("components/platform/platformSamples/sampleUsers/SampleUsers"))


const PlatformNewStudents = () => {

    let {locationId} = useParams()

    const {newStudents, btns, fetchNewStudentsStatus, page, checkedUsers} = useSelector(state => state.newStudents)
    const {filters} = useSelector(state => state.filters)
    const {location, role} = useSelector(state => state.me)
    const {isCheckedPassword} = useSelector(state => state.me)

    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [activeModal, setActiveModal] = useState(false)
    const [activeModalName, setActiveModalName] = useState(false)
    const [deleteStId, setDeleteStId] = useState()
    const [isConfirm, setIsConfirm] = useState(false)


    const [isDeleteData, setIsDeleteData] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchNewStudents(locationId))
        const newData = {
            name: "newStudents",
            location: locationId
        }

        dispatch(fetchFilters(newData))
        dispatch(setSelectedLocation({id: locationId}))

    }, [dispatch, locationId])


    const navigate = useNavigate()

    useEffect(() => {
        if (location !== +locationId && role !== ROLES["Director"]) {
            navigate(-1)
        }
    }, [location, locationId, navigate, role])


    useEffect(() => {
        if (isCheckedPassword && activeModalName) {
            setActiveCheckPassword(false)
            setActiveModal(true)
        }
    }, [activeModalName, isCheckedPassword])


    const activeItems = useMemo(() => {
        if (isDeleteData) {
            return {
                name: true,
                surname: true,
                age: true,
                reg_date: true,
                checked: false,
                comment: true,
                subjects: true,
                returnDeleted: true,
                delete: false,
                deletedDate: true
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
            delete: true,
            returnDeleted: false
        }
    }, [isDeleteData])


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

    const deleteNewStudent = (data) => {

        const newData = {
            ...data,
            typeLocation: "registerStudents",
            student_id: deleteStId
        }


        request(`${BackUrl}delete_student`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                } else {
                    dispatch(setMessage({
                        msg: "Serverda hatolik",
                        type: "error",
                        active: true
                    }))

                }
            })
        dispatch(deleteStudent({id: deleteStId}))
        setActiveModal(false)

    }

    const returnDeletedStudent = (data) => {
        if (data === "yes") {
            request(`${BackUrl}get_back_student/${deleteStId}`, "GET", null, headers())
                .then(res => {
                    if (res.success) {
                        dispatch(setMessage({
                            msg: res.msg,
                            type: "success",
                            active: true
                        }))

                    } else {
                        dispatch(setMessage({
                            msg: "Serverda hatolik",
                            type: "error",
                            active: true
                        }))

                    }
                })

            dispatch(deleteStudent({id: deleteStId}))
            setActiveModal(false)
        } else {
            setActiveModal(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getDeleted = (isActive) => {
        if (isActive) {
            const newData = {
                name: "deleted_reg_students",
                location: locationId
            }
            dispatch(fetchNewStudentsDeleted(locationId))
            dispatch(fetchFilters(newData))
            setIsDeleteData(true)
        } else {

            const newData = {
                name: "newStudents",
                location: locationId
            }

            dispatch(fetchFilters(newData))
            dispatch(fetchNewStudents(locationId))
            setIsDeleteData(false)
        }
    }

    const funcsSlice = useMemo(() => {
        return {
            setChecked: {func: setChecked, type: "sliceFunc"},
            setActiveBtn,
            onDelete,
            getDeleted,
            setPage
        }
    }, [getDeleted, onDelete])


    return (
        <>
            <SampleUsers
                fetchUsersStatus={fetchNewStudentsStatus}
                funcsSlice={funcsSlice}
                activeRowsInTable={activeItems}
                users={newStudents}
                filters={filters}
                btns={btns}
                pageName={"newStudents"}
                locationId={locationId}
                isDeletedData={true}
                page={page}
                checkedUsers={checkedUsers}
            />


            <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                <CheckPassword/>
            </Modal>
            {
                activeModalName === "delete" && isCheckedPassword ?
                    <>
                        <Modal activeModal={activeModal} setActiveModal={() => setActiveModal(false)}>
                            <Confirm setActive={setActiveModal} text={"Oq'uvchini uchirishni hohlaysizmi?"}
                                     getConfirm={setIsConfirm}/>
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
                                    <ConfimReason getConfirm={deleteNewStudent} student={true}/>
                                </Modal> : null
                        }

                    </>
                    : activeModalName === "returnDeleted" && isCheckedPassword ?
                        <Modal activeModal={activeModal} setActiveModal={() => setActiveModal(false)}>
                            <Confirm setActive={setActiveModal} text={"Uchirilgan o'quvchini qaytarishni hohlaysizmi"}
                                     getConfirm={returnDeletedStudent}/>
                        </Modal>
                        : null

            }
        </>
    );
};

export default PlatformNewStudents;