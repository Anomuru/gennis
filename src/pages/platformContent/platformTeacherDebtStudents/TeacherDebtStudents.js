import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {BackUrl, headers} from "constants/global";
import header from "components/webSite/header/Header";
import {useHttp} from "hooks/http.hook";


import cls from "./teacherDebtStudents.module.sass"
import Table from "components/platform/platformUI/table";
import Select from "components/platform/platformUI/select";
import BackButton from "components/platform/platformUI/backButton/backButton";



const TeacherDebtStudents = () => {


    const {request} = useHttp()

    const {userId} = useParams()

    const [groups,setGroups] = useState([])
    const [students,setStudents] = useState([])
    const [selectedGroup,setSelectedGroup] = useState("all")


    useEffect(() => {
        request(`${BackUrl}black_salary/${userId}`, "GET",null,headers())
            .then(res => {
                setGroups(res.groups)
                setStudents(res.students)
            })
    },[])

    const renderFilterStudents = useCallback(() => {
        const filteredStudents = students.filter(item => {

            if (selectedGroup === "all") return true
            return item.group_name.includes(selectedGroup)
        })


        return filteredStudents.map((item,index) => {
            return (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{item.student_name}</td>
                    <td>{item.student_surname}</td>
                    <td>{item.group_name.toString()}</td>
                    <td>{item.total_salary}</td>
                </tr>
            )
        })

    },[selectedGroup,students])

    return (
        <div className={cls.studentsDebt}>
            <BackButton/>

            <div className={cls.header}>
                <h1>Qarzdor o'quvchilar</h1>

                <Select all={true} value={selectedGroup} onChangeOption={setSelectedGroup} options={groups}/>
            </div>
            <div className={cls.wrapper}>
                <Table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Ism</th>
                            <th>Familya</th>
                            <th>Guruh</th>
                            <th>Qarz</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderFilterStudents()}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default TeacherDebtStudents;