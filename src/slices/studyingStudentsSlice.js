import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    studyingStudents: [],
    btns: [],
    fetchStudyingStudentsStatus: "idle"
}


export const  fetchStudyingStudents = createAsyncThunk(
    'studyingStudentsSlice/fetchStudyingStudents',
    async (id) => {
        const {request} = useHttp();

        return await request(`${BackUrl}studyingStudents/${id}`,"GET",null,headers())
    }
)



const studyingStudentsSlice = createSlice({
    name: "studyingStudentsSlice",
    initialState,
    reducers: {
        setActiveBtn: (state,action) => {
            state.btns = state.btns.map(item => {
                if (item.name === action.payload.name) {
                    if (item.typeModal) {
                        return {...item,activeModal : !item.activeModal}
                    }
                }
                return item
            })

        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchStudyingStudents.pending,state => {state.fetchStudyingStudentsStatus = 'loading'} )
            .addCase(fetchStudyingStudents.fulfilled,(state, action) => {
                state.fetchStudyingStudentsStatus = 'success';
                state.studyingStudents = action.payload.studyingStudents
            })
            .addCase(fetchStudyingStudents.rejected,state => {state.fetchStudyingStudentsStatus = 'error'} )



    }
})



const {actions,reducer} = studyingStudentsSlice;

export default reducer

export const {
    setSelectOption,
    setFromToFilter,
    setActiveBtn,
    set
} = actions

