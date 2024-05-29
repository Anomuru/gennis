import React, {useEffect, useMemo, useState} from 'react';
import BackButton from "components/platform/platformUI/backButton/backButton";
import {Link} from "react-router-dom";
import book from "assets/book.png";
import {useDispatch, useSelector} from "react-redux";
import Pagination from "components/platform/platformUI/pagination";
import {setPage} from "slices/newStudentsSlice";


import "pages/platformContent/platformBooks/basketBooks/basketBooks.sass"
import Button from "components/platform/platformUI/button";
import {fetchBasketBooks} from "slices/booksSlice";

const BasketBooks = () => {

    const {basketBooks} = useSelector(state => state.books)
    const [search, setSearch] = useState("")
    const [activeAdd, setActiveAdd] = useState(false)

    const [activePage,setActivePage] = useState("new")

    const [currentPage, setCurrentPage] = useState(0);
    let PageSize = useMemo(() => 50, [])

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchBasketBooks())
    },[])



    const filteredData = useMemo( () =>  {
        if (activePage === "new") {
            return basketBooks?.new
        }
        return basketBooks?.old
    },[activePage, basketBooks?.new, basketBooks?.old])


    const searchedUsers = useMemo(() => {
        const filteredHeroes = filteredData.slice()
        setCurrentPage(1)
        return filteredHeroes
    }, [filteredData])


    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedUsers.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedUsers]);
    return (
        <div className="basketBooks">
            <div className="basketBooks__header">
                <BackButton/>



                <div style={{display: "flex"}}>
                    <Button active={activePage === "new"} onClickBtn={() => setActivePage("new")}>
                        Hozirgi
                    </Button>
                    <Button active={activePage === "old"} onClickBtn={() => setActivePage("old")}>
                        Oldingi
                    </Button>
                </div>

            </div>
            <div className="basketBooks__wrapper">
                {
                    currentTableData.map((item, index) => {
                        return (
                            <Link key={index} to={`../${item.id}`} className="basketBooks__item">
                                <img src={book} alt=""/>
                                <div className="info">
                                    <h3>{item.book.name}</h3>
                                    <h2>{item.book.price?.toLocaleString()}</h2>
                                </div>
                            </Link>
                        )
                    })
                }
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
        </div>
    );
};

export default BasketBooks;