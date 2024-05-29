import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    admins: [],
    btns: [],
    fetchAdminsStatus: "idle",
}


export const  fetchAdmins = createAsyncThunk(
    'adminsSlice/fetchAdmins',
    async () => {
        const {request} = useHttp();

        return await request(`${BackUrl}admins`,"GET",null,headers())
    }
)





const adminsSlice = createSlice({
    name: "adminsSlice",
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder
            .addCase(fetchAdmins.pending,state => {state.fetchAdminsStatus = 'loading'} )
            .addCase(fetchAdmins.fulfilled,(state, action) => {
                state.fetchAdminsStatus = 'success';
                state.admins = action.payload.admins
            })
            .addCase(fetchAdmins.rejected,state => {state.fetchAdminsStatus = 'error'} )
    }
})



const {actions,reducer} = adminsSlice;

export default reducer

// export const {} = actions

