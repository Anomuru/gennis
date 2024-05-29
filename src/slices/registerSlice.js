import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    data: null,
    fetchDataStatus: "idle",
    postDataStatus: "idle",
}



export const fetchData = createAsyncThunk(
    'registerSlice/fetchData',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}register`,"GET",null)
    }
)




const registerSlice = createSlice({
    name: "registerSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchData.pending,state => {state.fetchDataStatus = 'loading'} )
            .addCase(fetchData.fulfilled,(state, action) => {
                state.fetchDataStatus = 'success';
                state.data = action.payload.data
            })
            .addCase(fetchData.rejected,state => {state.fetchDataStatus = 'error'})
    }
})

const {actions,reducer} = registerSlice;

export default reducer

export const {} = actions



