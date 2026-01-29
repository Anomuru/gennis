import {createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import {BackUrl, headers} from "../constants/global";
import {useHttp} from "../hooks/http.hook";


export const fetchAssistant = createAsyncThunk(
    "assistantSlice/fetchAssistant",
    async ({locationId , type}) => {
        const {request} = useHttp()
        return await request(`${BackUrl}teacher/assistent/get_list/${locationId}/${type}` , "GET" , null , headers())

    }
)

const initialState = {
    loading: false,
    error: false,
    data: []
}

const assistantSlice = createSlice({
    name : "assistantSlice",
    initialState,
    reducers: {
        onDeleteAssistant: (state , action) => {
            state.data= state.data.filter(item => item.id !==action.payload)
        }
    },
    extraReducers: builder => builder
        .addCase(fetchAssistant.pending , state => {
            state.loading = true
        })
        .addCase(fetchAssistant.fulfilled , (state , action ) => {
            state.data = action.payload
            state.loading = true
        })
        .addCase(fetchAssistant.rejected , state => {
            state.loading = false
            state.error =true
        })
})


const {actions,reducer} = assistantSlice;

export default reducer
export const {
onDeleteAssistant


} = actions