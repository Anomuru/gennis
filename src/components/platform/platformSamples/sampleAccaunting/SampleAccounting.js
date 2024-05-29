import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import Message from "components/platform/platformMessage";
import Button from "components/platform/platformUI/button";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import PlatformSearch from "components/platform/platformUI/search";
import FuncBtns from "components/platform/platformUI/funcBtns";
import Filters from "components/platform/platformUI/filters";
import Pagination from "components/platform/platformUI/pagination";


import "components/platform/platformSamples/platformSamples.sass"
import {Link, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {useForm} from "react-hook-form";
import Select from "components/platform/platformUI/select";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import PlatformMessage from "components/platform/platformMessage";
import {fetchAccData, onChangePage} from "slices/accountingSlice";
import LocationMoneys from "pages/platformContent/platformAccounting/locationMoneys/locationMoneys";
import {useAuth} from "hooks/useAuth";
import UsersTable from "components/platform/platformUI/tables/usersTable";
import Modals from "components/platform/platformModals";
import PlatformUserProfile from "pages/platformContent/platformUser/platformUserProfile/platformUserProfile";


// const SampleAccounting = ({
//     typeOfMoney,
//     funcsSlice,
//     activeRowsInTable,
//     data,
//     filters,
//     fetchUsersStatus,
//     hrefName,
//     typeExpenditure,
//     locationId,
//     isDeletedData,
//     isArchiveData,
//     isDebtsSum,
//     options,
//     changeOption,
//     selectedOption
// }) => {
//
//     let PageSize = useMemo(()=> 50,[])
//     const {isCheckedPassword} = useSelector(state => state.me)
//     const {btns} = useSelector(state => state.accounting)
//
//     const filterRef = useRef()
//     const [dataAcc,setDataAcc] = useState([])
//     const [currentPage, setCurrentPage] = useState(1);
//     const [activeOthers,setActiveOthers] = useState(false)
//     const [heightOtherFilters,setHeightOtherFilters] = useState(0)
//     const [search,setSearch] = useState("")
//     // const [allMoney,setAllMoney] = useState(0)
//
//     const [activeChangeModal,setActiveChangeModal] = useState(false)
//     const [activeChangeModalName,setActiveChangeModalName] = useState("")
//     const [activeCheckPassword,setActiveCheckPassword] = useState(false)
//     const [deletedData,setDeletedData] = useState(false)
//     const [archiveData,setArchiveData] = useState(false)
//
//     const [msg,setMsg] = useState(false)
//     const [typeMsg,setTypeMsg] = useState(false)
//     const [activeMessage,setActiveMessage] = useState(false)
//
//
//
//     useEffect(() => {
//         setDataAcc(data)
//     }, [data])
//
//
//     const multiPropsFilter = useMemo(() => {
//         const filterKeys = Object.keys(filters);
//         return dataAcc?.filter(user => {
//             return filterKeys?.every(key => {
//                 if (!filters[key]?.activeFilters?.length) return true;
//                 if (Array.isArray(user[key])) {
//                     if (Array.isArray(filters[key]?.activeFilters)) {
//                         return user[key].some(keyEle =>
//                             filters[key].activeFilters.some(
//                                 keyFil => keyFil.toLowerCase().includes(keyEle.toLowerCase())
//                             )
//                         );
//                     }
//                     return user[key].some(keyEle =>
//                         filters[key]?.activeFilters === keyEle
//                     );
//                 }
//                 if (Array.isArray(filters[key]?.activeFilters)) {
//                     return filters[key]?.activeFilters.includes(user[key]);
//                 }
//                 return filters[key]?.activeFilters === user[key];
//             });
//         });
//     },[filters,dataAcc]) ;
//
//
//
//     const searchedUsers = useMemo(() => {
//         const filteredHeroes = multiPropsFilter?.slice()
//         setCurrentPage(1)
//         return filteredHeroes?.filter(item =>
//             item.name.toLowerCase().includes(search.toLowerCase()) ||
//             item.surname.toLowerCase().includes(search.toLowerCase())
//         )
//     },[multiPropsFilter,search])
//
//
//     const currentTableData = useMemo(() => {
//         const firstPageIndex = (currentPage - 1) * PageSize;
//         const lastPageIndex = firstPageIndex + PageSize;
//         return searchedUsers?.slice(firstPageIndex, lastPageIndex);
//     }, [PageSize, currentPage, searchedUsers]);
//
//     const changeModal = (name) => {
//         setActiveChangeModalName(name)
//         if (!isCheckedPassword) {
//             setActiveCheckPassword(true)
//         } else {
//             setActiveChangeModal(true)
//         }
//     }
//
//     useEffect(() => {
//         if (isCheckedPassword && activeChangeModalName) {
//             setActiveCheckPassword(false)
//             setActiveChangeModal(true)
//         }
//     },[activeChangeModalName, isCheckedPassword])
//
//
//     const getDeleted = () => {
//         setDeletedData(!deletedData)
//         funcsSlice?.getDeleted(!deletedData)
//     }
//
//     const getArchive = () => {
//         setArchiveData(!archiveData)
//         funcsSlice?.getArchive(!archiveData)
//         setActiveOthers(false)
//     }
//
//
//
//     let summa = isDebtsSum === "debt"  ? "balance" :
//         isDebtsSum === "payment"  ? "payment" :
//         isDebtsSum === "item"  ? "price" :
//         isDebtsSum === "salary"  ? "salary" : null
//
//
//
//
//     let sum = multiPropsFilter?.reduce((a, c) => { return a + c[summa]}, 0);
//
//
//     return (
//         // <section className="section">
//         //     <header className="section__header">
//         //         <div>
//         //             <PlatformSearch search={search} setSearch={setSearch}/>
//         //
//         //             <FuncBtns
//         //                 funcsSlice={funcsSlice}
//         //                 route={true}
//         //                 dataBtns={btns}
//         //             />
//         //             <div className="accounting__money">
//         //                 <span>
//         //                     {hrefName}
//         //                 </span>
//         //             </div>
//         //         </div>
//         //         <div key={2}>
//         //             <Button
//         //                 onClickBtn={() => {
//         //                     setActiveOthers(!activeOthers)
//         //                     setHeightOtherFilters(filterRef.current.scrollHeight)
//         //                 }}
//         //                 active={activeOthers}
//         //             >
//         //                 Filterlar
//         //             </Button>
//         //         </div>
//         //
//         //         <Filters filterRef={filterRef} filters={filters} heightOtherFilters={heightOtherFilters} activeOthers={activeOthers}/>
//         //     </header>
//         //     <div className="links">
//         //         <Link to={`../../collection/${locationId}`}>
//         //             <Button>Harajatlar to'plami</Button>
//         //         </Link>
//         //         <Link to={`../../historyAccounting/${locationId}`}>
//         //             <Button>Harajatlar tarixi</Button>
//         //         </Link>
//         //         {
//         //             typeExpenditure ?
//         //                 <Button
//         //                     active={activeChangeModalName === typeExpenditure && activeChangeModal}
//         //                     onClickBtn={changeModal}
//         //                     name={typeExpenditure}
//         //                 >
//         //                     Qo'shish
//         //                 </Button>
//         //                 : null
//         //         }
//         //         {
//         //             isDeletedData ?
//         //                 <Button active={deletedData} onClickBtn={getDeleted}>
//         //                     O'chirilgan
//         //                 </Button>
//         //                 : null
//         //         }
//         //         <Button>
//         //             {sum}
//         //         </Button>
//         //
//         //     </div>
//         //
//         //     <LocationMoneys locationId={locationId} />
//         //
//         //     <main className="section__main">
//         //         <AccountingTable
//         //             typeOfMoney={typeOfMoney}
//         //             fetchUsersStatus={fetchUsersStatus}
//         //             funcSlice={funcsSlice}
//         //             activeRowsInTable={activeRowsInTable}
//         //             users={currentTableData}
//         //         />
//         //
//         //         <Pagination
//         //             className="pagination-bar"
//         //             currentPage={currentPage}
//         //             totalCount={searchedUsers?.length}
//         //             pageSize={PageSize}
//         //             onPageChange={page => setCurrentPage(page)}
//         //         />
//         //     </main>
//         //
//         //
//         //     <footer className="section__footer">
//         //         <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
//         //             <CheckPassword/>
//         //         </Modal>
//         //         {
//         //             activeChangeModalName === "overhead" && isCheckedPassword ?
//         //                 <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
//         //                     <CreatOverhead
//         //                         setActiveChangeModal={setActiveChangeModal}
//         //                         setMsg={setMsg}
//         //                         setActiveMessage={setActiveMessage}
//         //                         setTypeMsg={setTypeMsg}
//         //                         locationId={locationId}
//         //                     />
//         //                 </Modal> :
//         //                 <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
//         //                     <CreatCapital
//         //                         setActiveChangeModal={setActiveChangeModal}
//         //                         setMsg={setMsg}
//         //                         setActiveMessage={setActiveMessage}
//         //                         setTypeMsg={setTypeMsg}
//         //                         locationId={locationId}
//         //                     />
//         //                 </Modal>
//         //         }
//         //         <PlatformMessage typeMessage={typeMsg} activeMsg={activeMessage}>
//         //             {msg}
//         //         </PlatformMessage>
//         //     </footer>
//         // </section>
//
//         <>
//             <Routes>
//                 <Route path="list" element={<List>
//                     <section className="section">
//                         <header className="section__header">
//                             <div>
//                                 <PlatformSearch search={search} setSearch={setSearch}/>
//
//                                 <FuncBtns
//                                     funcsSlice={funcsSlice}
//                                     route={true}
//                                     dataBtns={btns}
//                                 />
//
//
//                                 <div>
//                                     <Select
//                                         title={"Sahifalar"}
//                                         defaultValue={selectedOption}
//                                         options={options}
//                                         onChangeOption={(e) => {
//                                             changeOption(e)
//                                             setArchiveData(false)
//                                         }}
//                                     />
//                                 </div>
//                             </div>
//                             <div key={2}>
//                                 <Button
//                                     onClickBtn={() => {
//                                         setActiveOthers(!activeOthers)
//                                         setHeightOtherFilters(filterRef.current.scrollHeight)
//                                     }}
//                                     active={activeOthers}
//                                 >
//                                     Filterlar
//                                 </Button>
//                             </div>
//
//                             <Filters filterRef={filterRef} filters={filters} heightOtherFilters={heightOtherFilters} activeOthers={activeOthers}/>
//                         </header>
//                         <div className="links">
//                             <Link to={`../../collection/${locationId}`}>
//                                 <Button>Harajatlar to'plami</Button>
//                             </Link>
//                             <Link to={`../../historyAccounting/${locationId}`}>
//                                 <Button>Harajatlar tarixi</Button>
//                             </Link>
//                             {
//                                 typeExpenditure ?
//                                     <Button
//                                         active={activeChangeModalName === typeExpenditure && activeChangeModal}
//                                         onClickBtn={changeModal}
//                                         name={typeExpenditure}
//                                     >
//                                         Qo'shish
//                                     </Button>
//                                     : null
//                             }
//                             {
//                                 isDeletedData ?
//                                     <Button active={deletedData} onClickBtn={getDeleted}>
//                                         O'chirilgan
//                                     </Button>
//                                     : null
//                             }
//
//                             {
//                                 isArchiveData ?
//                                     <Button active={archiveData} onClickBtn={getArchive}>
//                                         Arxiv
//                                     </Button>
//                                     : null
//                             }
//                         </div>
//
//                         <LocationMoneys locationId={locationId} />
//
//                         <main className="section__main">
//
//                             <AccountingTable
//                                 sum={sum}
//                                 cache={true}
//                                 typeOfMoney={typeOfMoney}
//                                 fetchUsersStatus={fetchUsersStatus}
//                                 funcSlice={funcsSlice}
//                                 activeRowsInTable={activeRowsInTable}
//                                 users={currentTableData}
//                             />
//
//                             <Pagination
//                                 className="pagination-bar"
//                                 currentPage={currentPage}
//                                 totalCount={searchedUsers?.length}
//                                 pageSize={PageSize}
//                                 onPageChange={page => setCurrentPage(page)}
//                             />
//                         </main>
//
//
//                         <footer className="section__footer">
//                             <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
//                                 <CheckPassword/>
//                             </Modal>
//                             {
//                                 activeChangeModalName === "overhead" && isCheckedPassword ?
//                                     <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
//                                         <CreatOverhead
//                                             setActiveChangeModal={setActiveChangeModal}
//                                             setMsg={setMsg}
//                                             setActiveMessage={setActiveMessage}
//                                             setTypeMsg={setTypeMsg}
//                                             locationId={locationId}
//                                         />
//                                     </Modal> :
//                                     <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
//                                         <CreatCapital
//                                             setActiveChangeModal={setActiveChangeModal}
//                                             setMsg={setMsg}
//                                             setActiveMessage={setActiveMessage}
//                                             setTypeMsg={setTypeMsg}
//                                             locationId={locationId}
//                                         />
//                                     </Modal>
//                             }
//                             <PlatformMessage typeMessage={typeMsg} activeMsg={activeMessage}>
//                                 {msg}
//                             </PlatformMessage>
//                         </footer>
//                     </section>
//                 </List>} />
//
//                 <Route path="profile/:userId/*" element={<PlatformUserProfile/>}  />
//
//                 <Route path="*"  element={
//                     // This links to /:userId/messages, no matter
//                     // how many segments were matched by the *
//                     <Navigate to="list" replace />
//                 }
//                 />
//             </Routes>
//         </>
//     );
// };


const SampleAccounting = (props) => {



    const {links,children} = props

    // let PageSize = useMemo(() => 50, [])
    // const {isCheckedPassword} = useSelector(state => state.me)
    // const {btns} = useSelector(state => state.accounting)
    //
    // const filterRef = useRef()
    // const [dataAcc, setDataAcc] = useState([])
    // const [currentPage, setCurrentPage] = useState(1);
    // const [activeOthers, setActiveOthers] = useState(false)
    // const [heightOtherFilters, setHeightOtherFilters] = useState(0)
    // const [search, setSearch] = useState("")
    // const [allMoney,setAllMoney] = useState(0)
    //
    // const [activeChangeModal, setActiveChangeModal] = useState(false)
    // const [activeChangeModalName, setActiveChangeModalName] = useState("")
    // const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    // const [deletedData, setDeletedData] = useState(false)
    // const [archiveData, setArchiveData] = useState(false)
    //
    // const [msg, setMsg] = useState(false)
    // const [typeMsg, setTypeMsg] = useState(false)
    // const [activeMessage, setActiveMessage] = useState(false)
    //
    //
    // useEffect(() => {
    //     setDataAcc(data)
    // }, [data])
    //
    //

    //
    // const changeModal = (name) => {
    //     setActiveChangeModalName(name)
    //     if (!isCheckedPassword) {
    //         setActiveCheckPassword(true)
    //     } else {
    //         setActiveChangeModal(true)
    //     }
    // }
    //
    // useEffect(() => {
    //     if (isCheckedPassword && activeChangeModalName) {
    //         setActiveCheckPassword(false)
    //         setActiveChangeModal(true)
    //     }
    // }, [activeChangeModalName, isCheckedPassword])

    //
    // const getDeleted = () => {
    //     setDeletedData(!deletedData)
    //     funcsSlice?.getDeleted(!deletedData)
    // }
    //
    // const getArchive = () => {
    //     setArchiveData(!archiveData)
    //     funcsSlice?.getArchive(!archiveData)
    //     setActiveOthers(false)
    // }
    //
    //
    // let summa = isDebtsSum === "debt" ? "balance" :
    //     isDebtsSum === "payment" ? "payment" :
    //         isDebtsSum === "item" ? "price" :
    //             isDebtsSum === "salary" ? "salary" : null
    //
    //
    // let sum = multiPropsFilter?.reduce((a, c) => {
    //     return a + c[summa]
    // }, 0);




    return (
        <>
            <div className="links">
                {
                    links.map((item) => {

                        const Component = item.elem
                        const props = item.props

                        return <Component {...props} />

                    })
                }

                {/*{*/}
                {/*    typeExpenditure ?*/}
                {/*        <Button*/}
                {/*            active={activeChangeModalName === typeExpenditure && activeChangeModal}*/}
                {/*            onClickBtn={changeModal}*/}
                {/*            name={typeExpenditure}*/}
                {/*        >*/}
                {/*            Qo'shish*/}
                {/*        </Button>*/}
                {/*        : null*/}
                {/*}*/}
                {/*{*/}
                {/*    isDeletedData ?*/}
                {/*        <Button active={deletedData} onClickBtn={getDeleted}>*/}
                {/*            O'chirilgan*/}
                {/*        </Button>*/}
                {/*        : null*/}
                {/*}*/}

                {/*{*/}
                {/*    isArchiveData ?*/}
                {/*        <Button active={archiveData} onClickBtn={getArchive}>*/}
                {/*            Arxiv*/}
                {/*        </Button>*/}
                {/*        : null*/}
                {/*}*/}
            </div>

            {/*<LocationMoneys locationId={locationId}/>*/}

            <main className="section__main" >
                {children}
                {/*<AccountingTable*/}
                {/*    sum={sum}*/}
                {/*    cache={true}*/}
                {/*    typeOfMoney={typeOfMoney}*/}
                {/*    fetchUsersStatus={fetchUsersStatus}*/}
                {/*    funcSlice={funcsSlice}*/}
                {/*    activeRowsInTable={activeRowsInTable}*/}
                {/*    users={currentTableData}*/}
                {/*/>*/}

                {/*<Pagination*/}
                {/*    className="pagination-bar"*/}
                {/*    currentPage={currentPage}*/}
                {/*    totalCount={searchedUsers?.length}*/}
                {/*    pageSize={PageSize}*/}
                {/*    onPageChange={page => setCurrentPage(page)}*/}
                {/*/>*/}
            </main>


            <footer className="section__footer">
                {/*<Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>*/}
                {/*    <CheckPassword/>*/}
                {/*</Modal>*/}
                {/*{*/}
                {/*    activeChangeModalName === "overhead" && isCheckedPassword ?*/}
                {/*        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>*/}
                {/*            <CreatOverhead*/}
                {/*                setActiveChangeModal={setActiveChangeModal}*/}
                {/*                setMsg={setMsg}*/}
                {/*                setActiveMessage={setActiveMessage}*/}
                {/*                setTypeMsg={setTypeMsg}*/}
                {/*                locationId={locationId}*/}
                {/*            />*/}
                {/*        </Modal> :*/}
                {/*        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>*/}
                {/*            <CreatCapital*/}
                {/*                setActiveChangeModal={setActiveChangeModal}*/}
                {/*                setMsg={setMsg}*/}
                {/*                setActiveMessage={setActiveMessage}*/}
                {/*                setTypeMsg={setTypeMsg}*/}
                {/*                locationId={locationId}*/}
                {/*            />*/}
                {/*        </Modal>*/}
                {/*}*/}
            </footer>
        </>
    );
};







const CreatOverhead = ({locationId, setMsg, setTypeMsg, setActiveMessage, setActiveChangeModal}) => {
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


    useEffect(() => {
        dispatch(fetchDataToChange(locationId))
    }, [locationId])

    const renderPaymentType = useCallback(() => {
        return dataToChange?.payment_types?.map((item, index) => {
            return (
                <label key={index} className="radioLabel" htmlFor="">
                    <input className="radio" {...register("typePayment", {required: true})} type="radio"
                           value={item.id}/>
                    <span>{item.name}</span>
                </label>
            )
        })
    }, [dataToChange?.payment_types])


    const renderDate = useCallback(() => {
        return data?.overhead_tools?.map((item, index) => {
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
    }, [data.overhead_tools, month, day])


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


        request(`${BackUrl}add_overhead/${locationId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    reset()
                    setTypeMsg("success")
                    setMsg(res.msg)
                    setActiveMessage(true)
                    setActiveChangeModal(false)
                    const data = {
                        locationId,
                        type: "overhead"
                    }
                    dispatch(fetchAccData(data))
                } else {
                    setTypeMsg("error")
                    setMsg("Serverda hatolik")
                    setActiveMessage(true)
                    setActiveChangeModal(false)
                }
            })
    }


    useEffect(() => {
        if (data.overhead_tools.length < 2) {
            setMonth(data.overhead_tools[0].value)
        }
    }, [data?.overhead_tools])

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
                    data?.overhead_tools?.length >= 2 ?
                        <Select
                            name={"month"}
                            title={"Oy"}
                            defaultValue={month}
                            onChangeOption={setMonth}
                            options={data?.overhead_tools}
                        /> :
                        null
                }
                {renderedDays}

                <input className="input-submit" type="submit" value="Tasdiqlash"/>


            </form>
        </div>
    )
}

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
                    setTypeMsg("success")
                    setMsg(res.msg)
                    setActiveMessage(true)
                    setActiveChangeModal(false)
                    const data = {
                        locationId,
                        type: "capital"
                    }
                    dispatch(fetchAccData(data))
                } else {
                    setTypeMsg("error")
                    setMsg("Serverda hatolik")
                    setActiveMessage(true)
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

const List = React.memo(({children}) => {

    return children

})

export default SampleAccounting;
