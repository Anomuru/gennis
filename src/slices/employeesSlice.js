import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    employees: [],
    btns: [],
    fetchEmployeesStatus: "idle",
}


export const  fetchEmployees = createAsyncThunk(
    'employeesSlice/fetchEmployees',
    async (loc) => {
        const {request} = useHttp();

        return await request(`${BackUrl}employees/${loc}`,"GET",null,headers())
    }
)

export const  fetchDeletedEmployees = createAsyncThunk(
    'employeesSlice/fetchDeletedEmployees',
    async (loc) => {
        const {request} = useHttp();

        return await request(`${BackUrl}employees/${loc}/deleted`,"GET",null,headers())
    }
)








const employeesSlice = createSlice({
    name: "employeesSlice",
    initialState,
    reducers: {
        deleteStaff: (state,action) => {
            state.employees = state.employees.filter(item => item.id !== action.payload.id)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchEmployees.pending,state => {state.fetchEmployeesStatus = 'loading'} )
            .addCase(fetchEmployees.fulfilled,(state, action) => {
                state.fetchEmployeesStatus = 'success';
                state.employees = action.payload.data
            })
            .addCase(fetchEmployees.rejected,state => {state.fetchEmployeesStatus = 'error'} )

            .addCase(fetchDeletedEmployees.pending,state => {state.fetchEmployeesStatus = 'loading'} )
            .addCase(fetchDeletedEmployees.fulfilled,(state, action) => {
                state.fetchEmployeesStatus = 'success';
                state.employees = action.payload.data
            })
            .addCase(fetchDeletedEmployees.rejected,state => {state.fetchEmployeesStatus = 'error'} )
    }
})



const {actions,reducer} = employeesSlice;

export default reducer

export const {deleteStaff} = actions

