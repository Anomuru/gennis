import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";

const initialState = {
    reports: [],
    fetchReportsStatus: "idle",
}

export const fetchChatReports = createAsyncThunk(
    "chatsSlice/fetchChatReports",
    async (locationId) => {
        const { request } = useHttp();
        return await request(`${BackUrl}chat-analyzer/reports/?location_id=${locationId}`, "GET", null, headers());
    }
)

const chatsSlice = createSlice({
    name: "chatsSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchChatReports.pending, state => { state.fetchReportsStatus = "loading" })
            .addCase(fetchChatReports.fulfilled, (state, action) => {
                state.fetchReportsStatus = "success";
                state.reports = action.payload.reports ?? [];
            })
            .addCase(fetchChatReports.rejected, state => { state.fetchReportsStatus = "error" })
    }
})

const { reducer } = chatsSlice;

export default reducer;
