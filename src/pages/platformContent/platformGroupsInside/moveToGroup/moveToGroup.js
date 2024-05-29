import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';


import "./moveToGroup.sass"
import {useParams} from "react-router-dom";
import Modal from "components/platform/platformUI/modal";
import {useDispatch, useSelector} from "react-redux";
import {useAuth} from "hooks/useAuth";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {setActiveBtn, setPage} from "slices/newStudentsSlice";
import PlatformSearch from "components/platform/platformUI/search";
import Button from "components/platform/platformUI/button";
import Filters from "components/platform/platformUI/filters";
import UsersTable from "components/platform/platformUI/tables/usersTable";
import classNames from "classnames";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {fetchFilters} from "slices/filtersSlice";
import Input from "components/platform/platformUI/input";
import {setMessage} from "slices/messageSlice";

const MoveToGroup = () => {

    const {oldGroupId,newGroupId} = useParams()
    const [activeModal,setActiveModal] = useState(false)
    const [users,setUsers] = useState([])

    const {request} = useHttp()





    const dispatch = useDispatch()

    useEffect(() => {
        request(`${BackUrl}moving_students/${oldGroupId}/${newGroupId}`,"GET",null,headers())
            .then(res => {
                if (res.success) {
                    setUsers(res.students)
                }
            })
    },[dispatch, newGroupId, oldGroupId])



    return (
        <div className="create">

            <div className="create__header">
                <div className="checkedSt" onClick={()=> setActiveModal(!activeModal)}>
                    <i className="fas fa-bars"/>
                </div>
            </div>
            <div className="create__wrapper">
                <Users setUsers={setUsers} users={users}/>
            </div>



            <Modal activeModal={activeModal} setActiveModal={() => setActiveModal(!activeModal)}>
                <CheckedStudents
                    setActiveModal={setActiveModal}
                    users={users}
                    setUsers={setUsers}

                    oldGroupId={oldGroupId}
                    newGroupId={newGroupId}
                />
            </Modal>
        </div>
    );
};


const Users = ({users,setUsers}) => {

    const {fetchFilteredStudentsStatus} = useSelector(state => state.newStudents)
    const {filters} = useSelector(state => state.filters)

    const filterRef = useRef()
    const [activeOthers,setActiveOthers] = useState(false)
    const [pageSize,setPageSize] = useState(50)
    const [heightOtherFilters,setHeightOtherFilters] = useState(0)
    const [search,setSearch] = useState("")








    const activeItems = useMemo(() => {
        return {
            name: true,
            surname : true,
            age: true,
            reg_date: true,
            checked: true,
            comment :true,
            subjects : true,
            color: true,
            shift: true
        }
    },[])



    const setChecked = useCallback((id) => {
        setUsers(users => users.map(item => {
            if (item.id === id) {
                return {...item,checked:!item.checked}
            }
            return item
        }))
    },[])




    const funcsSlice = useMemo(() => {
        return {
            setChecked : {func: setChecked,type: "simpleFunc"},
            setActiveBtn,
            setPage
        }
    },[setChecked])


    const onLoadMore = () => {
        if (pageSize < users.length) setPageSize(pageSize + 50)
    }

    return (
        <section className="section create__section">
            <header className="section__header">
                <div key={1}>
                    <PlatformSearch search={search} setSearch={setSearch}/>
                </div>
                <div key={2}>
                    <Button
                        onClickBtn={() => {
                            setActiveOthers(!activeOthers)
                            setHeightOtherFilters(filterRef.current.scrollHeight)
                        }}
                        active={activeOthers}
                    >
                        Filterlar
                    </Button>

                </div>

                <Filters key={3} filterRef={filterRef} filters={filters} heightOtherFilters={heightOtherFilters} activeOthers={activeOthers}/>
            </header>

            <main className="section__main">
                {
                    !users?.length ? <h1 className="error">O'quvchilar yoq</h1>  :
                        <UsersTable
                            fetchUsersStatus={fetchFilteredStudentsStatus}
                            funcsSlice={funcsSlice}
                            activeRowsInTable={activeItems}
                            users={users}
                            pageName={"newStudents"}
                        />
                }
                {
                    users?.length > pageSize ?
                        <div className="loadMore">
                            <Button onClickBtn={onLoadMore}><i className="fas fa-plus" /></Button>
                        </div> : null
                }
            </main>
        </section>
    )
}


const CheckedStudents = React.memo(({users,setUsers,groupId,setActiveModal,oldGroupId,newGroupId}) => {




    const [error,setError] = useState(false)
    const [reason,setReason] = useState(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setChecked = useCallback((id) => {
        setUsers(users => {
            return users.map(item => {
                if (item.id === id) {
                    return {...item, checked: !item.checked}
                }
                return item
            })
        })
    },[users])

    const renderCheckedStudents = useCallback( () => {

        // console.log(users)
        if (users?.length !== 0) {
            // eslint-disable-next-line array-callback-return
            return users?.map(st => {
                if (st.checked) {
                    return (
                        <div
                            key={st.id}
                            className={classNames("checkedStudents__item",{
                                isShift: st.color === "green"
                            })}
                        >
                            <div>
                                <h2>{st.name}</h2>
                                <h2>{st.surname}</h2>
                                <input
                                    onChange={() => setChecked(st.id)}
                                    type="checkbox"
                                    checked={st.checked}
                                />
                            </div>
                        </div>
                    )
                }
            })
        } else {
            return (
                <h1 className="error">
                    Studentlar tanlanmagan !
                </h1>
            )
        }
    },[setChecked, users])

    useEffect(() => {
        setError(!users?.filter(item => item?.checked)?.some(item => item.color === "green") && !users?.some(item => item.checked))
    },[users])


    const renderedCheckedSt = renderCheckedStudents()

    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmit = (e) => {
        e.preventDefault()

        const data = {
            checkedStudents : users.filter(item => item.checked),
            reason
        }

        request(`${BackUrl}move_group_time/${oldGroupId}/${newGroupId}`,"POST",JSON.stringify(data),headers())
            .then(res => {
                setActiveModal(false)
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                    setUsers(users => {
                        return users.filter(item => !item.checked)
                    })
                } else {
                    dispatch(setMessage({
                        msg: `Serverda hatolik`,
                        type: "error",
                        active: true
                    }))

                }
            })
    }

    return (
        <div className="checkedStudents">
            <div className="checkedStudents__wrapper">
                <form action="" onSubmit={onSubmit}>
                    <h1>Tanlangan O'quvchilar</h1>
                    <Input title={"Sabab"} onChange={setReason} />
                    <div className="checkedStudents__students">
                        {renderedCheckedSt}
                    </div>
                    <input disabled={error} type="submit" className={"input-submit"} />
                </form>
            </div>
        </div>
    )
})


export default MoveToGroup;