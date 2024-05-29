import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PlatformSearch from "components/platform/platformUI/search";
import Select from "components/platform/platformUI/select";
import Button from "components/platform/platformUI/button";
import Filters from "components/platform/platformUI/filters";
import {Link} from "react-router-dom";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import PlatformMessage from "components/platform/platformMessage";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

import {fetchDataToChange} from "slices/dataToChangeSlice";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";



import "./overheadBooks.sass"
import {
    addBookOverhead,
    changeBookOverheadPaymentType,
    deleteBookOverhead,
    fetchBooksOverheadData,
    fetchDeletedBooksOverheadData
} from "slices/booksSlice";
import {setMessage} from "slices/messageSlice";

const OverheadBooks = () => {

    let PageSize = useMemo(()=> 50,[])
    const filterRef = useRef()

    const [currentPage,setCurrentPage] = useState(1);
    const [activeOthers,setActiveOthers] = useState(false)
    const [heightOtherFilters,setHeightOtherFilters] = useState(0)
    const [search,setSearch] = useState("")

    const [activeChangeModal,setActiveChangeModal] = useState(false)
    const [activeChangeModalName,setActiveChangeModalName] = useState("")
    const [activeCheckPassword,setActiveCheckPassword] = useState(false)

    const [deletedData,setDeletedData] = useState(false)
    const [archiveData,setArchiveData] = useState(false)

    const [msg,setMsg] = useState(false)
    const [typeMsg,setTypeMsg] = useState(false)
    const [activeMessage,setActiveMessage] = useState(false)

    const {filters} = useSelector(state => state.filters)
    const {booksOverhead,fetchBooksAccStatus} = useSelector(state => state.books)
    const {isCheckedPassword} = useSelector(state => state.me)

    const dispatch = useDispatch()



    const multiPropsFilter = useMemo(() => {
        const filterKeys = Object.keys(filters);
        return booksOverhead?.book?.filter(user => {
            return filterKeys?.every(key => {
                if (!filters[key]?.activeFilters?.length) return true;
                if (Array.isArray(user[key])) {
                    if (Array.isArray(filters[key]?.activeFilters)) {
                        return user[key].some(keyEle =>
                            filters[key].activeFilters.some(
                                keyFil => keyFil.toLowerCase().includes(keyEle.toLowerCase())
                            )
                        );
                    }
                    return user[key].some(keyEle =>
                        filters[key]?.activeFilters === keyEle
                    );
                }
                if (Array.isArray(filters[key]?.activeFilters)) {
                    return filters[key]?.activeFilters.includes(user[key]);
                }
                return filters[key]?.activeFilters === user[key];
            });
        });
    },[filters,booksOverhead]) ;



    const searchedUsers = useMemo(() => {
        const filteredHeroes = multiPropsFilter?.slice()
        setCurrentPage(1)
        return filteredHeroes?.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.surname.toLowerCase().includes(search.toLowerCase())
        )
    },[multiPropsFilter,search])


    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedUsers?.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedUsers]);

    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    },[activeChangeModalName, isCheckedPassword])


    const getDeleted = () => {
        setDeletedData(!deletedData)
    }
    const getArchive = () => {
        setArchiveData(!archiveData)
        setActiveOthers(false)
    }

    // useEffect(() => {
    //
    //     const newData = {
    //         name: "debt_students",
    //         location: locationId
    //     }
    //     dispatch(fetchFilters(newData))
    // },[])


    useEffect(() => {
        const data ={
            // locationId,
            // type: "overhead"
        }
        if (deletedData) {
            if (archiveData) {
                dispatch(fetchDeletedBooksOverheadData({...data,isArchive:true}))
            }
            else {
                dispatch(fetchDeletedBooksOverheadData(data))
            }
        } else {
            if (archiveData) {
                dispatch(fetchBooksOverheadData({...data,isArchive: true}))
            } else {
                dispatch(fetchBooksOverheadData(data))
            }
        }
    },[deletedData,archiveData])


    // let summa = isDebtsSum === "debt"  ? "balance" :
    //     isDebtsSum === "payment"  ? "payment" :
    //         isDebtsSum === "item"  ? "price" :
    //             isDebtsSum === "salary"  ? "salary" : null


    // let sum = dataAcc.reduce((a, c) => { return a + c[summa]}, 0);
    const {request} = useHttp()
    const changePaymentTypeData = (id,value) => {
        request(`${BackUrl}change_overhead_book/${id}/${value}`,"GET",null,headers())
            .then( res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    dispatch(changeBookOverheadPaymentType({id,name:res.type,editor_balance:res.editor_balance}))
                } else {
                    setTypeMsg("error")
                    setMsg("Serverda hatolik")
                    setActiveMessage(true)
                }
            })
    }

    const onDelete = (data) => {

        const {id} = data


        request(`${BackUrl}delete_book_overhead/${id}`, "POST", JSON.stringify(data),headers())
            .then( res => {
                if (res.success) {
                    dispatch(setMessage({
                        type: "success",
                        msg: res.msg,
                        active : true
                    }))
                    dispatch(deleteBookOverhead({id,editor_balance: res.editor_balance}))
                } else {
                    setTypeMsg("error")
                    setMsg("Serverda hatolik")
                    setActiveMessage(true)
                }
            })
    }

    const funcsSlice = {
        changePaymentTypeData,
        onDelete
    }
    const activeItems = ()=> {
        if (deletedData) {
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


    return (
        <div className="accountingBooks">
            <section className="section">
                <header className="section__header">
                    <div>
                        <PlatformSearch search={search} setSearch={setSearch}/>
                        <div></div>
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

                    <Filters filterRef={filterRef} filters={filters} heightOtherFilters={heightOtherFilters} activeOthers={activeOthers}/>
                </header>
                <div className="links">
                    <Link to={`../historyOverheadBooks`}>
                        <Button>Harajatlar tarixi</Button>
                    </Link>

                    <Button
                        active={activeChangeModalName === "overhead" && activeChangeModal}
                        onClickBtn={changeModal}
                        name={"overhead"}
                    >
                        Qo'shish
                    </Button>

                    <Button active={deletedData} onClickBtn={getDeleted}>
                        O'chirilgan
                    </Button>

                    <Button active={archiveData} onClickBtn={getArchive}>
                        Arxiv
                    </Button>
                </div>


                <div className="locationMoneys">
                    {
                        booksOverhead.editor_balance?.map((item,index) => {
                            return (
                                <div key={index} className="locationMoneys__item">
                                    <span>{item.payment_type.name}:</span>
                                    <span>{item?.balance?.toLocaleString()}</span>
                                </div>
                            )
                        })
                    }

                </div>

                <main className="section__main">
                    <AccountingTable
                        // sum={sum}
                        cache={true}
                        typeOfMoney={"overhead"}
                        fetchUsersStatus={fetchBooksAccStatus}
                        funcSlice={funcsSlice}
                        activeRowsInTable={activeItems()}
                        users={currentTableData}
                    />

                    {/*<Pagination*/}
                    {/*    className="pagination-bar"*/}
                    {/*    currentPage={currentPage}*/}
                    {/*    totalCount={searchedUsers?.length}*/}
                    {/*    pageSize={PageSize}*/}
                    {/*    onPageChange={page => setCurrentPage(page)}*/}
                    {/*/>*/}
                </main>


                <footer className="section__footer">
                    <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                        <CheckPassword/>
                    </Modal>
                    {
                        activeChangeModalName === "overhead" && isCheckedPassword ?
                            <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                                <CreatOverhead
                                    setActiveChangeModal={setActiveChangeModal}
                                    setMsg={setMsg}
                                    setActiveMessage={setActiveMessage}
                                    setTypeMsg={setTypeMsg}
                                />
                            </Modal>: null
                    }
                    <PlatformMessage typeMessage={typeMsg} activeMsg={activeMessage}>
                        {msg}
                    </PlatformMessage>
                </footer>
            </section>
        </div>
    );
};

const CreatOverhead = ({setMsg,setTypeMsg,setActiveMessage,setActiveChangeModal}) => {
    const {
        register,
        formState: {errors},
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur"
    })


    const {dataToChange} = useSelector(state => state.dataToChange)
    const {booksOverhead} = useSelector(state => state.books)
    const [day,setDay] = useState(null)
    const [month,setMonth] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchDataToChange(1))
    },[])



    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map((item,index) => {
            return (
                <label key={index} className="radioLabel" htmlFor="">
                    <input className="radio" {...register("typePayment", { required: true })} type="radio" value={item.id} />
                    <span>{item.name}</span>
                </label>
            )
        })
    },[dataToChange?.payment_types])


    const renderDate = useCallback(() => {
        return booksOverhead?.overhead_tools?.map((item,index) => {
            if (item.value === month) {
                return (
                    <div className="date__item" key={index}>
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
    },[booksOverhead?.overhead_tools, month, day])


    const renderedDays = renderDate()
    const renderedPaymentType = renderPaymentType()

    const {request} = useHttp()


    const onSubmit = (data,e) => {
        e.preventDefault()
        const newData = {
            ...data,
            month,
            day
        }
        request(`${BackUrl}book_overhead2/`,"POST", JSON.stringify(newData),headers())
            .then(res => {
                if (res.success) {
                    reset()
                    dispatch(setMessage({
                        type: "success",
                        msg: res.msg,
                        active : true
                    }))
                    setActiveChangeModal(false)
                    dispatch(addBookOverhead({book: res.book,editor_balance: res.editor_balance}))
                } else {
                    setTypeMsg("error")
                    setMsg("Serverda hatolik")
                    setActiveMessage(true)
                    setActiveChangeModal(false)
                }
            })
    }


    useEffect(() => {
        if (booksOverhead.overhead_tools.length < 2) {
            setMonth(booksOverhead.overhead_tools[0].value)
        }
    },[booksOverhead?.overhead_tools])

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
                            {...register("typeItem",{
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
                            {...register("price",{
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
                    booksOverhead?.overhead_tools?.length >= 2 ?
                        <Select
                            name={"month"}
                            title={"Oy"}
                            defaultValue={month}
                            onChangeOption={setMonth}
                            options={booksOverhead?.overhead_tools}
                        /> :
                        null
                }
                {renderedDays}

                <input className="input-submit" type="submit" value="Tasdiqlash"/>


            </form>
        </div>
    )
}

export default OverheadBooks;