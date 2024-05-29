import React, {useEffect, useState} from 'react';

import "../../tables.sass"

const TeacherTimeTable = ({days,data}) => {

    const [lessons,setLessons] = useState([])

    const renderLessons = () => {
        return lessons?.map((item,index) => {
            return (
                <tr>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    {
                        item?.lessons?.map(hour => {
                            return <td>{hour}</td>
                        })
                    }
                </tr>
            )
        })
    }


    useEffect(() => {
        if (data) {
            setLessons(data)
        }
    },[data])

    return (
        <div className="tableBox">
            <table>
                <thead>
                <tr className="tbody_th">
                    <th/>
                    <th>Guruh nomi</th>

                    {
                        days?.map(item => {
                            return <th>{item?.name}</th>
                        })
                    }
                </tr>
                </thead>
                <tbody>
                    {renderLessons()}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherTimeTable;