import React, {useEffect, useState} from 'react';


import {AnimatePresence, AnimateSharedLayout} from "framer-motion";
import WebSiteLoader from "components/loader/webSiteLoader/WebSiteLoader";
import {Route, Routes} from "react-router-dom";
import HomePage from "pages/webSite/home/homePage";
import BooksPage from "pages/webSite/books/booksPage";
import Book from "pages/webSite/books/book/book";
import TeacherInfo from "pages/webSite/teacherInfo";
import {BackUrl, headers} from "constants/global";
import {
    fetchedAdvantages,
    fetchedCertificates, fetchedHrefs,
    fetchedImageItems, fetchedLocations,
    fetchedNews, fetchedSubjects, fetchedTeachers,
    fetchedVideoItems
} from "slices/webSiteSlice";
import {useHttp} from "hooks/http.hook";
import {useDispatch, useSelector} from "react-redux";


export const Context = React.createContext();


const WebSite = () => {


    const {request} = useHttp()
    const dispatch = useDispatch()

    useEffect(() => {
        request(`${BackUrl}get_home_info`, "GET", null, headers())
            .then(res => {
                console.log(res)
                if (res?.success) {
                    dispatch(fetchedAdvantages(res?.advantages))
                    dispatch(fetchedImageItems(res?.design))
                    dispatch(fetchedVideoItems(res?.video))
                    dispatch(fetchedNews(res?.news))
                    dispatch(fetchedCertificates(res?.certificates))
                    dispatch(fetchedHrefs(res?.links))
                    dispatch(fetchedSubjects(res?.subjects))
                    dispatch(fetchedTeachers(res?.teachers))
                    dispatch(fetchedLocations(res?.locations))
                } else {
                    dispatch(fetchedAdvantages([]))
                    dispatch(fetchedImageItems({}))
                    dispatch(fetchedVideoItems({}))
                    dispatch(fetchedNews([]))
                    dispatch(fetchedCertificates([]))
                    dispatch(fetchedHrefs([]))
                    dispatch(fetchedSubjects([]))
                    dispatch(fetchedTeachers([]))
                    dispatch(fetchedLocations([]))
                }
            })
            .catch(err => console.log(err))
    }, [])


    const {imageLoadingStatus} = useSelector(state => state.website)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(imageLoadingStatus === "loading" || imageLoadingStatus === "idle")
        }, 3000)

        return () => clearTimeout(timer)
    },[imageLoadingStatus])

    const [sectionTop, setSectionTop] = useState({
        home: null,
        about: null,
        advantages: null,
        comments: null,
        events: null,
        gallery: null,
        contact: null
    })




    return (
        <>
            <AnimatePresence >
                {
                    loading ? (
                        <WebSiteLoader/>
                    ) : (

                        // <AnimateSharedLayout type="crossfade">
                        <>
                            <Context.Provider value={{sectionTop, setSectionTop}}>
                                <Routes>
                                    <Route index path={"/"} element={<HomePage/>}/>
                                    <Route path={"books"} element={<BooksPage/>}/>
                                    <Route path={"books/:id"} element={<Book/>}/>
                                    <Route path={"teacherInfo/:id"} element={<TeacherInfo/>}/>
                                </Routes>
                            </Context.Provider>
                        </>
                        // </AnimateSharedLayout>
                    )


                }
            </AnimatePresence>
        </>
    );
};

export default WebSite;
