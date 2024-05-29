
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    students: [],
    btns: [
        {
            id: 1,
            type: "select",
            name: "location",
            title: "Qo'shimcha",
            options : [
                {
                    value: "O'qituvchi yoqmadi",
                    name: "O'qituvchi yoqmadi",
                    disabled: false
                },
                {
                    value: "O'quvchi o'qishni eplolmadi",
                    name: "O'quvchi o'qishni eplolmadi",
                    disabled: false
                },
                {
                    value: "Pul oilaviy sharoit",
                    name: "Pul oilaviy sharoit",
                    disabled: false
                },
                {
                    value: "Boshqa",
                    name: "Boshqa",
                    disabled: false
                }
            ]
        }
    ],
    fetchDeletedStudentStatus: "idle",
}


export const  fetchDeletedStudent = createAsyncThunk(
    'deletedStudentsSlice/fetchDeletedStudent',
    async (data) => {
        const {locationId} = data
        const {request} = useHttp();
        return await request(`${BackUrl}deletedStudents/${locationId}`,"POST",JSON.stringify(data),headers())
    }
)




const deletedStudentsSlice = createSlice({
    name: "deletedStudentsSlice",
    initialState,
    reducers: {
        setDisableOption: (state,action) => {
            state.btns = state.btns.map(item => {
                if (item.type === "select") {
                    const newOptions = item.options.map(option => {
                        if (option.value === action.payload.to) {
                            return {...option,disabled: true}
                        }

                        return {...option,disabled: false}
                    })
                    return {...item,options: newOptions}
                }
                return item
            })
        },

    },
    extraReducers: builder => {
        builder
            .addCase(fetchDeletedStudent.pending,state => {
                state.fetchDeletedStudentStatus = 'loading'
            })
            .addCase(fetchDeletedStudent.fulfilled,(state, action) => {
                state.fetchDeletedStudentStatus = 'success';
                state.students = action.payload.data
            })
            .addCase(fetchDeletedStudent.rejected,state => {state.fetchDeletedStudentStatus = 'error'} )

    }
})



const {actions,reducer} = deletedStudentsSlice;

export default reducer

export const {setDisableOption,resetState} = actions






