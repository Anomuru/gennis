import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    id: null,
    teacherId: null,
    groupName: "",
    subject: "",
    locationId: null,
    groupStatus: false,
    level: '',
    levels: [],
    data: {},

    links: [
        // {
        //     type: "link",
        //     link: "addToGroup",
        //     title: "Add to group",
        //     iconClazz: "fa-user-plus",
        // },
        // {
        //     type: "link",
        //     link: "addGroup",
        //     title: "Add to group",
        //     iconClazz: "fa-user-plus",
        //
        // },
        // {
        //     type: "btn",
        //     name: "deleteGroup",
        //     title: "Gruppani o'chirish",
        //     iconClazz: "fa-times",
        // }
    ],
    btns: [
        {
            id: 1,
            title: "Ma'lumotlar",
            name: "information",
            active: true
        },
        {
            id: 2,
            title: "Qo'shimcha",
            name: "addition",
            active: false
        }
    ],
    fetchGroupStatus: "idle",
}


export const  fetchGroup = createAsyncThunk(
    'groupSlice/fetchGroup',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}group_profile/${id}`,"GET",null,headers())
    }
)







const groupSlice = createSlice({
    name: "groupSlice",
    initialState,
    reducers: {
        setActiveBtn: (state,action) => {
            state.btns = state.btns.map(btn => {
                if (btn.id === action.payload.id) {
                    return {...btn,active:true}
                }
                return {...btn,active: false}
            })
        },
        setChecked: (state,action) => {
            // eslint-disable-next-line array-callback-return

            state.data.students = state.data.students.map(st => {
                if (st.id === action.payload.id) {
                    return {...st, checked: !st.checked}
                }
                return st
            })
        },
        onDelete: (state,action) =>{
            state.data.students = state.data.students.filter(st => st.id !== action.payload.id)
        },
        deleteCheckedStudents: (state,action) => {
            // eslint-disable-next-line array-callback-return
            state.data.students = state.data.students.filter(item => {
                // eslint-disable-next-line array-callback-return
                return action.payload.checkedStudents.every( st => {
                    return st.id !== item.id;
                })
            })
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchGroup.pending,state => {state.fetchGroupsStatus = 'loading'} )
            .addCase(fetchGroup.fulfilled,(state, action) => {
                state.fetchGroupsStatus = 'success';
                state.data = action.payload.data
                state.time_table = action.payload.time_table
                state.isTime = action.payload.isTime
                state.links = action.payload.links
                state.id = action.payload.groupID
                state.groupName = action.payload.groupName
                state.teacherId = action.payload.teacher_id
                state.subject = action.payload.groupSubject
                state.groupStatus = action.payload.groupStatus
                state.locationId = action.payload.locationId
                state.level = action.payload.level
                state.levels = action.payload.levels
            })
            .addCase(fetchGroup.rejected,state => {state.fetchGroupsStatus = 'error'})
    }
})



const {actions,reducer} = groupSlice;

export default reducer

export const {setActiveBtn,setChecked,onDelete,deleteCheckedStudents} = actions

