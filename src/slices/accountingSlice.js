import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    data: {
        typeOfMoney: "",
        data: [],
        collection: []
    },
    location: null,

    collection: {
        data: []
    },
    history: {
        data: []
    },


    search: "",
    btns: [
        {
            id: 1,
            type: "btn",
            name: "deleted",
            title: "O'chirilgan",
            active: false,
            // page: "studentsPayments"
        },
        {
            id: 2,
            type: "btn",
            name: "archive",
            title: "Arxiv",
            active: false,
            // page: "studentsPayments"
        },
        {
            id: 3,
            type: "btn",
            name: "overhead",
            title: "Qo'shish",
            active: false,
            page: "overhead"
        },
        {
            id: 4,
            type: "btn",
            name: "capital",
            title: "Qo'shish",
            active: false,
            page: "capital"
        }
    ],

    pages: [
        {
            value: "studentsPayments",
            name: "O'quvchilar tolovlari",
            disabled: true
        },
        {
            value: "bookPayment",
            name: "Kitob tolovlari",
            disabled: false
        },
        {
            value: "teachersSalary",
            name: "O'qituvchilar oyligi",
            disabled: false
        },
        {
            value: "employeesSalary",
            name: "Ishchilar oyligi",
            disabled: false
        },
        {
            value: "studentsDiscounts",
            name: "O'quvchilar chegirmalari",
            disabled: false
        },
        {
            value: "debtStudents",
            name: "Qarzdor o'quvchilar",
            disabled: false
        },
        {
            value: "overhead",
            name: "Qo'shimcha xarajatlar",
            disabled: false
        },
        {
            value: "capital",
            name: "Kapital xarajatlari",
            disabled: false
        }
    ],

    fetchedDataType: "",
    fetchAccDataStatus: "idle",
}


export const fetchAccData = createAsyncThunk(
    'accountingSlice/fetchAccData',
    async (data) => {
        const {isArchive} = data
        const {request} = useHttp();
        return await request(`${BackUrl}account_info/${isArchive ? "archive" : ""}`, "POST", JSON.stringify(data), headers())
    }
)

export const fetchDeletedAccData = createAsyncThunk(
    'accountingSlice/fetchDeletedAccData',
    async (data) => {
        const {isArchive} = data
        const {request} = useHttp();
        return await request(`${BackUrl}account_info_deleted/${isArchive ? "archive" : ""}`, "POST", JSON.stringify(data), headers())
    }
)


export const fetchCollection = createAsyncThunk(
    'accountingSlice/fetchCollection',
    async (data) => {
        const {locationId, date, activeFilter} = data
        const {request} = useHttp();
        return await request(`${BackUrl}account_details/${locationId}`, "POST", JSON.stringify({
            ...date,
            activeFilter
        }), headers())
    }
)

export const fetchHistoryAccountingPost = createAsyncThunk(
    'accountingSlice/fetchHistoryAccountingPost',
    async (data) => {
        const {locationId, activeFilter, year} = data
        const {request} = useHttp();
        return await request(`${BackUrl}account_history/${locationId}`, "POST", JSON.stringify({
            activeFilter,
            year
        }), headers())
    }
)

export const fetchHistoryAccountingGet = createAsyncThunk(
    'accountingSlice/fetchHistoryAccountingGet',
    async (data) => {
        const {locationId} = data
        const {request} = useHttp();
        return await request(`${BackUrl}account_years/${locationId}`, "GET", null, headers())
    }
)

export const deleteAccData = createAsyncThunk(
    'accountingSlice/deleteAccData',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}accounting_delete/${id}`, "DELETE", null, headers())
    }
)


const accountingSlice = createSlice({
    name: "accountingSlice",
    initialState,
    reducers: {
        deleteAccDataItem: (state, action) => {
            state.data.data = state.data.data.filter(item => item.id !== action.payload.id)
        },
        setDisableOption: (state, action) => {
            state.btns = state.btns.map(item => {
                if (item.type === "select") {
                    const newOptions = item.options.map(option => {
                        if (option.value === action.payload.to) {
                            return {...option, disabled: true}
                        }
                        return {...option, disabled: false}
                    })
                    return {...item, options: newOptions}
                }
                return item
            })

        },
        changePaymentType: (state, action) => {
            state.data.data = state.data.data.map(item => {
                if (item.id === action.payload.id) {
                    return {...item, typePayment: action.payload.typePayment}
                }
                return item
            })
        },
        resetState: (state, action) => {
            state.data = {
                typeOfMoney: "",
                data: [],
                collection: []
            }
        },
        onChangeAccountingPage: (state, action) => {
            state.pages = state.pages.map(item => {
                if (item.value === action.payload.value) {
                    return {...item, disabled: true}
                }
                return {...item, disabled: false}
            })


        },

        onChangeAccountingBtns: (state, action) => {
            state.btns = state.btns.map(item => {
                if (item.id === action.payload.id) {
                    return {...item,active: !item.active}
                }
                return item
            })
        },
        onChangeAccountingSearch: (state, action) => {
            state.search = action.payload.value

        },
        onChangeFetchedDataType: (state, action) => {
            state.fetchedDataType = action.payload.type
        },
        clearAccData: (state,action) => {
            state.data = {
                typeOfMoney: "",
                data: [],
                collection: []
            }
        },


    },
    extraReducers: builder => {
        builder
            .addCase(fetchAccData.pending, state => {
                state.fetchAccDataStatus = 'loading'
            })
            .addCase(fetchAccData.fulfilled, (state, action) => {
                state.fetchAccDataStatus = 'success';
                state.data = action.payload.data;
                state.location = action.payload.location;
            })
            .addCase(fetchAccData.rejected, state => {
                state.fetchAccDataStatus = 'error'
            })

            .addCase(fetchDeletedAccData.pending, state => {
                state.fetchAccDataStatus = 'loading'
            })
            .addCase(fetchDeletedAccData.fulfilled, (state, action) => {
                state.fetchAccDataStatus = 'success';
                state.data = action.payload.data
            })
            .addCase(fetchDeletedAccData.rejected, state => {
                state.fetchAccDataStatus = 'error'
            })


            .addCase(fetchCollection.pending, state => {
                state.fetchAccDataStatus = 'loading'
            })
            .addCase(fetchCollection.fulfilled, (state, action) => {
                state.fetchAccDataStatus = 'success';
                state.collection = action.payload.data
            })
            .addCase(fetchCollection.rejected, state => {
                state.fetchAccDataStatus = 'error'
            })

            .addCase(fetchHistoryAccountingPost.pending, state => {
                state.fetchAccDataStatus = 'loading'
            })
            .addCase(fetchHistoryAccountingPost.fulfilled, (state, action) => {
                state.fetchAccDataStatus = 'success';
                state.history.data = action.payload.data
            })
            .addCase(fetchHistoryAccountingPost.rejected, state => {
                state.fetchAccDataStatus = 'error'
            })

            .addCase(fetchHistoryAccountingGet.pending, state => {
                state.fetchAccDataStatus = 'loading'
            })
            .addCase(fetchHistoryAccountingGet.fulfilled, (state, action) => {
                state.fetchAccDataStatus = 'success';
                state.history.years = action.payload.years
            })
            .addCase(fetchHistoryAccountingGet.rejected, state => {
                state.fetchAccDataStatus = 'error'
            })
    }
})


const {actions, reducer} = accountingSlice;

export default reducer

export const {
    onChangeFetchedDataType,
    onChangeAccountingPage,
    onChangeAccountingSearch,
    deleteAccDataItem,
    setDisableOption,
    changePaymentType,
    resetState,
    onChangeAccountingBtns,
    clearAccData
} = actions

