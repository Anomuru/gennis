import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {

    studentAtt : {
        attendances: [
            // {
            //     student_name: "Ulug'bek",
            //     student_surname: "Fatxullayev",
            //     dates: ["True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True",]
            // },
            // {
            //     student_name: "Ulug'bek",
            //     student_surname: "Fatxullayev",
            //     dates: ["True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True",]
            // },
            // {
            //     student_name: "Ulug'bek",
            //     student_surname: "Fatxullayev",
            //     dates: ["True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True",]
            // },
        ],
        dates: [
            // "01","02","03"
        ],
        students: [],
        date: []
    },
    groupAtt: {
        attendance_filter: [
            // {
            //     student_name: "Ulug'bek",
            //     student_surname: "Fatxullayev",
            //     dates: ["True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True",]
            // },
            // {
            //     student_name: "Ulug'bek",
            //     student_surname: "Fatxullayev",
            //     dates: ["True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True",]
            // },
            // {
            //     student_name: "Ulug'bek",
            //     student_surname: "Fatxullayev",
            //     dates: ["True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True","True","False","True","Empty","True",]
            // },
        ],
        dates: [
            // "01","02","03"
        ],
        students: []
    },

    groupDates: {
        months: [],
        years: []
    },
    studentDates: {
        months: [],
        years: []
    },

    fetchAttendancesStatus: "idle",
}


export const  fetchAttendances = createAsyncThunk(
    'attendancesSlice/fetchAttendances',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}attendances/${id}`,"GET",null,headers())
    }
)


export const  fetchGroupDates = createAsyncThunk(
    'attendancesSlice/fetchGroupDates',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}group_dates2/${id}`,"GET",null,headers())
    }
)

export const  fetchAttendancesStudent = createAsyncThunk(
    'attendancesSlice/fetchAttendancesStudent',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}combined_attendances/${id}`,"GET",null,headers())
    }
)

export const  fetchStudentGroupDates = createAsyncThunk(
    'attendancesSlice/fetchStudentGroupDates',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}student_group_dates2/${id}`,"GET",null,headers())
    }
)


const attendancesSlice = createSlice({
    name: "attendancesSlice",
    initialState,
    reducers:{
        setFilteredAttendances: (state,action) => {
            state.groupAtt.attendance_filter = action.payload.data
        },
        setStudentFilteredAttendances: (state,action) => {
            state.studentAtt = action.payload.data
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAttendances.pending,state => {state.fetchAttendancesStatus = 'loading'} )
            .addCase(fetchAttendances.fulfilled,(state, action) => {
                state.fetchAttendancesStatus = 'success';
                state.groupAtt = action.payload.data
            })
            .addCase(fetchAttendances.rejected,state => {state.fetchAttendancesStatus = 'error'})


            .addCase(fetchGroupDates.fulfilled,(state, action) => {
                state.fetchAttendancesStatus = 'success';
                state.groupDates = action.payload.data
            })



            .addCase(fetchAttendancesStudent.pending,state => {state.fetchAttendancesStatus = 'loading'} )
            .addCase(fetchAttendancesStudent.fulfilled,(state, action) => {
                state.fetchAttendancesStatus = 'success';
                state.studentAtt = action.payload.data
            })
            .addCase(fetchAttendancesStudent.rejected,state => {state.fetchAttendancesStatus = 'error'})


            .addCase(fetchStudentGroupDates.fulfilled,(state, action) => {
                state.fetchAttendancesStatus = 'success';
                state.studentDates = action.payload.data
            })

    }
})



const {actions,reducer} = attendancesSlice;

export default reducer

export const {setFilteredAttendances,setStudentFilteredAttendances} = actions

