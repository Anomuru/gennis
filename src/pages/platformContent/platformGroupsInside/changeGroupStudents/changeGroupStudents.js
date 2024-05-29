import React, {useEffect, useMemo, useState} from 'react';
import UsersTable from "components/platform/platformUI/tables/usersTable";
import {Link, useNavigate, useParams} from "react-router-dom";
import {fetchGroup, onDelete, setChecked} from "slices/groupSlice";
import {useDispatch, useSelector} from "react-redux";


import "./changeGroupStudents.sass"
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import MoveToGroup from "components/platform/platformModals/moveToGroup/moveToGroup";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Select from "components/platform/platformUI/select";
import {fetchGroups} from "slices/groupsSlice";
import BackButton from "../../../../components/platform/platformUI/backButton/backButton";
import {setMessage} from "slices/messageSlice";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";

const ChangeGroupStudents = () => {

    const {locationId, groupId} = useParams()

    const {data} = useSelector(state => state.group)

    const [deleteStId, setDeleteStId] = useState()
    const [activeModal, setActiveModal] = useState(false)
    const [activeMTG, setActiveMTG] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [groups, setGroups] = useState([])
    const [isConfirm, setIsConfirm] = useState(false)


    const {request} = useHttp()

    useEffect(() => {
        dispatch(fetchGroup(groupId))
    }, [groupId])

    useEffect(() => {
        request(`${BackUrl}filtered_groups/${locationId}`, "GET", null, headers())
            .then(res => {
                setGroups(res.groups)
            })
    }, [locationId])


    const activeItems = useMemo(() => {
        return {
            name: true,
            surname: true,
            username: true,
            age: true,
            phone: false,
            reg_date: true,
            comment: true,
            subjects: false,
            money: true,
            delete: true,
            // checked: true
        }
    }, [])


    const deleteStudent = (id) => {
        setDeleteStId(id)
        setActiveModal(true)
    }

    const funcsSlice = {
        setChecked: {func: setChecked, type: "sliceFunc"},
        onDelete: deleteStudent
    }

    const dispatch = useDispatch()


    const getConfirm = (data) => {
        const newData = {
            ...data,
            groupId: groupId,
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
                        msg: "Serverda yoki internetingizda hatolik",
                        type: "error",
                        active: true
                    }))
                }
            })
        dispatch(onDelete({id: deleteStId}))
        setActiveModal(false)

    }


    const navigate = useNavigate()
    const onSubmit = (e) => {
        e.preventDefault()
        navigate(`../moveToGroup/${groupId}/${selectedGroup}`)
    }

    return (
        <div className="changeStudents">

            <header>
                <div>
                    <BackButton/>
                </div>
                <div>
                    <div
                        onClick={() => setActiveMTG(true)}
                        className="moveBtn"
                    >
                        Move to group
                    </div>
                </div>
            </header>
            <main>
                <UsersTable
                    funcsSlice={funcsSlice}
                    activeRowsInTable={activeItems}
                    users={data?.students}
                    pageName={"students"}
                />
            </main>
            <>
                <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                    <Confirm setActive={setActiveModal} text={"Oq'uvchini ushbu guruhdan chopiwni hohlaysizmi?"}
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
                            <ConfimReason getConfirm={getConfirm} student={true}/>
                        </Modal> : null
                }
            </>
            <Modal activeModal={activeMTG} setActiveModal={setActiveMTG}>
                {/*<MoveToGroup*/}
                {/*    setActiveMTG={setActiveMTG}*/}
                {/*    id={groupId}*/}
                {/*    setMsg={setMsg}*/}
                {/*    setTypeMsg={setTypeMsg}*/}
                {/*    setActiveMessage={setActiveMessage}*/}
                {/*/>*/}

                <div className="moveToGroup">
                    <form className="modal-form" action="" onSubmit={onSubmit}>
                        <h1>Gruppaga qoshish</h1>

                        <Select
                            name={'groups'}
                            title={"Groups"}
                            options={groups}
                            onChangeOption={setSelectedGroup}
                            group={true}
                        />


                        <input
                            className="input-submit"
                            type="submit"
                        />
                    </form>
                </div>
            </Modal>
        </div>
    );
};


export default ChangeGroupStudents;