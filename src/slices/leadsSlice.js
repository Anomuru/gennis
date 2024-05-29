import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    leads: [],
    callList: [],
    deletedLeads: [],
    fetchLeadsStatus: "idle",
    fetchCallListStatus: "idle",
}


export const  fetchLeads = createAsyncThunk(
    'leadsSlice/fetchLeads',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}get_leads_location/news/${id}`,"GET",null,headers())
    }
)

export const  fetchDeletedLeads = createAsyncThunk(
    'leadsSlice/fetchDeletedLeads',
    async (id) => {
        const {request} = useHttp();

        return await request(`${BackUrl}get_leads_location/deleted/${id}`,"GET",null,headers())
    }
)

export const  fetchLeadsCallList = createAsyncThunk(
    'leadsSlice/fetchLeadsCallList',
    async (id) => {
        const {request} = useHttp();

        return await request(`${BackUrl}lead_crud/${id}`,"GET",null,headers())
    }
)




const leadsSlice = createSlice({
    name: "leadsSlice",
    initialState,
    reducers: {
        onChangedLead: (state, action) =>{
            state.leads = state.leads.map(item => {
                if (item.id === action.payload.item.id) {
                    return {
                        ...action.payload.item
                    }
                }
                return item
            })
        },

        onDeleteLead: (state, action) => {

            state.leads = state.leads.filter(item => item.id !== action.payload.id)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchLeads.pending,state => {state.fetchLeadsStatus = 'loading'} )
            .addCase(fetchLeads.fulfilled,(state, action) => {
                state.fetchLeadsStatus = 'success';
                state.leads = action.payload.leads
            })
            .addCase(fetchLeads.rejected,state => {state.fetchLeadsStatus = 'error'} )

            .addCase(fetchLeadsCallList.pending,state => {state.fetchCallListStatus = 'loading'} )
            .addCase(fetchLeadsCallList.fulfilled,(state, action) => {
                state.fetchCallListStatus = 'success';

                state.callList = action.payload.comments
            })
            .addCase(fetchLeadsCallList.rejected,state => {state.fetchCallListStatus = 'error'} )

            .addCase(fetchDeletedLeads.pending,state => {state.fetchCallListStatus = 'loading'} )
            .addCase(fetchDeletedLeads.fulfilled,(state, action) => {
                state.fetchCallListStatus = 'success';
                state.deletedLeads =  action.payload.leads
            })
            .addCase(fetchDeletedLeads.rejected,state => {state.fetchCallListStatus = 'error'} )

    }
})



const {actions,reducer} = leadsSlice;

export default reducer

export const {onChangedLead,onDeleteLead} = actions

