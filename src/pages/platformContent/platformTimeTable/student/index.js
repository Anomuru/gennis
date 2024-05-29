import React, {useEffect, useState} from 'react';

import "./style.sass"
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useParams} from "react-router-dom";
import StudentTimeTable from "components/platform/platformUI/tables/timeTable/student";
import {useAuth} from "hooks/useAuth";

const Index = () => {

    const {userId} = useParams()

    const [data,setData] = useState()

    const {selectedLocation} = useAuth()
    const {request} = useHttp()

    useEffect(() => {
        request(`${BackUrl}user_time_table/${userId}/${selectedLocation}`,"GET",null,headers())
            .then(res => {
                if (res.success) {
                    setData(res)
                }
            })
    },[userId])





    return (
        <div className="groupTable">
            <StudentTimeTable data={data?.data} days={data?.days}/>
        </div>
    );
};

export default Index;