import React, {useEffect, useState} from 'react';
import Select from "components/platform/platformUI/select";
import {useDispatch, useSelector} from "react-redux";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useAuth} from "hooks/useAuth";

const ChangeLocStudent = () => {

    const {dataToChange} = useSelector(state => state.dataToChange)
    const {user} = useSelector(state => state.usersProfile)
    const [selectedLoc,setSelectedLoc] = useState(user.location_id)


    const dispatch = useDispatch()

    const {selectedLocation} = useAuth()


    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    },[selectedLocation])

    const {request} = useHttp()

    const onChange = (id) => {
        request(`${BackUrl}change_location/${user.id}/${id}`,"GET",null,headers())
        setSelectedLoc(id)
    }
    return (
        <div>
            <Select group={true}  defaultValue={selectedLoc} options={dataToChange.locations} onChangeOption={onChange}  title={"Change loc"}/>
        </div>
    );
};

export default ChangeLocStudent;