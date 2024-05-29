import React, {useEffect, useMemo} from 'react';


import {useDispatch, useSelector} from "react-redux";
import {fetchAdmins} from "slices/adminsSlice";
import {fetchFilters} from "slices/filtersSlice";
import {useNavigate} from "react-router-dom";
import {ROLES} from "constants/global";






const SampleUsers = React.lazy(() => import("components/platform/platformSamples/sampleUsers/SampleUsers") )


const PlatformAdmins = () => {

    const {admins,btns,fetchAdminsStatus} = useSelector(state => state.employees)
    const {filters} = useSelector(state => state.filters)
    const {location,role} = useSelector(state => state.me)

    const dispatch = useDispatch()


    useEffect(()=> {

        dispatch(fetchAdmins())
        const newData = {
            name: "admins",
            location: location
        }
        dispatch(fetchFilters(newData))

    },[])

    const navigate = useNavigate()

    useEffect(()=>{
        if (role !== ROLES["Director"] && role !== ROLES["Admin"]) {
            navigate("/platform")
        }
    },[location, navigate, role])


    const activeItems = useMemo(()=> {
        return {
            name: true,
            surname : true,
            username: true,
            age: false,
            phone : true,
            reg_date: false,
            checked: false,
            comment :false,
            subject : false,
            money : false,
            job : false,
            locationName: true
        }
    },[])



    return (
        <SampleUsers
            fetchUsersStatus={fetchAdminsStatus}
            activeRowsInTable={activeItems}
            users={admins}
            filters={filters}
            btns={btns}
        />
    );
};

export default PlatformAdmins;