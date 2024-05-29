import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";

const initialState = {
    filters: {
        // job: {
        //     id: 1,
        //     title: "Fan boyicha",
        //     type: "btn",
        //     typeChange: "multiple",
        //     activeFilters: [],
        //     filtersList: ["Admin", "Farrosh"]
        // },
        // language: {
        //     id: 2,
        //     title: "Til bo'yicha",
        //     type: "btn",
        //     typeChange: "once",
        //     activeFilters: [],
        //     filtersList: ["Uz", "Ru"]
        // },
        // month: {
        //     id: 3,
        //     title: "Oy bo'yicha",
        //     type: "select",
        //     activeFilters: [],
        //     filtersList: [
        //         {
        //             name: "01"
        //         },
        //         {
        //             name: "03"
        //         },
        //         {
        //             name: "04"
        //         },
        //         {
        //             name: "12"
        //         },
        //     ]
        // },
        // age: {
        //     id: 4,
        //     title: "Oy bo'yicha",
        //     type: "input",
        //     fromTo: {
        //         from: 1,
        //         to: 18
        //     }
        // }
    },
    fetchFiltersStatus: "idle"
}




export const fetchFilters = createAsyncThunk(
    'filtersSlice/fetchFilters',
    async (data) => {
        const {name,location,type} = data
        const {request} = useHttp();

        return await request(`${BackUrl}filters/${name}/${location}/${type}`,"GET",null,headers())
    }
)



const newStudentsSlice = createSlice({
    name: "filtersSlice",
    initialState,
    reducers: {
        resetState: () => initialState,
        setActive: (state,action) => {
            const filterKeys = Object.keys(state.filters)
            // eslint-disable-next-line array-callback-return
            filterKeys.map(keys => {
                if (keys === action.payload.activeFilter) {
                    if (state.filters[keys].typeChange === "once") {
                        let newFilter
                        if (state.filters[keys].activeFilters === action.payload.subFilter) {
                            newFilter = {...state.filters[keys],activeFilters:[]}
                        } else {
                            newFilter = {...state.filters[keys],activeFilters: action.payload.subFilter }
                        }
                        state.filters = {...state.filters,[keys]: newFilter}
                    }
                    if (state.filters[keys].typeChange === "multiple") {
                        let newFilter
                        if (state.filters[keys].activeFilters.includes(action.payload.subFilter)) {
                            newFilter = {
                                ...state.filters[keys],
                                activeFilters: state.filters[keys].activeFilters.filter(item => item !== action.payload.subFilter)
                            }
                        } else {
                            newFilter = {
                                ...state.filters[keys],
                                activeFilters: [...state.filters[keys].activeFilters,action.payload.subFilter]
                            }
                        }
                        state.filters = {...state.filters,[keys] : newFilter}
                    }
                }
            })
        },
        setSelectOption: (state,action) => {
            const filterKeys = Object.keys(state.filters)
            // eslint-disable-next-line array-callback-return
            filterKeys.map(keys => {
                if (keys === action.payload.activeFilter) {
                    let newFilter
                    if (state.filters[keys].activeFilters.includes(action.payload.selectedOption) || action.payload.selectedOption === "all") {
                        newFilter = {...state.filters[keys],activeFilters:[]}
                    } else {
                        newFilter = {...state.filters[keys], activeFilters: action.payload.selectedOption }
                    }
                    state.filters = {...state.filters,[keys] : newFilter}
                }
            })
        },
        setFromToFilter: (state,action) => {
            const filterKeys = Object.keys(state.filters)
            // eslint-disable-next-line array-callback-return
            filterKeys.map(keys => {
                if (keys === action.payload.activeFilter) {
                    const newFilter = {...state.filters[keys],fromTo: action.payload.fromTo }
                    state.filters = {...state.filters,[keys] : newFilter}
                }
            })
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFilters.pending,state => {state.fetchFiltersStatus = 'loading'} )
            .addCase(fetchFilters.fulfilled,(state, action) => {
                state.fetchFiltersStatus = 'success';
                state.filters = action.payload.filters

            })
            .addCase(fetchFilters.rejected,state => {state.fetchFiltersStatus = 'error'} )

            .addDefaultCase(()=> {})
    }
})



const {actions,reducer} = newStudentsSlice;

export default reducer

export const {resetState,setActive,setFromToFilter,setSelectOption} = actions

