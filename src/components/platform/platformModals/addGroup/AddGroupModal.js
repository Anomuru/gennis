
import Input from "components/platform/platformUI/input";
import Modal from "components/platform/platformUI/modal";
import Select from "components/platform/platformUI/select";
import React, {useCallback, useEffect, useMemo, useState} from 'react';


import "./addGroupModal.sass"
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {
    deleteCheckedStudents,
    fetchCreateGroupTools,
    setActiveAllBtn,
    setActiveBtn,
    setChecked
} from "slices/newStudentsSlice";
import {fetchGroups} from "slices/groupsSlice";
import classNames from "classnames";
import {BackUrl, headers} from "constants/global";
import PlatformMessage from "components/platform/platformMessage";
import {useNavigate} from "react-router-dom";

const AddGroupModal = ({btnName,activeModal,setMsg,setTypeMsg,setActiveMessage,locationId}) => {

    // const {groups} = useSelector(state => state.groups)
    const {createGroupTools,checkedUsers} = useSelector(state => state.newStudents)

   const [groups,setGroups] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchGroups(locationId))
        dispatch(fetchCreateGroupTools())
    },[dispatch, locationId])

    useEffect(() => {
        request(`${BackUrl}filtered_groups/${locationId}`,"GET",null,headers())
            .then(res => {
                setGroups(res.groups)
            })
    },[locationId])

    const [subject,setSubject] = useState(null)
    const [filteredGroups,setFilteredGroups] = useState([])
    const [checkedStudents,setCheckedStudents] = useState()
    const [selectedGroup,setSelectedGroup] = useState(null)
    const [isSubmit,setIsSubmit] = useState(false)

    useEffect(() => {
        if (subject) {
            setFilteredGroups(groups.filter(item => item.subjects?.toLowerCase().includes(subject?.toLowerCase())))
        } else {
            setFilteredGroups(groups)
        }


    },[subject, groups])

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


    const {request} = useHttp()


    // const onSubmit =  (e) => {
    //
    //     e.preventDefault()
    //     const data = {
    //         checkedStudents,
    //         group_id : selectedGroup,
    //     }
    //
    //
    //
    //     request(`${BackUrl}addGroup`,"POST",JSON.stringify(data),headers())
    //         .then( () => {
    //             changeActive(btnName)
    //             dispatch(deleteCheckedStudents({checkedStudents}))
    //             setTypeMsg("success")
    //             setMsg("Guruhga qo'shildi")
    //             setActiveMessage(true)
    //         })
    //         .catch(() => {
    //             setMsg("Internetda yoki Serverda Hatolik")
    //             setActiveMessage(true)
    //             setTypeMsg("error")
    //         })
    // }

    const navigate = useNavigate()
    const onSubmit =  (e) => {
        e.preventDefault()
        navigate(`../../addGroup/${locationId}/${selectedGroup}`)

    }

    const changeActive = (name) => {
        dispatch(setActiveBtn({name:name}))
    }

    useEffect(() => {
        if (subject && checkedStudents?.length) {
            // eslint-disable-next-line array-callback-return
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


    const renderedCheckedSt = renderCheckedStudents()

    return (

        // <Modal  activeModal={activeModal} setActiveModal={changeActiveAllBtn}>
        //     <div className="addGroupModal">
        //         <form className="modal-form" action="" onSubmit={onSubmit}>
        //             <h1>Gruppaga qoshish</h1>
        //
        //             <Select
        //                 name={'add-subjects'}
        //                 title={"Fanlar"}
        //                 options={createGroupTools.subjects}
        //                 onChangeOption={setSubject}
        //             />
        //
        //             <Select
        //                 name={'groups'}
        //                 title={"Groups"}
        //                 options={filteredGroups}
        //                 onChangeOption={setSelectedGroup}
        //                 group={true}
        //             />
        //
        //
        //             <input
        //                 className="input-submit"
        //                 disabled={isSubmit}
        //                 type="submit"
        //             />
        //         </form>
        //         <div className="checkedStudents">
        //             <h1>Tanlangan O'quvchilar</h1>
        //             {renderedCheckedSt}
        //         </div>
        //     </div>
        // </Modal>

        <Modal activeModal={activeModal} setActiveModal={changeActiveAllBtn}>
            <div className="addGroupModal">
                <form className="modal-form" action="" onSubmit={onSubmit}>
                    <h1>Gruppaga qoshish</h1>

                    <Select
                        name={'groups'}
                        title={"Groups"}
                        options={filteredGroups}
                        onChangeOption={setSelectedGroup}
                        group={true}
                    />


                    <input
                        className="input-submit"
                        disabled={isSubmit}
                        type="submit"
                    />
                </form>
            </div>
        </Modal>
    )

};

export default AddGroupModal;