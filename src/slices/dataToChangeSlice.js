import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    dataToChange: {},
    tools: [],
    locationMoneys: [],
    fetchDataStatus: "idle",
}

export const  fetchLocationMoney = createAsyncThunk(
    'dataToChangeSlice/fetchLocationMoney',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_location_money/${id}`,"GET",null,headers())
    }
)

export const  fetchDataToChange = createAsyncThunk(
    'dataToChangeSlice/fetchDataToChange',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}block_information2${id ? `/${id}` : ""}`,"GET",null,headers())
    }
)
export const  fetchDataTools = createAsyncThunk(
    'dataToChangeSlice/fetchDataTools',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}list_tools_info`,"GET",null,headers())
    }
)



const dataToChangeSlice = createSlice({
    name: "dataToChangeSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchDataToChange.pending,state => {state.fetchDataStatus = 'loading'} )
            .addCase(fetchDataToChange.fulfilled,(state, action) => {
                state.fetchDataStatus = 'success';
                state.dataToChange = action.payload.data
            })
            .addCase(fetchDataToChange.rejected,state => {state.fetchDataStatus = 'error'})

            .addCase(fetchLocationMoney.pending,state => {state.fetchDataStatus = 'loading'} )
            .addCase(fetchLocationMoney.fulfilled,(state, action) => {
                state.fetchDataStatus = 'success';
                state.locationMoneys = action.payload.data
            })
            .addCase(fetchLocationMoney.rejected,state => {state.fetchDataStatus = 'error'})

            .addCase(fetchDataTools.pending,state => {state.fetchDataStatus = 'loading'} )
            .addCase(fetchDataTools.fulfilled,(state, action) => {
                state.fetchDataStatus = 'success';
                state.tools = action.payload.tools
            })
            .addCase(fetchDataTools.rejected,state => {state.fetchDataStatus = 'error'})
    }
})



const {actions,reducer} = dataToChangeSlice;

export default reducer

// export const {} = actions

