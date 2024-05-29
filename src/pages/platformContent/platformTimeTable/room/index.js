import React, {useEffect, useRef, useState} from 'react';


import "./style.sass"
import {Link, useParams} from "react-router-dom";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Select from "components/platform/platformUI/select";


const Index = () => {
    const {roomId} = useParams();


    const [lessons,setLessons] = useState([]);
    const [selectedDay,setSelectedDay] = useState(null);
    const [days,setDays] = useState([]);
    const {request} = useHttp();




    useEffect(() => {
        request(`${BackUrl}room_time_table/${roomId}`,"GET",null,headers())
            .then(res => {
                if (days?.length === 0) {
                    setDays(res.week_days)
                }
                setLessons(res.time_table)

            })
    },[selectedDay])


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
        },
        {
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

    const renderItems = () => {
        return lessons.map(item => {

            let indexHour = 0
            let indexRoom = 0

            days.map((day,index) => {
                if (day.id === item.day) {
                    indexRoom = index
                }
            })

            // eslint-disable-next-line array-callback-return
            indexHour = +item.from.replace(":",".") - 7


            function hexToRgb(hex) {
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }

            const color1rgb = hexToRgb(item?.teacher[0]?.color ? item?.teacher[0]?.color : "#ffffff");



            const brightness = Math.round(((parseInt(color1rgb.r) * 299) +
                (parseInt(color1rgb.g) * 587) +
                (parseInt(color1rgb.b) * 114)) / 1000);

            const heightItem = +item.to.replace(":",".")- +item.from.replace(":",".")
            const style = {
                top: indexHour * 120 + "px",
                left: indexRoom * 170  + "px",
                height: heightItem * 120 + "px",
                backgroundColor: item?.teacher[0]?.color ? item?.teacher[0]?.color : "white",
                color: brightness > 125 ? "black" : "white"
            }


            return <Link to={`../../insideGroup/${item?.teacher[0].group_id}`} className="lesson" style={style}>
                <h1>{item?.teacher[0].name}</h1>
                <h1>{item?.teacher[0].surname}</h1>
            </Link>
        })
    }

    const renderDefaults = () => {




        return hours.map(() => {
            return <div
                className="default"
                style={{
                    width: days.length * 170 + "px"
                }}
            >
                {
                    days.map(() => {
                        return (
                            <div/>
                        )
                    })
                }
            </div>
        })


    }

    const renderHours = () => {
        return hours.map(item => {
            return <div>{item.name}</div>
        })
    }

    const renderRooms= () => {
        return days.map(item => {
            return <div>{item.name}</div>
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
                                {renderRooms()}
                            </div>
                            <div className="wrapper">
                                <div className="wrapper__hours">
                                    {renderHours()}
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