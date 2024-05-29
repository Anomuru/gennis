import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    groups: [],
    btns: [
        {
            id: 2,
            type: "link",
            link: "timeTable",
            title: "Time Table",
            location: true
        },
    ],
    fetchGroupsStatus: "idle",
}


export const fetchGroups = createAsyncThunk(
    'groupsSlice/fetchGroups',
    async (loc) => {
        const {request} = useHttp();
        return await request(`${BackUrl}groups/${loc}`,"GET",null,headers())
    }
)




export const fetchGroupsBySubject = createAsyncThunk(
    'groupsSlice/fetchGroupsBySubject',
    async (data) => {
        const {request} = useHttp();
        return await request(`${BackUrl}groups/${data.loc}/${data.subject}`,"GET",null,headers())
    }
)


export const fetchGroupsById = createAsyncThunk(
    'groupsSlice/fetchGroupsById',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}groups_by_id/${id}`,"GET",null,headers())
    }
)

export const fetchGroupsByStudentId = createAsyncThunk(
    'groupsSlice/fetchGroupsByStudentId',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}my_groups/${id}`,"GET",null,headers())
    }
)



const groupsSlice = createSlice({
    name: "groupsSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchGroups.pending,state => {state.fetchGroupsStatus = 'loading'} )
            .addCase(fetchGroups.fulfilled,(state, action) => {
                state.fetchGroupsStatus = 'success';
                state.groups = action.payload.groups
            })
            .addCase(fetchGroups.rejected,state => {state.fetchGroupsStatus = 'error'})

            .addCase(fetchGroupsById.pending,state => {state.fetchGroupsStatus = 'loading'} )
            .addCase(fetchGroupsById.fulfilled,(state, action) => {
                state.fetchGroupsStatus = 'success';
                state.groups = action.payload.groups
            })
            .addCase(fetchGroupsById.rejected,state => {state.fetchGroupsStatus = 'error'})

            .addCase(fetchGroupsByStudentId.pending,state => {state.fetchGroupsStatus = 'loading'} )
            .addCase(fetchGroupsByStudentId.fulfilled,(state, action) => {
                state.fetchGroupsStatus = 'success';
                state.groups = action.payload.groups
            })
            .addCase(fetchGroupsByStudentId.rejected,state => {state.fetchGroupsStatus = 'error'})


            .addCase(fetchGroupsBySubject.pending,state => {state.fetchGroupsStatus = 'loading'} )
            .addCase(fetchGroupsBySubject.fulfilled,(state, action) => {
                state.fetchGroupsStatus = 'success';
                state.groups = action.payload.groups
            })
            .addCase(fetchGroupsBySubject.rejected,state => {state.fetchGroupsStatus = 'error'})
    }
})



const {actions,reducer} = groupsSlice;

export default reducer

// export const {} = actions

