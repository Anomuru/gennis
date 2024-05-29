import React, {useCallback, useEffect} from 'react';
import {Navigate, Outlet, Route, useLocation,Routes} from "react-router-dom"
import {useAuth} from "hooks/useAuth";
import {fetchMe} from "slices/meSlice";
import {useDispatch} from "react-redux";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";



const RequireAuthChildren = ({allowedRules,children}) => {

    const {role,roleStorage} = useAuth()



    return (
        allowedRules.includes(role || roleStorage)
            ? children
            : null
    );

}



export default RequireAuthChildren
