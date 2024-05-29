import React, {useCallback, useEffect, useState} from 'react';
import "./makeAttendance.sass"
import Select from "components/platform/platformUI/select";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import classNames from "classnames";
import {
    fetchGroupStudents,
    removeCheckedStudent,
    requestStudent,
    setActiveById,
    setChecked,
    setNext, setPrev
} from "slices/makeAttendanceSlice";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import ErrorStudentsNotFound from "components/error/errorStudentsNotFound/errorStudentsNotFound";
import Modal from "components/platform/platformUI/modal";


import {motion} from "framer-motion";
import {forTitle} from "frame-motion";
import {BackUrl, BackUrlForDoc, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import user_img from "assets/user-interface/user_image.png";
import BackButton from "components/platform/platformUI/backButton/backButton";
import {setMessage} from "slices/messageSlice";


const MakeAttendance = () => {

    const {
        students,
        checkedStudents,
        monthList,
        scoresData,
        fetchGroupStudentsStatus
    } = useSelector(state => state.makeAttendanceSlice)

    const {groupId, teacherId} = useParams()

    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)
    const [scores, setScores] = useState()
    const [activeBtn, setActiveBtn] = useState("")


    const [activeModal, setActiveModal] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchGroupStudents(groupId))
    }, [])

    useEffect(() => {
        setScores(scoresData)
    }, [scoresData])

    const renderStudent = useCallback(() => {
        // eslint-disable-next-line array-callback-return
        if (!students.length) {
            return <ErrorStudentsNotFound/>
        }
        return students?.map((student, index) => {
            if (student.active) {
                const functions = () => {
                    return {
                        variables: {
                            scores,
                            activeBtn,
                            day,
                            month,
                            monthList,
                            studentIndex: index
                        },
                        funcs: {
                            setDay,
                            setMonth,
                            setScores,
                            setActiveBtn
                        },

                    }
                }
                return (
                    <>
                        <Main
                            student={student}
                            functions={functions}
                        />
                        <Footer studentIndex={index}/>
                    </>
                )
            }
        })

    }, [activeBtn, monthList, day, month, scores, students])


    const renderedStudents = renderStudent()

    if (fetchGroupStudentsStatus === "loading") {
        return <DefaultLoader/>
    } else if (fetchGroupStudentsStatus === "error") {
        return <h1>No students</h1>
    }


    return (
        <div className="giveRate">
            <div className="giveRate__container">
                <Header setActiveModal={setActiveModal}/>
                {renderedStudents}
                <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                    <CheckedStudents
                        teacherId={teacherId}
                        groupId={groupId}
                        setActiveModal={setActiveModal}
                        students={checkedStudents}
                    />
                </Modal>
            </div>
        </div>
    );
};


const Header = ({setActiveModal}) => {

    return (
        <header>
            <div>
                <BackButton/>
                <div onClick={() => setActiveModal(true)} className="menuBar">
                    <i className="fas fa-bars"></i>
                </div>
            </div>
            <div>

            </div>
        </header>
    )
}


const Main = ({functions, student}) => {

    const {funcs, variables} = functions()
    const {setDay, setMonth, setScores, setActiveBtn} = funcs
    const {scores, activeBtn, day, month, studentIndex, monthList} = variables


    const [typeChecked, setTypeChecked] = useState("")
    const [submited, setSubmited] = useState(false)

    useEffect(() => {
        if (student.scores.length) {
            setScores(student?.scores)
        }
        if (student.date) {
            if (student.date.day) {
                setDay(student.date.day)
            }
            if (student.date.month) {
                setMonth(student.date.month)
            }
        }
        if (student.typeChecked) {
            setActiveBtn(student.typeChecked)
        }
    }, [student])


    const activeStar = (name, index) => {
        setScores(
            scores.map(item => {
                if (item.name === name) {
                    let activeStars = 0
                    const newStars = item.stars.map((star, i) => {
                        if (i <= index) {
                            if (i === 0 && 0 === index) {
                                if (!star.active) {
                                    activeStars++
                                }
                                return {...star, active: !star.active}
                            }
                            activeStars++
                            return {...star, active: true}
                        }
                        return {...star, active: false}
                    })
                    return {...item, stars: newStars, activeStars: activeStars}
                }
                return item
            })
        )
    }


    const renderStars = (stars, name) => {
        return stars.map((item, index) => {
            return (
                <i
                    onClick={() => activeStar(name, index)}
                    className={classNames('fas fa-star', {
                        active: item.active
                    })}
                />
            )
        })
    }


    const renderDegree = useCallback(() => {
        return scores?.map(item => {
            const stars = renderStars(item.stars, item.name)
            return (
                <div className="stars__item">
                    <h1>{item.title}</h1>
                    <div>
                        {stars}
                    </div>
                </div>
            )
        })
    }, [scores])

    const dispatch = useDispatch()

    const submitCheckedStudent = useCallback(() => {
        if (student.money_type !== "red") {
            const date = {
                day,
                month
            }
            dispatch(setNext({index: studentIndex}))
            dispatch(setChecked({date, typeChecked, id: student?.id, scores}))
        }
    }, [day, month, scores, student?.id, studentIndex, typeChecked])


    const renderDate = useCallback(() => {
        return monthList?.map(item => {
            if (item.value === month) {
                return (
                    <div className="date__item">
                        <Select
                            number={true}
                            name={"day"}
                            title={"Kun"}
                            defaultValue={day}
                            onChangeOption={setDay}
                            options={item?.days}
                        />
                    </div>
                )
            }
        })
    }, [monthList, day, month, setDay])

    const renderedDegree = renderDegree()
    const renderedDays = renderDate()


    return (
        <main className="main">
            <InfoUser
                name={student?.name}
                money={student?.money}
                surname={student?.surname}
                img={student.profile_photo}
                money_type={student.money_type}
            />
            <motion.div
                variants={forTitle}
                animate="show"
                initial="hidden"
                className="main__container"
            >
                {
                    submited ?
                        <IsChecked submitCheckedStudent={submitCheckedStudent}/>
                        :
                        <>
                            <div className="toggle">
                                <div
                                    onClick={() => setActiveBtn("yes")}
                                    className={classNames("toggle__item", {
                                        active: activeBtn === "yes"
                                    })}
                                >
                                    <i className="fas fa-check"></i>
                                </div>
                                <div
                                    onClick={() => setActiveBtn("no")}
                                    className={classNames("toggle__item", {
                                        active: activeBtn === "no"
                                    })}
                                >
                                    <i className="fas fa-times"></i>
                                </div>
                            </div>
                            {
                                activeBtn === "yes" ? (
                                    <div className="yes__container">
                                        <div className="stars">
                                            {renderedDegree}
                                        </div>
                                        <div className="date">
                                            {
                                                monthList?.length >= 2 ?
                                                    <Select
                                                        name={"month"}
                                                        title={"Oy"}
                                                        defaultValue={month}
                                                        onChangeOption={setMonth}
                                                        options={monthList}
                                                    /> :
                                                    setMonth(monthList[0].value)
                                            }
                                            {renderedDays}
                                        </div>

                                        <div
                                            onClick={() => {
                                                setTypeChecked("yes")
                                                setSubmited(true)
                                            }}
                                            className={`submit`}
                                        >
                                            Yuborish
                                        </div>

                                    </div>
                                ) : activeBtn === "no" ? (
                                    <div className="no__container">
                                        <div className="date">
                                            {
                                                monthList?.length >= 2 ?
                                                    <Select
                                                        name={"month"}
                                                        title={"Oy"}
                                                        defaultValue={month}
                                                        onChangeOption={setMonth}
                                                        options={monthList}
                                                    /> :
                                                    setMonth(monthList[0].value)
                                            }
                                            {renderedDays}
                                        </div>

                                        <div
                                            onClick={() => {
                                                setTypeChecked("no")
                                                setSubmited(true)
                                            }}
                                            className={`submit`}
                                        >
                                            Yuborish
                                        </div>
                                    </div>
                                ) : null
                            }
                        </>
                }
            </motion.div>
        </main>
    )
}

const InfoUser = ({name, surname, money, img, money_type}) => {

    const userImg = img ? `${BackUrlForDoc}${img}` : user_img
    return (
        <div className="main__header">
            <div>
                <motion.img
                    variants={forTitle}
                    animate="show"
                    initial="hidden"
                    src={userImg}
                    alt=""
                />
                <div className="information">
                    <motion.span
                        variants={forTitle}
                        animate="show"
                        initial="hidden"
                    >
                        {name}
                    </motion.span>
                    <motion.span
                        variants={forTitle}
                        animate="show"
                        initial="hidden"
                    >
                        {surname}
                    </motion.span>
                </div>
            </div>
            <div>
                <motion.div
                    variants={forTitle}
                    animate="show"
                    initial="hidden"
                    className={`money ${money_type}`}
                >
                    {money}
                </motion.div>
            </div>
        </div>
    )
}


const IsChecked = ({submitCheckedStudent}) => {
    return (
        <div className="checkedIcon">
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
            >
                <motion.path
                    stroke="#65ec65"
                    strokeWidth={20}
                    fill="transparent"
                    initial={{
                        opacity: 0,
                        pathLength: 0
                    }}
                    animate={{
                        opacity: 1,
                        pathLength: 1
                    }}
                    transition={{
                        delay: 0.2,
                        duration: 1

                    }}
                    onAnimationComplete={() => submitCheckedStudent()}
                    d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                />
            </motion.svg>
        </div>
    )
}


const Footer = ({studentIndex}) => {
    const dispatch = useDispatch()

    return (
        <footer>
            <div className="submitBtns">
                <div>
                    <div
                        onClick={() => {
                            dispatch(setPrev({index: studentIndex}))
                        }}
                        className="submitBtns__item prev"
                    >
                        <i className="fas fa-arrow-left"/>
                        <span>Orqaga</span>
                    </div>
                    <div
                        onClick={() => {
                            dispatch(setNext({index: studentIndex}))
                        }}
                        className="submitBtns__item next"
                    >
                        <span>Dalshi</span>
                        <i className="fas fa-arrow-right"/>
                    </div>
                </div>
            </div>
        </footer>
    )
}


const CheckedStudents = ({students, setActiveModal, groupId, teacherId}) => {

    const dispatch = useDispatch()
    const activeById = (id) => {
        setActiveModal(false)
        dispatch(setActiveById({id}))
    }

    const renderStudents = useCallback(() => {

        if (!students.length) {
            return
        }

        return students.map(student => {

            const userImg = student.profile_photo ? `${BackUrlForDoc}${student.profile_photo}` : user_img
            return (
                <div onClick={() => activeById(student.id)} className="checkedStudents__item">
                    <div className="infoStudent">
                        <img src={userImg} alt="studentImg"/>
                        <div className="info">
                            <span>{student.name}</span>
                            <span>{student.surname}</span>
                        </div>

                        <div className="typeChecked">
                            {
                                student.typeChecked === "yes"
                                    ?
                                    <i className="fas fa-plus-circle green"/>
                                    :
                                    <i className="fas fa-minus-circle red"/>
                            }
                        </div>
                        <div>
                            {
                                student?.requestType === "loading" ?
                                    <DefaultLoaderSmall/> : null
                            }
                        </div>
                    </div>
                    <div
                        className={classNames("error", {
                            errorActive: student.requestType === "error"
                        })}
                    >
                        {student.requestMsg}
                    </div>

                </div>
            )
        })
    }, [students])

    const {request} = useHttp()

    const onSubmit = (e) => {
        e.preventDefault()
        // eslint-disable-next-line array-callback-return
        students.map(student => {
            const data = {
                student,
                groupId,
            }
            dispatch(requestStudent({id: student.id, requestType: "loading"}))
            request(`${BackUrl}make_attendance`, "POST", JSON.stringify(data), headers())
                .then(res => {
                    if (res.success) {
                        dispatch(removeCheckedStudent({id: res.student_id}))
                        setActiveModal(false)
                        dispatch(setMessage({
                            msg: res.msg,
                            type: "success",
                            active: true
                        }))

                    }
                    if (res.error) {
                        dispatch(requestStudent({
                            id: res.student_id,
                            requestType: res.requestType,
                            requestMsg: res.msg
                        }))
                    }
                })
                .catch(() => {
                    dispatch(setMessage({
                        msg: "Serverda yoki internetingizda hatolik",
                        type: "error",
                        active: true
                    }))
                })
        })

    }


    const renderedStudents = renderStudents()
    return (
        <div className="checkedStudents">
            {
                !students.length ?
                    <h1>O'quvchilar baholanmagan</h1>
                    :
                    <form className="checkedStudents__form" onSubmit={onSubmit}>
                        <div className="checkedStudents__container">
                            {renderedStudents}
                        </div>
                        <input type="submit" className="input-submit" value="submit"/>
                    </form>
            }
        </div>
    )
}


export default MakeAttendance;