import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useDispatch} from "react-redux";

const initialState = {
    students: [
        // {
        //     id: 1,
        //     name: "Ulug'bek12",
        //     surname: "Fatxullayev",
        //     money: 200000,
        //     active: true,
        //     checked: false,
        //     typeChecked: "",
        //     date : {},
        //     scores: {},
        //     requestLoading: false
        // },
        // {
        //     id: 2,
        //     name: "Kimdur",
        //     surname: "nmadur",
        //     money: 100000,
        //     active: false,
        //     checked: false,
        //     typeChecked: "",
        //     date : {},
        //     scores: {},
        //     requestType: "",
        //     requestMsg: "",
        // }
    ],
    monthList: [
        {
            num : 1,
            days: [
                {
                    num: 13
                }
            ]
        },
        {
            num : 2,
            days: [
                {
                    num: 15
                }
            ]
        }
    ],
    scoresData: [
        {
            name: "homework",
            id:1,
            title: "Uy ishi",
            activeStars: 0,
            stars : [
                {
                    active: false
                },
                {
                    active: false
                },
                {
                    active: false
                },
                {
                    active: false
                },
                {
                    active: false
                },
            ]
        },
        {
            name: "homework",
            id:1,
            title: "Uy ishi",
            activeStars: 0,
            stars : [
                {
                    active: false
                },
                {
                    active: false
                },
                {
                    active: false
                },
                {
                    active: false
                },
                {
                    active: false
                },
            ]
        },
    ],
    checkedStudents: [],
    fetchGroupStudentsStatus: "idle",
}


export const  fetchGroupStudents = createAsyncThunk(
    'makeAttendance/fetchGroupStudents',
    async (id) => {
        const {request} = useHttp();
        return await request(`${BackUrl}attendance/${id}`,"GET",null,headers())
    }
)





const makeAttendanceSlice = createSlice({
    name: "makeAttendanceSlice",
    initialState,
    reducers: {
        requestStudent: (state,action) => {
            state.checkedStudents = state.checkedStudents.map(st => {
                if (st.id === action.payload.id) {
                    return {...st,requestType: action.payload.requestType,requestMsg: action.payload.requestMsg}
                }
                return st
            })
        },
        setNext: (state,action) => {
            let newStudents
            if (action.payload.index + 1 === state.students.length) {
                newStudents = state.students.map((student,index) => {
                    if (index === 0) {
                        return {...student,active: true}
                    }
                    return {...student,active: false}
                })
            }
            else {
                newStudents = state.students.map((student,index) => {
                    if (index === action.payload.index + 1) {
                        return {...student,active: true}
                    }
                    return {...student,active: false}
                })
            }
            state.students = newStudents
        },
        setPrev: (state,action) => {
            let newStudents

            if (action.payload.index - 1 < 0) {
                newStudents = state.students.map((student,index) => {
                    if (index === state.students.length - 1) {
                        return {...student,active: true}
                    }
                    return {...student,active: false}
                })
            }
            else {
                newStudents = state.students.map((student,index) => {
                    if (index === action.payload.index - 1) {
                        return {...student,active: true}
                    }
                    return {...student,active: false}
                })
            }
            state.students = newStudents
        },
        setChecked: (state,action) => {
            let newCheckedSt = {}
            // eslint-disable-next-line array-callback-return
            state.students.map( student => {
                if (student.id === action.payload.id) {
                    newCheckedSt = {
                        ...student,
                        checked: true,
                        scores: action.payload.scores,
                        typeChecked: action.payload.typeChecked,
                        date: action.payload.date,
                        requestType: "",
                        requestMsg: "",
                    }
                }
            })

            state.checkedStudents = [...state.checkedStudents,newCheckedSt]

            state.students = state.students.filter(student => student.id !== action.payload.id)
        },
        setActiveById: (state,action) => {
            let checkedStudent = {}

            // eslint-disable-next-line array-callback-return
            state.checkedStudents.map(student => {
                if (student.id === action.payload.id) {
                    checkedStudent = {...student,active: true}
                }
            })
            state.students = state.students.map(student => {
                return {...student, active:false}
            })

            state.students = [...state.students,checkedStudent]
            state.checkedStudents = state.checkedStudents.filter(item => item.id !== action.payload.id)

        },
        removeCheckedStudent: (state,action) => {
            state.checkedStudents = state.checkedStudents.filter(student => student.id !== action.payload.id)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchGroupStudents.pending,state => {state.fetchGroupStudentsStatus = 'loading'} )
            .addCase(fetchGroupStudents.fulfilled,(state, action) => {
                state.fetchGroupStudentsStatus = 'success';
                state.students = action.payload.students.map((student,index) => {
                    if (index === 0) {
                        return {...student,active: true}
                    }
                    return student
                })
                state.checkedStudents = []
                state.monthList = action.payload.date
                state.scoresData = action.payload.scoresData
            })
            .addCase(fetchGroupStudents.rejected,state => {state.fetchGroupStudentsStatus = 'error'})
    }
})



const {actions,reducer} = makeAttendanceSlice;

export default reducer

export const {setNext,setChecked,setActiveById,requestStudent,removeCheckedStudent,setPrev} = actions

