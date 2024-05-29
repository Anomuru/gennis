import {useSelector} from "react-redux";


export function useAuth() {
    const token = sessionStorage.getItem("token")
    const refresh_token = sessionStorage.getItem("refresh_token")
    const selectedLocation = localStorage.getItem("selectedLocation")
    // const user = localStorage.getItem("user")
    const roleStorage = localStorage.getItem("role")

    const {username,name,surname,id,role,meLoadingStatus,location} = useSelector(state => state.me)


    return {
        isAuth: !!username,
        user:username,
        role,
        token,
        username,
        name,
        id,
        surname,
        meLoadingStatus,
        refresh_token,
        location,
        selectedLocation,
        roleStorage
    }
}

