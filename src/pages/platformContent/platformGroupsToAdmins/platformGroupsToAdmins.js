import SampleGroups from "components/platform/platformSamples/sampleGroups/SampleGroups";
import React, {useEffect, useMemo} from 'react';


import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchGroups} from "slices/groupsSlice";
import {fetchFilters} from "slices/filtersSlice";
import {ROLES} from "constants/global";
import {setSelectedLocation} from "slices/meSlice";



const PlatformGroupsToAdmins = () => {

    let {locationId} = useParams()


    const {groups,btns} = useSelector(state => state.groups)
    const {filters} = useSelector(state => state.filters)
    const {location,role} = useSelector(state => state.me)

    const dispatch = useDispatch()

    useEffect(()=> {
        dispatch(fetchGroups(locationId))
        const newData = {
            name: "groups",
            location: locationId
        }
        dispatch(fetchFilters(newData))
        dispatch(setSelectedLocation({id:locationId}))
    },[dispatch, locationId])


    const navigate = useNavigate()

    useEffect(()=>{
        if (location !== +locationId && role !== ROLES["Director"]) {
            navigate(-1)
        }
    },[location, locationId, navigate, role])


    const activeItems = useMemo(()=> {
        return {
            name: true,
            teacherName : true,
            teacherSurname: true,
            typeOfCourse: true,
            subject : true,
            teacherID: false,
            studentsLength :false,
            subjects : true,
            payment : true,
            status: true
        }
    },[])


    return (
        <SampleGroups
            locationId={locationId}
            activeRowsInTable={activeItems}
            groups={groups}
            filters={filters}
            btns={btns}
        />
    );
};

export default PlatformGroupsToAdmins;