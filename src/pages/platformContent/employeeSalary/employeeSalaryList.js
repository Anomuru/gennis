import React, {useEffect, useState} from 'react';
import {Link, NavLink, Route, Routes, useParams} from "react-router-dom";

import LocationSalary from "./locationSalary/locationSalary";
import "pages/platformContent/employeeSalary/employeeSalaryList.sass"
import LocationMonths from "./locationMonths/locationMonths";
import {useDispatch, useSelector} from "react-redux";
import {fetchLocations} from "slices/locationsSlice";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";
import {Logger} from "sass";
import Select from "components/platform/platformUI/select";
import Button from "components/platform/platformUI/button";

const EmployeeSalaryList = () => {

    const {userId} = useParams()

    // const {locations} = useSelector(state => state.locations)


    console.log(userId)

    const [locations, setLocations] = useState([])
    const [location, setLocation] = useState(null)

    const [years, setYears] = useState([])
    const [year, setYear] = useState(null)

    const [salaries, setSalaries] = useState([])

    const {request} = useHttp()


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchLocations())
    },[])

    useEffect(() => {
        request(`${BackUrl}salary_info/${userId}`, "GET", null, headers())
            .then(res => {
                setLocations(res.locations)
                if (res.years.length === 1) {
                    setYear(res.years[0].id)
                } else {
                    setYears(res.years)
                    setYear(res.current_year)
                }
            })
    }, [])


    return (
        <section className="teacherLocations">
            <header>
                <div className="teacherLocations__btns">

                    {
                        locations.map(item => {
                            return (
                                <NavLink
                                    className={({ isActive }) =>
                                        "teacherLocations__btns-item" + (isActive ? " active" : "")
                                    }
                                    to={`locations/${item.value}`}
                                >
                                    {item.name}
                                </NavLink>
                            )
                        })
                    }
                </div>

                <Link to={`/platform/teacherDebtStudents/${userId}`}>
                    <Button>
                        Qarzdor o'quvchilar
                    </Button>
                </Link>
            </header>
            <main>
                <Routes>
                    <Route path="locations/:locationId" element={<LocationSalary userId={userId}/>} />
                </Routes>
            </main>
        </section>
    );
};

export default EmployeeSalaryList;