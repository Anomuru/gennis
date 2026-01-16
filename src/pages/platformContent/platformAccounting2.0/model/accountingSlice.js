import { createSlice } from "@reduxjs/toolkit";
import { fetchAccounting } from "pages/platformContent/platformAccounting2.0/model/accountingThunk";


const savedValue = localStorage.getItem("selectedValue");
const savedName = localStorage.getItem("selectedName");

const initialState = {
    // data: {
    //     book_overheads: [{
    //         date: "2024-04-05",
    //         day: "962",
    //         id: 1,
    //         month: "39",
    //         name: "Kitobchiga pul",
    //         price: 10000,
    //         reason: "",
    //         type: "book_payments",
    //         typePayment: "click",
    //         year: "4"
    //     }
    //     ],
    //     book_payments: [
    //         {
    //             date: "2024-04-05",
    //             day: "962",
    //             id: 1,
    //             month: "39",
    //             name: "Kitobchiga pul",
    //             price: 10000,
    //             reason: "",
    //             type: "book_payments",
    //             typePayment: "click",
    //             year: "4"
    //         }
    //
    //     ],
    // },
    data: [],
    loading: false,
    error: null,
    selectOptions: [
        { value: "studentsPayments", name: "O'quvchilar tolovlari", disabled: false },
        { value: "bookPayment", name: "Kitob tolovlari", disabled: false },
        { value: "teachersSalary", name: "O'qituvchilar oyligi", disabled: false },
        { value: "employeesSalary", name: "Ishchilar oyligi", disabled: false },
        { value: "studentsDiscounts", name: "O'quvchilar chegirmalari", disabled: false },
        { value: "debtStudents", name: "Qarzdor o'quvchilar", disabled: false },
        { value: "overhead", name: "Qo'shimcha xarajatlar", disabled: false },
        { value: "capital", name: "Kapital xarajatlari", disabled: false },
        { value: "investments", name: "Invistitsiya", disabled: false },
        { value: "dividends", name: "Dividends", disabled: false },
        { value: "prepayment", name: "Prepayments", disabled: false }
    ],
    selectedValue: savedValue || "studentsPayments",
    selectedName: savedName || "O'quvchilar tolovlari",
    totalCount: null,
    overhead_tools: [],
    capital_tools: []
};


if (savedValue) {
    initialState.selectOptions = initialState.selectOptions.map(item => ({
        ...item,
        disabled: item.value === savedValue
    }));
}

const newAccountingSlice = createSlice({
    name: "newAccountingSlice",
    initialState,
    reducers: {
        onChangeAccountingPage: (state, action) => {
            const selected = state.selectOptions.find(item => item.value === action.payload);


            state.selectOptions = state.selectOptions.map(item => ({
                ...item,
                disabled: item.value === action.payload
            }));


            if (selected) {
                state.selectedValue = selected.value;
                state.selectedName = selected.name;


                localStorage.setItem("selectedValue", selected.value);
                localStorage.setItem("selectedName", selected.name);
            }
        },
        onDeleteItem: (state, action) => {

            state.data = state.data.filter(item => item.id !== action.payload)
        },
        changePaymentType: (state, action) => {
            const { id, typePayment } = action.payload;


            const found = state.data.find(item => item.id === id);
            if (!found || found.typePayment === typePayment) {
                return;
            }


            state.data = state.data.map(item =>
                item.id === id ? { ...item, typePayment } : item
            );
        },
        onAddItem: (state, action) => {
            state.data = [action.payload, ...state.data]
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchAccounting.pending, state => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchAccounting.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.data = action.payload.data.data;
                state.totalCount = action?.payload?.data?.pagination;
                state.capital_tools = action?.payload?.data?.capital_tools
                state.overhead_tools = action?.payload?.data?.overhead_tools

            })
            .addCase(fetchAccounting.rejected, state => {
                state.loading = false;
                state.error = true;
            })
});

const { actions, reducer } = newAccountingSlice;
export default reducer;
export const { onChangeAccountingPage, onDeleteItem, onAddItem, changePaymentType } = actions;
