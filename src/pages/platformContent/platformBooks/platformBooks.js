import React, {useEffect, useMemo, useState} from 'react';
import "./platformBooks.sass"
import Search from "components/platform/platformUI/search";
import Button from "components/platform/platformUI/button";

import {Link, Navigate, Route, Routes} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Pagination from "components/platform/platformUI/pagination";

import AddBook from "components/platform/platformModals/addBook/addBook";
import BooksProfile from "pages/platformContent/platformBooks/profileBooks/booksProfile";
import BasketBooks from "pages/platformContent/platformBooks/basketBooks/basketBooks";

import {fetchBooks} from "slices/booksSlice";
import {BackUrlForDoc, ROLES} from "constants/global";
import OverheadBooks from "pages/platformContent/platformBooks/overheadBooks/overheadBooks";
import OrderedBooks from "pages/platformContent/platformBooks/orderedBooks/orderedBooks";
import AccountingBooks from "./accountingBooks/accountingBooks";
import MonthAccountingBook from "./accountingBooks/monthAccountingBook/monthAccountingBook";
import HistoryOverheadBooks from "pages/platformContent/platformBooks/historyOverheadBooks/historyOverheadBooks";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import GetBookMoney from "pages/platformContent/platformBooks/getBookMoney/getBookMoney";
import MonthBookMoney from "pages/platformContent/platformBooks/getBookMoney/monthBookMoney/monthBookMoney";

const PlatformBooks = () => {
    return (
        <>
            <Routes>
                <Route index path={"/"} element={<PlatformBooksIndex/>}/>
                <Route path={":id"} element={<BooksProfile/>}/>
                <Route path={"basketBooks"} element={<BasketBooks/>}/>
                <Route path={"overheadBooks"} element={<OverheadBooks/>}/>
                <Route path={"orderedBooks"} element={<OrderedBooks/>}/>
                <Route path={"accounting"} element={<AccountingBooks/>}/>
                <Route path={"monthAccountingBook/:monthId"} element={<MonthAccountingBook/>}/>
                <Route path={"historyOverheadBooks"} element={<HistoryOverheadBooks/>}/>
                <Route path={"getBookMoney"} element={<GetBookMoney/>}/>
                <Route path={"getBookMoney/:id"} element={<MonthBookMoney/>}/>
                <Route
                    path="*"
                    element={
                        <Navigate to="/" replace/>
                    }
                />
            </Routes>
        </>
    );
};

const PlatformBooksIndex = () => {

    const {books} = useSelector(state => state.books)
    const [fetched, setFetched] = useState(false)

    const [search, setSearch] = useState("")
    const [activeAdd, setActiveAdd] = useState(false)

    const [currentPage, setCurrentPage] = useState(0);
    let PageSize = useMemo(() => 20, [])


    const dispatch = useDispatch()

    useEffect(() => {
        if (books.length === 0 && !fetched) {
            setFetched(true)
            dispatch(fetchBooks())
        }
    }, [books])


    const searchedUsers = useMemo(() => {
        const filteredHeroes = books.slice()
        setCurrentPage(1)
        return filteredHeroes.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.surname.toLowerCase().includes(search.toLowerCase()) ||
            item.username.toLowerCase().includes(search.toLowerCase())
        )
    }, [books, search])


    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedUsers.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedUsers]);


    return (
        <div className="books">
            <div className="books__header" >
                <Search setSearch={setSearch} search={search}/>
                <div className="books__header-btns">
                    <RequireAuthChildren allowedRules={[ROLES.Editor]}>
                        <Link to={"overheadBooks"}>
                            <Button>
                                Harajatlar
                            </Button>
                        </Link>
                        <Button onClickBtn={() => setActiveAdd(true)} active={activeAdd}>
                            Qo'shish
                        </Button>
                    </RequireAuthChildren>
                    <RequireAuthChildren allowedRules={[!ROLES.Editor,!ROLES.Admin]}>
                        <Link to={"basketBooks"}>
                            <Button extraMsg={1}>
                                <i className="fas fa-shopping-cart"></i> Savat
                            </Button>
                        </Link>
                    </RequireAuthChildren>


                    <RequireAuthChildren allowedRules={[ROLES.Editor,ROLES.Admin]}>

                        <Link to={"orderedBooks"}>
                            <Button extraMsg={1}>
                                <i className="fas fa-shopping-cart"></i> Buyurtmalar
                            </Button>
                        </Link>

                    </RequireAuthChildren>

                </div>
            </div>

            <div className="books__wrapper">
                {
                    currentTableData.map((item, index) => {
                        return (
                            <Link key={index} to={`${item.id}`} className="books__item">
                                <img src={`${BackUrlForDoc}${item.images[0]?.img}`} alt=""/>
                                <div className="info">
                                    <h3>{item.name}</h3>
                                    <h2>{item.price.toLocaleString()}</h2>
                                </div>
                            </Link>
                        )
                    })
                }
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={currentTableData.length}
                    pageSize={PageSize}
                    onPageChange={page => {
                        setCurrentPage(page)
                    }}
                />
            </div>
            <AddBook activeModal={activeAdd} setActiveModal={setActiveAdd}/>
        </div>
    );
}

export default PlatformBooks;