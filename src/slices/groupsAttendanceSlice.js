import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BackUrl, headers } from "constants/global";
import { useHttp } from "hooks/http.hook";

export const fetchGroupsAttendance = createAsyncThunk(
    "groupsAttendanceSlice/fetchGroupsAttendance",
    ({location, year, month, day}) => {
        const {request} = useHttp()
        return request(`${BackUrl}teacher/location/${location}/daily-stats?year=${+year}&month=${+month}&day=${+day}`, "GET", null, headers())
    }
)

const initialState = {
    attendance: [],
    attendanceCount: null,
    loading: false,
    error: null
}

const groupsAttendanceSlice = createSlice({
    name: "groupsAttendanceSlice",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchGroupsAttendance.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchGroupsAttendance.fulfilled, (state, action) => {
                state.attendance = action.payload?.groups
                state.attendanceCount = action.payload?.overall_summary
                state.loading = false
                state.error = null
            })
            .addCase(fetchGroupsAttendance.rejected, (state) => {
                state.loading = false
                state.error = "error"
            })
})

export default groupsAttendanceSlice.reducer

