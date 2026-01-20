import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";

const initialState = {

    isTable: false,

    unCompleted: {
        debtors: [],
        students: [],
        leads: []
    },

    completed: {
        debtors: [],
        students: [],
        leads: []
    },


    profile: {},


    newStudents: [],
    completedNewStudents: [],
    debtorStudent: [],
    completedDebtorStudent: [],
    leads: [],
    completedLeads: [],



    progress: null,
    allProgress: null,

    search: [],


    searchStatus: "idle",
    newStudentsStatus: "idle",
    debtorStudentStatus: "idle",
    leadsStatus: "idle",

    progressStatus: "idle",
    unCompletedStatus: "idle",
    completedStatus: "idle",
    profileStatus: "idle",

    callStatus: "idle",
    callState: "idle",
    callId: null,
    audioId: null,
    message: null
}

export const fetchNewStudentsData = createAsyncThunk(
    'taskManager/fetchNewStudentsData',
    async (id) => {
        const { request } = useHttp();
        return await request(`${BackUrl}student/task_new_students_calling/${id}`, "GET", null, headers())
    }
)



// export const fetchCompletedDebtorsData = createAsyncThunk(
//     'taskManager/fetchCompletedDebtorsData',
//     async (id) => {
//         const {request} = useHttp();
//         return await request(`${BackUrl}student/get_completed_tasks/${id}`, "GET", null, headers())
//     }
// )


export const fetchDebtorsData = createAsyncThunk(
    'taskManager/fetchDebtorStudentsData',
    async (data) => {

        const { locationId, date } = data

        const { request } = useHttp();
        return await request(`${BackUrl}task_debts/student_debts_progress/${locationId}/${date}`, "GET", null, headers())
    }
)

export const fetchCompletedDebtorsData = createAsyncThunk(
    'taskManager/fetchCompletedDebtorsData',
    async (data) => {

        const { locationId, date } = data

        const { request } = useHttp();
        return await request(`${BackUrl}task_debts/student_debts_completed/${locationId}/${date}`, "GET", null, headers())
    }
)


export const fetchNewStudentsTaskData = createAsyncThunk(
    'taskManager/fetchNewStudentsTaskData',
    async (data) => {
        const { locationId, date } = data
        const { request } = useHttp();

        return await request(`${BackUrl}task_new_students/task_new_students/${locationId}/${date}`, "GET", null, headers())
    }
)

export const fetchCompletedNewStudentsTaskData = createAsyncThunk(
    'taskManager/fetchCompletedNewStudentsTaskData',
    async (data) => {
        const { locationId, date } = data
        const { request } = useHttp();

        return await request(`${BackUrl}task_new_students/completed_new_students/${locationId}/${date}`, "GET", null, headers())
    }
)


export const fetchLeadsData = createAsyncThunk(
    'taskManager/fetchLeadsData',
    async (data) => {
        const { locationId, date } = data
        const { request } = useHttp();

        return await request(`${BackUrl}task_leads/task_leads/${locationId}/${date}`, "GET", null, headers())
    }
)

export const fetchCompletedLeadsData = createAsyncThunk(
    'taskManager/fetchCompletedLeadsData',
    async (data) => {
        const { locationId, date } = data
        const { request } = useHttp();

        return await request(`${BackUrl}task_leads/completed_leads/${locationId}/${date}`, "GET", null, headers())
    }
)

export const fetchUserDataWithHistory = createAsyncThunk(
    'taskManager/fetchUserDataWithHistory',
    async ({ url }) => {

        const { request } = useHttp();
        return await request(`${BackUrl}${url}`, "GET", null, headers())
    }
)

const TaskManagerSlice = createSlice({
    name: 'taskManager',
    initialState,
    reducers: {
        fetchingItems: (state) => {
            state.tasksLoadingStatus = "loading"
        },
        changeNewStudents: (state, action) => {
            state.newStudents = [
                ...state.newStudents.filter(item => item.id !== action.payload.student.id),
                action.payload.student.info
            ]
        },
        onDelNewStudents: (state, action) => {
            state.unCompleted.students = state.unCompleted.students.filter(item => item.id !== action.payload.id)
        },

        // changeDebtorStudents: (state, action) => {
        //     state.debtorStudent = [
        //         ...state.debtorStudent.filter(item => item.id !== action.payload.student.id),
        //         action.payload.student
        //     ]
        // },

        onDelLeads: (state, action) => {
            state.unCompleted.leads = state.unCompleted.leads.filter(item => item.id !== action.payload.id)
        },


        onDelDebtors: (state, action) => {
            if (action.payload.type === "debtors") {
                state.unCompleted.debtors = [...state.unCompleted.debtors.filter(item => item.student !== action.payload.id)]
            } else {
                state.unCompleted.students = [...state.unCompleted.students.filter(item => item.id !== action.payload.id)]
            }

            console.log(action.payload.id)
        },

        onChangeProgress: (state, action) => {
            state.progress = action.payload.progress
            state.allProgress = action.payload.allProgress
        },

        callStart: (state, action) => {
            state.callStatus = action.payload.callStatus
            state.callState = action.payload.callState
            state.callId = action.payload.callId
            state.audioId = action.payload.audioId
            state.message = action.payload.message
        }

    },
    extraReducers: builder => {
        builder

            // Debtors data
            .addCase(fetchDebtorsData.pending, (state) => {
                state.unCompletedStatus = "loading"
                state.progressStatus = "loading"
            })
            .addCase(fetchDebtorsData.fulfilled, (state, action) => {
                state.unCompleted.debtors = action.payload.students || []
                state.allProgress = action.payload.task_daily_statistics
                state.progress = action.payload.task_statistics
                state.isTable = action.payload.table
                state.unCompletedStatus = "success"
                state.progressStatus = "success"
            })
            .addCase(fetchDebtorsData.rejected, (state) => {
                state.unCompletedStatus = "error"
                state.progressStatus = "error"
            })

            .addCase(fetchCompletedDebtorsData.pending, (state) => {
                state.completedStatus = "loading"
                state.progressStatus = "loading"
            })
            .addCase(fetchCompletedDebtorsData.fulfilled, (state, action) => {
                state.completed.debtors = action.payload.records || []
                state.allProgress = action.payload.task_daily_statistics
                state.progress = action.payload.task_statistics
                state.isTable = action.payload.table
                state.completedStatus = "success"
                state.progressStatus = "success"
            })
            .addCase(fetchCompletedDebtorsData.rejected, (state) => {
                state.completedStatus = "error"
                state.progressStatus = "error"
            })



            // New students data

            .addCase(fetchNewStudentsTaskData.pending, (state) => {
                state.unCompletedStatus = "loading"
                state.progressStatus = "loading"
            })
            .addCase(fetchNewStudentsTaskData.fulfilled, (state, action) => {
                state.unCompleted.students = action.payload.students || []
                state.allProgress = action.payload.task_daily_statistics
                state.progress = action.payload.task_statistics
                state.isTable = action.payload.table || false
                state.unCompletedStatus = "success"
                state.progressStatus = "success"
            })
            .addCase(fetchNewStudentsTaskData.rejected, (state) => {
                state.unCompletedStatus = "error"
                state.progressStatus = "error"
            })


            .addCase(fetchCompletedNewStudentsTaskData.pending, (state) => {
                state.completedStatus = "loading"
                state.progressStatus = "loading"
            })
            .addCase(fetchCompletedNewStudentsTaskData.fulfilled, (state, action) => {
                state.completed.students = action.payload.records || []
                state.allProgress = action.payload.task_daily_statistics
                state.progress = action.payload.task_statistics
                state.isTable = action.payload.table || false
                state.completedStatus = "success"
                state.progressStatus = "success"
            })
            .addCase(fetchCompletedNewStudentsTaskData.rejected, (state) => {
                state.completedStatus = "error"
                state.progressStatus = "error"
            })



            // New leads data

            .addCase(fetchLeadsData.pending, (state) => {
                state.unCompletedStatus = "loading"
                state.progressStatus = "loading"
            })
            .addCase(fetchLeadsData.fulfilled, (state, action) => {
                state.unCompleted.leads = action.payload.leads || []
                state.allProgress = action.payload.task_daily_statistics
                state.progress = action.payload.task_statistics
                state.isTable = action.payload.table || false
                state.unCompletedStatus = "success"
                state.progressStatus = "success"
            })
            .addCase(fetchLeadsData.rejected, (state) => {
                state.unCompletedStatus = "error"
                state.progressStatus = "error"
            })


            .addCase(fetchCompletedLeadsData.pending, (state) => {
                state.completedStatus = "loading"
                state.progressStatus = "loading"
            })
            .addCase(fetchCompletedLeadsData.fulfilled, (state, action) => {
                state.completed.leads = action.payload.lead_infos || []
                state.allProgress = action.payload.task_daily_statistics
                state.progress = action.payload.task_statistics
                state.isTable = true
                state.completedStatus = "success"
                state.progressStatus = "success"
            })
            .addCase(fetchCompletedLeadsData.rejected, (state) => {
                state.completedStatus = "error"
                state.progressStatus = "error"
            })



            //
            // .addCase(fetchCompletedDebtorsData.pending, (state) => {
            //     state.completedStatus = "loading"
            //     state.progressStatus = "loading"
            // })
            // .addCase(fetchCompletedDebtorsData.fulfilled, (state, action) => {
            //     state.completed.debtors = action.payload.students || []
            //     state.allProgress = action.payload.task_daily_statistics
            //     state.progress = action.payload.task_statistics
            //     state.isTable = action.payload.table
            //     state.completedStatus = "success"
            //     state.progressStatus = "success"
            // })
            // .addCase(fetchCompletedDebtorsData.rejected, (state) => {
            //     state.completedStatus = "error"
            //     state.progressStatus = "error"
            // })


            .addCase(fetchUserDataWithHistory.pending, (state) => {
                state.profileStatus = "loading"
            })
            .addCase(fetchUserDataWithHistory.fulfilled, (state, action) => {
                state.profile = { ...action.payload.info, comments: action.payload.comments, invitations: action.payload.invitations }
                state.profileStatus = "success"
            })
            .addCase(fetchUserDataWithHistory.rejected, (state) => {
                state.profileStatus = "error"
            })




        // .addCase(fetchNewStudentsData.pending, (state) => {
        //     state.profileStatus = "loading"
        // })
        // .addCase(fetchNewStudentsData.fulfilled, (state, action) => {
        //     state.profile = action.payload
        //     state.profileStatus = "success"
        // })
        // .addCase(fetchNewStudentsData.rejected, (state) => {
        //     state.profileStatus = "error"
        // })
        //





        // .addCase(fetchLeadsData.pending, (state) => {
        //     state.leadsStatus = "loading"
        // })
        // .addCase(fetchLeadsData.fulfilled, (state, action) => {
        //     state.leads = action.payload.leads
        //     state.completedLeads = action.payload.completed_tasks
        //     state.leadsStatus = "success"
        // })
        // .addCase(fetchLeadsData.rejected, (state) => {
        //     state.leadsStatus = "error"
        // })



    }
})

const { actions, reducer } = TaskManagerSlice
export default reducer

export const {
    fetchingItems,

    changeLead,
    deleteLead,
    fetchedError,
    changeNewStudents,
    changeNewStudentsDel,
    fetchingProgress,
    fetchedProgress,
    fetchedProgressError,
    fetchingSearch,
    fetchedSearch,


    onDelLeads,
    onChangeProgress,
    onDelDebtors,
    onDelNewStudents,

    callStart
} = actions