import React, {useEffect, useRef, useState} from 'react';


import "./style.sass"
import {Link, useParams} from "react-router-dom";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Select from "components/platform/platformUI/select";


const Index = () => {
    const {locationId} = useParams();

    const [rooms,setRooms] = useState([]);
    const [lessons,setLessons] = useState([]);
    const [selectedDay,setSelectedDay] = useState(null);
    const [days,setDays] = useState([]);
    const {request} = useHttp();


    useEffect(() => {
        const date = new Date();

        let day = date.toLocaleString('en-us', {weekday: 'long'})

        request(`${BackUrl}time_table/view_table2/${locationId}/${selectedDay ? selectedDay : day}`,"GET",null,headers())
            .then(res => {
                console.log(res)
                if (days?.length === 0) {
                    setDays(res.week_days)
                }
                setRooms(res.rooms)
                setLessons(res.time_table)
            })
    },[locationId,selectedDay])


    useEffect(() => {
        const date = new Date();
        let day = date.toLocaleString('en-us', {weekday: 'long'})
        // eslint-disable-next-line array-callback-return
        days.map(item => {
            if (item.value.toLowerCase() === day.toLowerCase()) {
                setSelectedDay(item.value)
            }
        })
    },[days])

    const hours = [
        {
            id: 8,
            value: "07:00",
            name: "07:00 - 08:00"
        },
        {
            id: 9,
            value: "08:00",
            name: "08:00 - 09:00"
        },
        {
            id: 10,
            value: "09:00",
            name: "09:00 - 10:00"
        },
        {
            id: 11,
            value: "10:00",
            name: "10:00 - 11:00"
        },
        {
            id: 12,
            value: "11:00",
            name: "11:00 - 12:00"
        },
        {
            id: 13,
            value: "12:00",
            name: "12:00 - 13:00"
        },
        {
            id: 14,
            value: "13:00",
            name: "13:00 - 14:00"
        },
        {
            id: 15,
            value: "14:00",
            name: "14:00 - 15:00"
        },
        {
            id: 16,
            value: "15:00",
            name: "15:00 - 16:00"
        },
        {
            id: 17,
            value: "16:00",
            name: "16:00 - 17:00"
        },
        {
            id: 18,
            value: "17:00",
            name: "17:00 - 18:00"
        },
        {
            id: 19,
            value: "18:00",
            name: "18:00 - 19:00"
        },
        {
            id: 20,
            value: "19:00",
            name: "19:00 - 20:00"
        },
        {
            id: 21,
            value: "20:00",
            name: "20:00 - 21:00"
        },
        {
            id: 22,
            value: "21:00",
            name: "21:00 - 22:00"
        },
        {
            id: 23,
            value: "22:00",
            name: "22:00 - 23:00"
        },
        {
            id: 24,
            value: "23:00",
            name: "23:00 - 24:00"
        }
        ,{
            id: 1,
            value: "00:00",
            name: "00:00 - 01:00"
        },
        {
            id: 2,
            value: "01:00",
            name: "01:00 - 02:00"
        },
        {
            id: 3,
            value: "02:00",
            name: "02:00 - 03:00"
        },
        {
            id: 4,
            value: "03:00",
            name: "03:00 - 04:00"
        },
        {
            id: 5,
            value: "04:00",
            name: "04:00 - 05:00"
        },
        {
            id: 6,
            value: "05:00",
            name: "05:00 - 06:00"
        },
        {
            id: 7,
            value: "06:00",
            name: "06:00 - 07:00"
        }
        // {
        //     id: 2,
        //     value: "01:00-02:00"
        // },
        // {
        //     id: 3,
        //     value: "02:00-02:00"
        // },
        // {
        //     id: 4,
        //     value: "03:00-04:00"
        // },
        // {
        //     id: 5,
        //     value: "04:00-05:00"
        // },
        // {
        //     id: 6,
        //     value: "05:00-06:00"
        // },
    ]


    // const rooms = [
    //     {
    //         id:1,
    //         name: "room 1"
    //     },
    //     {
    //         id:2,
    //         name: "room 2"
    //     },
    //     {
    //         id:3,
    //         name: "room 3"
    //     },
    //     {
    //         id:4,
    //         name: "room 4"
    //     },
    //     {
    //         id:5,
    //         name: "room 5"
    //     },
    //     {
    //         id:6,
    //         name: "room 6"
    //     },
    //     {
    //         id:7,
    //         name: "room 7"
    //     },
    //     {
    //         id:3,
    //         name: "room 8"
    //     },
    //     {
    //         id:3,
    //         name: "room 9"
    //     },
    //     {
    //         id:3,
    //         name: "room 10"
    //     },
    // ]

    // const renderHours = () => {
    //
    //
    //
    //     return hours.map(item => {
    //
    //         return <tr>
    //             <td>{item.value}</td>
    //         </tr>
    //     })
    //
    //
    // }
    //
    // const [time,setTime] = useState(null)
    //
    // const inputRef = useRef()

    // const items = [
    //     {
    //         id: 1,
    //         teacher: {
    //             name: "ulugbek",
    //             surname: "fatxullayev",
    //         },
    //         from: "01:00",
    //         to: "02:30",
    //         room: "room 2"
    //     },
    //     {
    //         id: 2,
    //         teacher: {
    //             name: "ulugbek",
    //             surname: "fatxullayev",
    //         },
    //         from: "02:00",
    //         to: "04:00",
    //         room: "room 3"
    //     },
    //     {
    //         id: 3,
    //         teacher: {
    //             name: "ulugbek",
    //             surname: "fatxullayev",
    //         },
    //         from: "07:00",
    //         to: "08:30",
    //         room: "room 7"
    //     },
    // ]




    function hexToRgb(hex) {
        if (!hex) return { r: 255, g: 255, b: 255 }
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }

    const timeToMinutes = (time) => {
        const [h, m] = time.split(':').map(Number)
        return h * 60 + m
    }

    const getMergedConflicts = (lessonList) => {
        const parent = {}
        lessonList.forEach(l => { parent[l.id] = l.id })

        const find = (id) => {
            if (parent[id] !== id) parent[id] = find(parent[id])
            return parent[id]
        }
        const union = (a, b) => { parent[find(a)] = find(b) }

        const conflictedIds = new Set()

        for (let i = 0; i < lessonList.length; i++) {
            for (let j = i + 1; j < lessonList.length; j++) {
                const a = lessonList[i]
                const b = lessonList[j]
                if (a.room !== b.room) continue
                const startA = timeToMinutes(a.from)
                const endA = timeToMinutes(a.to)
                const startB = timeToMinutes(b.from)
                const endB = timeToMinutes(b.to)
                if (startA < endB && startB < endA) {
                    union(a.id, b.id)
                    conflictedIds.add(a.id)
                    conflictedIds.add(b.id)
                }
            }
        }

        const groupMap = {}
        conflictedIds.forEach(id => {
            const root = find(id)
            if (!groupMap[root]) groupMap[root] = []
            groupMap[root].push(lessonList.find(l => l.id === id))
        })

        return { conflictedIds, groups: Object.values(groupMap) }
    }

    const renderLessonCard = (item, key) => {
        let indexRoom = 0
        // eslint-disable-next-line array-callback-return
        rooms.map((room, index) => {
            if (room.id === item.room) indexRoom = index
        })
        const indexHour = +item.from.replace(":", ".") - 7
        const durationHours = +item.to.replace(":", ".") - +item.from.replace(":", ".")
        const containerStyle = {
            top: indexRoom * 120 + "px",
            left: indexHour * 170 + "px",
            width: durationHours * 170 + "px",
            height: "120px",
        }
        const teachers = item.teacher.length > 0 ? item.teacher : []
        const isMulti = teachers.length > 1
        const isSameTeacher = isMulti && teachers.every(t => t.name === teachers[0].name && t.surname === teachers[0].surname)
        const displayTeachers = isSameTeacher ? [teachers[0]] : teachers

        return (
            <div key={key} className={`lesson${isMulti ? ' lesson--multi' : ''}`} style={containerStyle}>
                {isMulti && (
                    <div className="lesson__multi-bar">
                        {teachers.map(t => t.group_name).join(' / ')}
                    </div>
                )}
                <div className="lesson__subs">
                    {displayTeachers.length === 0 ? (
                        <div className="lesson__sub lesson__sub--empty"><h1>—</h1></div>
                    ) : (
                        displayTeachers.map((t, idx) => {
                            const rgb = hexToRgb(t.color)
                            const brightness = Math.round(((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000)
                            return (
                                <Link
                                    key={t.group_id}
                                    to={`../../insideGroup/${t.group_id}`}
                                    className="lesson__sub"
                                    style={{
                                        backgroundColor: t.color || "white",
                                        color: brightness > 125 ? "black" : "white",
                                        borderLeft: idx > 0 ? "2px solid rgba(255,255,255,0.4)" : "none",
                                    }}
                                >
                                    <h1>{t.name}</h1>
                                    <h1>{t.surname}</h1>
                                    {!isMulti && <h1>{t.group_name}</h1>}
                                </Link>
                            )
                        })
                    )}
                </div>
            </div>
        )
    }

    const renderItems = () => {
        const { conflictedIds, groups } = getMergedConflicts(lessons)

        const normalCards = lessons
            .filter(item => !conflictedIds.has(item.id))
            .map(item => renderLessonCard(item, item.id))

        const conflictCards = groups.map((group, idx) => {
            let indexRoom = 0
            // eslint-disable-next-line array-callback-return
            rooms.map((room, index) => {
                if (room.id === group[0].room) indexRoom = index
            })

            const fromDecimal = Math.min(...group.map(l => +l.from.replace(":", ".")))
            const toDecimal = Math.max(...group.map(l => +l.to.replace(":", ".")))

            const containerStyle = {
                top: indexRoom * 120 + "px",
                left: (fromDecimal - 7) * 170 + "px",
                width: (toDecimal - fromDecimal) * 170 + "px",
                height: "120px",
            }

            const firstTeacher = group[0].teacher[0]
            const rgb = hexToRgb(firstTeacher?.color)
            const brightness = Math.round(((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000)

            const groupNames = group.flatMap(l => l.teacher.map(t => t.group_name)).join("/")
            const times = group.map(l => `${l.from}–${l.to}`).join("/")

            return (
                <div
                    key={`conflict-${idx}`}
                    className="lesson lesson__sub"
                    style={{
                        ...containerStyle,
                        backgroundColor: firstTeacher?.color || "white",
                        color: brightness > 125 ? "black" : "white",
                    }}
                >
                    <h1>{firstTeacher?.name}</h1>
                    <h1>{firstTeacher?.surname}</h1>
                    <h1>{groupNames}</h1>
                    <small>{times}</small>
                </div>
            )
        })

        return [...normalCards, ...conflictCards]
    }

    const renderDefaults = () => {
        return rooms.map(() => {
            return <div
                className="default"
                style={{
                    width: hours.length * 170 + "px"
                }}
            >
                {hours.map((_, i) => <div key={i}/>)}
            </div>
        })
    }

    const renderHours = () => {
        return hours.map(item => {
            return <div key={item.id}>{item.name}</div>
        })
    }

    const renderRooms = () => {
        return rooms.map(item => {
            return <div key={item.id}>{item.name}</div>
        })
    }


    const [zoom,setZoom] = useState(100)

    const styleTable = {
        zoom: zoom + "%"
    }


    const [client,setClient] = useState({
        isScrolling: false,
        clientX: 0,
        clientY: 0,
        scrollX: 0,
        scrollY: 0,
    })


    const dragRef = useRef()

    const mouseDown = (e) => {
        setClient( (state) => ({
            ...state,
            clientX: e.clientX,
            clientY: e.clientY,
            scrollX: dragRef.current.scrollLeft,
            scrollY: dragRef.current.scrollTop,
            isScrolling: true
        }))
    }

    const mouseUp = () => {
        setClient( (state) => ({
            ...state,
            isScrolling: false
        }))
    }

    const onDrag = (e) => {
        if (client.isScrolling) {

            const dx = e.clientX - client.clientX;
            const dy = e.clientY -  client.clientY;
            // setClient({
            //     ...client,
            //     clientX: e.clientX,
            //     scrollX: client.scrollX + e.clientX - client.clientX,
            //     clientY: e.clientY
            // });
            dragRef.current.scrollLeft = client.scrollX - dx;
            dragRef.current.scrollTop = client.scrollY - dy;
        }
    }


    // useEffect(() => {
    //     console.log(client)
    //
    // },[client])




    return (
        <section className="timeTable">
            <Select options={days} name={"day"} title={"Kun"} defaultValue={selectedDay} onChangeOption={setSelectedDay}/>
            <div className="roomDate">
                <div className="table"
                     onMouseDown={mouseDown}
                     ref={dragRef}
                     onMouseUp={mouseUp}
                     onMouseMove={onDrag}
                >
                    {/*<input type="time"  ref={inputRef} value={time} onChange={e => setTime(e.target.value)}/>*/}
                    <div className="table__wrapper" style={styleTable}>
                        <div className="container">
                            <div className="rooms">
                                {renderHours()}
                            </div>
                            <div className="wrapper">
                                <div className="wrapper__hours">
                                    {renderRooms()}
                                </div>
                                <div className="wrapper__classes">
                                    {renderDefaults()}
                                    {renderItems()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="zoom">
                    <input type="range" value={zoom} onChange={e => setZoom(e.target.value)} min="0" max="100"/>
                </div>
            </div>
        </section>
    );
};

export default Index;