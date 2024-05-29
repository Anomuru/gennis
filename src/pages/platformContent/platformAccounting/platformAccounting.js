import React, {useRef, useState, UIEvent, useEffect} from 'react';
import {Link, Route, Routes, useLocation, useNavigate, useParams} from "react-router-dom";

import EmployeeSalary from "./employeeSalary/employeeSalary";
import StudentsDiscount from "./studentsDiscount/studentsDiscount";
import DebtStudents from "./debtStudents/debtStudents";
import StudentsPayments from "./studentsPayments/studentsPayments";
import TeachersSalary from "./teachersSalary/teachersSalary";
import Overhead from "./overhead/overhead";
import Capital from "pages/platformContent/platformAccounting/capital/capital";




import "./platformAccounting.sass"
import {useDispatch, useSelector} from "react-redux";
import SampleAccounting from "components/platform/platformSamples/sampleAccaunting/SampleAccounting";
import StudentsBookPayment from "pages/platformContent/platformAccounting/studentBookPayments/studentsBookPayment";
import {fetchFilters} from "slices/filtersSlice";
import Select from "components/platform/platformUI/select";
import {clearAccData, onChangeAccountingPage, onChangeAccountingSearch} from "slices/accountingSlice";
import PlatformSearch from "components/platform/platformUI/search";
import Button from "components/platform/platformUI/button";
import Filters from "components/platform/platformUI/filters";

import PlatformUserProfile from "pages/platformContent/platformUser/platformUserProfile/platformUserProfile";
import {getUIScrollByPath, setScrollPosition} from "slices/uiSlice";
import useThrottle from "hooks/useThrottle";
import LocationMoneys from "pages/platformContent/platformAccounting/locationMoneys/locationMoneys";


const PlatformAccounting = () => {

    let {locationId} = useParams()
    const location = useLocation()
    const {pages,search} = useSelector(state => state.accounting)
    const {filters} = useSelector(state => state.filters)
    const scrollPosition = useSelector((state) => getUIScrollByPath(state, location.pathname))


    const [heightOtherFilters, setHeightOtherFilters] = useState(0)
    const [activeOthers, setActiveOthers] = useState(false)
    const filterRef = useRef()
    const wrapperRef = useRef()

    const dispatch = useDispatch()
    const navigate =  useNavigate()



    const setPage = (e) => {

        dispatch(onChangeAccountingPage({value: e}))
        dispatch(clearAccData())
        navigate(`./${e}`)
    }


    const setSearch = (e) => {
        dispatch(onChangeAccountingSearch({value: e}))
    }


    const onScroll = useThrottle((e) => {
        dispatch(setScrollPosition({path: location.pathname,position: e.target.scrollTop}))
    },300)


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            wrapperRef.current.scrollTop = scrollPosition
        }, 500);
        return () => clearTimeout(timeoutId);
    },[])



    return (
        <section className={"section"} onScroll={onScroll} ref={wrapperRef}>
            <header className="section__header">
                <div>
                    <PlatformSearch search={search} setSearch={setSearch}/>
                    <div>
                        <Select
                            autoSelect
                            title={"Sahifalar"}
                            options={pages}
                            onChangeOption={setPage}
                        />
                    </div>
                </div>
                <div style={{justifyContent: "flex-start"}}>
                    <Button
                        onClickBtn={() => {
                            setActiveOthers(!activeOthers)
                            setHeightOtherFilters(filterRef.current.scrollHeight)
                        }}
                        active={activeOthers}
                    >
                        Filterlar
                    </Button>
                    <Link to={`../../collection/${locationId}`}>
                        <Button>Harajatlar to'plami</Button>
                    </Link>
                    <Link to={`../../historyAccounting/${locationId}`}>
                        <Button>Harajatlar tarixi</Button>
                    </Link>

                </div>

                <div>
                    <LocationMoneys locationId={locationId}/>
                </div>

                <Filters filterRef={filterRef} filters={filters} heightOtherFilters={heightOtherFilters}
                         activeOthers={activeOthers}/>

            </header>




            <Routes>
                <Route path={"studentsPayments"} element={<StudentsPayments path={"studentsPayments"} locationId={locationId}/>}/>
                <Route path={"bookPayment"} element={<StudentsBookPayment path={"bookPayment"} locationId={locationId}/>}/>
                <Route path={"teachersSalary"} element={<TeachersSalary path={"teachersSalary"} locationId={locationId}/>}/>
                <Route path={"studentsDiscounts"} element={<StudentsDiscount path={"studentsDiscounts"} locationId={locationId}/>}/>
                <Route path={"employeesSalary"} element={<EmployeeSalary path={"employeesSalary"} locationId={locationId}/>}/>
                <Route path={"debtStudents"} element={<DebtStudents path={"debtStudents"} locationId={locationId}/>}/>
                <Route path={"overhead"} element={<Overhead path={"overhead"} locationId={locationId}/>}/>
                <Route path={"capital"} element={<Capital path={"capital"} locationId={locationId}/>}/>

                {/*<Route path={"debtStudents"} element={<DebtStudents/>}/>*/}



            </Routes>
        </section>





        // <div className="accounting">
        //     <SampleAccounting
        //         locationId={locationId}
        //         funcsSlice={funcsSlice}
        //         typeOfMoney={data.typeOfMoney}
        //         activeRowsInTable={activeItems()}
        //         data={data.data}
        //         filters={filters}
        //         btns={btns}
        //         hrefName={hrefName}
        //         isDeletedData={isGetDelete}
        //         isArchiveData={isGetArchive}
        //         fetchUsersStatus={fetchAccDataStatus}
        //         isDebtsSum={paymentType}
        //         options={options}
        //         changeOption={changeOption}
        //         selectedOption={selectedOption}
        //         typeExpenditure={typeExpenditure}
        //     />
        //
        // </div>
    );
};


export default PlatformAccounting;