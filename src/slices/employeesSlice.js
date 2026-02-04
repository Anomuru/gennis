import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";

const initialState = {
    employees: [],
    btns: [],
    fetchEmployeesStatus: "idle",
    totalCount: null
}


export const fetchEmployees = createAsyncThunk(
    'employeesSlice/fetchEmployees',
    async ({ locationId, pageSize, currentPage, search, currentFilters }) => {
        const { request } = useHttp();

        return await request(`${BackUrl}account/employees/${locationId}${pageSize ? `?offset=${(currentPage - 1) * 50}&limit=${pageSize}` : ""}${search ? `&search=${search}` : ""}${currentFilters.job ? `&job=${currentFilters.job}` : ""}${currentFilters.language ? `&language=${currentFilters.language}` : ""}`, "GET", null, headers())
    }
)

export const fetchDeletedEmployees = createAsyncThunk(
    'employeesSlice/fetchDeletedEmployees',
    async ({ locationId, pageSize, currentPage, search, currentFilters }) => {
        const { request } = useHttp();

        return await request(`${BackUrl}account/employees/${locationId}/deleted${pageSize ? `?offset=${(currentPage - 1) * 50}&limit=${pageSize}` : ""}${search ? `&search=${search}` : ""}${currentFilters.job ? `&job=${currentFilters.job}` : ""}${currentFilters.language ? `&language=${currentFilters.language}` : ""}`, "GET", null, headers())
    }
)

export const fetchEmployersDataWithoutPagination = createAsyncThunk(
    'employeesSlice/fetchEmployersDataWithoutPagination',
    async ({ locationId, level }) => {
        const { request } = useHttp();

        return await request(`${BackUrl}account/employees/${locationId}?level=${level}`, "GET", null, headers())
    }
)








const employeesSlice = createSlice({
    name: "employeesSlice",
    initialState,
    reducers: {
        deleteStaff: (state, action) => {
            state.employees = state.employees.filter(item => item.id !== action.payload.id)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchEmployees.pending, state => { state.fetchEmployeesStatus = 'loading' })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.fetchEmployeesStatus = 'success';
                state.employees = action.payload.data
                state.totalCount = action.payload?.pagination
            })
            .addCase(fetchEmployees.rejected, state => { state.fetchEmployeesStatus = 'error' })

            .addCase(fetchEmployersDataWithoutPagination.pending, state => { state.fetchEmployeesStatus = 'loading' })
            .addCase(fetchEmployersDataWithoutPagination.fulfilled, (state, action) => {
                state.fetchEmployeesStatus = 'success';
                state.employees = action.payload.data
                // state.totalCount = action.payload?.pagination
            })
            .addCase(fetchEmployersDataWithoutPagination.rejected, state => { state.fetchEmployeesStatus = 'error' })

            .addCase(fetchDeletedEmployees.pending, state => { state.fetchEmployeesStatus = 'loading' })
            .addCase(fetchDeletedEmployees.fulfilled, (state, action) => {
                state.fetchEmployeesStatus = 'success';
                state.employees = action.payload.data
                state.totalCount = action.payload?.pagination

            })
            .addCase(fetchDeletedEmployees.rejected, state => { state.fetchEmployeesStatus = 'error' })
    }
})



const { actions, reducer } = employeesSlice;

export default reducer

export const { deleteStaff } = actions

