
import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import {
    deleteAccDataItem,
    fetchAccData,
    fetchDeletedAccData, onChangeAccountingBtns, onChangeAccountingPage, onChangeFetchedDataType,
} from "slices/accountingSlice";
import {fetchFilters} from "slices/filtersSlice";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";
import {getUIPageByPath, setPagePosition} from "slices/uiSlice";
import useFilteredData from "pages/platformContent/platformAccounting/useFilteredData";
import {setMessage} from "slices/messageSlice";
import Button from "components/platform/platformUI/button";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import Pagination from "components/platform/platformUI/pagination";

const SampleAccounting = React.lazy(() => import("components/platform/platformSamples/sampleAccaunting/SampleAccounting"))




const StudentsDiscount = ({locationId, path}) => {

    const {data, fetchAccDataStatus, fetchedDataType, btns,location} = useSelector(state => state.accounting)
    const [isChangedData, setIsChangedData] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const {pathname} = useLocation()


    const oldPage = useSelector((state) => getUIPageByPath(state,pathname))
    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 30, [])

    const dispatch = useDispatch()
    const {request} = useHttp()

    const [filteredData,searchedData] = useFilteredData(data.data, currentPage, PageSize)

    useEffect(() => {
        if (fetchedDataType !== path || !data.data.length || locationId !== location) {
            const data = {
                locationId,
                type: "discounts"
            }
            dispatch(fetchAccData(data))
            const newData = {
                name: "debt_students",
                location: locationId,
                type: ""
            }
            dispatch(fetchFilters(newData))
            dispatch(onChangeFetchedDataType({type: path}))
        }
    }, [locationId])

    useEffect(() => {
        dispatch(onChangeAccountingPage({value: path}))
    },[])


    useEffect(() => {
        let data = {
            locationId,
            type: "discounts"
        }
        for (let item of btns) {
            if (item.active) {
                data = {
                    ...data,
                    [item.name]: item.active
                }
            }
        }
        setIsDeleted(data.deleted)

        if (data.deleted) {

            if (data.archive) {
                dispatch(fetchDeletedAccData({...data, isArchive: true}))
            } else {
                getArchive()
                dispatch(fetchDeletedAccData(data))
            }
        } else if (data.archive) {
            getArchive()
            dispatch(fetchAccData({...data, isArchive: true}))
        } else if (isChangedData) {
            dispatch(fetchAccData(data))
        }
    }, [btns, isChangedData])
    useEffect(() => {
        if (oldPage) {
            setCurrentPage(oldPage)
        }
    },[])
    const activeItems = ()=> {
        if (isDeleted) {
            return {
                name: true,
                surname : true,
                payment: true,
                datePayment: true,
                delete : false,
                date : true,
                reason: true
            }
        }
        return {
            name: true,
            surname : true,
            payment: true,
            datePayment: true,
            delete : true,
            date : true
        }
    }



    const onDelete = (data) => {
        const {id} = data
        dispatch(deleteAccDataItem({id: id}))
        request(`${BackUrl}delete_payment/${id}`, "POST", JSON.stringify(data), headers())
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
    }


    const changePaymentTypeData = (id, value, userId) => {
        request(`${BackUrl}change_teacher_salary/${id}/${value}/${userId}`, "GET", null, headers())
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
    }


    const getArchive = (isActive) => {
        const newData = {
            name: "debt_students",
            location: locationId,
            type: isActive ? "archive" : ""
        }

        if (isActive) {
            dispatch(fetchFilters(newData))
        } else {
            setIsChangedData(true)
            dispatch(fetchFilters(newData))
        }

    }

    const setChangedBtns = (id,active) => {
        if (!active) setIsChangedData(true)
        dispatch(onChangeAccountingBtns({id}))
    }



    const links = useMemo(() => {

        const newBtns = []
        for (let item of btns) {
            if (item.page && item.page === path ) {
                newBtns.push({
                    ...item,
                    elem: Button,
                    props: {
                        active: item.active,
                        onClickBtn: () => setChangedBtns(item.id,item.active),
                        children: item.title
                    }
                })
            }
            else if (!item.page) {
                newBtns.push({
                    ...item,
                    elem: Button,
                    props: {
                        active: item.active,
                        onClickBtn: () => setChangedBtns(item.id,item.active),
                        children: item.title
                    }
                })
            }
        }


        return newBtns


    }, [btns])

    const funcsSlice = {
        changePaymentTypeData,
        onDelete,
        getArchive
    }


    const onChangedPage = (page) => {
        setCurrentPage(page)
        dispatch(setPagePosition({path:pathname,page: page}))
    }


    let summa = "payment"


    let sum = filteredData?.reduce((a, c) => {
        return a + c[summa]
    }, 0);



    return (
        <>
            <SampleAccounting
                links={links}
            >
                <AccountingTable
                    sum={sum}
                    // cache={true}
                    typeOfMoney={data.typeOfMoney}
                    fetchUsersStatus={fetchAccDataStatus}
                    funcSlice={funcsSlice}
                    activeRowsInTable={activeItems()}
                    users={filteredData}
                />



                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={searchedData.length}
                    pageSize={PageSize}
                    onPageChange={page => onChangedPage(page)}
                />

            </SampleAccounting>
        </>
    )
};


export default StudentsDiscount;