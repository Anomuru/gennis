import React, {useCallback, useEffect} from 'react';

import "./platformGroupsToUsers.sass"
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchGroupsByStudentId} from "slices/groupsSlice";
import { BackUrlForDoc} from "constants/global";
import user_img from "assets/user-interface/user_image.png";



const PlatformGroupsToUsers = () => {
    const {id} = useSelector(state => state.me)
    const {groups} = useSelector(state => state.groups)
    const dispatch = useDispatch()
    
    useEffect(() =>{
       dispatch(fetchGroupsByStudentId(id))
    },[dispatch, id])
    

    const renderGroups = useCallback(() => {
        return groups.map(item => {
            const userImg = item.teacherImg ? `${BackUrlForDoc}${item.teacherImg}` : user_img
            return (
                <Link
                    to={`../insideGroup/${item.id}`}
                    className="my__groups-item"
                >
                    <img src={userImg} alt="teacherImg"/>
                    <div className="info">
                        <div className="info__name">{item.name}</div>
                        <div className="info__teacher">
                            <span>{item.teacherName}</span>
                            <span>{item.teacherSurname}</span>
                        </div>
                    </div>
                </Link>
            )
        })
    },[groups])

    const renderedGroups = renderGroups()

    return (
        <div className="my__groups">
            <h1>Mening Gruppalarim</h1>
            <div className="my__groups-container">
                {renderedGroups}
            </div>
        </div>
    );
};

export default PlatformGroupsToUsers;