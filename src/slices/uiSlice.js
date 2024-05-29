import {createSelector, createSlice} from "@reduxjs/toolkit";

const initialState = {
    scroll: {},
    page: {}
}

export const getUIScroll = (state) => state.ui.scroll;
export const getUIScrollByPath = createSelector(
    getUIScroll,
    (state, path) => path,
    (scroll, path) => scroll[path] || 0,
);


export const getUIPage = (state) => state.ui.page;
export const getUIPageByPath = createSelector(
    getUIPage,
    (state, path) => path,
    (page, path) => page[path] || 1,
);

const UISlice = createSlice({
    name: "UISlice",
    initialState,
    reducers: {
        setScrollPosition: (state, {payload}) => {
            state.scroll[payload.path] = payload.position
        },
        setPagePosition: (state, {payload}) => {
            state.page[payload.path] = payload.page
        }
    }
})



const {actions,reducer} = UISlice;

export default reducer

export const {
    setScrollPosition,setPagePosition
} = actions




