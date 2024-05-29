import classNames from "classnames";
import React, {useCallback, useEffect, useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";

import "../tables.sass"
import {useNavigate} from "react-router-dom";


const GroupsTable = React.memo(({groups,activeRowsInTable}) =>  {

    const {fetchGroupsStatus} = useSelector(state => state.groups)
    const [groupsList,setGroupsList] = useState(groups)

    useEffect(()=> {
        setGroupsList(groups)
    },[groups])

    const navigate = useNavigate()
    const LinkToGroup = (id) => {
        navigate(`../insideGroup/${id}`)
    }

    const stringCheck = (name) => {
        if (name.length > 10) {
            return (
                <>
                    {name.substring(0,10)}...
                    <div className="popup">
                        {name}
                    </div>
                </>
            )
        }
        return name
    }



    const renderElements = useCallback(() => {
        return groupsList?.map((item,index) => {
            return (
                <tr key={index} onClick={() => LinkToGroup(item.id)}>
                    <td>{index + 1}</td>
                    {activeRowsInTable.name ? <td className="groupName">{stringCheck(item.name)}</td> : null}
                    {activeRowsInTable.teacherName ? <td>{stringCheck(item.teacherName)}</td> : null}
                    {activeRowsInTable.teacherSurname ? <td>{stringCheck(item.teacherSurname)}</td>: null}
                    {
                        activeRowsInTable.subject ?
                            <td>
                                <span key={index} className="subject">
                                    {
                                        stringCheck(item.subjects)
                                    }
                                </span>
                            </td> : null
                    }
                    {activeRowsInTable.typeOfCourse ? <td>{stringCheck(item.typeOfCourse)}</td>: null}
                    {
                        activeRowsInTable.payment ?
                            <td>
                                <span
                                    className={"money"}
                                >
                                    {item.payment}
                                </span>

                            </td> : null
                    }
                    {
                        activeRowsInTable.status ?
                            <td>
                                <div className="status">
                                    {
                                        item.status === "True" ?
                                            <span className="true" />
                                            :
                                            <span className="false" />
                                    }
                                </div>
                            </td> : null
                    }
                </tr>

            )
        })
    },[LinkToGroup, activeRowsInTable, groupsList])







    const renderedUsers = renderElements()

    if (fetchGroupsStatus === "loading") {
        return <DefaultLoader/>
    } else if (fetchGroupsStatus === "error") {
        console.log('error')
    }


    return (
        <div className="tableBox">
            <table className="groupsTable">
                <thead>
                    <tr className="tbody_th" key={1000000}>
                        <th/>
                        {activeRowsInTable.name ? <th >Gruppa nomi</th> : null}
                        {activeRowsInTable.teacherName ?  <th>O'qituvchi Ismi</th> : null}
                        {activeRowsInTable.teacherSurname ?  <th>O'qituvchi Familyasi</th> : null}
                        {activeRowsInTable.subject ?  <th>Fan</th> : null}
                        {activeRowsInTable.typeOfCourse ?  <th>Kurs turi</th> : null}
                        {activeRowsInTable.payment ?  <th>Gruppa narxi</th> : null}
                        {activeRowsInTable.status ?  <th>Status</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {renderedUsers}
                </tbody>
            </table>
        </div>
    );
})




export default GroupsTable;