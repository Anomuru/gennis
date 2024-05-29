import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    books: [],
    basketBooks: {
        old: [],
        new: []
    },
    debtLoc: null,
    orderedBooks: [],
    book: {},
    booksAcc: [],
    monthBooksAcc: [],
    booksOverhead: [],
    booksOverheadHistory: [],

    fetchBooksAccStatus: "idle",
    fetchBooksStatus: "idle",
    fetchBookStatus: "idle",
}


export const  fetchBooksOverheadData = createAsyncThunk(
    'booksSlice/fetchOverheadData',
    async (data) => {
        const {isArchive} = data
        const {request} = useHttp();
        return await request(`${BackUrl}book_overhead2/${isArchive ? "archive" : ""}`,"GET",null,headers())
    }
)

export const  fetchBooksAccData = createAsyncThunk(
    'booksSlice/fetchAccData',
    async (data) => {
        const {request} = useHttp();
        return await request(`${BackUrl}campus_account/${data.type}/${data.id ? data.id: ""}`,"GET",null,headers())
    }
)

export const  fetchMonthBooksAcc = createAsyncThunk(
    'booksSlice/fetchMonthBooksAcc',
    async (data) => {
        const {monthId} = data

        const {request} = useHttp();
        return await request(`${BackUrl}campus_account_inside/${monthId}`,"GET",null,headers())
    }
)



export const  fetchDeletedBooksOverheadData = createAsyncThunk(
    'booksSlice/fetchDeletedBooksOverheadData',
    async (data) => {
        const {isArchive} = data
        const {request} = useHttp();
        return await request(`${BackUrl}deleted_book_overhead2/${isArchive ? "archive" : ""}`,"GET",null,headers())
    }
)


export const  fetchHistoryOverheadBooks = createAsyncThunk(
    'booksSlice/fetchHistoryOverheadBooks',
    async () => {
        const {request} = useHttp();
        return await request(`${BackUrl}editor_balance_history2`,"GET",null,headers())
    }
)

export const  fetchBooks = createAsyncThunk(
    'booksSlice/fetchBooks',
    async () => {
        const {request} = useHttp();

        return await request(`${BackUrl}book`,"GET",null)
    }
)
export const  fetchBasketBooks = createAsyncThunk(
    'booksSlice/fetchBasketBooks',
    async () => {
        const {request} = useHttp();

        return await request(`${BackUrl}buy_book`,"GET",null,headers())
    }
)

export const  fetchOrderedBooks = createAsyncThunk(
    'booksSlice/fetchOrderedBooks',
    async (type) => {
        const {request} = useHttp();

        return await request(`${BackUrl}filtered_orders_books2/${type ? type : ""}`,"GET",null,headers())
    }
)


export const  fetchDeletedOrdersBooks = createAsyncThunk(
    'booksSlice/fetchDeletedOrdersBooks',
    async () => {
        const {request} = useHttp();

        return await request(`${BackUrl}deleted_orders`,"GET",null,headers())
    }
)


export const  fetchBook = createAsyncThunk(
    'booksSlice/fetchBook',
    async (data) => {
        const {id} = data

        const {request} = useHttp();

        return await request(`${BackUrl}book_inside/${id}`,"GET",null)
    }
)






const booksSlice = createSlice({
    name: "booksSlice",
    initialState,
    reducers: {
        setBook:(state,action) =>{
            state.books = [...state.books,action.payload.book]
        },
        changeBook: (state,action) => {
            state.book = action.payload.book
        },
        deleteBook: (state,action) => {
            state.books = state.books.filter(item => item.id !== action.payload.id)
        },



        onSetChangedOrders: (state, action) => {
            state.orderedBooks = state.orderedBooks.map(item => {

                const filtered = action.payload.books.filter(book => book.id === item.id)
                if (filtered.length > 0) {
                    return filtered[0]
                } else {
                    return item
                }
            })
        },

        onDeletedOrder: (state,action) => {
            state.orderedBooks = state.orderedBooks.filter(item => item.id !== action.payload.id)
        },


        addBookOverhead: (state,action) => {
            state.booksOverhead.book = [...state.booksOverhead.book,action.payload.book]
            state.booksOverhead.editor_balance = action.payload.editor_balance
        },
        changeBookOverheadPaymentType: (state,action) => {
            state.booksOverhead = {
                ...state.booksOverhead,
                book: state.booksOverhead.book.map(item => {
                    if (item.id === action.payload.id) {
                        return {
                            ...item,
                            typePayment: action.payload.name
                        }
                    }
                    return item
                })
            }
            state.booksOverhead.editor_balance = action.payload.editor_balance
        },
        deleteBookOverhead: (state,action) => {
            state.booksOverhead.book = state.booksOverhead.book.filter(item => item.id !== action.payload.id)
            state.booksOverhead.editor_balance = action.payload.editor_balance
        }

    },
    extraReducers: builder => {
        builder
            .addCase(fetchBooks.pending,state => {state.fetchBooksStatus = 'loading'} )
            .addCase(fetchBooks.fulfilled,(state, action) => {
                state.fetchBooksStatus = 'success';
                state.books = action.payload.books
            })
            .addCase(fetchBooks.rejected,state => {state.fetchBooksStatus = 'error'} )


            .addCase(fetchBasketBooks.pending,state => {state.fetchBooksStatus = 'loading'} )
            .addCase(fetchBasketBooks.fulfilled,(state, action) => {
                state.fetchBooksStatus = 'success';
                state.basketBooks = {
                    old: action.payload.old_books,
                    new: action.payload.new_books
                }
            })

            .addCase(fetchBasketBooks.rejected,state => {state.fetchBooksStatus = 'error'} )

            .addCase(fetchOrderedBooks.pending,state => {state.fetchBooksStatus = 'loading'} )
            .addCase(fetchOrderedBooks.fulfilled,(state, action) => {
                state.fetchBooksStatus = 'success';
                state.orderedBooks = action.payload.orders
                state.debtLoc = action.payload.debt
            })
            .addCase(fetchOrderedBooks.rejected,state => {state.fetchBooksStatus = 'error'} )


            .addCase(fetchDeletedOrdersBooks.pending,state => {state.fetchBooksStatus = 'loading'} )
            .addCase(fetchDeletedOrdersBooks.fulfilled,(state, action) => {
                state.fetchBooksStatus = 'success';
                state.orderedBooks = action.payload.orders

            })
            .addCase(fetchDeletedOrdersBooks.rejected,state => {state.fetchBooksStatus = 'error'} )



            .addCase(fetchBook.pending,state => {state.fetchBookStatus = 'loading'} )
            .addCase(fetchBook.fulfilled,(state, action) => {
                state.fetchBookStatus = 'success';
                state.book = action.payload.book
            })
            .addCase(fetchBook.rejected,state => {state.fetchBookStatus = 'error'} )


            .addCase(fetchBooksOverheadData.pending,state => {state.fetchBooksAccStatus = 'loading'} )
            .addCase(fetchBooksOverheadData.fulfilled,(state, action) => {
                state.fetchBooksAccStatus = 'success';
                state.booksOverhead = action.payload.data
            })
            .addCase(fetchBooksOverheadData.rejected,state => {state.fetchBooksAccStatus = 'error'} )

            .addCase(fetchHistoryOverheadBooks.pending,state => {state.fetchBooksAccStatus = 'loading'} )
            .addCase(fetchHistoryOverheadBooks.fulfilled,(state, action) => {
                state.fetchBooksAccStatus = 'success';
                state.booksOverheadHistory = action.payload.data
            })
            .addCase(fetchHistoryOverheadBooks.rejected,state => {state.fetchBooksAccStatus = 'error'} )


            .addCase(fetchMonthBooksAcc.pending,state => {state.fetchBooksAccStatus = 'loading'} )
            .addCase(fetchMonthBooksAcc.fulfilled,(state, action) => {
                state.fetchBooksAccStatus = 'success';
                state.monthBooksAcc = action.payload.data
            })
            .addCase(fetchMonthBooksAcc.rejected,state => {state.fetchBooksAccStatus = 'error'} )


            .addCase(fetchBooksAccData.pending, state => {
                state.fetchBooksAccStatus = 'loading'
            })
            .addCase(fetchBooksAccData.fulfilled, (state, action) => {
                state.fetchBooksAccStatus = 'success';
                state.booksAcc = action.payload.data
            })
            .addCase(fetchBooksAccData.rejected, state => {
                state.fetchBooksAccStatus = 'error'
            })

            .addCase(fetchDeletedBooksOverheadData.pending,state => {state.fetchBooksAccStatus = 'loading'} )
            .addCase(fetchDeletedBooksOverheadData.fulfilled,(state, action) => {
                state.fetchBooksAccStatus = 'success';
                state.booksOverhead = action.payload.data
            })
            .addCase(fetchDeletedBooksOverheadData.rejected,state => {state.fetchBooksAccStatus = 'error'} )
    }
})



const {actions,reducer} = booksSlice;

export default reducer

export const {
    setBook,
    changeBook,
    deleteBook,
    changeBookOverheadPaymentType,
    addBookOverhead,
    deleteBookOverhead,
    onSetChangedOrders,
    onDeletedOrder
} = actions

