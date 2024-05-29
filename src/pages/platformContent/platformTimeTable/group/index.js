import React, {useEffect, useState} from 'react';
import GroupTimeTable from "components/platform/platformUI/tables/timeTable/group";

import "./style.sass"
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useParams} from "react-router-dom";

const Index = () => {

    const {groupId} = useParams()

    const [data,setData] = useState()


    const {request} = useHttp()

    useEffect(() => {
        request(`${BackUrl}group_time_table/${groupId}`,"GET",null,headers())
            .then(res => {
                if (res.success) {
                    setData(res)
                }
            })
    },[groupId])


    console.log(data)
    return (
        <div className="groupTable">
            <GroupTimeTable data={data?.data} days={data?.days}/>
        </div>
    );
};

export default Index;