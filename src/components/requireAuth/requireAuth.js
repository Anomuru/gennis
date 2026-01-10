import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "hooks/useAuth";
import { fetchMe, fetchMyInfo } from "slices/meSlice";
import { useDispatch, useSelector } from "react-redux";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";

const RequireAuth = ({ allowedRules }) => {

    const { role, meLoadingStatus, refresh_token } = useAuth()
    const { id } = useSelector(state => state.me)

    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchMe(refresh_token))
    }, [])

    useEffect(() => {
        if (id) {
            dispatch(fetchMyInfo(id))
        }
    }, [id])

    const style = {
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }

    if (meLoadingStatus === "loading" || meLoadingStatus === "idle") {
        return (
            <div style={style}>
                <DefaultLoader />
            </div>
        )
    } else if (meLoadingStatus === "success") {
        if (allowedRules.includes(role)) return <Outlet />
        return <Navigate to="/login" state={{ from: location }} replace />
    } else {
        return (
            <Navigate to="/login" state={{ from: location }} replace />
        );
    }

}



export default RequireAuth
