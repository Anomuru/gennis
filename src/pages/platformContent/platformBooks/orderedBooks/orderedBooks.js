import React, {useCallback, useEffect, useMemo, useState} from 'react';
import BackButton from "components/platform/platformUI/backButton/backButton";
import Search from "components/platform/platformUI/search";
import Button from "components/platform/platformUI/button";
import BooksTable from "components/platform/platformUI/tables/booksTable";
import {useDispatch, useSelector} from "react-redux";


import "./orderedBooks.sass"
import {
    fetchDeletedOrdersBooks,
    fetchMonthBooksAcc,
    fetchOrderedBooks,
    onDeletedOrder,
    onSetChangedOrders
} from "slices/booksSlice";
import Pagination from "components/platform/platformUI/pagination";
import {setPage} from "slices/newStudentsSlice";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import Select from "components/platform/platformUI/select";
import {Link} from "react-router-dom";
import {BackUrl, headers, ROLES} from "constants/global";
import {setMessage} from "slices/messageSlice";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Confirm from "components/platform/platformModals/confirm/confirm";
import {useForm} from "react-hook-form";
import {useHttp} from "hooks/http.hook";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";


const OrderedBooks = () => {


    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const {isCheckedPassword, role} = useSelector(state => state.me)


    const [search, setSearch] = useState("")
    const [location, setLocation] = useState("")
    const [changingData, setChangingData] = useState({})

    const [currentPage, setCurrentPage] = useState(0);
    let PageSize = useMemo(() => 50, [])

    const {orderedBooks, debtLoc} = useSelector(state => state.books)
    const {dataToChange} = useSelector(state => state.dataToChange)
    const [activeDeleted, setActiveDeleted] = useState(false)
    const [activeArchive, setActiveArchive] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)


    const [books, setBooks] = useState([])

    useEffect(() => {
        setBooks(orderedBooks)
    }, [orderedBooks])

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchDataToChange())
    }, [])


    const activeRowsTable = {
        name: true,
        surname: true,
        book: true,
        price: true,
        count: true,
        location: true,
        allPrice: true,
        group: true,
        date: true,
        role: true,
        reason: activeDeleted,
        confirmEditor: !activeDeleted,
        confirmAdmin: !activeDeleted,
        change: !activeDeleted && role === ROLES.Admin,
        delete: !activeDeleted && role === ROLES.Admin,
        deleteOrder: !activeDeleted && role === ROLES.Admin
    }
    const multiPropsFilter = useMemo(() => {
        return books.filter(book => {
            if (location === "all" || !location) return book
            return book.location.id === +location
        });
    }, [books, location]);


    const searchedUsers = useMemo(() => {
        const filteredHeroes = multiPropsFilter.slice()
        setCurrentPage(1)
        return filteredHeroes.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, multiPropsFilter])


    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedUsers.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedUsers]);


    useEffect(() => {
        if (activeDeleted) {
            dispatch(fetchDeletedOrdersBooks())
        } else if (activeArchive) {
            dispatch(fetchOrderedBooks("archive"))
        } else {
            dispatch(fetchOrderedBooks())
        }
    }, [activeDeleted, activeArchive])


    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    }, [activeChangeModalName, isCheckedPassword])

    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }


    const funks = {
        changeModal,
        setChangingData
    }

    const {request} = useHttp()


    const changePaymentTypeTransfer = (id, value) => {
        setActiveChangeModal(false)
        request(`${BackUrl}change_branch_money/${id}/${value}`, "GET", null, headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    dispatch(onSetChangedOrders({books: res.order}))
                }
            })
    }

    const deleteTransfer = (data) => {

        request(`${BackUrl}delete_branch_payment2/${changingData.id}`, "GET", null, headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    dispatch(onSetChangedOrders({books: res.order}))
                }
            })
        setActiveChangeModal(false)

    }

    const deleteOrder = (data) => {

        const newData = {
            ...data
        }
        request(`${BackUrl}delete_book_order/${changingData.id}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    dispatch(onDeletedOrder({id: changingData.id}))
                }
            })
        setActiveChangeModal(false)

    }

    return (
        <div className="orderedBooks">
            <div className="orderedBooks__header">
                <BackButton/>
            </div>
            <div className="orderedBooks__subheader">
                <Search search={search} setSearch={setSearch}/>
                <div style={{display: "flex"}}>

                    <RequireAuthChildren allowedRules={[ROLES.Admin]}>


                        <Button>
                            {debtLoc}
                        </Button>

                        <Link to={"../accounting"}>
                            <Button>Hisob</Button>
                        </Link>

                    </RequireAuthChildren>
                    <RequireAuthChildren allowedRules={[ROLES.Editor]}>
                        <Link to={"../getBookMoney"}>
                            <Button>Pul olish</Button>
                        </Link>
                        <Select title={"Manzil"} all={true} group={true} options={dataToChange.locations}
                                onChangeOption={setLocation}/>
                    </RequireAuthChildren>
                </div>
            </div>
            <div className="orderedBooks__subheader">
                <div style={{display: "flex"}}>
                    <RequireAuthChildren allowedRules={[ROLES.Admin]}>
                        <Button onClickBtn={() => setActiveDeleted(!activeDeleted)}
                                active={activeDeleted}>O'chirilgan</Button>
                    </RequireAuthChildren>
                    <Button active={activeArchive} onClickBtn={() => setActiveArchive(!activeArchive)}>
                        Arxiv
                    </Button>
                </div>

            </div>


            <div className="orderedBooks__wrapper">
                <BooksTable funks={funks} books={currentTableData} activeRowsInTable={activeRowsTable}/>
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={searchedUsers.length}
                    pageSize={PageSize}
                    onPageChange={page => {
                        setCurrentPage(page)
                        setPage(page)
                    }}
                />
            </div>


            <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                <CheckPassword/>
            </Modal>
            {
                activeChangeModalName === "transfer" && isCheckedPassword ?
                    <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                        <MoneyTransfers
                            setActiveChangeModal={setActiveChangeModal}
                            books={books}
                        />
                    </Modal>
                    : activeChangeModalName === "changeTransfer" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <div className="changeTypePayment">
                                <Select
                                    group={true}
                                    options={dataToChange.payment_types}
                                    name={""}
                                    title={"Payment turi"}
                                    onChangeOption={changePaymentTypeTransfer}
                                    id={changingData.id}
                                    defaultValue={changingData.typePayment}
                                />
                            </div>
                        </Modal>
                        : activeChangeModalName === "deleteTransfer" && isCheckedPassword ?
                            <>
                                <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                                    <Confirm setActive={setActiveChangeModal}
                                             text={`${changingData.name} kitob pulini o'chirishni hohlaysizmi`}
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
                                            <ConfimReason getConfirm={deleteTransfer} reason={true}/>
                                        </Modal> : null
                                }
                            </>
                            : activeChangeModalName === "deleteOrder" && isCheckedPassword ?
                                <>
                                    <Modal activeModal={activeChangeModal}
                                           setActiveModal={() => setActiveChangeModal(false)}>
                                        <Confirm setActive={setActiveChangeModal}
                                                 text={`${changingData.name} kitob zakazini o'chirishni hohlaysizmi`}
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
                                                <ConfimReason getConfirm={deleteOrder} reason={true}/>
                                            </Modal> : null
                                    }

                                </>
                                : null
            }
        </div>
    );
};

const MoneyTransfers = ({setActiveChangeModal, books}) => {

    const {dataToChange} = useSelector(state => state.dataToChange)

    const {
        register,
        formState: {
            isValid,
            isDirty
        },
        handleSubmit,
    } = useForm({
        mode: "onBlur"
    })


    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmit = (data) => {
        const newData = {
            ...data,
            books: books.filter(item => item.admin_confirm)
        }
        request(`${BackUrl}send_campus_money`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                    dispatch(onSetChangedOrders({books: res.order}))
                    setActiveChangeModal(false)
                }
            })
    }

    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map(item => {
            return (
                <label className="radioLabel" htmlFor="">
                    <input className="radio" {...register("typePayment", {required: true})} type="radio"
                           value={item.id}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange, register])

    const renderedPaymentTypes = renderPaymentType()


    return (
        <div className="transfers">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <h1>Pul</h1>
                <div>
                    {renderedPaymentTypes}
                </div>
                <input disabled={!isDirty || !isValid} className="input-submit" type="submit" value="Tasdiqlash"/>
            </form>


        </div>
    )
}


export default OrderedBooks;
