
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    locations: [],
    fetchLocationsStatus: false
}




export const fetchLocations = createAsyncThunk(
    'locationsSlice/fetchLocations',
    async () => {
        const {request} = useHttp();

        return await request(`${BackUrl}locations`,"GET",null)
    }
)



const locationsSlice = createSlice({
    name: "locationsSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchLocations.pending,state => {state.fetchLocationsStatus = 'loading'} )
            .addCase(fetchLocations.fulfilled,(state, action) => {
                state.fetchLocationsStatus = 'success';
                state.locations = action.payload.locations

            })
            .addCase(fetchLocations.rejected,state => {state.fetchLocationsStatus = 'error'} )

            .addDefaultCase(()=> {})
    }
})



const {actions,reducer} = locationsSlice;

export default reducer

export const {resetState,setActive,setFromToFilter,setSelectOption} = actions



