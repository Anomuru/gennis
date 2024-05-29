import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    data: {
        debts: [],
        payments: [],
    },
    btns: [],
    fetchAccDataStatus: "idle",
}


export const  fetchStudentAccData = createAsyncThunk(
    'studentAccountSlice/fetchStudentAccData',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}student_attendance_info/${id}`,"GET",null,headers())
    }
)





const studentAccountSlice = createSlice({
    name: "studentAccountSlice",
    initialState,
    reducers: {
        deletePayment: (state,action) => {

            if (action.payload.data.type === "payments") {
                state.data.payments = state.data.payments.filter(item => item.id !== action.payload.data.id)
            }
            if (action.payload.data.type === "discounts") {
                state.data.discounts = state.data.discounts.filter(item => item.id !== action.payload.data.id)
            }
            if (action.payload.data.type === "bookPayment") {
                state.data.bookPayments = state.data.bookPayments.filter(item => item.id !== action.payload.data.id)
            }
        },
        changePaymentType: (state,action) => {
            state.data.payments = state.data.payments.map(item => {
                if (item.id === action.payload.id) {
                    return {...item, type_payment: action.payload.typePayment}
                }
                return item
            })
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



const {actions,reducer} = studentAccountSlice;

export default reducer

export const {deletePayment,changePaymentType} = actions

