import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import cls from "./changeGroupAssistent.module.sass"


import Button from "components/platform/platformUI/button";
import { useDispatch, useSelector } from "react-redux";

import {
    setActiveBtn,
    setPage
} from "slices/newStudentsSlice";



import UsersTable from "components/platform/platformUI/tables/usersTable";
import PlatformSearch from "components/platform/platformUI/search";
import Filters from "components/platform/platformUI/filters";
import { fetchFilters } from "slices/filtersSlice";
import { useParams } from "react-router-dom";
import { fetchDataToChange } from "slices/dataToChangeSlice";
import { useAuth } from "hooks/useAuth";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";
import { setMessage } from "slices/messageSlice";
import classNames from 'classnames';






const ChangeGroupAssistent = () => {

    const { data } = useSelector(state => state.group)

    const { groupId } = useParams()
    const [users, setUsers] = useState([])

    const isSubmit = !users?.some(item => item.radioChecked)

    const { request } = useHttp()

    useEffect(() => {
        request(`${BackUrl}group_change/check_time_assistent/${groupId}/`, "GET", null, headers())
            .then(res => {
                console.log(res)
                // if (res.success) {
                setUsers(res.assistent_errors)
                // }
            })
    }, [groupId])

    const onDelete = () => {
        request(`${BackUrl}create_group/delete_asistent_group/${data?.assistantID?.value}/${groupId}`, "DELETE", null, headers())
            .then(res => {
                // if (res.success) {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                    request(`${BackUrl}group_change/check_time_assistent/${groupId}/`, "GET", null, headers())
                        .then(res => {
                            console.log(res)
                            // if (res.success) {
                            setUsers(res.assistent_errors)
                            // }
                        })
                } else {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "error",
                        active: true
                    }))
                }
                // }
            })
            .catch(() => {
                dispatch(setMessage({
                    msg: "Internetingizda yoki serverda hatolik",
                    type: "error",
                    active: true
                }))
            })
    }


    const dispatch = useDispatch()
    const onSubmit = (e) => {
        // e.preventDefault()

        const assistentId = users.filter(item => item.radioChecked)[0].id

        request(`${BackUrl}group_change/add_assistent_group/${assistentId}/${groupId}`, "GET", null, headers())
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
            .catch(() => {
                dispatch(setMessage({
                    msg: "Internetingizda yoki serverda hatolik",
                    type: "error",
                    active: true
                }))
            })
    }

    return (
        <div className={cls.create}>

            <div className={cls.create__header}>
                <Button
                    type='danger'
                    disabled={!data?.assistantID?.value}
                    onClickBtn={onDelete}
                >
                    Delete
                </Button>
                <Button
                    active={!isSubmit}
                    disabled={isSubmit}
                    onClickBtn={onSubmit}
                >
                    Submit
                </Button>
                {/* <form action="" onSubmit={onSubmit}>
                    <input disabled={isSubmit} className="input-submit" type="submit" />
                </form> */}
            </div>

            <div className={cls.create__wrapper}>
                <Teachers setUsers={setUsers} users={users} />
            </div>
        </div>
    );
};




const Teachers = ({ users, setUsers }) => {


    const { fetchFilteredStudentsStatus } = useSelector(state => state.newStudents)
    const { filters } = useSelector(state => state.filters)


    const { selectedLocation } = useAuth()

    const filterRef = useRef()
    const [activeOthers, setActiveOthers] = useState(false)
    const [pageSize, setPageSize] = useState(50)
    const [heightOtherFilters, setHeightOtherFilters] = useState(0)
    const [search, setSearch] = useState("")

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    }, [])

    useEffect(() => {
        const newData = {
            name: "teachers",
            location: selectedLocation
        }
        dispatch(fetchFilters(newData))
    }, [selectedLocation])



    const multiPropsFilter = useMemo(() => {
        const filterKeys = Object.keys(filters);
        return users?.filter(user => {
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
    }, [filters, users]);

    // multiPropsFilter
    const searchedUsers = useMemo(() => {
        const filteredHeroes = users?.slice()
        return filteredHeroes?.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.surname.toLowerCase().includes(search.toLowerCase()) ||
            item.username.toLowerCase().includes(search.toLowerCase())
        )
    }, [users, search])



    const currentTableData = useMemo(() => {
        const firstPageIndex = 0;
        const lastPageIndex = firstPageIndex + pageSize;
        return searchedUsers?.slice(firstPageIndex, lastPageIndex);
    }, [pageSize, searchedUsers]);



    const activeItems = useMemo(() => {
        return {
            name: true,
            surname: true,
            subjects: true,
            color: true,
            shift: true,
            radio: true
        }
    }, [])


    const setChecked = useCallback((id) => {
        setUsers(users => users.map(item => {
            if (item.id === id) {
                return { ...item, radioChecked: true }
            }
            return { ...item, radioChecked: false }
        }))
    }, [])


    const funcsSlice = useMemo(() => {
        return {
            setChecked: { func: setChecked, type: "simpleFunc" },
            setActiveBtn,
            setPage
        }
    }, [setChecked])


    const onLoadMore = () => {
        if (pageSize < searchedUsers.length) setPageSize(pageSize + 50)
    }


    return (
        <section className={classNames(cls.section, cls.create__section)}>
            <header className={cls.section__header}>
                <div key={1} className=''>
                    <PlatformSearch search={search} setSearch={setSearch} />
                </div>
                {/* <div key={2}>
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

                <Filters key={3} filterRef={filterRef} filters={filters} heightOtherFilters={heightOtherFilters} activeOthers={activeOthers} /> */}
            </header>

            <main className={cls.section__main}>
                {
                    !users?.length ? <h1 className={cls.error}>Asistent yo'q</h1> :
                        <UsersTable
                            fetchUsersStatus={fetchFilteredStudentsStatus}
                            funcsSlice={funcsSlice}
                            activeRowsInTable={activeItems}
                            users={currentTableData}
                            pageName={"newStudents"}
                        />
                }
                {
                    searchedUsers?.length > pageSize ?
                        <div className={cls.loadMore}>
                            <Button onClickBtn={onLoadMore}><i className="fas fa-plus" /></Button>
                        </div> : null
                }
            </main> :
        </section>
    )
}





export default ChangeGroupAssistent;