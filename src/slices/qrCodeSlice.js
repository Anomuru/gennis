import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";


const initialState = {
    students: [],
    btns: [],
    fetchQrCodeStudentsStatus: "idle",
}


export const  fetchQrCodeStudents = createAsyncThunk(
    'qrCodeSlice/fetchQrCodeStudents',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}qr_students`,"GET",null,headers())
    }
)





const qrCodeSlice = createSlice({
    name: "qrCodeSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchQrCodeStudents.pending,state => {state.fetchQrCodeStudentsStatus = 'loading'} )
            .addCase(fetchQrCodeStudents.fulfilled,(state, action) => {
                state.fetchQrCodeStudentsStatus = 'success';
                state.students = action.payload.students
            })
            .addCase(fetchQrCodeStudents.rejected,state => {state.fetchQrCodeStudentsStatus = 'error'} )
    }
})



const {actions,reducer} = qrCodeSlice;

export default reducer

// export const {} = actions

