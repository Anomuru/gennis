import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    teacher: {},
    teacherLoadingStatus: 'idle',
    groups: [],
    groupsLoadingStatus: 'idle',
    results: [],
    resultsLoadingStatus: 'idle',
    students: [],
    studentsLoadingStatus: 'idle'
}

const TeacherInfoSlice = createSlice({
    name: 'teacherInfo',
    initialState,
    reducers: {
        fetchingTeacher: (state) => {
            state.teacherLoadingStatus = 'loading'
        },
        fetchedTeacher: (state, action) => {
            state.teacher = action.payload
            state.teacherLoadingStatus = 'success'
        },
        changeTeacher: (state, action) => {
            state.teacher = action.payload
        },
        fetchedTeacherError: (state) => {
            state.teacherLoadingStatus = 'error'
        },
        fetchingGroups: (state) => {
            state.groupsLoadingStatus = 'loading'
        },
        fetchedGroups: (state, action) => {
            state.groups = action.payload
            state.groupsLoadingStatus = 'success'
        },
        fetchedGroupsError: (state) => {
            state.groupsLoadingStatus = 'error'
        },
        fetchingResults: (state) => {
            state.resultsLoadingStatus = 'loading'
        },
        fetchedResults: (state, action) => {
            state.results = action.payload
            state.resultsLoadingStatus = 'success'
        },
        fetchedResultsError: (state) => {
            state.resultsLoadingStatus = 'error'
        },
        fetchingStudents: (state) => {
            state.studentsLoadingStatus = 'loading'
        },
        fetchedStudents: (state, action) => {
            state.students = action.payload
            state.studentsLoadingStatus = "success"
        },
        fetchedStudentsError: (state) => {
            state.studentsLoadingStatus = 'error'
        }
    }
})

const {actions, reducer} = TeacherInfoSlice
export default reducer

export const {
    fetchingTeacher,
    fetchedTeacher,
    changeTeacher,
    fetchedTeacherError,
    fetchingGroups,
    fetchedGroups,
    fetchedGroupsError,
    fetchingResults,
    fetchedResults,
    fetchedResultsError,
    fetchingStudents,
    fetchedStudents,
    fetchedStudentsError
} = actions