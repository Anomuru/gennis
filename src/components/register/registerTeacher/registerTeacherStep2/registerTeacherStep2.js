import React, {useEffect, useState} from 'react';
import { motion} from "framer-motion";


import "components/register/registerUser/registerUserStep2/registerUserStep2.sass"
import "styles/components/_form.sass"

import {forTitle} from "frame-motion";
import {useNavigate} from "react-router-dom";
import {useHttp} from "hooks/http.hook";
import {fetchData} from "slices/registerSlice";
import {useDispatch, useSelector} from "react-redux";
import {BackUrl} from "constants/global";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import PlatformMessage from "components/platform/platformMessage";

const RegisterTeacherStep2 = ({userData}) => {


    const {data} = useSelector(state => state.register)
    const {location} = useSelector(state => state.me)

    const [subjects,setSubjects] = useState([])
    const [locations,setLocations] = useState([])
    const [languages,setLanguages] = useState([])
    const [selectedSubjects,setSelectedSubjects] = useState([])
    const [postDataStatus,setPostDataStatus] = useState(false)

    const [selectedLocation,setSelectedLocation] = useState(1)
    const [studyLang,setStudyLang] = useState(1)

    const [msg,setMsg] = useState(false)
    const [typeMsg,setTypeMsg] = useState(false)
    const [activeMessage,setActiveMessage] = useState(false)

    useEffect(()=>{
        if (data) {
            setSubjects(data.subject)
            setLocations(data.location)
            setLanguages(data.language)
        }
    },[data])


    const navigate = useNavigate()
    const {request} = useHttp()

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(fetchData())
    },[])


    const onSubmit = (e) => {

        e.preventDefault()
        const newData = {
            ...userData,
            eduCenLoc: selectedLocation,
            studyLang: studyLang,
            selectedSubjects
        }
        setPostDataStatus(true)

        request(`${BackUrl}register_teacher`, "POST", JSON.stringify(newData))
            .then(res => {
                if (res.isError) {
                    if (res.isUsername) {
                        navigate(-1)
                    }
                    else {
                        setTypeMsg("error")
                        setMsg(res.msg)
                        setActiveMessage(true)
                    }
                }
                if (res.success) {
                    setPostDataStatus(false)
                    navigate("/platform")
                }
            })
    }




    const onGetSubject = (subjectName) => {
        if (subjectName !== "Fan tanla") {
            const filteredSubjects = subjects.find(item => item.name === subjectName)
            setSubjects(subjects => {
                return subjects.map(item => {
                    if (item.name === subjectName) {
                        return {...item,disabled: true}
                    }
                    return item
                })
            })
            setSelectedSubjects([...selectedSubjects,filteredSubjects])
        }

    }

    const onDeleteSubject = (subjectName) => {
        if (subjectName !== "Fan tanla" ) {
            setSubjects(subjects => {
                return subjects.map(item => {
                    if (item.name === subjectName) {
                        return {...item,disabled: false}
                    }
                    return item
                })
            })
            setSelectedSubjects(selectedSubjects.filter(item => item.name !== subjectName))
        }
    }

    const renderOptions = (list,isLoc) => {
        return (
            list.map((item,index) => {
                if (isLoc && item.id === +location) {
                    return (
                        <option key={index} selected value={item.id}>{item.name}</option>
                    )
                }
                return (
                    <option key={index} value={item.id}>{item.name}</option>
                )
            })
        )
    }


    const selectedSubjectLevel = (name,value) => {
        if (value !== "defaultLevel") {
            setSelectedSubjects(subjects => {
                return subjects.map(item => {
                    if (item.name === name) {
                        return {...item,selectedLevel: value}
                    }
                    return item
                })
            })
        }
    }

    useEffect(() => {
        if (locations) {
            // eslint-disable-next-line array-callback-return
            locations?.map(item => {
                if (item.id === location) {
                    setSelectedLocation(item.id)
                }
            })
        }

    },[location, locations])

    const renderSubjects = (list) => {
        return (
            list.map((item,index) => {
                return (
                    <div

                        key={index}
                        className="subjects__item"
                    >
                        <div className="subjects__item-info">
                            <span>
                                {item.name}
                            </span>
                            <i
                                onClick={() => onDeleteSubject(item.name)}
                                className="fas fa-times"
                            />
                        </div>
                        {
                            item.levels ? (
                                <label htmlFor={item.name}>
                                    <span className="name-field">{item.name} Darajalari</span>
                                    <select
                                        id={item.name}
                                        className="input-fields"
                                        onChange={e => selectedSubjectLevel(item.name,e.target.value)}
                                    >
                                        <option value="defaultLevel">Darajani tanlang</option>
                                        {renderOptions(item.levels)}
                                    </select>
                                </label>
                            ) : null
                        }
                    </div>
                )
            })
        )
    }




    return (
        <motion.div className="register__step-2" >
            <PlatformMessage typeMessage={typeMsg} activeMsg={activeMessage}>
                {msg}
            </PlatformMessage>
            <motion.form
                variants={forTitle}
                initial="hidden"
                animate="show"
                exit="exit"
                action=""
                onSubmit={onSubmit}
            >
                {
                    postDataStatus ?
                        <DefaultLoader/>
                        :
                        <>
                            <label htmlFor="eduCenLoc">
                                <span className="name-field">O'quv markazi joylashuvi</span>
                                <select
                                    id="eduCenLoc"
                                    className="input-fields "
                                    value={selectedLocation}
                                    onChange={e => setSelectedLocation(e.target.value)}
                                >
                                    {renderOptions(locations,true)}
                                </select>
                            </label>
                            {
                                selectedSubjects.length < 3 ? (
                                    <label htmlFor="subjects">
                                        <select
                                            id="subjects"
                                            className="input-fields"
                                            onChange={e => onGetSubject(e.target.value)}
                                        >
                                            <option value="Fan tanla" >Fan tanlang</option>
                                            {
                                                subjects?.map(item => {
                                                    return (
                                                        <option disabled={item.disabled}  key={item.id} value={item.name}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </label>
                                ) : null
                            }

                            <div className="subjects">
                                <h3>Tanlangan fanlar:</h3>
                                <div className="subjects__wrapper">
                                    {renderSubjects(selectedSubjects)}
                                </div>
                            </div>

                            <label htmlFor="studyLang">
                                <span className="name-field">Ta'lim tili</span>
                                <select
                                    id="studyLang"
                                    className="input-fields "
                                    value={studyLang}
                                    onChange={e => setStudyLang(e.target.value)}
                                >
                                    {renderOptions(languages)}
                                </select>
                            </label>
                            <input className="input-submit" type="submit" value="Submit"/>
                        </>
                }
            </motion.form>
        </motion.div>
    );
};

export default RegisterTeacherStep2;