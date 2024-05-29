
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useParams} from "react-router-dom";
import {
    changePaymentType,
    deleteAccDataItem,
    fetchAccData,
    fetchDeletedAccData, onChangeAccountingBtns, onChangeAccountingPage, onChangeFetchedDataType,
    setDisableOption
} from "slices/accountingSlice";
import {fetchFilters} from "slices/filtersSlice";
import {deletePayment} from "slices/studentAccountSlice";
import {BackUrl, headers} from "constants/global";
import PlatformMessage from "components/platform/platformMessage";
import {useHttp} from "hooks/http.hook";
import {getUIPageByPath, setPagePosition} from "slices/uiSlice";
import useFilteredData from "pages/platformContent/platformAccounting/useFilteredData";
import {setMessage} from "slices/messageSlice";
import Button from "components/platform/platformUI/button";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import Pagination from "components/platform/platformUI/pagination";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import {useForm} from "react-hook-form";
import {useAuth} from "hooks/useAuth";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import Select from "components/platform/platformUI/select";

const SampleAccounting = React.lazy(() => import("components/platform/platformSamples/sampleAccaunting/SampleAccounting"))





const Capital = ({locationId, path}) => {

    const {data, fetchAccDataStatus, fetchedDataType, btns,location} = useSelector(state => state.accounting)
    const [isChangedData, setIsChangedData] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const {pathname} = useLocation()

    const {isCheckedPassword} = useSelector(state => state.me)
    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)


    const oldPage = useSelector((state) => getUIPageByPath(state,pathname))
    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = useMemo(() => 30, [])

    const dispatch = useDispatch()
    const {request} = useHttp()

    const [filteredData,searchedData] = useFilteredData(data.data, currentPage, PageSize)

    useEffect(() => {
        if (fetchedDataType !== path || !data.data.length || locationId !== location) {
            const data ={
                locationId,
                type: "capital"
            }
            dispatch(fetchAccData(data))
            const newData = {
                name: "accounting_payment",
                location: locationId
            }
            dispatch(fetchFilters(newData))
            dispatch(onChangeFetchedDataType({type: path}))
        }
    }, [])


    useEffect(() => {
        dispatch(onChangeAccountingPage({value: path}))
    },[])



    useEffect(() => {
        let data = {
            locationId,
            type: "capital"
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
                name : true,
                price : true,
                date : true,
                typePayment: true,
                delete: false,
                reason: true
            }
        }
        return {
            name : true,
            price : true,
            date : true,
            typePayment: true,
            delete: true
        }
    }





    const onDelete = (data) => {

        const {id} = data

        dispatch(deleteAccDataItem({id:id}))
        request(`${BackUrl}delete_capital/${id}`, "POST", JSON.stringify(data),headers())
            .then( res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    const data ={
                        locationId,
                        type: "capital"
                    }
                    dispatch(fetchAccData(data))
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


        request(`${BackUrl}change_capital/${id}/${value}`,"GET",null,headers())
            .then( res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    dispatch(changePaymentType({id: id,typePayment: value}))

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
            name: "accounting_payment",
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
    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }


    const links = useMemo(() => {

        const newBtns = []


        for (let item of btns) {
            if (item.page && item.page === path ) {
                if (item.name === "capital") {
                    newBtns.push({
                        ...item,
                        elem: Button,
                        props: {
                            name: item.name,
                            active: activeChangeModalName === "capital" && activeChangeModal,
                            onClickBtn: changeModal,
                            children: item.title
                        }
                    })
                }
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



    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    }, [activeChangeModalName, isCheckedPassword])


    return (
        <>
            <SampleAccounting
                links={links}
            >
                <AccountingTable
                    // sum={sum}
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


                <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                    <CheckPassword/>
                </Modal>
                {
                    activeChangeModalName === "capital" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <CreatCapital
                                setActiveChangeModal={setActiveChangeModal}
                                locationId={locationId}
                            />
                        </Modal> : null

                }

            </SampleAccounting>
        </>
    )
};


const CreatCapital = ({locationId, setMsg, setTypeMsg, setActiveMessage, setActiveChangeModal}) => {

    const {
        register,
        formState: {errors},
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur"
    })


    const {dataToChange} = useSelector(state => state.dataToChange)
    const {data} = useSelector(state => state.accounting)
    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)
    const dispatch = useDispatch()

    const {selectedLocation} = useAuth()

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    }, [selectedLocation])

    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map((item, i) => {
            return (
                <label key={i} className="radioLabel" htmlFor="">
                    <input className="radio" {...register("typePayment", {required: true})} type="radio"
                           value={item.id}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange?.payment_types])


    const renderDate = useCallback(() => {
        return data?.capital_tools?.map((item, index) => {
            if (item.value === month) {
                return (
                    <div key={index} className="date__item">
                        <Select
                            number={true}
                            name={"day"}
                            title={"Kun"}
                            defaultValue={day}
                            onChangeOption={setDay}
                            options={item?.days}
                        />
                    </div>
                )
            }
        })
    }, [data.capital_tools, month, day])


    const renderedDays = renderDate()
    const renderedPaymentType = renderPaymentType()

    const {request} = useHttp()

    const onSubmit = (data, e) => {
        e.preventDefault()
        const newData = {
            ...data,
            month,
            day
        }


        request(`${BackUrl}add_capital/${locationId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    reset()
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    setActiveChangeModal(false)
                    const data = {
                        locationId,
                        type: "capital"
                    }
                    dispatch(fetchAccData(data))
                } else {
                    dispatch(setMessage({
                        msg: "Serverda hatolik",
                        type: "error",
                        active: true
                    }))
                    setActiveChangeModal(false)
                }
            })
    }


    useEffect(() => {
        if (data?.capital_tools?.length < 2) {
            setMonth(data.capital_tools[0]?.value)
        }
    }, [data?.capital_tools])

    return (
        <div className="overhead">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="typeItem">
                    <div>
                        <span className="name-field">Narsa turi</span>
                        <input
                            defaultValue={""}
                            id="typeItem"
                            className="input-fields"
                            {...register("typeItem", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                    </div>
                    {
                        errors?.typeItem &&
                        <span className="error-field">
                            {errors?.typeItem?.message}
                        </span>
                    }
                </label>
                <label htmlFor="price">
                    <div>
                        <span className="name-field">Narxi</span>
                        <input
                            defaultValue={""}
                            id="price"
                            className="input-fields"
                            type={"number"}
                            {...register("price", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                    </div>
                    {
                        errors?.price &&
                        <span className="error-field">
                            {errors?.price?.message}
                        </span>
                    }
                </label>
                <div>
                    {renderedPaymentType}
                </div>
                {
                    data?.capital_tools?.length >= 2 ?
                        <Select
                            name={"month"}
                            title={"Oy"}
                            defaultValue={month}
                            onChangeOption={setMonth}
                            options={data?.capital_tools}
                        /> :
                        null
                }
                {renderedDays}

                <input className="input-submit" type="submit" value="Tasdiqlash"/>

            </form>
        </div>
    )
}


export default Capital;