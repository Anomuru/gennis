import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import UsersTable from "components/platform/platformUI/tables/usersTable";
import Pagination from "components/platform/platformUI/pagination";
import {useDispatch, useSelector} from "react-redux";
import {fetchNewStudents, setActiveBtn, setChecked} from "slices/newStudentsSlice";
import {fetchFilters} from "slices/filtersSlice";
import {useParams} from "react-router-dom";
import PlatformSearch from "components/platform/platformUI/search";
import Button from "components/platform/platformUI/button";
import Filters from "components/platform/platformUI/filters";

import "./addToGroup.sass"
import {fetchGroup} from "slices/groupSlice";
import Modal from "components/platform/platformUI/modal";
import classNames from "classnames";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";


const AddToGroup = () => {

    let {locationId,groupId} = useParams()

    const {newStudents,fetchNewStudentsStatus,checkedUsers} = useSelector(state => state.newStudents)
    const {subject} = useSelector(state => state.group)
    const {filters} = useSelector(state => state.filters)


    const dispatch = useDispatch()

    useEffect(()=> {

        dispatch(fetchNewStudents(locationId))
        const newData = {
            name: "newStudents",
            location: locationId
        }
        dispatch(fetchFilters(newData))
        dispatch(fetchGroup(groupId))

    },[dispatch, groupId, locationId])



    let PageSize = useMemo(()=> 50,[])

    const [filteredStudents,setFilteredStudents] = useState([])

    
    const filterRef = useRef()
    const [currentPage, setCurrentPage] = useState(1);
    const [activeOthers,setActiveOthers] = useState(false)
    const [activeModal,setActiveModal] = useState(false)
    const [heightOtherFilters,setHeightOtherFilters] = useState(0)
    const [search,setSearch] = useState("")

    useEffect(() => {
        if (newStudents) {
            setFilteredStudents(newStudents?.filter(user => {
                return user?.subjects?.some(keyEle => keyEle?.toLowerCase().includes(subject?.toLowerCase()))
            }))
        }
    },[newStudents, subject])





    const multiPropsFilter = useMemo(() => {
        const filterKeys = Object.keys(filters);
        return filteredStudents?.filter(user => {
            return filterKeys.every(key => {
                if (!filters[key]?.activeFilters && filters[key]?.fromTo) {
                    if (filters[key]?.fromTo.from && filters[key]?.fromTo.to) {
                        return user[key] >= filters[key].fromTo.from && user[key] <= filters[key]?.fromTo.to
                    }
                    return true
                }
                if (!filters[key]?.activeFilters?.length) return true;
                if (Array.isArray(user[key])) {
                    return user[key]?.some(keyEle =>
                        filters[key].activeFilters?.some(
                            keyFil => keyFil.toLowerCase().includes(keyEle.toLowerCase())
                        )
                    );
                }
                return filters[key]?.activeFilters?.includes(user[key]);
            });
        });
    },[filters,filteredStudents]) ;



    const searchedUsers = useMemo(() => {
        const filteredHeroes = multiPropsFilter?.slice()
        setCurrentPage(1)
        return filteredHeroes.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.surname.toLowerCase().includes(search.toLowerCase()) ||
            item.username.toLowerCase().includes(search.toLowerCase())
        )
    },[multiPropsFilter,search])





    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedUsers.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedUsers]);



    const activeItems = useMemo(()=> {
        return {
            name: true,
            surname : true,
            username: true,
            age: true,
            phone : false,
            reg_date: true,
            checked: true,
            comment :true,
            subjects : true,
            money : false
        }
    },[])


    const funcsSlice = {
        setChecked : {func: setChecked,type: "sliceFunc"},
        setActiveBtn,
    }

    return (
        <section className="section">
            <header className="section__header">
                <div>
                    <PlatformSearch search={search} setSearch={setSearch}/>
                    <div
                        onClick={() => setActiveModal(!activeModal)}
                        className="submitBtn"
                    >
                        Submit
                    </div>
                </div>
                <div>
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
                <UsersTable
                    fetchUsersStatus={fetchNewStudentsStatus}
                    funcsSlice={funcsSlice}
                    activeRowsInTable={activeItems}
                    users={currentTableData}
                    pageName={"newStudents"}
                    checkedUsers={checkedUsers}
                />
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={searchedUsers.length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />
            </main>
            <footer>
                <Modal activeModal={activeModal} setActiveModal={() => setActiveModal(false)}>
                    <SubmitBox students={checkedUsers} groupId={groupId}/>
                </Modal>
            </footer>
        </section>
    );
};


const SubmitBox = ({students,groupId}) => {


    const [checkedStudents,setCheckedStudents] = useState([])

    useEffect(() => {
        if (students) {
            setCheckedStudents(students.filter(user => user.checked))
        }
    },[students])
    
    const dispatch = useDispatch()
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onChecked = (id) => {
        dispatch(setChecked({id}))
    }
    
    const renderCheckedStudents = useCallback( () => {
        if (checkedStudents?.length !== 0) {
            return checkedStudents?.map(st => {
                return (
                    <div
                        key={st}
                        className={classNames("CheckedStudent")}
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

    },[checkedStudents, onChecked])


    const {request} = useHttp()

    const onSubmit = (e) => {

        const data = {
            group_id: groupId,
            checkedStudents
        }


        request(`${BackUrl}addGroup`, "POST", JSON.stringify(data),headers())
            .then(res => console.log(res))

    }
    
    return (
        <div className="submitBox">
            <form action="" onSubmit={onSubmit}>
                <div className="students">
                    {renderCheckedStudents()}
                </div>
                <input type="submit" className="input-submit"/>
            </form>
        </div>
    )
}


export default AddToGroup;
