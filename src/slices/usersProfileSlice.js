import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";

const initialState = {
    user: {
        id: 23,
        role: "",
        activeToChange: {
            // username: true,
            // name: true,
            // surname: true,
            // fathersName: true,
            // age: true,
            // phone: true,
            // birth: true,
            // subject: true,
            // studentsLength: true
        },

        info: {
            // name: {
            //     name: "name",
            //     value: "Ulug'bek",
            // },
            // surname: {
            //     name: "surname",
            //     value: "Fatxullayev",
            // },
            // fathersName: {
            //     name: "Otasining Ismi",
            //     value: "Farxodovich",
            // },
            // age: {
            //     name: "age",
            //     value: 19,
            // },
            // phone: {
            //     name: "Telefon raqam",
            //     value: 998949200232,
            // },
            // birthDate: {
            //     name: "Tug'ulgan kun",
            //     value: "2003-11-13",
            // }
        },

        rate: [
            {
                subject: "Matematika",
                degree: 5.0
            },
            {
                subject: "Ona tili",
                degree: 4.0
            },
            {
                subject: "Ingliz tili",
                degree: 3.0
            },
        ],


        groups: [
            {
                nameGroup: "Marg'iyona IELTS abiturent",
                teacherImg: "adsda",
            },
            {
                nameGroup: "Marg'iyona pre-IELTS",
                teacherImg: "adsda",
            }
        ],

        links: [
            {
                link: "changeInfo",
                title: "Ma'lumotlarni o'zgratirish",
                iconClazz: "fa-pen",
            }
        ],
    },


    payment: {},


    dataHistory: {

        balls: {

        }
    },

    fetchUserDataStatus: "idle",
}


export const fetchUserData = createAsyncThunk(
    'userProfileSlice/fetchUserData',
    async (data) => {
        const { id } = data
        const { request } = useHttp();
        return await request(`${BackUrl}base/profile/${id}`, "GET", null, headers())
    }
)

export const fetchPaymentOptions = createAsyncThunk(
    'userProfileSlice/fetchPaymentOptions',
    async (id) => {
        const { request } = useHttp();
        return await request(`${BackUrl}account/get_payment/${id}`, "GET", null, headers())
    }
)
export const fetchHistoryData = createAsyncThunk(
    'userProfileSlice/fetchHistoryData',
    async (id) => {
        const { request } = useHttp();
        return await request(`${BackUrl}student/student_history2/${id}`, "GET", null, headers())
    }
)



const userProfileSlice = createSlice({
    name: "userProfileSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchUserData.pending, state => { state.fetchUserDataStatus = 'loading' })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.fetchUserDataStatus = 'success';
                state.user = action.payload.user
            })
            .addCase(fetchUserData.rejected, state => { state.fetchUserDataStatus = 'error' })


            .addCase(fetchPaymentOptions.pending, state => { state.fetchUserDataStatus = 'loading' })
            .addCase(fetchPaymentOptions.fulfilled, (state, action) => {
                state.fetchUserDataStatus = 'success';
                state.payment = action.payload.payment
            })
            .addCase(fetchPaymentOptions.rejected, state => { state.fetchUserDataStatus = 'error' })


            .addCase(fetchHistoryData.pending, state => { state.fetchUserDataStatus = 'loading' })
            .addCase(fetchHistoryData.fulfilled, (state, action) => {
                state.fetchUserDataStatus = 'success';
                state.dataHistory = action.payload.data
            })
            .addCase(fetchHistoryData.rejected, state => { state.fetchUserDataStatus = 'error' })

    }
})



const { actions, reducer } = userProfileSlice;

export default reducer

// export const {
//
// } = actions

