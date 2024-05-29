

import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {

    category: {},
    categories: [],


    fetchCategoriesStatus: "idle",
    fetchCategoryStatus: "idle",
}


export const  fetchCategory = createAsyncThunk(
    'capitalCategory/fetchCategory',
    async (id) => {
        const {request} = useHttp();

        return await request(`${BackUrl}get_capital_category/${id}`,"GET",null,headers())
    }
)

export const  fetchCategories = createAsyncThunk(
    'capitalCategory/fetchCategories',
    async () => {
        const {request} = useHttp();

        return await request(`${BackUrl}get_capital_categories`,"GET",null,headers())
    }
)




const capitalCategory = createSlice({
    name: "capitalCategory",
    initialState,
    reducers: {
        onChangeCategory: (state,action) => {
            state.categories = state.categories.map(item => {
                if (item.id === action.payload.category.id) {
                    return action.payload.category
                }

                return item
            })
        },


        onAddCategory: (state,action) => {
            state.categories.push(action.payload.category)
        }


    },
    extraReducers: builder => {
        builder
            .addCase(fetchCategory.pending,state => {state.fetchCategoryStatus = 'loading'} )
            .addCase(fetchCategory.fulfilled,(state, action) => {
                state.fetchCategoryStatus = 'success';
                state.category = action.payload.category
            })
            .addCase(fetchCategory.rejected,state => {state.fetchCategoryStatus = 'error'} )

            .addCase(fetchCategories.pending,state => {state.fetchCategoriesStatus = 'loading'} )
            .addCase(fetchCategories.fulfilled,(state, action) => {
                state.fetchCategoriesStatus = 'success';
                state.categories = action.payload.categories
            })
            .addCase(fetchCategories.rejected,state => {state.fetchCategoriesStatus = 'error'} )
    }
})



const {actions,reducer} = capitalCategory;

export default reducer

export const {onAddCategory,onChangeCategory} = actions










