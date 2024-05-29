import React, {useCallback, useEffect, useState} from 'react';

import Select from "components/platform/platformUI/select";

import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {fetchGroup, setChecked} from "slices/groupSlice";
import {fetchGroups, fetchGroupsById} from "slices/groupsSlice";
import {BackUrl, headers} from "constants/global";

import "./moveToGroup.sass"
import {deleteCheckedStudents} from "slices/groupSlice";
import Input from "components/platform/platformUI/input";


const MoveToGroup = ({setActiveMTG,setTypeMsg,setActiveMessage,setMsg,id}) => {

    const {groups} = useSelector(state => state.groups)
    const {data} = useSelector(state => state.group)
    const {location} = useSelector(state => state.me)

    const [reason,setReason] = useState(null)

    const {students} = data

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchGroups(location))
        dispatch(fetchGroup(id))
    },[dispatch, id])

    const [checkedStudents,setCheckedStudents] = useState()
    const [selectedGroup,setSelectedGroup] = useState(null)
    const [isSubmit,setIsSubmit] = useState(false)


    useEffect(() => {
        if (checkedStudents?.length === 0) {
            setIsSubmit(true)
        } else {
            setIsSubmit(false)
        }
    },[checkedStudents?.length])

    useEffect(() => {
        setCheckedStudents(students?.filter(student => student.checked))
    },[students])


    const onChecked = (id) => {
        dispatch(setChecked({id}))
    }



    const renderCheckedStudents = useCallback( () => {
        if (checkedStudents?.length !== 0) {
            return checkedStudents?.map(st => {
                return (
                    <div
                        className="CheckedStudent selectedSubject"
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

    },[checkedStudents])


    const {request} = useHttp()


    const onSubmit =  (e) => {

        e.preventDefault()

        const data = {
            checkedStudents,
            reason
        }

        request(`${BackUrl}move_group/${selectedGroup}/${id}`,"POST",JSON.stringify(data),headers())
            .then((res) => {
                if (res.success) {
                    setActiveMTG(false)
                    setTypeMsg("success")
                    setMsg(res.msg)
                    setActiveMessage(true)
                    dispatch(deleteCheckedStudents({checkedStudents}))
                }
                else {
                    setTypeMsg("error")
                    setMsg(res.msg)
                    setActiveMessage(true)
                }
            })
            .catch(err => {
                setTypeMsg("error")
                setMsg("Serverda yoki internetingizda hatolik")
                setActiveMessage(true)
                console.log(err)
            })
    }




    const renderedCheckedSt = renderCheckedStudents()

    return (
        <div className="addGroupModal">
            <form className="modal-form" action="" onSubmit={onSubmit}>
                <h1>Boshqa gruppaga qoshish</h1>
                <Select
                    name={'groups'}
                    title={"Groups"}
                    options={groups}
                    onChangeOption={setSelectedGroup}
                    group={true}
                />
                <Input title={"Sabab"} onChange={setReason}/>
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
    )

};

export default MoveToGroup;