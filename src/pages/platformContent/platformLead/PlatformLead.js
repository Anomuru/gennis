import React, {useCallback, useEffect, useState} from 'react';


import cls from "./style.module.sass"
import {useDispatch, useSelector} from "react-redux";
import Modal from "components/platform/platformUI/modal";
import Input from "components/platform/platformUI/input";
import classNames from "classnames";
import Table from "components/platform/platformUI/table";
import {fetchDeletedLeads, fetchLeads, fetchLeadsCallList, onChangedLead, onDeleteLead} from "slices/leadsSlice";
import {useParams} from "react-router-dom";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useForm} from "react-hook-form";
import InputForm from "components/platform/platformUI/inputForm";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import Confirm from "components/platform/platformModals/confirm/confirm";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import Button from "components/platform/platformUI/button";
import {setMessage} from "slices/messageSlice";

const PlatformLead = () => {


    const {locationId} = useParams()
    const {register, handleSubmit,reset} = useForm()



    const {leads, deletedLeads ,callList,fetchLeadsStatus,fetchCallListStatus} = useSelector(state => state.leads)


    const [isDeleted, setIsDeleted] = useState(false)
    const [changeLead, setChangeLead] = useState(false)
    const [callListActive, setCallListActive] = useState(false)
    const [dellLead, setDellLead] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)

    const [changeLeadData, setChangeLeadData] = useState({})

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchLeads(locationId))
    },[locationId])


    const stringCheck = (name,length = 10) => {
        if (name?.length > length) {
            return (
                <>
                    {name.substring(0,length)}...
                    <div className={cls.popup}>
                        {name}
                    </div>
                </>
            )
        }
        return name
    }


    const renderLeads = useCallback(() => {
        if (!isDeleted) {
            return leads.map(item => {
                return (
                    <div className={classNames(cls.leads__item, [cls[item.status]])}>

                        <div className={cls.leads__itemHeader}>
                            <div >
                                <div
                                    onClick={() => {
                                        setChangeLead(true)
                                        setChangeLeadData(item)
                                    }}
                                    className={cls.icon}
                                >
                                    <i className="fas fa-phone-alt"></i>
                                </div>
                                <div
                                    onClick={() => {
                                        setCallListActive(true)
                                        setChangeLeadData(item)
                                        dispatch(fetchLeadsCallList(item.id))
                                    }}
                                    className={cls.icon}
                                >
                                    <i className="fas fa-list"></i>
                                </div>
                            </div>

                            <div>

                                <div
                                    onClick={() => {
                                        setDellLead(true)
                                        setChangeLeadData(item)
                                        // dispatch(fetchLeadsCallList(item.id))
                                    }}
                                    className={cls.icon}
                                >
                                    <i className="fas fa-trash"></i>
                                </div>

                            </div>

                        </div>

                        <h3>{item.name}</h3>
                        <h3>{item.phone}</h3>
                    </div>
                )
            })
        } else {
            return deletedLeads.map(item => {

                return (
                    <div className={classNames(cls.leads__item, [cls[item.status]])}>

                        <div className={cls.leads__itemHeader}>



                            <div >
                                <div
                                    onClick={() => {
                                        setChangeLead(true)
                                        setChangeLeadData(item)
                                    }}
                                    className={cls.icon}
                                >
                                    {/*<i className="fas fa-phone-alt"></i>*/}
                                </div>
                                <div
                                    onClick={() => {
                                        setCallListActive(true)
                                        setChangeLeadData(item)
                                        dispatch(fetchLeadsCallList(item.id))
                                    }}
                                    className={cls.icon}
                                >
                                    <i className="fas fa-list"></i>
                                </div>
                            </div>

                            <div>

                                <div
                                    onClick={() => {
                                        setDellLead(true)
                                        setChangeLeadData(item)
                                        // dispatch(fetchLeadsCallList(item.id))
                                    }}
                                    className={cls.icon}
                                >
                                    {/*<i className="fas fa-trash"></i>*/}
                                </div>

                            </div>

                        </div>

                        <h3>{item.name}</h3>
                        <h3>{item.phone}</h3>
                        <h3>{stringCheck(item.comment)}</h3>

                    </div>
                )
            })
        }
    }, [leads,isDeleted,deletedLeads])



    const {request} = useHttp()
    const onComment = (data) => {
        request(`${BackUrl}lead_crud/${changeLeadData.id}`, "POST",JSON.stringify(data),headers())
            .then(res => {
                reset()
                dispatch(onChangedLead({item: res.lead}))
                setChangeLead(false)
                dispatch(setMessage({
                    msg: `Telefon qilindi`,
                    type: "success",
                    active: true
                }))
            })
    }

    const onDelete = (data) => {
        request(`${BackUrl}lead_crud/${changeLeadData.id}`, "DELETE",JSON.stringify(data),headers())
            .then(() => {
                setIsConfirm(false)
                setDellLead(false)
                setChangeLead(false)
                dispatch(onDeleteLead({id: changeLeadData.id}))
                dispatch(setMessage({
                    msg: `${changeLeadData.name} o'chirildi `,
                    type: "success",
                    active: true
                }))
            })

        // if (data.confirm === "no") {
        //     setDellLead(false)
        // }

    }

    const getDeleted = () => {
        setIsDeleted(isDeleted => !isDeleted)
        dispatch(fetchDeletedLeads(locationId))
    }




    if (fetchLeadsStatus === "loading") {
        return <DefaultLoader/>
    }

    return (
        <div className={cls.leads}>


            <div className={cls.leads__header}>
                <Button active={isDeleted} onClickBtn={getDeleted}>Deleted</Button>
            </div>


            <div className={cls.leads__wrapper}>

                {renderLeads()}

            </div>


            <Modal activeModal={changeLead} setActiveModal={setChangeLead}>
                <div className={cls.leads__change}>
                    <form action="" onSubmit={handleSubmit(onComment)}>
                        <h3>Ism: {changeLeadData.name}</h3>
                        <h3>Tel: {changeLeadData.phone}</h3>


                        <InputForm register={register} name={"comment"} title={"Koment"} required/>
                        <InputForm type={"date"} register={register} name={"date"} title={"Kun"} required/>

                        <Input value={"Tasdiqlash"} type={"submit"}/>
                    </form>

                </div>
            </Modal>


            <Modal activeModal={callListActive} setActiveModal={setCallListActive}>
                <div className={cls.leads__callList}>

                    <Table>


                        <tr>
                            <th>Comment</th>
                            <th>date</th>
                        </tr>

                        {
                            fetchLeadsCallList === "loading" ? <DefaultLoader/> :
                                callList.map(item => {
                                    return (
                                        <tr>
                                            <td>{item.comment}</td>
                                            <td>{item.date}</td>
                                        </tr>
                                    )
                                })
                        }

                    </Table>

                </div>
            </Modal>


            <Modal activeModal={dellLead} setActiveModal={() => setDellLead(false)}>
                <Confirm setActive={setDellLead} getConfirm={setIsConfirm} text={"O'chirishni hohlaysizmi"} />
            </Modal>
            {
                isConfirm === "yes" ?
                    <Modal
                        activeModal={dellLead}
                        setActiveModal={() => {
                            setDellLead(false)
                            setIsConfirm(false)
                        }}
                    >
                        <ConfimReason getConfirm={onDelete} reason={true} />
                    </Modal> : null
            }


        </div>
    );
};

export default PlatformLead;