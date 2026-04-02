// import React, { useEffect, useState } from 'react';
// // import CanvasJSReact from '@canvasjs/react-charts';
// import CanvasJSReact from '@canvasjs/react-stockcharts';


// import cls from "./platformTeacherRating.module.sass"
// import Select from "components/platform/platformUI/select";
// import { useHttp } from "hooks/http.hook";
// import { BackUrl, headers } from "constants/global";
// import { useParams } from "react-router-dom";
// import BackButton from "components/platform/platformUI/backButton/backButton";
// import Button from "components/platform/platformUI/button";

// let CanvasJSChart = CanvasJSReact.CanvasJSChart;
// let CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

// const PlatformTeachersRating = () => {


//     const [year, setYear] = useState()
//     const [years, setYears] = useState([])

//     const [month, setMonth] = useState()
//     const [months, setMonths] = useState([])


//     const [day, setDay] = useState()
//     const [days, setDays] = useState([])


//     const [attendanceSt, setAttendanceSt] = useState([])


//     const { request } = useHttp()


//     useEffect(() => {
//         request(`${BackUrl}teacher/statistics_dates`, "GET", null, headers())
//             .then(res => {
//                 setMonths(res.month_list.map(item => ({ name: item.month, value: item.date })))
//                 setYears(res.years_list.map(item => item.value))
//                 setYear(res.current_year)
//                 setMonth(res.current_month)
//             })
//     }, [])

//     useEffect(() => {
//         if (year && year !== "all") {
//             request(`${BackUrl}teacher/statistics_dates`, "POST", JSON.stringify({ type_rating: "attendance", year }), headers())
//                 .then(res => {
//                     setMonths(res.month_list.map(item => ({ name: item.month, value: item.date })))
//                 })
//         }
//     }, [year])


//     return (
//         <div className={cls.teachersRating}>


//             <div className={cls.header}>
//                 <h1>Teachers Rating</h1>
//                 <div>
//                     <Select
//                         defaultValue={year}
//                         all={true}
//                         onChangeOption={(e) => {
//                             setYear(e)
//                             setMonth(null)
//                         }}
//                         options={years}
//                         title={"Year"}
//                     />

//                     {
//                         year !== "all" ?
//                             <Select defaultValue={month} all={true} onChangeOption={setMonth} options={months}
//                                 title={"Month"} /> : null
//                     }

//                     {/*<Select title={"Day"}/>*/}
//                 </div>

//             </div>

//             <AttendanceStatistics month={month} year={year} />
//             <ObservationStatistics month={month} year={year} />
//             <LessonPlanStatistics month={month} year={year} />
//             <DeletedStudentsStatistics month={month} year={year} />
//         </div>
//     );
// };


// const AttendanceStatistics = (props) => {

//     const { locationId } = useParams()


//     const { month, year } = props

//     const [data, setData] = useState([])

//     const { request } = useHttp()

//     useEffect(() => {
//         if (year) {
//             request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
//                 type_rating: "attendance",
//                 year
//             }), headers())
//                 .then(res => {
//                     setData(res.teachers_list.map((item, index) => {
//                         return {
//                             y: item.percentage,
//                             label: `${item.name} ${item.surname}`,
//                             indexLabel: `${item.percentage}`,
//                             indexLabelPlacement: "outside",
//                             indexLabelOrientation: "horizontal",
//                             x: index++
//                         }
//                     }))
//                 })
//         }

//     }, [year])

//     useEffect(() => {

//         if (month) {

//             request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
//                 type_rating: "attendance",
//                 year: year,
//                 month: month === "all" ? null : month
//             }), headers())
//                 .then(res => {
//                     setData(res.teachers_list.map((item, index) => {
//                         return {
//                             label: `${item.name} ${item.surname}`,
//                             y: item.percentage,
//                             indexLabel: `${item.percentage}`,
//                             indexLabelPlacement: "outside",
//                             indexLabelOrientation: "horizontal",
//                             x: index++
//                         }
//                     }))
//                 })
//         }

//     }, [month])


//     const options = {
//         animationEnabled: true,
//         exportEnabled: true,
//         theme: "light1", //"light1", "dark1", "dark2"


//         rangeSelector: {
//             enabled: false
//         },

//         dataPointMaxWidth: 50,
//         charts: [{
//             data: [{
//                 dataPoints: data
//             }]
//         }],
//         navigator: {
//             slider: {
//                 minimum: 0
//             }
//         }
//     }

//     // console.log(options.data[0].dataPoints.length)


//     return (
//         <div className={cls.rating}>
//             <h1>Attendance Statistics</h1>

//             <div className={cls.wrapper}>
//                 <CanvasJSStockChart containerProps={{ width: '100%', height: '300px' }} options={options} />
//             </div>
//         </div>
//     )
// }

// const ObservationStatistics = (props) => {
//     const { locationId } = useParams()

//     const { month, year } = props

//     const [data, setData] = useState([])

//     const { request } = useHttp()

//     useEffect(() => {
//         if (year) {
//             request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
//                 type_rating: "observation",
//                 year
//             }), headers())

//                 .then(res => {
//                     setData(res.teachers_list.map((item, index) => {
//                         return {
//                             y: item.percentage,
//                             label: `${item.name} ${item.surname} `,
//                             indexLabel: `${item.percentage}`,
//                             indexLabelPlacement: "outside",
//                             indexLabelOrientation: "horizontal",
//                             x: index++,
//                             indexLabelFontColor: "black"
//                         }
//                     }))
//                 })
//         }
//     }, [year])

//     useEffect(() => {
//         if (month) {
//             request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
//                 type_rating: "observation",
//                 year: year,
//                 month: month === "all" ? null : month
//             }), headers())
//                 .then(res => {
//                     setData(res.teachers_list.map((item, index) => {
//                         return {
//                             label: `${item.name} ${item.surname}`,
//                             y: item.percentage,
//                             indexLabel: `${item.percentage}`,
//                             indexLabelPlacement: "outside",
//                             indexLabelOrientation: "horizontal",
//                             x: index++,
//                             indexLabelFontColor: "black"
//                         }
//                     }))
//                 })
//         }
//     }, [month])


//     const options = {
//         animationEnabled: true,
//         exportEnabled: true,
//         theme: "light1", //"light1", "dark1", "dark2"


//         rangeSelector: {
//             enabled: false
//         },

//         dataPointMaxWidth: 50,
//         charts: [{
//             data: [{
//                 dataPoints: data
//             }]
//         }],
//         navigator: {
//             slider: {
//                 minimum: 0
//             }
//         }
//     }

//     // console.log(options.data[0].dataPoints.length)


//     return (
//         <div className={cls.rating}>
//             <h1>Observation Statistics</h1>

//             <div className={cls.wrapper}>
//                 <CanvasJSStockChart containerProps={{ width: '100%', height: '300px' }} options={options} />
//             </div>
//         </div>
//     )
// }

// const DeletedStudentsStatistics = (props) => {


//     const { locationId } = useParams()
//     const { month, year } = props

//     const [data, setData] = useState([])
//     const [subData, setSubData] = useState([])
//     const [type, setType] = useState("default")
//     const [nameItem, setNameItem] = useState()

//     const { request } = useHttp()

//     useEffect(() => {
//         if (year) {
//             request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
//                 type_rating: "deleted_students",
//                 year
//             }), headers())
//                 .then(res => {
//                     setData(res.teachers_list.map((item, index) => {
//                         return {
//                             y: item.percentage,
//                             label: `${item.name}`,
//                             name: item.name
//                         }
//                     }))
//                 })
//         }
//     }, [year])

//     useEffect(() => {
//         if (month) {
//             request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
//                 type_rating: "deleted_students",
//                 year: year,
//                 month: month === "all" ? null : month
//             }), headers())
//                 .then(res => {

//                     setData(res.teachers_list.map((item, index) => {
//                         return {
//                             label: `${item.name}`,
//                             y: item.percentage,
//                             name: item.name
//                         }
//                     }))
//                 })
//         }
//     }, [month])


//     const onClick = (e) => {
//         setNameItem(e.dataPoint.name)
//         setType("teacher")

//         request(`${BackUrl}teacher/teacher_statistics_deleted_students/${locationId}`, "POST", JSON.stringify({
//             reason_name: e.dataPoint.name, year: year, month: month === "all" ? null : month
//         }), headers())
//             .then(res => {
//                 setSubData(res.teachers_list.map((item, index) => {
//                     return {
//                         label: `${item.name} ${item.surname}`,
//                         y: item.percentage,
//                         indexLabel: `${item.percentage}`,
//                         indexLabelPlacement: "outside",
//                         indexLabelOrientation: "horizontal",
//                         x: index++
//                     }
//                 }))
//             })
//     }


//     const DefaultOptions = {
//         animationEnabled: true,
//         exportEnabled: true,
//         theme: "light1", // "light1", "dark1", "dark2"
//         data: [{
//             type: "pie",
//             indexLabel: "{label}: {y}%",
//             startAngle: 0,
//             click: onClick,
//             dataPoints: data
//         }]
//     }

//     let TeacherOptions = {
//         animationEnabled: true,
//         exportEnabled: true,
//         theme: "light1", //"light1", "dark1", "dark2"


//         rangeSelector: {
//             enabled: false
//         },

//         title: {
//             text: nameItem
//         },


//         dataPointMaxWidth: 50,
//         charts: [{
//             data: [{
//                 dataPoints: subData
//             }]
//         }],
//         navigator: {
//             slider: {
//                 minimum: 0
//             }
//         }
//     };


//     // console.log(options.data[0].dataPoints.length)

//     const onClickBackBtn = () => {
//         setType("default")
//     }


//     return (
//         <div className={cls.rating}>
//             <div className={cls.subHeader}>
//                 <h1>Deleted Students Statistics</h1>
//                 <Button onClickBtn={onClickBackBtn}>Back</Button>
//             </div>
//             <div className={cls.wrapper}>
//                 {
//                     type === "default" ?
//                         <CanvasJSChart options={DefaultOptions} />
//                         :
//                         <CanvasJSStockChart ontainerProps={{ width: '100%', height: '300px' }} options={TeacherOptions} />
//                 }
//             </div>
//         </div>
//     )
// }


// const LessonPlanStatistics = (props) => {
//     const { locationId } = useParams()

//     const { month, year } = props

//     const [data, setData] = useState([])

//     const { request } = useHttp()

//     useEffect(() => {
//         if (year) {
//             request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
//                 type_rating: "lesson_plan",
//                 year
//             }), headers())
//                 .then(res => {
//                     setData(res.teachers_list.map((item, index) => {
//                         return {
//                             y: item.percentage,
//                             label: `${item.name} ${item.surname}`,
//                             indexLabel: `${item.percentage}`,
//                             indexLabelPlacement: "outside",
//                             indexLabelOrientation: "horizontal",
//                             x: index++
//                         }
//                     }))
//                 })
//         }

//     }, [year])

//     useEffect(() => {

//         if (month) {

//             request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
//                 type_rating: "lesson_plan",
//                 year: year,
//                 month: month === "all" ? null : month
//             }), headers())
//                 .then(res => {
//                     setData(res.teachers_list.map((item, index) => {
//                         return {
//                             label: `${item.name} ${item.surname}`,
//                             y: item.percentage,
//                             indexLabel: `${item.percentage}`,
//                             indexLabelPlacement: "outside",
//                             indexLabelOrientation: "horizontal",
//                             x: index++
//                         }
//                     }))
//                 })
//         }

//     }, [month])


//     const options = {
//         animationEnabled: true,
//         exportEnabled: true,
//         theme: "light1", //"light1", "dark1", "dark2"


//         rangeSelector: {
//             enabled: false
//         },

//         dataPointMaxWidth: 50,
//         charts: [{
//             data: [{
//                 dataPoints: data
//             }]
//         }],
//         navigator: {
//             slider: {
//                 minimum: 0
//             }
//         }
//     }

//     // console.log(options.data[0].dataPoints.length)


//     return (
//         <div className={cls.rating}>
//             <h1>Lesson Plan Statistics</h1>

//             <div className={cls.wrapper}>
//                 <CanvasJSStockChart containerProps={{ width: '100%', height: '300px' }} options={options} />
//             </div>
//         </div>
//     )
// }

// export default PlatformTeachersRating;

import React, { useEffect, useState } from 'react';
import cls from "./platformTeacherRating.module.sass"
import Select from "components/platform/platformUI/select";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";
import { useParams } from "react-router-dom";
import Button from "components/platform/platformUI/button";
import DefaultLoaderSmall from 'components/loader/defaultLoader/defaultLoaderSmall';

// ─── helpers ─────────────────────────────────────────────────────────────────

// trim пробелы, сортировать по убыванию — дубликаты НЕ мержим, показываем как есть
const normalize = (list = []) =>
    list
        .map(item => ({ ...item, surname: item.surname.trim() }))
        .sort((a, b) => b.percentage - a.percentage);

const initials = (name = '', surname = '') =>
    `${name[0] ?? ''}${surname[0] ?? ''}`.toUpperCase();

const AVATAR_COLORS = [
    ['#E6F1FB', '#185FA5'],
    ['#E1F5EE', '#0F6E56'],
    ['#FAEEDA', '#854F0B'],
    ['#EEEDFE', '#3C3489'],
    ['#FAECE7', '#993C1D'],
    ['#EAF3DE', '#3B6D11'],
];

// ─── atoms ───────────────────────────────────────────────────────────────────

const Avatar = ({ name, surname, idx = 0 }) => {
    const [bg, color] = AVATAR_COLORS[idx % AVATAR_COLORS.length];
    return (
        <div className={cls.avatar} style={{ background: bg, color }}>
            {initials(name, surname)}
        </div>
    );
};

const HBar = ({ value, max, color = '#378ADD' }) => {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className={cls.hBarWrap}>
            <div className={cls.hBarBg}>
                <div className={cls.hBarFill} style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className={cls.hBarVal}>{value}</span>
        </div>
    );
};

const Badge = ({ value }) =>
    <span className={value > 0 ? cls.badgeGreen : cls.badgeGray}>{value} pts</span>;

const EmptyState = () =>
    <p className={cls.emptyState}>No data for the selected period</p>;

const SectionLoader = () => (
    <div className={cls.loaderWrap}>
        <DefaultLoaderSmall />
    </div>
);

// ─── horizontal bar chart ─────────────────────────────────────────────────────

const BarChart = ({ data, color = '#378ADD', loading }) => {
    if (loading) return <SectionLoader />;
    if (data.length === 0) return <EmptyState />;

    const max = Math.max(...data.map(d => d.percentage), 1);

    return (
        <div className={cls.barChartScroll}>
            <div className={cls.barChart}>
                {data.map((item, i) => (
                    <div key={`${item.name}_${item.surname}_${i}`} className={cls.barRow}>
                        <div className={cls.barLabel}>
                            <Avatar name={item.name} surname={item.surname} idx={i} />
                            <span>{item.name} {item.surname}</span>
                        </div>
                        <div className={cls.barTrack}>
                            <div className={cls.barBg}>
                                <div
                                    className={cls.barFill}
                                    style={{
                                        width: item.percentage > 0
                                            ? `${Math.round((item.percentage / max) * 100)}%`
                                            : '0%',
                                        background: color,
                                    }}
                                />
                            </div>
                            <span className={item.percentage === 0 ? cls.barNumZero : cls.barNum}>
                                {item.percentage}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── summary table ────────────────────────────────────────────────────────────

const SummaryTable = ({ attendance, observation, lessonPlan, loading }) => {
    // мержим по id учителя
    const mergeById = (list) => {
        const map = {};
        list.forEach(item => {
            const key = item.id;
            if (map[key]) map[key].percentage += item.percentage;
            else map[key] = { ...item, surname: item.surname.trim() };
        });
        return Object.values(map);
    };

    const toMap = (list) =>
        Object.fromEntries(mergeById(list).map(t => [t.id, t.percentage]));

    // infoMap — чтобы достать name/surname по id
    const infoMap = {};
    [...attendance, ...observation, ...lessonPlan].forEach(t => {
        if (!infoMap[t.id]) infoMap[t.id] = { name: t.name, surname: t.surname.trim() };
    });

    const attMap = toMap(attendance);
    const obsMap = toMap(observation);
    const planMap = toMap(lessonPlan);

    const allIds = [...new Set([
        ...mergeById(attendance).map(t => t.id),
        ...mergeById(observation).map(t => t.id),
        ...mergeById(lessonPlan).map(t => t.id),
    ])];

    const rows = allIds.map(id => {
        const info = infoMap[id] || { name: '', surname: '' };
        return {
            id,
            name: info.name,
            surname: info.surname,
            att: attMap[id] ?? 0,
            obs: obsMap[id] ?? 0,
            plan: planMap[id] ?? 0,
            score: (attMap[id] ?? 0) + (obsMap[id] ?? 0) + (planMap[id] ?? 0),
        };
    }).sort((a, b) => b.score - a.score);

    const maxAtt = Math.max(...rows.map(r => r.att), 1);
    const maxObs = Math.max(...rows.map(r => r.obs), 1);
    const maxPlan = Math.max(...rows.map(r => r.plan), 1);

    const rankCls = (i) =>
        i === 0 ? cls.gold : i === 1 ? cls.silver : i === 2 ? cls.bronze : cls.rankNum;

    return (
        <div className={cls.rating}>
            <h2 className={cls.sectionTitle}>Overall Ranking</h2>

            {loading ? <SectionLoader /> : (
                <div className={cls.tableScroll}>
                    <table className={cls.table}>
                        <thead>
                            <tr>
                                <th className={cls.thSmall}>#</th>
                                <th className={cls.thSmall}>ID</th>
                                <th>Teacher</th>
                                <th>Attendance</th>
                                <th>Observation</th>
                                <th>Lesson plan</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <tr key={row.id} className={row.score === 0 ? cls.dimRow : ''}>
                                    <td><span className={rankCls(i)}>{i + 1}</span></td>
                                    <td><span className={cls.idCell}>{row.id}</span></td>
                                    <td>
                                        <div className={cls.nameCell}>
                                            <Avatar name={row.name} surname={row.surname} idx={i} />
                                            <span>{row.name} {row.surname}</span>
                                        </div>
                                    </td>
                                    <td><HBar value={row.att} max={maxAtt} /></td>
                                    <td>
                                        {row.obs > 0
                                            ? <HBar value={row.obs} max={maxObs} color="#1D9E75" />
                                            : <span className={cls.dash}>—</span>}
                                    </td>
                                    <td><HBar value={row.plan} max={maxPlan} color="#1D9E75" /></td>
                                    <td><Badge value={row.score} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// ─── donut chart ──────────────────────────────────────────────────────────────

const PIE_COLORS = ['#E24B4A', '#1D9E75', '#BA7517', '#378ADD', '#AFA9EC'];

const DonutChart = ({ data, onSliceClick }) => {
    const total = data.reduce((s, d) => s + d.percentage, 0) || 1;
    let cum = 0;
    const cx = 80, cy = 80, r = 62, ri = 38;
    const TAU = 2 * Math.PI;

    const slices = data.map((d, i) => {
        const pct = d.percentage / total;
        const start = cum * TAU - Math.PI / 2;
        cum += pct;
        const end = cum * TAU - Math.PI / 2;
        const large = pct > 0.5 ? 1 : 0;
        const { cos, sin } = Math;
        return {
            ...d,
            color: PIE_COLORS[i % PIE_COLORS.length],
            pct,
            path: [
                `M ${cx + r * cos(start)} ${cy + r * sin(start)}`,
                `A ${r} ${r} 0 ${large} 1 ${cx + r * cos(end)} ${cy + r * sin(end)}`,
                `L ${cx + ri * cos(end)} ${cy + ri * sin(end)}`,
                `A ${ri} ${ri} 0 ${large} 0 ${cx + ri * cos(start)} ${cy + ri * sin(start)}`,
                `Z`,
            ].join(' '),
        };
    });

    return (
        <div className={cls.donutWrap}>
            <svg viewBox="0 0 160 160" className={cls.donutSvg}>
                {slices.map((s, i) => (
                    <path
                        key={i}
                        d={s.path}
                        fill={s.color}
                        opacity={s.percentage === 0 ? 0.18 : 1}
                        className={s.percentage > 0 ? cls.donutSlice : ''}
                        onClick={() => s.percentage > 0 && onSliceClick(s)}
                    />
                ))}
            </svg>
            <div className={cls.donutLegend}>
                {slices.map((s, i) => (
                    <button
                        key={i}
                        className={`${cls.legendRow} ${s.percentage > 0 ? cls.legendClickable : ''}`}
                        onClick={() => s.percentage > 0 && onSliceClick(s)}
                        disabled={s.percentage === 0}
                    >
                        <span className={cls.legendDot} style={{ background: s.color }} />
                        <span className={cls.legendName}>{s.label}</span>
                        <span className={cls.legendPct} style={{ color: s.color }}>{s.percentage}%</span>
                        {s.percentage > 0 && <span className={cls.legendArrow}>→</span>}
                    </button>
                ))}
            </div>
        </div>
    );
};

// ─── dropout reasons ──────────────────────────────────────────────────────────

const DropoutReasonsStatistics = ({ month, year }) => {
    const { locationId } = useParams();
    const { request } = useHttp();

    const [data, setData] = useState([]);
    const [subData, setSubData] = useState([]);
    const [view, setView] = useState("pie");
    const [selectedReason, setSelectedReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [subLoading, setSubLoading] = useState(false);

    const fetchMain = (y, m) => {
        setLoading(true);
        request(`${BackUrl}teacher/teacher_statistics/${locationId}`, "POST", JSON.stringify({
            type_rating: "deleted_students", year: y, month: m === "all" ? null : m,
        }), headers()).then(res => {
            setData(res.teachers_list.map(item => ({
                label: item.name,
                name: item.name,
                percentage: item.percentage,
            })));
            setLoading(false);
        });
    };

    useEffect(() => { if (year) fetchMain(year, month); }, [year]);
    useEffect(() => { if (month) fetchMain(year, month); }, [month]);

    const onSliceClick = (slice) => {
        setSelectedReason(slice.name);
        setView("bar");
        setSubLoading(true);
        request(`${BackUrl}teacher/teacher_statistics_deleted_students/${locationId}`, "POST", JSON.stringify({
            reason_name: slice.name, year, month: month === "all" ? null : month,
        }), headers()).then(res => {
            setSubData(normalize(res.teachers_list));
            setSubLoading(false);
        });
    };

    return (
        <div className={cls.rating}>
            <div className={cls.sectionHeader}>
                <h2 className={cls.sectionTitle}>Student Dropout Reasons</h2>
                {view === "bar" && (
                    <Button onClickBtn={() => { setView("pie"); setSelectedReason(""); }}>
                        ← Back
                    </Button>
                )}
            </div>

            {view === "pie" ? (
                loading ? <SectionLoader /> : <DonutChart data={data} onSliceClick={onSliceClick} />
            ) : (
                <>
                    <p className={cls.subReasonTitle}>{selectedReason}</p>
                    <BarChart data={subData} color="#E24B4A" loading={subLoading} />
                </>
            )}
        </div>
    );
};

// ─── root ─────────────────────────────────────────────────────────────────────

const PlatformTeachersRating = () => {
    const { locationId } = useParams();
    const { request } = useHttp();

    const [year, setYear] = useState();
    const [years, setYears] = useState([]);
    const [month, setMonth] = useState();
    const [months, setMonths] = useState([]);

    const [attendanceRaw, setAttendanceRaw] = useState([]);
    const [observationRaw, setObservationRaw] = useState([]);
    const [lessonPlanRaw, setLessonPlanRaw] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        request(`${BackUrl}teacher/statistics_dates`, "GET", null, headers())
            .then(res => {
                setMonths(res.month_list.map(i => ({ name: i.month, value: i.date })));
                setYears(res.years_list.map(i => i.value));
                setYear(res.current_year);
                setMonth(res.current_month);
            });
    }, []);

    useEffect(() => {
        if (year && year !== "all") {
            request(`${BackUrl}teacher/statistics_dates`, "POST",
                JSON.stringify({ type_rating: "attendance", year }), headers()
            ).then(res => setMonths(res.month_list.map(i => ({ name: i.month, value: i.date }))));
        }
    }, [year]);

    const fetchAll = (y, m) => {
        setLoading(true);
        const post = (type) => request(
            `${BackUrl}teacher/teacher_statistics/${locationId}`, "POST",
            JSON.stringify({ type_rating: type, year: y, month: m === "all" ? null : m }),
            headers()
        );

        Promise.all([
            post("attendance").then(res => setAttendanceRaw(normalize(res.teachers_list))),
            post("observation").then(res => setObservationRaw(normalize(res.teachers_list))),
            post("lesson_plan").then(res => setLessonPlanRaw(normalize(res.teachers_list))),
        ]).finally(() => setLoading(false));
    };

    useEffect(() => { if (year) fetchAll(year, month); }, [year]);
    useEffect(() => { if (month) fetchAll(year, month); }, [month]);

    return (
        <div className={cls.teachersRating}>
            <div className={cls.header}>
                <h1>Teachers Rating</h1>
                <div className={cls.filters}>
                    <Select
                        defaultValue={year} all={true}
                        onChangeOption={(e) => { setYear(e); setMonth(null); }}
                        options={years} title="Year"
                    />
                    {year !== "all" && (
                        <Select
                            defaultValue={month} all={true}
                            onChangeOption={setMonth}
                            options={months} title="Month"
                        />
                    )}
                </div>
            </div>

            <SummaryTable
                attendance={attendanceRaw}
                observation={observationRaw}
                lessonPlan={lessonPlanRaw}
                loading={loading}
            />

            <div className={cls.rating}>
                <h2 className={cls.sectionTitle}>Attendance</h2>
                <BarChart data={attendanceRaw} color="#378ADD" loading={loading} />
            </div>

            <div className={cls.rating}>
                <h2 className={cls.sectionTitle}>Observations</h2>
                <BarChart data={observationRaw} color="#534AB7" loading={loading} />
            </div>

            <div className={cls.rating}>
                <h2 className={cls.sectionTitle}>Lesson Plans</h2>
                <BarChart data={lessonPlanRaw} color="#1D9E75" loading={loading} />
            </div>

            <DropoutReasonsStatistics month={month} year={year} />
        </div>
    );
};

export default PlatformTeachersRating;