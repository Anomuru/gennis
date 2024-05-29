import "../../tables.sass"
import React, {useEffect, useState} from "react";
import GroupTimeTable from "components/platform/platformUI/tables/timeTable/group";

const StudentTimeTable = ({days,data}) => {

    const [lessons,setLessons] = useState([])

    const renderLessons = () => {
        return lessons?.map((item,index) => {
            return (
                <tr>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    {
                        item?.lesson?.map(hour => {
                            if (hour.from !== "") {
                                return <td>{hour.from+"-"+hour.to}</td>
                            } else {
                                return <td/>
                            }
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
                            return <th>{item}</th>
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

export default StudentTimeTable;