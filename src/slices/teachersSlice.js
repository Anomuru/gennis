import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    teachers: [],
    btns: [],
    fetchTeachersStatus: "idle",
}


export const  fetchTeachers = createAsyncThunk(
    'teachersSlice/fetchTeachers',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_teachers`,"GET",null,headers())
    }
)
export const  fetchTeachersByLocation = createAsyncThunk(
    'teachersSlice/fetchTeachersByLocation',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_teachers_location/${id}`,"GET",null,headers())
    }
)

export const  fetchDeletedTeachersByLocation = createAsyncThunk(
    'teachersSlice/fetchDeletedTeachersByLocation',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_deletedTeachers_location/${id}`,"GET",null,headers())
    }
)



const teachersSlice = createSlice({
    name: "teachersSlice",
    initialState,
    reducers: {
        deleteTeacher: (state,action) => {
            state.teachers = state.teachers.filter(item => item.id !== action.payload.id)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTeachers.pending,state => {state.fetchTeachersStatus = 'loading'} )
            .addCase(fetchTeachers.fulfilled,(state, action) => {
                state.fetchTeachersStatus = 'success';
                state.teachers = action.payload.teachers
            })
            .addCase(fetchTeachers.rejected,state => {state.fetchTeachersStatus = 'error'} )

            .addCase(fetchTeachersByLocation.pending,state => {state.fetchTeachersStatus = 'loading'} )
            .addCase(fetchTeachersByLocation.fulfilled,(state, action) => {
                state.fetchTeachersStatus = 'success';
                state.teachers = action.payload.teachers
            })
            .addCase(fetchTeachersByLocation.rejected,state => {state.fetchTeachersStatus = 'error'} )


            .addCase(fetchDeletedTeachersByLocation.pending,state => {state.fetchTeachersStatus = 'loading'} )
            .addCase(fetchDeletedTeachersByLocation.fulfilled,(state, action) => {
                state.fetchTeachersStatus = 'success';
                state.teachers = action.payload.teachers
            })
            .addCase(fetchDeletedTeachersByLocation.rejected,state => {state.fetchTeachersStatus = 'error'} )
    }
})



const {actions,reducer} = teachersSlice;

export default reducer

export const {deleteTeacher} = actions

