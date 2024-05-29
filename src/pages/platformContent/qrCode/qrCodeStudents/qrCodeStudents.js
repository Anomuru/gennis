import React, {useEffect, useMemo, useState} from 'react';
import PlatformSearch from "components/platform/platformUI/search";
import UsersTable from "components/platform/platformUI/tables/usersTable";
import Pagination from "components/platform/platformUI/pagination";
import {useDispatch, useSelector} from "react-redux";

import "./qrCodeStudents.sass"
import {fetchQrCodeStudents} from "slices/qrCodeSlice";


const QrCodeStudents = () => {

    let PageSize = useMemo(() => 50,[])
    const [currentPage, setCurrentPage] = useState(1);
    const {students,fetchQrCodeStudentsStatus} = useSelector(state => state.qrCode)

    const [search,setSearch] = useState("")

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchQrCodeStudents())
    },[])

    const searchedUsers = useMemo(() => {
        const filteredHeroes = students.slice()
        setCurrentPage(1)
        return filteredHeroes.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.surname.toLowerCase().includes(search.toLowerCase())
        )
    },[students,search])

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedUsers.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedUsers]);

    const activeItems = useMemo(() => {
        return {
            name: true,
            surname : true,
            phone: true,
            money: true
        }
    },[])

    return (
        <section className="section">
            <header className="section__header">
                <div key={1}>
                    <PlatformSearch search={search} setSearch={setSearch}/>
                </div>
            </header>
            <main className="section__main">
                <UsersTable
                    fetchUsersStatus={fetchQrCodeStudentsStatus}
                    activeRowsInTable={activeItems}
                    users={currentTableData}
                    blockLink={true}
                />
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={searchedUsers.length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />
            </main>
        </section>
    );
};

export default QrCodeStudents;