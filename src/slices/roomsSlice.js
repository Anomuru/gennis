import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    rooms: [],
    btns: [],
    insideRoom: [],
    fetchRoomsStatus: "idle",
}


export const  fetchRooms = createAsyncThunk(
    'roomsSlice/fetchRooms',
    async (id) => {
        const {request} = useHttp();

        return await request(`${BackUrl}rooms_location/${id}`,"GET",null,headers())
    }
)
export const  fetchInsideRoom = createAsyncThunk(
    'roomsSlice/fetchInsideRoom',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}room_profile/${id}`,"GET",null,headers())
    }
)





const roomsSlice = createSlice({
    name: "roomsSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchRooms.pending,state => {state.fetchRoomsStatus = 'loading'} )
            .addCase(fetchRooms.fulfilled,(state, action) => {
                state.fetchRoomsStatus = 'success';
                state.rooms = action.payload.data
            })
            .addCase(fetchRooms.rejected,state => {state.fetchRoomsStatus = 'error'} )

            .addCase(fetchInsideRoom.pending,state => {state.fetchRoomsStatus = 'loading'} )
            .addCase(fetchInsideRoom.fulfilled,(state, action) => {
                state.fetchRoomsStatus = 'success';
                state.insideRoom = action.payload.info
            })
            .addCase(fetchInsideRoom.rejected,state => {state.fetchRoomsStatus = 'error'})
    }
})



const {actions,reducer} = roomsSlice;

export default reducer

// export const {} = actions

