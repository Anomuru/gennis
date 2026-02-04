import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers, ROLES } from "constants/global";

const initialState = {
    id: null,
    level: null,
    username: null,
    role: process.env.NODE_ENV !== "production" ? ROLES.Director : null,
    // role: null,
    name: null,
    surname: null,
    location: null,
    selectedLocation: null,
    contract_url: null,
    rate: [],
    extraInfo: {},
    links: [],
    activeToChange: {},
    meLoadingStatus: "idle",
    meInfoLoadingStatus: "idle",
    fetchMeStatus: "idle",
    checkingPassword: "idle",
    meCheckPassword: false,
    isCheckedPassword: true
}


export const fetchMe = createAsyncThunk(
    'user/fetchMe',
    async (refresh_token) => {
        const { request } = useHttp();
        const headers = {
            "Authorization": "Bearer " + refresh_token,
            'Content-Type': 'application/json'
        }
        return await request(`${BackUrl}base/refresh`, "POST", null, headers)
    }
)

export const fetchMyInfo = createAsyncThunk(
    'user/fetchMyInfo',
    async (id) => {

        const { request } = useHttp();

        return await request(`${BackUrl}base/my_profile/${id}`, "GET", null, headers())
    }
)

export const fetchTeacherSalary = createAsyncThunk(
    'user/fetchMyInfo',
    async (id) => {
        const { request } = useHttp();

        return await request(`${BackUrl}/${id}`, "GET", null, headers())
    }
)


export const fetchCheckPassword = createAsyncThunk(
    'user/fetchCheckPassword',
    async (data) => {
        const { request } = useHttp();
        const token = sessionStorage.getItem("token")
        const headers = {
            "Authorization": "Bearer " + token,
            'Content-Type': 'application/json'
        }
        return await request(`${BackUrl}checks/check_password`, "POST", JSON.stringify(data), headers)
    }
)


const meSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        settingUser(state) {
            state.userLoadingStatus = true
        },
        setUser(state, action) {
            state.meLoadingStatus = 'success';
            sessionStorage.setItem('token', action.payload.access_token);
            sessionStorage.setItem('refresh_token', action.payload.refresh_token);
            localStorage.setItem('user', action.payload.username);
            localStorage.setItem('role', action.payload.role);
            localStorage.setItem('location_id', action.payload.location_id);
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.name = action.payload.name;
            state.surname = action.payload.surname;
            state.role = action.payload.role
            state.location = action.payload.location_id
            state.links = action.payload.links
            state.contract_url = action.payload.contract_url

        },

        changePaymentType: (state, action) => {
            state.teacherSalary.selectedMonth = state.teacherSalary.selectedMonth.map(item => {
                if (item.id === action.payload.id) {
                    console.log(action.payload.id)
                    return { ...item, typePayment: action.payload.typePayment }
                }
                return item
            })

        },
        removeUser(state) {
            sessionStorage.removeItem('token');
            state.id = null;
            state.username = null;
            state.role = null
        },
        setActiveModalCheckPassword: (state) => {
            state.userCheckPassword = true
        },
        setClearPassword: (state) => {
            state.isCheckedPassword = false
        },
        setLoadingStatus: (state) => {
            state.meLoadingStatus = "error"
        },
        setSelectedLocation: (state, action) => {
            localStorage.setItem('selectedLocation', action.payload.id);
            state.selectedLocation = action.payload.id
        },
        logout: (state, action) => {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            localStorage.removeItem('userData');
            localStorage.removeItem('selectedLocation');
            state.id = null
            state.username = null
            state.name = null
            state.surname = null
            state.role = null
            state.location = null
            state.location = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchMe.pending, state => { state.meLoadingStatus = 'loading' })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.meLoadingStatus = 'success';
                state.id = action.payload.id;
                state.level = action.payload.level;
                state.username = action.payload.username;
                state.name = action.payload.name;
                state.surname = action.payload.surname;
                state.role = action.payload.role;
                state.profile_photo = action.payload.profile_photo
                sessionStorage.setItem('token', action.payload.access_token);
                state.location = action.payload.location_id
                localStorage.setItem('location_id', action.payload.location_id);


            })
            .addCase(fetchMe.rejected, state => { state.meLoadingStatus = 'error' })

            .addCase(fetchMyInfo.pending, state => { state.meInfoLoadingStatus = 'loading' })
            .addCase(fetchMyInfo.fulfilled, (state, action) => {
                state.meInfoLoadingStatus = 'success';
                state.id = action.payload.id;
                state.level = action.payload.level;
                state.username = action.payload.username;
                state.name = action.payload.name;
                state.surname = action.payload.surname;
                state.role = action.payload.role
                state.extraInfo = action.payload.extraInfo
                state.activeToChange = action.payload.activeToChange
                state.profile_photo = action.payload.profile_photo
                state.links = action.payload.links
                state.rate = action.payload.rate
                state.contract_url = action.payload.contract_url
            })
            .addCase(fetchMyInfo.rejected, state => { state.meInfoLoadingStatus = 'error' })

            .addCase(fetchCheckPassword.pending, state => { state.checkingPassword = 'loading' })
            .addCase(fetchCheckPassword.fulfilled, (state, action) => {
                state.checkingPassword = 'success';
                if (action.payload.password === true) {
                    state.meCheckPassword = false
                    state.isCheckedPassword = true
                }
            })
            .addCase(fetchCheckPassword.rejected, state => { state.checkingPassword = 'error' })
            .addDefaultCase(() => { })
    }
})



const { actions, reducer } = meSlice;

export default reducer

export const {
    setUser,
    settingUser,
    setActiveModalCheckPassword,
    setClearPassword,
    setLoadingStatus,
    changePaymentType,
    logout,
    setSelectedLocation
} = actions




