import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    person: null,
    audioId: null,
    callId: null,
    isActive: false,
    isOpen: false,
    type: null,
    status: "idle",
    state: "idle",
    msg: null
}

const taskManagerModalSlice = createSlice({
    name: "taskManagerModalSlice",
    initialState,
    reducers: {
        onCallStart: (state, action) => {
            state.person = action.payload.person
            state.callId = action.payload.callId
            state.status = action.payload.callStatus
            state.state = action.payload.callState
            state.type = action.payload.type
            state.msg = action.payload.msg
            state.isOpen = true
            state.isActive = true
        },
        onCallProgressing: (state, action) => {
            state.audioId = action.payload.audioId
            state.callId = action.payload.callId
            state.status = action.payload.callStatus
            state.state = action.payload.callState
            state.person = action.payload.person
            state.type = action.payload.type
            state.msg = action.payload.msg
            state.isOpen = true
            state.isActive = true
        },
        onCallEnd: (state) => {
            state.isActive = false
            state.isOpen = false
            state.person = null
            state.callId = null
            state.audioId = null
            state.type = null
            state.status = "idle"
            state.state = "idle"
        }
    }
})

export const {
    onCallStart,
    onCallProgressing,
    onCallEnd
} = taskManagerModalSlice.actions

export default taskManagerModalSlice.reducer

