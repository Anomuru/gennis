import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Outlet, useHistory, useLocation, Routes, Route,Navigate} from "react-router-dom";

import PlatformSearch from "components/platform/platformUI/search";
import FuncBtns from "components/platform/platformUI/funcBtns";
import Filters from "components/platform/platformUI/filters";
import UsersTable from "components/platform/platformUI/tables/usersTable";
import Pagination from "components/platform/platformUI/pagination";
import Modals from "components/platform/platformModals";
import Button from "components/platform/platformUI/button";
import Message from "components/platform/platformMessage";
import "components/platform/platformSamples/platformSamples.sass"
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import PlatformUserProfile from "pages/platformContent/platformUser/platformUserProfile/platformUserProfile";
import Select from "components/platform/platformUI/select";



const SampleUsers = (props) => {


    const {
        funcsSlice,
        activeRowsInTable,
        users,
        filters,
        btns,
        fetchUsersStatus,
        pageName,
        locationId,
        isDeletedData,
        isTeachers,
        page = 1,
        checkedUsers,
        options,
        isChangePage,
        selectedOption
    } = props

    let PageSize = useMemo(()=> 50,[])
    
    const filterRef = useRef()
    const sectionRef = useRef({
        scrollTop: 0
    })
    const [dataBtns,setDataBtns] = useState([])
    const [currentPage, setCurrentPage] = useState(page);
    const [activeOthers,setActiveOthers] = useState(false)
    const [heightOtherFilters,setHeightOtherFilters] = useState(0)
    const [search,setSearch] = useState("")
    const [deletedData,setDeletedData] = useState(false)
    // const [usersList,setUsersList] = useState()
    const [currentScroll,setCurrentScroll] = useState()



    const [msg,setMsg] = useState("")
    const [typeMsg,setTypeMsg] = useState("")
    const [activeMessage,setActiveMessage] = useState(false)

    const [linkUser,setLinkUser] = useState(false)

    useEffect(()=>{
        setDataBtns(btns)
    },[btns])


    const scrollEvent = (e) => {
        setCurrentScroll(e.target.scrollTop)
    }



    const multiPropsFilter = useMemo(() => {
        const filterKeys = Object.keys(filters);
        return users.filter(user => {
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
                if (typeof filters[key]?.activeFilters === "string") {
                    if (typeof user[key] === "number") {
                        return +filters[key]?.activeFilters === +user[key]
                    }
                    return filters[key]?.activeFilters === user[key]
                }
                return filters[key]?.activeFilters?.includes(user[key]);
            });
        });
    },[filters,users]) ;



    const searchedUsers = useMemo(() => {
        const filteredHeroes = multiPropsFilter.slice()
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


    const clazzBtnFilter = activeOthers ? "funcButtons__btn funcButtons__btn-active" : "funcButtons__btn "



    const dispatch = useDispatch()
    const getDeleted = () => {
        setDeletedData(!deletedData)
        funcsSlice?.getDeleted(!deletedData)
    }
    // const changeDirection = () => {
    //     setTimeout(() => {
    //         sectionRef.current.scrollTop = currentScroll
    //     },500)
    // }


    // if (linkUser) {
    //     return (
    //         <section className="section">
    //             <div className="section__header">
    //                 <div>
    //                     <Link to={-1} onClick={changeDirection} className="backBtn">
    //                         <i className="fas fa-arrow-left" />
    //                         Ortga
    //                     </Link>
    //                 </div>
    //                 <div></div>
    //             </div>
    //             <Outlet/>
    //         </section>
    //     )
    // }

    const [currentLocation,setCurrentLocation] = useState(false)

    const location = useLocation()

    useEffect(() => {
        if (location) {
            setCurrentLocation(location)
        }
    },[location])

    useEffect(() => {
        if (location !== currentLocation) {
            setTimeout(() => {
                if (sectionRef.current?.scrollTop) {
                    sectionRef.current.scrollTop = currentScroll
                }
            },500)
        }
    },[location])


    return (
        <>
            <Routes>
                <Route path="list" element={<List sectionRef={sectionRef} currentScroll={currentScroll} >
                    <section className="section" onScroll={scrollEvent} ref={sectionRef} >
                        <header className="section__header">
                            <div key={1}>
                                <PlatformSearch search={search} setSearch={setSearch}/>
                                <FuncBtns
                                    locationId={locationId}
                                    funcsSlice={funcsSlice}
                                    clazzBtnFilter={clazzBtnFilter}
                                    dataBtns={dataBtns}
                                />

                                {
                                    isChangePage ?
                                        <div>
                                            <Select
                                                all={true}
                                                title={"Sahifalar"}
                                                defaultValue={selectedOption}
                                                options={options}
                                                onChangeOption={funcsSlice?.changeOption}
                                            />
                                        </div> : null
                                }

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

                            <Filters key={3} filterRef={filterRef} filters={filters} heightOtherFilters={heightOtherFilters} activeOthers={activeOthers}/>
                        </header>
                        <div className="links">
                            {
                                isDeletedData ?
                                    <Button active={deletedData} onClickBtn={getDeleted}>
                                        O'chirilgan
                                    </Button>
                                    : null
                            }
                            {
                                isTeachers ?
                                    <>
                                        <Link to={`../../allTeachers`}>
                                            <Button>Hamma o'qituvchilar</Button>
                                        </Link>
                                        <Link to={`../../teachersRating/${locationId}`}>
                                            <Button>O'qituvchilar reytingi</Button>
                                        </Link>
                                    </>
                                    : null
                            }
                        </div>
                        <main className="section__main">
                            <UsersTable
                                fetchUsersStatus={fetchUsersStatus}
                                funcsSlice={funcsSlice}
                                activeRowsInTable={activeRowsInTable}
                                users={currentTableData}
                                pageName={pageName}
                                checkedUsers={checkedUsers}
                                setLinkUser={setLinkUser}
                                cache={true}
                            />
                            <Pagination
                                className="pagination-bar"
                                currentPage={currentPage}
                                totalCount={searchedUsers.length}
                                pageSize={PageSize}
                                onPageChange={page => {
                                    setCurrentPage(page)
                                    dispatch(funcsSlice?.setPage({page}))
                                }}
                            />
                        </main>

                        <footer className="section__footer">

                            <Modals
                                locationId={locationId}
                                btns={dataBtns}
                                setMsg={setMsg}
                                setTypeMsg={setTypeMsg}
                                setActiveMessage={setActiveMessage}
                            />
                        </footer>
                        <Message typeMessage={typeMsg} activeMsg={activeMessage}>{msg}</Message>
                    </section>
                </List>} />

                <Route path="profile/:userId/*" element={<PlatformUserProfile/>}  />

                <Route path="*"  element={
                        // This links to /:userId/messages, no matter
                        // how many segments were matched by the *
                        <Navigate to="list" replace />
                    }
                />
            </Routes>
            {/*<List>*/}
            {/*    <section className="section" onScroll={scrollEvent} ref={sectionRef} >*/}
            {/*        <header className="section__header">*/}
            {/*            <div key={1}>*/}
            {/*                <PlatformSearch search={search} setSearch={setSearch}/>*/}
            {/*                <FuncBtns*/}
            {/*                    locationId={locationId}*/}
            {/*                    funcsSlice={funcsSlice}*/}
            {/*                    clazzBtnFilter={clazzBtnFilter}*/}
            {/*                    dataBtns={dataBtns}*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div key={2}>*/}
            {/*                <Button*/}
            {/*                    onClickBtn={() => {*/}
            {/*                        setActiveOthers(!activeOthers)*/}
            {/*                        setHeightOtherFilters(filterRef.current.scrollHeight)*/}
            {/*                    }}*/}
            {/*                    active={activeOthers}*/}
            {/*                >*/}
            {/*                    Filterlar*/}
            {/*                </Button>*/}
            {/*            </div>*/}

            {/*            <Filters key={3} filterRef={filterRef} filters={filters} heightOtherFilters={heightOtherFilters} activeOthers={activeOthers}/>*/}
            {/*        </header>*/}
            {/*        <div className="links">*/}
            {/*            {*/}
            {/*                isDeletedData ?*/}
            {/*                    <Button active={deletedData} onClickBtn={getDeleted}>*/}
            {/*                        O'chirilgan*/}
            {/*                    </Button>*/}
            {/*                    : null*/}
            {/*            }*/}
            {/*            {*/}
            {/*                isTeachers ?*/}
            {/*                    <Link to={`../../allTeachers`}>*/}
            {/*                        <Button>Hamma o'qituvchilar</Button>*/}
            {/*                    </Link>*/}
            {/*                    : null*/}
            {/*            }*/}
            {/*        </div>*/}
            {/*        <main className="section__main">*/}
            {/*            <UsersTable*/}
            {/*                fetchUsersStatus={fetchUsersStatus}*/}
            {/*                funcsSlice={funcsSlice}*/}
            {/*                activeRowsInTable={activeRowsInTable}*/}
            {/*                users={currentTableData}*/}
            {/*                pageName={pageName}*/}
            {/*                checkedUsers={checkedUsers}*/}
            {/*                setLinkUser={setLinkUser}*/}
            {/*                cache={true}*/}
            {/*            />*/}
            {/*            <Pagination*/}
            {/*                className="pagination-bar"*/}
            {/*                currentPage={currentPage}*/}
            {/*                totalCount={searchedUsers.length}*/}
            {/*                pageSize={PageSize}*/}
            {/*                onPageChange={page => {*/}
            {/*                    setCurrentPage(page)*/}
            {/*                    dispatch(funcsSlice?.setPage({page}))*/}
            {/*                }}*/}
            {/*            />*/}
            {/*        </main>*/}

            {/*        <footer className="section__footer">*/}

            {/*            <Modals*/}
            {/*                locationId={locationId}*/}
            {/*                btns={dataBtns}*/}
            {/*                setMsg={setMsg}*/}
            {/*                setTypeMsg={setTypeMsg}*/}
            {/*                setActiveMessage={setActiveMessage}*/}
            {/*            />*/}
            {/*        </footer>*/}
            {/*        <Message typeMessage={typeMsg} activeMsg={activeMessage}>{msg}</Message>*/}
            {/*    </section>*/}
            {/*</List>*/}


        </>
    );
};

const List = React.memo(({children}) => {
    return children
})




export default SampleUsers;