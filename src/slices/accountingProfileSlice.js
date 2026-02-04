import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";

const initialState = {
    current_year: null,
    current_month: null,
    years: [],
    data: {},
    loading: false,
    error: null
}

// export const fetchAccountingProfileData = createAsyncThunk(
//     "accountingProfileSlice/fetchAccountingProfileData",
//     ({ locationId }) => {
//         const { request } = useHttp()
//         return request(`${BackUrl}`, "GET", null, headers())
//     }
// )

export const fetchAccountingProfileData = createAsyncThunk(
    "accountingProfileSlice/fetchAccountingProfileData",
    ({ URL_TYPE, locationId, year, month, type_salary }) => {
        const { request } = useHttp()
        return request(`${BackUrl}account/home/${URL_TYPE}/?location_id=${locationId}&month=${month}&year=${year}${type_salary ? `&type_salary=${type_salary}` : ""}`, "GET", null, headers())
    }
)


const accountingProfileSlice = createSlice({
    name: "accountingProfileSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchAccountingProfileData.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAccountingProfileData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchAccountingProfileData.rejected, (state) => {
                state.error = "Xatolik yuz berdi"
                state.loading = false
            })
    }
})


const { actions, reducer } = accountingProfileSlice;

export default reducer

export const {

} = actions






