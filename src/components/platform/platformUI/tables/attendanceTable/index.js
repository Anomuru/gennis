import React, {useCallback, useEffect, useState} from 'react';
import "../tables.sass"
import {useNavigate} from "react-router-dom";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Confirm from "components/platform/platformModals/confirm/confirm";
import Select from "components/platform/platformUI/select";
import {deleteAccDataItem} from "slices/accountingSlice";
import {useDispatch, useSelector} from "react-redux";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";


const attendanceTable = React.memo(({data, studentAtt, funcsSlice, activeRowsInTable, groups}) => {

    const {isCheckedPassword} = useSelector(state => state.me)

    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)
    const [changingData, setChangingData] = useState({})

    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    }, [activeChangeModalName, isCheckedPassword])


    const renderDates = (data) => {
        return data?.map(item => {
            return <th>{item}</th>
        })
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const linkTo = (id) => {
        funcsSlice?.linkTo(id)
    }


    const checkTrueFalse = (data) => {
        if (data) {
            return data?.map(item => {
                if (item.status === true) {
                    return (
                        <td className="date true">
                            <i className="fas fa-check"></i>
                        </td>
                    )
                }
                if (item.status === false) {
                    return (
                        <td className="date false">
                            <i className="fas fa-times"></i>
                            <div className="popup">
                                {item.reason}
                            </div>
                        </td>
                    )
                }
                if (item.status === "") {
                    return (
                        <td className="date true"></td>
                    )
                }
            })
        }

    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onDelete = (id) => {
        funcsSlice?.onDelete(id)
    }


    const getConfirmDelete = (name) => {
        funcsSlice?.onDelete(changingData.id)
        setActiveChangeModal(false)
    }


    const renderAttendances = useCallback(() => {
        if (studentAtt) {
            return data.map(item => {
                return (
                    <tr>
                        {activeRowsInTable?.homework ? <td>{item.homework}</td> : null}
                        {activeRowsInTable?.dictionary ? <td>{item.dictionary}</td> : null}
                        {activeRowsInTable?.activeness ? <td>{item.activeness}</td> : null}
                        {activeRowsInTable?.averageBall ? <td>{item.averageBall}</td> : null}
                        {activeRowsInTable?.date ? <td>{item.date}</td> : null}
                        {activeRowsInTable?.delete ? <td>
                            <div
                                onClick={() => {
                                    changeModal("deletePayment")
                                    setChangingData({id: item.id})
                                }}
                                className="delete"
                            >
                                <i className="fas fa-times"/>
                            </div>
                        </td> : null}
                    </tr>
                )
            })
        }
        if (groups) {
            return data?.attendances?.map(item => {
                return (
                    <tr onClick={() => linkTo(item.group_id)}>
                        <td>{item.name}</td>
                        {checkTrueFalse(item.dates)}
                    </tr>
                )

            })
        }
        return data?.attendances?.map(item => {
            return (
                <tr>
                    <td onClick={() => linkTo(item.student_id)}>{item.student_name}</td>
                    <td onClick={() => linkTo(item.student_id)}>{item.student_surname}</td>
                    {checkTrueFalse(item.dates)}
                </tr>
            )

        })

    }, [data, onDelete, studentAtt])

    const renderedAttendance = renderAttendances()

    return (
        <div className="tableBox">
            <table>
                <thead>
                {
                    studentAtt
                        ?
                        <tr className="tbody_th">
                            {activeRowsInTable?.homework ? <th>Uyga vazifa</th> : null}
                            {activeRowsInTable?.dictionary ? <th>Lug'at</th> : null}
                            {activeRowsInTable?.activeness ? <th>Darsda qatnashishi</th> : null}
                            {activeRowsInTable?.averageBall ? <th>Ortacha ball</th> : null}
                            {activeRowsInTable?.date ? <th>Sana</th> : null}
                            {activeRowsInTable?.delete ?
                                <th>
                                    O'chirish
                                </th>
                                : null}
                        </tr>
                        : groups ?
                            <tr className="tbody_th">
                                <th>Gruppa fani</th>
                                {renderDates(data?.dates)}
                            </tr>
                            :
                            <tr className="tbody_th">
                                <th>Ism</th>
                                <th>Familya</th>
                                {renderDates(data?.dates)}
                            </tr>

                }
                </thead>
                <tbody>
                {renderedAttendance}
                </tbody>
            </table>

            <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                <CheckPassword/>
            </Modal>
            {
                activeChangeModalName === "deletePayment" && isCheckedPassword ?
                    <>
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <Confirm setActive={setActiveChangeModal} text={"Davomatni ocirishni hohlaysizmi ?"}
                                     getConfirm={setIsConfirm}/>
                        </Modal>
                        {
                            isConfirm === "yes" ?
                                <Modal
                                    activeModal={activeChangeModal}
                                    setActiveModal={() => {
                                        setActiveChangeModal(false)
                                        setIsConfirm(false)
                                    }}
                                >
                                    <ConfimReason getConfirm={getConfirmDelete} reason={true}/>
                                </Modal> : null
                        }

                    </>
                    : null
            }
        </div>
    );
})

export default attendanceTable;