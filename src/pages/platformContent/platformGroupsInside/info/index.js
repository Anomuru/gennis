import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ROLES } from "constants/global";
import { useAuth } from "hooks/useAuth";
import Information from "./information/information";
import Students from "./students/students";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import { fetchStatistics } from "slices/groupSlice";

import cls from "./style.module.sass";
import PercentageTests from "pages/platformContent/platformGroupsInside/info/percentageTests/PercentageTests";

const Info = () => {

    const { data, id, statistics, fetchGroupStatus, percentageTest } = useSelector(state => state.group)
    const { role } = useAuth()
    const dispatch = useDispatch()
    const stringCheck = (name, length = 10) => {
        if (name.length > length) {
            return (
                <>
                    {name.substring(0, length)}...
                </>
            )
        }
        return name
    }

    useEffect(() => {
        if (id)
            dispatch(fetchStatistics(id))
    }, [id])

    const navigate = useNavigate()

    const LinkToUser = (e, id) => {
        if (role !== ROLES.Student) {
            navigate(`/platform/profile/${id}`)
        }
    }

    const keys = Object.keys(data)

    if (fetchGroupStatus === "loading" || fetchGroupStatus === "idle") {
        return <DefaultLoader />
    }

    // eslint-disable-next-line array-callback-return
    return (
        <div className={cls.main}>
            <Information
                data={data.information}
                statistics={statistics}
            />

            <PercentageTests
                data={percentageTest}
                assisData={{
                    assistantName: data.assistantName,
                    assistantSurname: data.assistantSurname,
                    assistentSalary: data.assistentSalary
                }}
            />

            <Students
                data={data.students}
                LinkToUser={LinkToUser}
                stringCheck={stringCheck}
            />


        </div>
    )
};

export default Info;