import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, Line,
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Sector, LineChart, Cell
} from 'recharts';
import classNames from "classnames";
import Calendar from "react-calendar";

import Table from "components/platform/platformUI/table";
import Input from "components/platform/platformUI/input";

import cls from "./platformAdminRating.module.sass";
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminRating } from "../../../slices/adminRatingSlice";
import { useLocation, useNavigate } from 'react-router-dom';

const colors = {
    a: '#12C2E9',    // голубой
    b: '#F64F59',    // красный
    c: '#3BC26F',    // зелёный
    d: '#B044F6',    // фиолетовый
    e: '#F9C74F',    // жёлто-оранжевый (новый)
}

const colors2 = {
    a: 'rgba(26,141,166,0.8)',    // голубой
    b: 'rgba(194,69,78,0.8)',    // красный
    c: 'rgba(53,147,89,0.8)',    // зелёный
    d: 'rgba(162,82,215,0.8)',    // фиолетовый
    e: 'rgba(199,166,85,0.8)',    // жёлто-оранжевый (новый)
}

const colors3 = {
    a: '#00d1ff',    // голубой
    b: '#ff000f',    // красный
    c: '#00ff65',    // зелёный
    d: '#9a00ff',    // фиолетовый
    e: '#ffb400',    // жёлто-оранжевый (новый)
}


const PlatformAdminRating = () => {

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const date = new Date()
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const formattedValue = `${year}-${month}-${day}`
        dispatch(fetchAdminRating({ date: formattedValue }))
    }, [])

    const [activeSwitch, setActiveSwitch] = useState(true)
    const [activeDate, setActiveDate] = useState(true)

    const getDate = (date) => {
        dispatch(fetchAdminRating({ date }))
    }

    return (
        <div className={cls.adminRating}>
            <div className={cls.adminRating__header}>
                <div className={cls.wrapper}>
                    <div className={cls.navButtons}>
                        <button
                            className={classNames(
                                cls.navButton,
                                {
                                    [cls.active]: location.pathname.includes("taskManager")
                                }
                            )}
                            onClick={() => navigate("../taskManager")}
                        >
                            Task manager
                        </button>
                        <button
                            className={classNames(
                                cls.navButton,
                                {
                                    [cls.active]: location.pathname.includes("adminRanking")
                                }
                            )}
                            onClick={() => navigate("../adminRanking")}
                        >
                            Admin ranking
                        </button>
                    </div>
                    <div className={cls.switch}>
                        <RatingHeader
                            activeSwitch={activeSwitch}
                            onChangeSwitch={(status) => setActiveSwitch(status)}
                        />
                        <h2>{activeSwitch ? "Diagramma" : "Table"}</h2>
                    </div>
                </div>
                {
                    !activeSwitch &&
                    <div className={cls.date}>
                        <div className={cls.date__switch}>
                            <RatingHeader
                                activeSwitch={activeDate}
                                onChangeSwitch={(status) => setActiveDate(status)}
                            />
                            <h2>{activeDate ? "Oy" : "Kun"}</h2>
                        </div>
                        <Input
                            clazzLabel={cls.date__input}
                            type={activeDate ? "month" : "date"}
                            onChange={getDate}
                        />
                    </div>
                }
            </div>
            <div
                className={classNames(
                    cls.adminRating__container, {
                    [cls.boxes]: activeSwitch
                }
                )}
            >
                {
                    activeSwitch
                        ? <>
                            <AdminRating />
                            <NewStudentsRating />
                            <LeadRating />
                            <DebtorsRating />
                            <FormattedCalendar />
                        </>
                        : <>
                            <AdminRatingTable />
                            <NewStudentsRatingTable />
                            <LeadRatingTable />
                            <DebtorsRatingTable />
                        </>
                }
            </div>
        </div>
    );
};

const AdminRating = () => {

    const list = useSelector(state => state.adminRatingSlice)
    const [data, setData] = useState([])

    useEffect(() => {
        if (list) {
            setData(list?.data?.map((item, index) => ({
                name: item?.location_name,
                value: item?.task_statistics?.completed_tasks_percentage ?? 0,
                fill: Object.values(colors)[index]
            })))
        }
    }, [list])

    return (
        <div className={classNames(cls.adminRating__admins, cls.adminRating__box)}>
            <h2 className={cls.adminRating__title}>Admins</h2>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value">
                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

const AdminRatingTable = () => {

    const list = useSelector(state => state.adminRatingSlice)

    const renderList = () => {
        return list.data.map((item, index) => {
            return (
                <tr>
                    <td>{1 + index}</td>
                    <td>{item.location_name}</td>
                    <td>{item.task_statistics?.completed_tasks_percentage ?? 0}</td>
                </tr>
            )
        })
    }

    return (
        <div className={classNames(cls.adminRating__table, cls.adminRating__box)}>
            <h2 className={cls.adminRating__title}>Admins</h2>
            <Table className={cls.inner}>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Filial nomi</th>
                        <th>Vazifalar statistikasi</th>
                    </tr>
                </thead>
                <tbody>
                    {renderList()}
                </tbody>
            </Table>
        </div>
    )
}

const NewStudentsRating = () => {

    const [state, setState] = useState(0)
    const list = useSelector(state => state.adminRatingSlice)
    const [data, setData] = useState([])

    useEffect(() => {
        if (list) {
            setData(list?.data?.map((item, index) => ({
                name: item?.location_name,
                value: item?.new_students ?? 1,
                // value:  1,
                // fill: Object.values(colors)[index]
            })))
        }
    }, [list])

    const onPieEnter = (_, index) => {
        setState(index)
    }

    // const data = [
    //     {name: 'Group A', value: 400},
    //     {name: 'Group B', value: 300},
    //     {name: 'Group C', value: 300},
    //     {name: 'Group D', value: 200},
    //     {name: 'Group E', value: 200},
    // ];

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {payload.name}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor}
                    fill="#333">{`PV ${value}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(Rate ${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };

    return (
        <div className={classNames(cls.adminRating__newStudents, cls.adminRating__box)}>
            <h2 className={cls.adminRating__title}>New Student</h2>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart width={400} height={400}>
                    <Pie
                        activeIndex={state}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

const NewStudentsRatingTable = () => {

    const list = useSelector(state => state.adminRatingSlice)

    const renderList = () => {
        return list.data.map((item, index) => {
            return (
                <tr>
                    <td>{1 + index}</td>
                    <td>{item.location_name}</td>
                    <td>{item.new_students ?? 1}</td>
                </tr>
            )
        })
    }

    return (
        <div className={classNames(cls.adminRating__table, cls.adminRating__box)}>
            <h2 className={cls.adminRating__title}>New Student</h2>
            <Table className={cls.inner}>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Filial nomi</th>
                        <th>Yangi o'quvchilar</th>
                    </tr>
                </thead>
                <tbody>
                    {renderList()}
                </tbody>
            </Table>
        </div>
    )
}

const LeadRating = () => {

    const list = useSelector(state => state.adminRatingSlice)
    const [data, setData] = useState([])

    useEffect(() => {
        if (list) {
            setData(list?.data?.map((item, index) => {
                return {
                    name: item.location_name,
                    ["Completed leads"]: item.completed_leads ?? 1,
                    ["Not completed leads"]: item.not_completed_leads ?? 1,
                    fill2: Object.values(colors2)[index],
                    fill3: Object.values(colors3)[index],
                }
            }))

        }
    }, [list])

    return (
        <div className={classNames(cls.adminRating__lead, cls.adminRating__box)}>
            <h2 className={cls.adminRating__title}>Lead</h2>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        formatter={(value, name) => [`${value}`, name]}
                    />

                    {/* Убираем Leads — он считается как сумма Completed + Not Completed */}

                    {/* Completed leads */}
                    <Bar dataKey="Completed leads" stackId="a" barSize={40}>
                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-completed-${index}`} fill={entry.fill3} />
                            ))
                        }
                    </Bar>

                    {/* Not completed leads */}
                    <Bar dataKey="Not completed leads" stackId="a">
                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-not-completed-${index}`} fill={entry.fill2} />
                            ))
                        }
                    </Bar>
                </BarChart>

            </ResponsiveContainer>
        </div>
    )
}

const LeadRatingTable = () => {

    const list = useSelector(state => state.adminRatingSlice)

    const renderList = () => {
        return list.data.map((item, index) => {
            return (
                <tr>
                    <td>{1 + index}</td>
                    <td>{item.location_name}</td>
                    <td>{item.leads ?? 1}</td>
                    <td>{item.completed_leads ?? 1}</td>
                    <td>{item.not_completed_leads ?? 1}</td>
                </tr>
            )
        })
    }

    return (
        <div className={classNames(cls.adminRating__table, cls.adminRating__box)}>
            <h2 className={cls.adminRating__title}>Lead</h2>
            <Table className={cls.inner}>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Filial nomi</th>
                        <th>Leads</th>
                        <th>Completed leads</th>
                        <th>Not completed leads</th>
                    </tr>
                </thead>
                <tbody>
                    {renderList()}
                </tbody>
            </Table>
        </div>
    )
}

const DebtorsRating = () => {

    const list = useSelector(state => state.adminRatingSlice)
    const [data, setData] = useState([])

    console.log(list)
    useEffect(() => {
        if (list) {
            setData(list?.data?.map((item, index) => ({
                name: item?.location_name,
                debtors: item?.debt_students,
                completed_tasks: item?.task_statistics?.completed_tasks,
                // value: 1,
                fill: Object.values(colors)[index]
            })))
        }
    }, [list])
    // const data = [
    //     {
    //         name: 'Page A',
    //         uv: 4000,
    //         pv: 2400,
    //         amt: 2400,
    //     },
    //     {
    //         name: 'Page B',
    //         uv: 3000,
    //         pv: 1398,
    //         amt: 2210,
    //     },
    //     {
    //         name: 'Page C',
    //         uv: 2000,
    //         pv: 9800,
    //         amt: 2290,
    //     },
    //     {
    //         name: 'Page D',
    //         uv: 2780,
    //         pv: 3908,
    //         amt: 2000,
    //     },
    //     {
    //         name: 'Page E',
    //         uv: 1890,
    //         pv: 4800,
    //         amt: 2181,
    //     },
    //     {
    //         name: 'Page F',
    //         uv: 2390,
    //         pv: 3800,
    //         amt: 2500,
    //     },
    //     {
    //         name: 'Page G',
    //         uv: 3490,
    //         pv: 4300,
    //         amt: 2100,
    //     },
    // ];
    console.log(data)

    return (
        <div className={classNames(cls.adminRating__debtors, cls.adminRating__box)}>
            <h2 className={cls.adminRating__title}>Qarzdorlar</h2>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Bar dataKey="debtors">
                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))
                        }
                    </Bar>
                    <Bar dataKey="completed_tasks">
                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

const DebtorsRatingTable = () => {

    const list = useSelector(state => state.adminRatingSlice)

    const renderList = () => {
        return list.data.map((item, index) => {
            return (
                <tr>
                    <td>{1 + index}</td>
                    <td>{item.location_name}</td>
                    <td>{item.debt_students ?? 1}</td>
                </tr>
            )
        })
    }

    return (
        <div className={classNames(cls.adminRating__table, cls.adminRating__box)}>
            <h2 className={cls.adminRating__title}>Qarzdorlar</h2>
            <Table className={cls.inner}>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Filial nomi</th>
                        <th>Qarzdorlar</th>
                    </tr>
                </thead>
                <tbody>
                    {renderList()}
                </tbody>
            </Table>
        </div>
    )
}

const FormattedCalendar = () => {
    const dispatch = useDispatch()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [formattedValue, setFormattedValue] = useState(null)
    const [lastFormattedDate, setLastFormattedDate] = useState(null)

    // Формат полной даты: 2025.06.13
    const formatFullDate = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    // Формат только год.месяц: 2025.06
    const formatYearMonth = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        return `${year}-${month}`
    }

    const getDate = (date) => {
        const fullDate = formatFullDate(date)

        if (fullDate === lastFormattedDate) {
            // Повторный клик — убираем выделение, сохраняем только год.месяц
            setSelectedDate(null)
            setFormattedValue(formatYearMonth(date))
            setLastFormattedDate(null)
        } else {
            // Первый клик — выделяем и сохраняем полную дату
            setSelectedDate(date)
            setFormattedValue(fullDate)
            setLastFormattedDate(fullDate)
        }
    }

    useEffect(() => {
        if (formattedValue) {
            dispatch(fetchAdminRating({ date: formattedValue }))
        }
    }, [formattedValue])

    return (
        <div
            style={{ border: "none", padding: "0 1rem" }}
            className={classNames(cls.adminRating__box, cls.adminRating__calendar)}
        >
            <h2 className={cls.adminRating__title}>Calendar</h2>

            {/*{formattedValue && (*/}
            {/*    <div style={{ marginBottom: '1rem' }}>*/}
            {/*        <strong>Selected:</strong> {formattedValue}*/}
            {/*    </div>*/}
            {/*)}*/}

            <Calendar
                className={cls.inner}
                value={selectedDate}
                onChange={getDate}
            />
        </div>
    )
}


const RatingHeader = ({ disabled = false, activeSwitch, onChangeSwitch }) => {
    return (
        <div className={cls.mainBody}>
            <button
                type="button"
                disabled={disabled}
                //         className={`${cls.mainSwitchBox}
                // ${disabled
                //             ? cls.disabled
                //             : cls.notDisabled
                //         }
                // ${!activeSwitch
                //             ? cls.switchOn
                //             : cls.switchOff
                //         }`}
                className={classNames(cls.mainSwitchBox, {
                    [cls.disabled]: disabled,
                    [cls.notDisabled]: !disabled,
                    [cls.switchOn]: !activeSwitch,
                    [cls.switchOff]: activeSwitch,
                })}
                onClick={() => onChangeSwitch(!activeSwitch)}
            >
                {!activeSwitch ? (
                    <span className={cls.mainSwitchBox__onSwitch}></span>
                ) : (
                    <span className={cls.mainSwitchBox__offSwitch}></span>
                )}
            </button>
        </div>
    )
}

export default PlatformAdminRating;