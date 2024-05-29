import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    video: {},
    videoLoadingStatus: 'idle',
    image: {},
    imageLoadingStatus: 'idle',
    newsList: [],
    newsLoadingStatus: 'idle',
    advantages: [],
    advantagesLoadingStatus: 'idle',
    hrefs: [],
    hrefsLoadingStatus: 'idle',
    subjects: [],
    subjectsLoadingStatus: 'idle',
    certificates: [],
    certificatesLoadingStatus: 'idle',
    teachers: [],
    teachersLoadingStatus: 'idle',
    locations: [],
    locationsLoadingStatus: 'idle'
}

const WebsiteSlice = createSlice({
    name: 'website',
    initialState,
    reducers: {
        fetchingImageItems: (state) => {
            state.imageLoadingStatus = 'loading'
        },
        fetchedImageItems: (state, action) => {
            state.image = action.payload
            state.imageLoadingStatus = 'success'
        },
        fetchedImageError: (state) => {
            state.imageLoadingStatus = 'error'
        },
        fetchingVideoItems: (state) => {
            state.videoLoadingStatus = 'loading'
        },
        fetchedVideoItems: (state, action) => {
            state.video = action.payload
            state.videoLoadingStatus = 'success'
        },
        fetchedVideoError: (state) => {
            state.videoLoadingStatus = 'error'
        },
        fetchingNews: (state) => {
            state.newsLoadingStatus = 'loading'
        },
        fetchedNews: (state, action) => {
            state.newsList = action.payload
            state.newsLoadingStatus = 'success'
        },
        fetchedError: (state) => {
            state.newsLoadingStatus = 'error'
        },
        changeNew: (state, action) => {
            state.newsList = [
                ...state.newsList.filter(item => item.id !== action.payload.id),
                action.payload
            ]
        },
        addNew: (state, action) => {
            state.newsList = [
                ...state.newsList,
                action.payload
            ]
        },
        fetchingAdvantages: (state) => {
            state.advantagesLoadingStatus = 'loading'
        },
        fetchedAdvantages: (state, action) => {
            state.advantages = action.payload
            state.advantagesLoadingStatus = 'success'
        },
        fetchedAdvantagesError: (state) => {
            state.advantagesLoadingStatus = 'error'
        },
        changeAdvantages: (state, action) => {
            state.advantages = [
                ...state.advantages.filter(item => item.id !== action.payload.id),
                action.payload
            ]
        },
        changeAdvantagesImage: (state, action) => {
            state.advantages = [
                ...state.advantages.filter(item => item.id !== action.payload.id),
                action.payload
            ]
        },
        fetchingHrefs: (state) => {
            state.hrefsLoadingStatus = 'loading'
        },
        fetchedHrefs: (state, action) => {
            state.hrefs = action.payload
            state.hrefsLoadingStatus = 'success'
        },
        fetchedHrefsError: (state) => {
            state.hrefsLoadingStatus = 'error'
        },
        changeHrefs: (state, action) => {
            state.hrefs = [
                ...state.hrefs.filter(item => item.id !== action.payload.id),
                action.payload
            ]
        },
        fetchingSubjects: (state) => {
            state.subjectsLoadingStatus = 'loading'
        },
        fetchedSubjects: (state, action) => {
            state.subjects = action.payload
            state.subjectsLoadingStatus = 'success'
        },
        fetchedSubjectsError: (state) => {
            state.subjectsLoadingStatus = 'error'
        },
        fetchingCertificates: (state) => {
            state.certificatesLoadingStatus = 'loading'
        },
        fetchedCertificates: (state, action) => {
            state.certificates = action.payload
            state.certificatesLoadingStatus = 'success'
        },
        fetchedCertificatesError: (state) => {
            state.certificatesLoadingStatus = 'error'
        },
        fetchingTeachers: (state) => {
            state.teachersLoadingStatus = 'loading'
        },
        fetchedTeachers: (state, action) => {
            state.teachers = action.payload
            state.teachersLoadingStatus = 'success'
        },
        fetchedTeachersError: (state) => {
            state.teachersLoadingStatus = 'error'
        },
        fetchingLocations: (state) => {
            state.locationsLoadingStatus = 'loading'
        },
        fetchedLocations: (state, action) => {
            state.locations = action.payload
            state.locationsLoadingStatus = 'success'
        },
        fetchedLocationsError: (state) => {
            state.locationsLoadingStatus = 'error'
        },
        changeLocation: (state, action) => {
            state.locations = [
                ...state.locations.filter(item => item.id !== action.payload.id),
                action.payload
            ]
        }
    }
})

const {actions, reducer} = WebsiteSlice
export default reducer

export const {
    fetchingImageItems,
    fetchedImageItems,
    fetchedImageError,
    fetchingVideoItems,
    fetchedVideoItems,
    fetchedVideoError,
    fetchingNews,
    fetchedNews,
    fetchedError,
    changeNew,
    addNew,
    fetchingAdvantages,
    fetchedAdvantages,
    fetchedAdvantagesError,
    changeAdvantages,
    changeAdvantagesImage,
    fetchingHrefs,
    fetchedHrefs,
    fetchedHrefsError,
    changeHrefs,
    fetchingSubjects,
    fetchedSubjects,
    fetchedSubjectsError,
    fetchingCertificates,
    fetchedCertificates,
    fetchedCertificatesError,
    fetchingTeachers,
    fetchedTeachers,
    fetchedTeachersError,
    fetchingLocations,
    fetchedLocations,
    fetchedLocationsError,
    changeLocation
} = actions