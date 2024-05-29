import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers, ROLES} from "constants/global";

const initialState = {
    msg: "",
    type: "",
    active: false
}


const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setMessage: (state,action) => {
            state.msg = action.payload.msg
            state.type = action.payload.type || ""
            state.active = action.payload.active
        }
    },
})



const {actions,reducer} = messageSlice;

export default reducer

export const {
    setMessage
} = actions




