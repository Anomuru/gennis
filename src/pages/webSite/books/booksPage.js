import React, {useEffect, useMemo, useState} from 'react';


import style from "pages/webSite/books/booksPage.module.sass"

import img from "assets/book.png"
import {Link} from "react-router-dom";
import Input from "components/platform/platformUI/input";
import {useDispatch, useSelector} from "react-redux";
import Pagination from "components/platform/platformUI/pagination";
import {fetchBooks} from "slices/booksSlice";
import {BackUrlForDoc} from "constants/global";
import Search from "components/platform/platformUI/search";

const BooksPage = () => {

    const [search, setSearch] = useState("")
    const {books} = useSelector(state => state.books)

    const [currentPage, setCurrentPage] = useState(0);
    let PageSize = useMemo(() => 30, [])


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchBooks())
    }, [])

    const searchedUsers = useMemo(() => {
        const filteredHeroes = books.slice()
        setCurrentPage(1)
        return filteredHeroes.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [books, search])

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedUsers.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedUsers]);



    return (
        <div className={style.bookPage}>
            <div className={style.bookPage__header}>
                <Link to={".."} className={style.bookPage__backBtn}>
                    <i className="fas fa-chevron-left"></i>
                </Link>
                <h1 className={style.bookPage__title}>
                    Kitoblar
                </h1>
            </div>

            <div className={style.bookPage__subheader}>
                <Search search={search} setSearch={setSearch}/>
                {/*<Input title={"Qidiruv"} onChange={setSearch} value={search} />*/}
            </div>


            <div className={style.bookPage__wrapper}>
                {
                    currentTableData.map(item => {
                        return (
                            <Link to={`${item.id}`} className={style.bookPage__item}>
                                <img src={`${BackUrlForDoc}${item.images[0].img}`} alt=""/>
                                <div className={style.info}>
                                    <h3>{item.name}</h3>
                                    <h2>{item.price}</h2>
                                </div>
                            </Link>
                        )
                    })
                }

            </div>

            <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={searchedUsers.length}
                pageSize={PageSize}
                onPageChange={page => {
                    setCurrentPage(page)
                }}
            />

        </div>
    );
};

export default BooksPage;
