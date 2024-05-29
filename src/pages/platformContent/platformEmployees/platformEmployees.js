import React, {useEffect, useMemo, useState} from 'react';


import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {deleteStaff, fetchDeletedEmployees, fetchEmployees} from "slices/employeesSlice";
import {fetchFilters} from "slices/filtersSlice";
import {BackUrl, headers, ROLES} from "constants/global";
import {setSelectedLocation} from "slices/meSlice";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Confirm from "components/platform/platformModals/confirm/confirm";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import {setMessage} from "slices/messageSlice";
import {deleteTeacher} from "slices/teachersSlice";
import {useHttp} from "hooks/http.hook";



const SampleUsers = React.lazy(() => import("components/platform/platformSamples/sampleUsers/SampleUsers") )



const PlatformEmployees = () => {

    let {locationId} = useParams()

    const {employees,btns,fetchEmployeesStatus} = useSelector(state => state.employees)
    const {filters} = useSelector(state => state.filters)
    const {location,role} = useSelector(state => state.me)
    const {isCheckedPassword} = useSelector(state => state.me)


    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [activeModal, setActiveModal] = useState(false)
    const [activeModalName, setActiveModalName] = useState(false)
    const [deleteStId, setDeleteStId] = useState()
    const [isConfirm, setIsConfirm] = useState(false)

    const dispatch = useDispatch()


    useEffect(()=> {

        dispatch(fetchEmployees(locationId))
        const newData = {
            name: "employees",
            location: locationId
        }
        dispatch(fetchFilters(newData))
        dispatch(setSelectedLocation({id:locationId}))

    },[dispatch, locationId])

    const navigate = useNavigate()

    useEffect(()=>{
        if (location !== +locationId && role !== ROLES["Director"]) {
            navigate(-1)
        }
    },[location, locationId, navigate, role])


    const activeItems = useMemo(()=> {
        return {
            name: true,
            surname : true,
            username: true,
            age: false,
            phone : false,
            reg_date: false,
            checked: false,
            comment :false,
            subject : false,
            money : false,
            job : true
        }
    },[])

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

    const {request} = useHttp()
    const getConfirm = (data) => {
        const newData = {
            ...data,
            user_id: deleteStId
        }
        request(`${BackUrl}delete_staff/${deleteStId}`, "DELETE", JSON.stringify(newData), headers())
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

        dispatch(deleteStaff({id: deleteStId}))
        setActiveModal(false)


    }

    const getDeleted = (isActive) => {

        if (isActive) {
            dispatch(fetchDeletedEmployees(locationId))
        } else {
            dispatch(fetchEmployees(locationId))
        }
    }

    const funcsSlice = useMemo(() => {
        return {
            getDeleted,
            onDelete
        }
    },[getDeleted])

    return (
        <>
            <SampleUsers
                isDeletedData={true}
                funcsSlice={funcsSlice}
                fetchUsersStatus={fetchEmployeesStatus}
                activeRowsInTable={activeItems}
                users={employees}
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
                                text={"Ishchini o'chirishni xohlaysizmi ?"}
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
                                    <ConfimReason getConfirm={getConfirm} reason={true}/>
                                </Modal> : null
                        }
                    </>
                    : null

            }
        </>

    );
};

export default PlatformEmployees;