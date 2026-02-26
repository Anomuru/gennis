import React, { useEffect, useState } from 'react';
// import CanvasJSReact from '@canvasjs/react-charts';
import CanvasJSReact from '@canvasjs/react-stockcharts';


import cls from "./platformTeacherRating.module.sass"
import Select from "components/platform/platformUI/select";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";
import { useParams } from "react-router-dom";
import BackButton from "components/platform/platformUI/backButton/backButton";
import Button from "components/platform/platformUI/button";

let CanvasJSChart = CanvasJSReact.CanvasJSChart;
let CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

const PlatformTeachersRating = () => {


    const [year, setYear] = useState()
    const [years, setYears] = useState([])

    const [month, setMonth] = useState()
    const [months, setMonths] = useState([])


    const [day, setDay] = useState()
    const [days, setDays] = useState([])


    const [attendanceSt, setAttendanceSt] = useState([])


    const { request } = useHttp()


    useEffect(() => {
        request(`${BackUrl}teacher/statistics_dates`, "GET", null, headers())
            .then(res => {
                setMonths(res.month_list.map(item => ({ name: item.month, value: item.date })))
                setYears(res.years_list.map(item => item.value))
                setYear(res.current_year)
                setMonth(res.current_month)
            })
    }, [])

    useEffect(() => {
        if (year && year !== "all") {
            request(`${BackUrl}teacher/statistics_dates`, "POST", JSON.stringify({ type_rating: "attendance", year }), headers())
                .then(res => {
                    setMonths(res.month_list.map(item => ({ name: item.month, value: item.date })))
                })
        }
    }, [year])


    return (
        <div className={cls.teachersRating}>


            <div className={cls.header}>
                <h1>Teachers Rating</h1>
                <div>
                    <Select
                        defaultValue={year}
                        all={true}
                        onChangeOption={(e) => {
                            setYear(e)
                            setMonth(null)
                        }}
                        options={years}
                        title={"Year"}
                    />

                    {
                        year !== "all" ?
                            <Select defaultValue={month} all={true} onChangeOption={setMonth} options={months}
                                title={"Month"} /> : null
                    }

                    {/*<Select title={"Day"}/>*/}
                </div>

            </div>

            <AttendanceStatistics month={month} year={year} />
            <ObservationStatistics month={month} year={year} />
            <LessonPlanStatistics month={month} year={year} />
            <DeletedStudentsStatistics month={month} year={year} />
        </div>
    );
};


const AttendanceStatistics = (props) => {

    const { locationId } = useParams()


    const { month, year } = props

    const [data, setData] = useState([])

    const { request } = useHttp()

    useEffect(() => {
        if (year) {
            request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
                type_rating: "attendance",
                year
            }), headers())
                .then(res => {
                    setData(res.teachers_list.map((item, index) => {
                        return {
                            y: item.percentage,
                            label: `${item.name} ${item.surname}`,
                            indexLabel: `${item.percentage}`,
                            indexLabelPlacement: "outside",
                            indexLabelOrientation: "horizontal",
                            x: index++
                        }
                    }))
                })
        }

    }, [year])

    useEffect(() => {

        if (month) {

            request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
                type_rating: "attendance",
                year: year,
                month: month === "all" ? null : month
            }), headers())
                .then(res => {
                    setData(res.teachers_list.map((item, index) => {
                        return {
                            label: `${item.name} ${item.surname}`,
                            y: item.percentage,
                            indexLabel: `${item.percentage}`,
                            indexLabelPlacement: "outside",
                            indexLabelOrientation: "horizontal",
                            x: index++
                        }
                    }))
                })
        }

    }, [month])


    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", //"light1", "dark1", "dark2"


        rangeSelector: {
            enabled: false
        },

        dataPointMaxWidth: 50,
        charts: [{
            data: [{
                dataPoints: data
            }]
        }],
        navigator: {
            slider: {
                minimum: 0
            }
        }
    }

    // console.log(options.data[0].dataPoints.length)


    return (
        <div className={cls.rating}>
            <h1>Attendance Statistics</h1>

            <div className={cls.wrapper}>
                <CanvasJSStockChart containerProps={{ width: '100%', height: '300px' }} options={options} />
            </div>
        </div>
    )
}

const ObservationStatistics = (props) => {
    const { locationId } = useParams()

    const { month, year } = props

    const [data, setData] = useState([])

    const { request } = useHttp()

    useEffect(() => {
        if (year) {
            request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
                type_rating: "observation",
                year
            }), headers())

                .then(res => {
                    setData(res.teachers_list.map((item, index) => {
                        return {
                            y: item.percentage,
                            label: `${item.name} ${item.surname} `,
                            indexLabel: `${item.percentage}`,
                            indexLabelPlacement: "outside",
                            indexLabelOrientation: "horizontal",
                            x: index++,
                            indexLabelFontColor: "black"
                        }
                    }))
                })
        }
    }, [year])

    useEffect(() => {
        if (month) {
            request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
                type_rating: "observation",
                year: year,
                month: month === "all" ? null : month
            }), headers())
                .then(res => {
                    setData(res.teachers_list.map((item, index) => {
                        return {
                            label: `${item.name} ${item.surname}`,
                            y: item.percentage,
                            indexLabel: `${item.percentage}`,
                            indexLabelPlacement: "outside",
                            indexLabelOrientation: "horizontal",
                            x: index++,
                            indexLabelFontColor: "black"
                        }
                    }))
                })
        }
    }, [month])


    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", //"light1", "dark1", "dark2"


        rangeSelector: {
            enabled: false
        },

        dataPointMaxWidth: 50,
        charts: [{
            data: [{
                dataPoints: data
            }]
        }],
        navigator: {
            slider: {
                minimum: 0
            }
        }
    }

    // console.log(options.data[0].dataPoints.length)


    return (
        <div className={cls.rating}>
            <h1>Observation Statistics</h1>

            <div className={cls.wrapper}>
                <CanvasJSStockChart containerProps={{ width: '100%', height: '300px' }} options={options} />
            </div>
        </div>
    )
}

const DeletedStudentsStatistics = (props) => {


    const { locationId } = useParams()
    const { month, year } = props

    const [data, setData] = useState([])
    const [subData, setSubData] = useState([])
    const [type, setType] = useState("default")
    const [nameItem, setNameItem] = useState()

    const { request } = useHttp()

    useEffect(() => {
        if (year) {
            request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
                type_rating: "deleted_students",
                year
            }), headers())
                .then(res => {
                    setData(res.teachers_list.map((item, index) => {
                        return {
                            y: item.percentage,
                            label: `${item.name}`,
                            name: item.name
                        }
                    }))
                })
        }
    }, [year])

    useEffect(() => {
        if (month) {
            request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
                type_rating: "deleted_students",
                year: year,
                month: month === "all" ? null : month
            }), headers())
                .then(res => {

                    setData(res.teachers_list.map((item, index) => {
                        return {
                            label: `${item.name}`,
                            y: item.percentage,
                            name: item.name
                        }
                    }))
                })
        }
    }, [month])


    const onClick = (e) => {
        setNameItem(e.dataPoint.name)
        setType("teacher")

        request(`${BackUrl}teacher/teacher_statistics_deleted_students/${locationId}`, "POST", JSON.stringify({
            reason_name: e.dataPoint.name, year: year, month: month === "all" ? null : month
        }), headers())
            .then(res => {
                setSubData(res.teachers_list.map((item, index) => {
                    return {
                        label: `${item.name} ${item.surname}`,
                        y: item.percentage,
                        indexLabel: `${item.percentage}`,
                        indexLabelPlacement: "outside",
                        indexLabelOrientation: "horizontal",
                        x: index++
                    }
                }))
            })
    }


    const DefaultOptions = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", // "light1", "dark1", "dark2"
        data: [{
            type: "pie",
            indexLabel: "{label}: {y}%",
            startAngle: 0,
            click: onClick,
            dataPoints: data
        }]
    }

    let TeacherOptions = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", //"light1", "dark1", "dark2"


        rangeSelector: {
            enabled: false
        },

        title: {
            text: nameItem
        },


        dataPointMaxWidth: 50,
        charts: [{
            data: [{
                dataPoints: subData
            }]
        }],
        navigator: {
            slider: {
                minimum: 0
            }
        }
    };


    // console.log(options.data[0].dataPoints.length)

    const onClickBackBtn = () => {
        setType("default")
    }


    return (
        <div className={cls.rating}>
            <div className={cls.subHeader}>
                <h1>Deleted Students Statistics</h1>
                <Button onClickBtn={onClickBackBtn}>Back</Button>
            </div>
            <div className={cls.wrapper}>
                {
                    type === "default" ?
                        <CanvasJSChart options={DefaultOptions} />
                        :
                        <CanvasJSStockChart ontainerProps={{ width: '100%', height: '300px' }} options={TeacherOptions} />
                }
            </div>
        </div>
    )
}


const LessonPlanStatistics = (props) => {
    const { locationId } = useParams()

    const { month, year } = props

    const [data, setData] = useState([])

    const { request } = useHttp()

    useEffect(() => {
        if (year) {
            request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
                type_rating: "lesson_plan",
                year
            }), headers())
                .then(res => {
                    setData(res.teachers_list.map((item, index) => {
                        return {
                            y: item.percentage,
                            label: `${item.name} ${item.surname}`,
                            indexLabel: `${item.percentage}`,
                            indexLabelPlacement: "outside",
                            indexLabelOrientation: "horizontal",
                            x: index++
                        }
                    }))
                })
        }

    }, [year])

    useEffect(() => {

        if (month) {

            request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
                type_rating: "lesson_plan",
                year: year,
                month: month === "all" ? null : month
            }), headers())
                .then(res => {
                    setData(res.teachers_list.map((item, index) => {
                        return {
                            label: `${item.name} ${item.surname}`,
                            y: item.percentage,
                            indexLabel: `${item.percentage}`,
                            indexLabelPlacement: "outside",
                            indexLabelOrientation: "horizontal",
                            x: index++
                        }
                    }))
                })
        }

    }, [month])


    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", //"light1", "dark1", "dark2"


        rangeSelector: {
            enabled: false
        },

        dataPointMaxWidth: 50,
        charts: [{
            data: [{
                dataPoints: data
            }]
        }],
        navigator: {
            slider: {
                minimum: 0
            }
        }
    }

    // console.log(options.data[0].dataPoints.length)


    return (
        <div className={cls.rating}>
            <h1>Lesson Plan Statistics</h1>

            <div className={cls.wrapper}>
                <CanvasJSStockChart containerProps={{ width: '100%', height: '300px' }} options={options} />
            </div>
        </div>
    )
}

export default PlatformTeachersRating;