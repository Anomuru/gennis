import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";

const initialState = {
    studyingStudents: [],
    btns: [],
    fetchStudyingStudentsStatus: "idle",
    totalCount: null
}


export const fetchStudyingStudents = createAsyncThunk(
    'studyingStudentsSlice/fetchStudyingStudents',
    async ({ locationId, currentPage, pageSize, search, currentFilters }) => {
        const { request } = useHttp();

        console.log(locationId, currentPage, pageSize, search, currentFilters);


        return await request(`${BackUrl}student/studyingStudents/${locationId}${pageSize ? `?offset=${(currentPage - 1) * 50}&limit=${pageSize}` : ""}${search ? `&search=${search}` : ""}${currentFilters.language ? `&language=${currentFilters.language}` : ""}${currentFilters.age ? `&age=${currentFilters.age}` : ""}`, "GET", null, headers())
    }
)

export const fetchStudyingStudentsWithoutPagination = createAsyncThunk(
    'studyingStudentsSlice/fetchStudyingStudentsWithoutPagination',
    ({ locationId }) => {
        const { request } = useHttp();
        return request(`${BackUrl}student/studyingStudents/${locationId}`, "GET", null, headers())
    }
)



const studyingStudentsSlice = createSlice({
    name: "studyingStudentsSlice",
    initialState,
    reducers: {
        setActiveBtn: (state, action) => {
            state.btns = state.btns.map(item => {
                if (item.name === action.payload.name) {
                    if (item.typeModal) {
                        return { ...item, activeModal: !item.activeModal }
                    }
                }
                return item
            })

        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchStudyingStudents.pending, state => { state.fetchStudyingStudentsStatus = 'loading' })
            .addCase(fetchStudyingStudents.fulfilled, (state, action) => {
                state.fetchStudyingStudentsStatus = 'success';
                state.studyingStudents = action.payload.studyingStudents
                state.totalCount = action.payload?.pagination
            })
            .addCase(fetchStudyingStudents.rejected, state => { state.fetchStudyingStudentsStatus = 'error' })
            .addCase(fetchStudyingStudentsWithoutPagination.pending, state => { state.fetchStudyingStudentsStatus = 'loading' })
            .addCase(fetchStudyingStudentsWithoutPagination.fulfilled, (state, action) => {
                state.fetchStudyingStudentsStatus = 'success';
                state.studyingStudents = action.payload.studyingStudents
                state.totalCount = action.payload?.pagination
            })
            .addCase(fetchStudyingStudentsWithoutPagination.rejected, state => { state.fetchStudyingStudentsStatus = 'error' })



    }
})



const { actions, reducer } = studyingStudentsSlice;

export default reducer

export const {
    setSelectOption,
    setFromToFilter,
    setActiveBtn,
    set
} = actions

