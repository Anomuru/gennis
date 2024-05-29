import React, {useEffect, useMemo, useRef, useState} from 'react';

import Message from "components/platform/platformMessage";
import GroupsTable from "components/platform/platformUI/tables/groupsTable";
import PlatformSearch from "components/platform/platformUI/search";
import FuncBtns from "components/platform/platformUI/funcBtns";
import Filters from "components/platform/platformUI/filters";
import Pagination from "components/platform/platformUI/pagination";


import "components/platform/platformSamples/platformSamples.sass"
import Button from "components/platform/platformUI/button";
import {useDispatch} from "react-redux";
import {Link, Navigate, Route, Routes, useLocation} from "react-router-dom";
import Select from "components/platform/platformUI/select";
import UsersTable from "components/platform/platformUI/tables/usersTable";
import Modals from "components/platform/platformModals";
import PlatformUserProfile from "pages/platformContent/platformUser/platformUserProfile/platformUserProfile";
import PlatformGroupInside from "pages/platformContent/platformGroupsInside/platformGroupInside";


// const SampleGroups = ({funcsSlice,activeRowsInTable,groups,filters,btns,locationId}) => {
//
//     let PageSize = useMemo(()=> 50,[])
//
//     const filterRef = useRef()
//     const [dataBtns,setDataBtns] = useState([])
//     const [currentPage, setCurrentPage] = useState(1);
//     const [activeOthers,setActiveOthers] = useState(false)
//     const [heightOtherFilters,setHeightOtherFilters] = useState(0)
//     const [search,setSearch] = useState("")
//     const [activeError,setActiveError] = useState(false)
//     const [errorMessage,setErrorMessage] = useState("")
//
//
//     useEffect(()=>{
//         setDataBtns(btns)
//     },[btns])
//
//
//
//     const multiPropsFilter = useMemo(() => {
//         const filterKeys = Object.keys(filters);
//         return groups.filter(group => {
//             return filterKeys.every(key => {
//                 if (!filters[key]?.activeFilters?.length) return true;
//
//                 // if (Array.isArray(group[key])) {
//                 //     return group[key].some(keyEle =>
//                 //         filters[key].activeFilters.some(
//                 //             keyFil => keyFil.toLowerCase().includes(keyEle.toLowerCase())
//                 //         )
//                 //     );
//                 // }
//                 return filters[key]?.activeFilters?.includes(group[key]);
//             });
//         });
//     },[filters,groups]) ;
//
//
//     const searchedGroups = useMemo(() => {
//         const filteredGroups = multiPropsFilter.slice()
//         setCurrentPage(1)
//         return filteredGroups.filter(group =>
//             group.name.toLowerCase().includes(search.toLowerCase())
//         )
//     },[multiPropsFilter, search])
//
//
//
//     const currentTableData = useMemo(() => {
//         const firstPageIndex = (currentPage - 1) * PageSize;
//         const lastPageIndex = firstPageIndex + PageSize;
//         return searchedGroups.slice(firstPageIndex, lastPageIndex);
//     }, [PageSize, currentPage, searchedGroups]);
//
//
//     const clazzBtnFilter = activeOthers ? "funcButtons__btn funcButtons__btn-active" : "funcButtons__btn "
//
//
//     return (
//         <section className="section">
//             <header className="section__header">
//                 <div>
//                     <PlatformSearch search={search} setSearch={setSearch}/>
//                     <FuncBtns
//                         funcsSlice={funcsSlice}
//                         clazzBtnFilter={clazzBtnFilter}
//                         activeOthers={activeOthers}
//                         setActiveOthers={setActiveOthers}
//                         setHeightOtherFilters={setHeightOtherFilters}
//                         filterRef={filterRef}
//                         dataBtns={dataBtns}
//                         locationId={locationId}
//                     />
//                 </div>
//                 <div>
//                     <Button
//                         id={100}
//                         onClickBtn={() => {
//                             setActiveOthers(!activeOthers)
//                             setHeightOtherFilters(filterRef.current.scrollHeight)
//                         }}
//                         active={activeOthers}
//                     >
//                         Filterlar
//                     </Button>
//                 </div>
//
//                 <Filters
//                     filterRef={filterRef}
//                     filters={filters}
//                     heightOtherFilters={heightOtherFilters}
//                     activeOthers={activeOthers}
//                 />
//             </header>
//
//
//             <main className="section__main">
//                 <GroupsTable
//                     activeRowsInTable={activeRowsInTable}
//                     groups={currentTableData}
//                 />
//
//                 <Pagination
//                     className="pagination-bar"
//                     currentPage={currentPage}
//                     totalCount={searchedGroups.length}
//                     pageSize={PageSize}
//                     onPageChange={page => setCurrentPage(page)}
//                 />
//             </main>
//
//
//             <footer className="section__footer">
//                 <Message activeError={activeError} typeMessage={"error"}>{errorMessage}</Message>
//             </footer>
//         </section>
//     );
// };


const SampleGroups = (props) => {


    const {
        funcsSlice,
        activeRowsInTable,
        groups,
        filters,
        btns,
        fetchUsersStatus,
        pageName,
        locationId,
        isDeletedData,
        isTeachers,
        page = 1,
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
        return groups.filter(group => {
            return filterKeys.every(key => {
                if (!filters[key]?.activeFilters?.length) return true;

                // if (Array.isArray(group[key])) {
                //     return group[key].some(keyEle =>
                //         filters[key].activeFilters.some(
                //             keyFil => keyFil.toLowerCase().includes(keyEle.toLowerCase())
                //         )
                //     );
                // }
                return filters[key]?.activeFilters?.includes(group[key]);
            });
        });
    },[filters,groups]) ;



    const searchedGroups= useMemo(() => {
        const filteredGroups = multiPropsFilter.slice()
        setCurrentPage(1)
        return filteredGroups.filter(group =>
            group.name.toLowerCase().includes(search.toLowerCase())
        )
    },[multiPropsFilter,search])





    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedGroups.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedGroups]);


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
                    <section className="section" onScroll={scrollEvent} ref={sectionRef}>
                        <header className="section__header">
                            <div>
                                <PlatformSearch search={search} setSearch={setSearch}/>
                                <FuncBtns
                                    funcsSlice={funcsSlice}
                                    clazzBtnFilter={clazzBtnFilter}
                                    activeOthers={activeOthers}
                                    setActiveOthers={setActiveOthers}
                                    setHeightOtherFilters={setHeightOtherFilters}
                                    filterRef={filterRef}
                                    dataBtns={dataBtns}
                                    locationId={locationId}
                                />
                            </div>
                            <div>
                                <Button
                                    id={100}
                                    onClickBtn={() => {
                                        setActiveOthers(!activeOthers)
                                        setHeightOtherFilters(filterRef.current.scrollHeight)
                                    }}
                                    active={activeOthers}
                                >
                                    Filterlar
                                </Button>
                            </div>

                            <Filters
                                filterRef={filterRef}
                                filters={filters}
                                heightOtherFilters={heightOtherFilters}
                                activeOthers={activeOthers}
                            />
                        </header>


                        <main className="section__main">
                            <GroupsTable
                                activeRowsInTable={activeRowsInTable}
                                groups={currentTableData}
                            />

                            <Pagination
                                className="pagination-bar"
                                currentPage={currentPage}
                                totalCount={searchedGroups.length}
                                pageSize={PageSize}
                                onPageChange={page => {
                                    setCurrentPage(page)
                                    dispatch(funcsSlice?.setPage({page}))
                                }}
                            />
                        </main>


                    </section>
                </List>} />

                <Route path="insideGroup/:groupId/*" element={<PlatformGroupInside/>}  />

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


export default SampleGroups;