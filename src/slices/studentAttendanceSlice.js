import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    data: {
        present: [],
        absent: [],
    },
    btns: [],
    fetchAccDataStatus: "idle",
}


export const  fetchStudentAccData = createAsyncThunk(
    'studentAttendanceSlice/fetchStudentAccData',
    async (data) => {
        const {request} = useHttp();
        const {month,studentId,groupId,year} = data
        return await request(`${BackUrl}student_attendances/${studentId}/${groupId}/${year}-${month}`,"GET",null,headers())
    }
)





const studentAttendanceSlice = createSlice({
    name: "studentAttendanceSlice",
    initialState,
    reducers: {
        deleteAtt: (state,action) => {
            let newData
            if (action.payload.name === "present") {
                newData = state.data.present.filter(item => item.id !== action.payload.id)
                state.data.present = newData
            }
            if (action.payload.name === "absent") {
                newData = state.data.absent.filter(item => item.id !== action.payload.id)
                state.data.absent = newData
            }

        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchStudentAccData.pending,state => {state.fetchAccDataStatus = 'loading'} )
            .addCase(fetchStudentAccData.fulfilled,(state, action) => {
                state.fetchAccDataStatus = 'success';
                state.data = action.payload.data
            })
            .addCase(fetchStudentAccData.rejected,state => {state.fetchAccDataStatus = 'error'} )
    }
})



const {actions,reducer} = studentAttendanceSlice;

export default reducer

export const {deleteAtt} = actions

