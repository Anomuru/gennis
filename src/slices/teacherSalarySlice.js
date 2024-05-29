import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers, ROLES} from "constants/global";

const initialState = {
    locationMonths: [],
    selectedMonth: {},

    fetchEmployeeSalaryStatus: "idle",
}



export const  fetchEmployeeSalary = createAsyncThunk(
    'teacherSalary/fetchTeacherSalary',
    async (data) => {
        const {request} = useHttp();
        const {userId,locationId} = data
        return await request(`${BackUrl}teacher_salary/${userId}/${locationId}`,"GET",null,headers())
    }
)
export const  fetchEmployeeSalaryMonth = createAsyncThunk(
    'teacherSalary/fetchTeacherSalaryMonth',
    async (data) => {
        const {monthId,userId} = data

        console.log("id", userId)
        const {request} = useHttp();
        return await request(`${BackUrl}teacher_salary_inside/${monthId}/${userId}`,"GET",null,headers())
    }
)

export const fetchDeletedEmployeeSalaryMonth = createAsyncThunk(
    'teacherSalary/fetchDeletedEmployeeSalaryMonth',
    async (data) => {
        const {monthId,userId} = data

        console.log("id", userId)
        const {request} = useHttp();
        return await request(`${BackUrl}teacher_salary_deleted_inside/${monthId}/${userId}`,"GET",null,headers())
    }
)


const meSlice = createSlice({
    name: "teacherSalary",
    initialState,
    reducers: {

        changePaymentType: (state,action) => {
            state.selectedMonth.data = state.selectedMonth.data.map(item => {
                console.log("id" ,action.payload.id )
                if (item.id === action.payload.id) {
                    return {...item, payment_type: action.payload.typePayment}
                }
                return item
            })

        },
        removeUser(state) {
            sessionStorage.removeItem('token');
            state.id = null;
            state.username = null;
            state.role = null
        },

    },
    extraReducers: builder => {
        builder

            .addCase(fetchEmployeeSalary.pending, state => {state.fetchEmployeeSalaryStatus = 'loading'} )
            .addCase(fetchEmployeeSalary.fulfilled,(state, action) => {
                state.fetchEmployeeSalaryStatus = 'success';
                console.log(action.payload.data)
                state.locationMonths = action.payload.data

            })
            .addCase(fetchEmployeeSalary.rejected, state => {state.fetchEmployeeSalaryStatus = 'error';state.isCheckedPassword = true} )

            .addCase(fetchDeletedEmployeeSalaryMonth.pending, state => {state.fetchEmployeeSalaryStatus = 'loading'} )
            .addCase(fetchDeletedEmployeeSalaryMonth.fulfilled,(state, action) => {
                state.fetchEmployeeSalaryStatus = 'success';
                state.selectedMonth = action.payload.data

            })
            .addCase(fetchDeletedEmployeeSalaryMonth.rejected, state => {state.fetchEmployeeSalaryStatus = 'error';state.isCheckedPassword = true} )


            .addCase(fetchEmployeeSalaryMonth.pending, state => {state.fetchEmployeeSalaryStatus = 'loading'} )
            .addCase(fetchEmployeeSalaryMonth.fulfilled,(state, action) => {
                state.fetchEmployeeSalaryStatus = 'success';
                state.selectedMonth = action.payload.data
            })
            .addCase(fetchEmployeeSalaryMonth.rejected, state => {state.fetchEmployeeSalaryStatus = 'error';state.isCheckedPassword = true} )


            .addDefaultCase(()=> {})
    }
})



const {actions,reducer} = meSlice;

export default reducer

export const {
    changePaymentType
} = actions




