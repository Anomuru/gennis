
import SampleGroups from "components/platform/platformSamples/sampleGroups/SampleGroups";
import React, { useEffect, useMemo } from 'react';


import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "slices/groupsSlice";
import { fetchFilters } from "slices/filtersSlice";
import { ROLES } from "constants/global";
import { setSelectedLocation } from "slices/meSlice";
import { fetchDataToChange } from "slices/dataToChangeSlice";



const PlatformGroupsToAdmins = () => {

    let { locationId } = useParams()


    const { groups, btns } = useSelector(state => state.groups)
    const { filters } = useSelector(state => state.filters)
    const { location, role } = useSelector(state => state.me)

    const dispatch = useDispatch()
    const { currentFilters } = useSelector(state => state.currentFilterSlice)


    useEffect(() => {
        dispatch(fetchGroups({ locationId, currentFilters }))
        // dispatch(fetchDataToChange())
        const newData = {
            name: "groups",
            location: locationId
        }
        dispatch(fetchFilters(newData))
        dispatch(setSelectedLocation({ id: locationId }))
    }, [dispatch, locationId, currentFilters])


    const navigate = useNavigate()

    useEffect(() => {
        if (location !== +locationId && role !== ROLES["Director"]) {
            navigate(-1)
        }
    }, [location, locationId, navigate, role])


    const activeItems = useMemo(() => {
        return {
            name: true,
            teacherName: true,
            teacherSurname: true,
            typeOfCourse: true,
            subject: true,
            teacherID: false,
            studentsLength: true,
            subjects: true,
            payment: true,
            status: true
        }
    }, [])


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
