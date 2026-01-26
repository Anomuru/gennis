import React, { useEffect, useState, useRef, useCallback } from "react"
import { motion, useDragControls, useMotionValue, useMotionValueEvent } from "framer-motion";
import { json, useLocation, useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
    PhoneIcon,
    SearchIcon,
} from "lucide-react"
import Calendar from "react-calendar";
import classNames from "classnames";

import {
    callStart,
    fetchCompletedDebtorsData,
    fetchCompletedLeadsData,
    fetchCompletedNewStudentsTaskData,
    fetchDebtorsData,
    fetchLeadsData,
    fetchNewStudentsTaskData,
    onChangeProgress,
    onDelDebtors,
    onDelLeads
} from "slices/taskManagerSlice"
import { BackUrl, BackUrlForDoc, formatDate, headers } from "constants/global";
import { useHttp } from "hooks/http.hook";
import { setMessage } from "slices/messageSlice";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import Table from "components/platform/platformUI/table";
import Modal from "components/platform/platformUI/modal";
import Input from "components/platform/platformUI/input";
import Button from "components/platform/platformUI/button";
import socketService from "services/socketService";

import styles from "./newTaskManager.module.sass"
import switchCompletedBtn from "assets/icons/progress.svg";
import switchXButton from "assets/icons/bx_task-x.svg";
import { onCallProgressing, onCallStart } from "../../../../slices/taskManagerModalSlice";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";

const NewTaskManager = () => {

    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { locationId } = useParams()
    const { request } = useHttp()

    const {
        unCompleted,
        completed,
        completedDebtorStudent,
        progress,
        progressStatus,
        allProgress,
        isTable,
        unCompletedStatus,
        completedStatus,
        profile,
        callId,
        callState,
        callStatus,
        audioId
    } = useSelector(state => state.taskManager)

    const [activeColorList, setActiveColorList] = useState([])
    const [activeCategory, setActiveCategory] = useState("debtors")
    const [isCompleted, setIsCompleted] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11))
    const [date, setDate] = useState(new Date())
    const [data, setData] = useState([])

    const [selectedPerson, setSelectedPerson] = useState(null)

    const [isSelectPhone, setIsSelectPhone] = useState(false)
    const [phonesList, setPhonesList] = useState([])
    const [isSelectedStudent, setIsSelectedStudent] = useState(null)
    const [selectedPhone, setSelectedPhone] = useState(null)
    const [selectedId, setSelectedId] = useState(null)

    useEffect(() => {
        if (!locationId && !date) return;

        const formatted = formatDate(date)

        if (isCompleted) {
            switch (activeCategory) {
                case "debtors":
                    dispatch(fetchCompletedDebtorsData({ locationId, date: formatted }))
                    break;
                case "newStudents":
                    dispatch(fetchCompletedNewStudentsTaskData({ locationId, date: formatted }))
                    break;
                case "leads":
                    dispatch(fetchCompletedLeadsData({ locationId, date: formatted }))
                    break;
            }
        } else {
            switch (activeCategory) {
                case "debtors":
                    dispatch(fetchDebtorsData({ locationId, date: formatted }))
                    break;
                case "newStudents":
                    dispatch(fetchNewStudentsTaskData({ locationId, date: formatted }))
                    break;
                case "leads":
                    dispatch(fetchLeadsData({ locationId, date: formatted }))
                    break;


            }
        }
    }, [activeCategory, locationId, date, isCompleted])

    useEffect(() => {
        if (!locationId && !date) return;


        if (isCompleted) {
            switch (activeCategory) {
                case "debtors":
                    setData(completed.debtors)
                    break;
                case "newStudents":
                    setData(completed.students)
                    break;
                case "leads":
                    setData(completed.leads)
                    break;


            }
        } else {
            switch (activeCategory) {
                case "debtors":
                    setData(unCompleted.debtors)
                    break;
                case "newStudents":
                    setData(unCompleted.students)
                    break;
                case "leads":
                    setData(unCompleted.leads)
                    break;
            }
        }


    }, [
        unCompleted.debtors,
        unCompleted.students,
        unCompleted.leads,
        completed.debtors,
        completed.students,
        completed.leads,
    ])


    const onChangeIsCompleted = (status) => {
        setData([])
        setIsCompleted(status)
    }


    const calcLengthData = useCallback((type, isCompleted) => {
        if (isCompleted) {
            switch (type) {
                case "debtors":
                    return completed.debtors.length;
                case "newStudents":
                    return completed.students.length;
                case "leads":
                    return completed.leads.length;
            }
        } else {
            switch (type) {
                case "debtors":
                    return unCompleted.debtors.length;
                case "newStudents":
                    return unCompleted.students.length;
                case "leads":
                    return unCompleted.leads.length;
            }
        }
    }, [
        unCompleted.debtors.length,
        unCompleted.students.length,
        unCompleted.leads.length,
        completed.debtors.length,
        completed.students.length,
        completed.leads.length,
    ])


    const getVisibleData = () => {
        const filtered = data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

        if (activeCategory === "completed") {
            return filtered.filter(
                (item) => item.category !== "lead" && item.category !== "debtors" && item.category !== "newStudents",
            )
        }

        return filtered
    }

    const getCardColor = (student) => {
        if (activeCategory === "debtors") {
            return (student.debt || 0) > 200000 ? "red" : "yellow"
        }
        if (activeCategory === "newStudents") {
            if (student.moneyType === "green") return "green"
            if (student.moneyType === "yellow") return "yellow"
            if (student.moneyType === "red") return "red"
            return "gray"
        }
        if (activeCategory === "lead") {
            return "red"
        }
        return "gray"
    }

    const sortedData = getVisibleData()

    const onCall = (id, phone) => {
        let post;
        let postURL;
        if (activeCategory === "leads") {
            postURL = "task_leads/call-to-lead"
            post = { lead_id: id }
        } else if (activeCategory === "debtors") {
            postURL = "task_debts/call_to_debt"
            post = { student_id: id, phone }
            setSelectedPerson(prev => ({ ...prev, phone }))
        } else {
            postURL = "task_new_students/call_to_new_student"
            post = { student_id: id, phone }
            setSelectedPerson(prev => ({ ...prev, phone }))
        }
        request(`${BackUrl}${postURL}`, "POST", JSON.stringify(post), headers())
            .then(res => {
                const person = {
                    fullName: `${selectedPerson.name} ${activeCategory === "leads" ? "" : selectedPerson.surname}`,
                    id,
                    phone
                }
                // dispatch(callStart({
                //     callId: res.task_id,
                //     callStatus: "loading",
                //     callState: "processing"
                // }))
                // setSelectedPhone(phone)
                // setSelectedId(id)
                localStorage.setItem("callId", res.task_id)
                localStorage.setItem("categoryType", activeCategory)
                localStorage.setItem("selectedPerson", JSON.stringify(person))
                localStorage.setItem("callStatus", "loading")
                localStorage.setItem("callState", "processing")
                dispatch(onCallStart({
                    person,
                    callId: res.task_id,
                    callStatus: "loading",
                    callState: "processing",
                    type: activeCategory
                }))
            })
            .catch(err => {
                if (err) {

                    dispatch(setMessage({
                        msg: "Missing 'crm_username'",
                        type: "error",
                        active: true
                    }))
                }
            })
    }


    return (
        <div className={styles.mainContent}>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Top Navigation */}
                <div className={styles.topNav}>
                    <div className={styles.searchBox}>
                        <SearchIcon size={20} />
                        <input
                            type="text"
                            placeholder="Qidiruv"
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <SwitchButton
                        isCompleted={isCompleted}
                        setIsCompleted={onChangeIsCompleted}
                        setSearchValue={setSearchTerm}
                    />
                    {/*<button className={styles.inProgressButton}>*/}
                    {/*    <span>📋</span> In Progress*/}
                    {/*</button>*/}
                </div>

                {/* Category Tabs */}
                <div className={styles.categoryTabs}>
                    <h2 className={styles.categoryTitle}>My tasks</h2>
                    <div className={styles.tabsContainer}>
                        {[
                            { id: "debtors", label: "Qarzdorlar", count: calcLengthData("debtors", isCompleted) },
                            {
                                id: "newStudents",
                                label: "Yangi o'quvchilar",
                                count: calcLengthData("newStudents", isCompleted)
                            },
                            { id: "leads", label: "Lead", count: calcLengthData("leads", isCompleted) },
                            // { id: "completed", label: "Completed", count: 0 },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                className={`${styles.tab} ${activeCategory === tab.id ? styles.activeTab : ""}`}
                                onClick={() => setActiveCategory(tab.id)}
                            >
                                <span>{tab.label}</span>
                                <span className={styles.tabCount}>{tab.count}</span>
                            </button>
                        ))}
                    </div>
                    <div className={styles.totalCount}>
                        {
                            sortedData.length
                        }
                    </div>
                </div>

                {/* Cards Grid */}
                {
                    (unCompletedStatus === "loading" || completedStatus === "loading")
                        ? <div classNames={styles.main__loader}>
                            <DefaultLoader />
                        </div>
                        : isTable
                            ? <div className={styles.main__table}>
                                {
                                    sortedData.map(item => (
                                        <CommentCard
                                            comment={item}
                                            activeCategory={activeCategory}
                                        />
                                    ))
                                }
                                {/*<TableData*/}
                                {/*    isCompleted={isCompleted}*/}
                                {/*    arr={sortedData}*/}
                                {/*    activeType={activeCategory}*/}
                                {/*/>*/}
                            </div>
                            : <>
                                <WrapperSlide
                                    arr={
                                        activeCategory === "debtors"
                                            ? sortedData.filter(item => item.moneyType === "red")
                                            : sortedData
                                    }
                                    index={"red"}
                                    activeCategory={activeCategory}
                                    getCardColor={getCardColor}
                                    setPhonesList={setPhonesList}
                                    setIsSelectPhone={setIsSelectPhone}
                                    setIsSelectedStudent={setIsSelectedStudent}
                                    onCall={onCall}
                                    setSelectedPerson={setSelectedPerson}
                                />

                                {
                                    activeCategory === "debtors" && (
                                        <WrapperSlide
                                            arr={sortedData.filter(item => item.moneyType === "yellow")}
                                            index={"yellow"}
                                            activeCategory={activeCategory}
                                            getCardColor={getCardColor}
                                            setPhonesList={setPhonesList}
                                            setIsSelectPhone={setIsSelectPhone}
                                            setIsSelectedStudent={setIsSelectedStudent}
                                            onCall={onCall}
                                            setSelectedPerson={setSelectedPerson}
                                        />
                                    )
                                }
                            </>
                }
            </main>

            {/* Right Sidebar */}
            <aside className={styles.rightSidebar}>
                <div className={styles.navButtons}>
                    <button
                        className={classNames(
                            styles.navButton,
                            {
                                [styles.active]: location.pathname.includes("taskManager")
                            }
                        )}
                        onClick={() => navigate("../taskManager")}
                    >
                        Task manager
                    </button>
                    <button
                        className={classNames(
                            styles.navButton,
                            {
                                [styles.active]: location.pathname.includes("adminRanking")
                            }
                        )}
                        onClick={() => navigate("../adminRanking")}
                    >
                        Admin ranking
                    </button>
                </div>
                {/* Calendar */}
                <div className={styles.calendarWidget}>
                    {/* <div className={styles.calendarHeader}>
                        <button
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        >
                            <ChevronLeftIcon size={18} />
                        </button>
                        <span>
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <button
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        >
                            <ChevronRightIcon size={18} />
                        </button>
                    </div>
                    <div className={styles.calendarDays}>
                        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                            <div key={day} className={styles.dayHeader}>
                                {day}
                            </div>
                        ))}
                        {calendarDays.map((day, idx) => (
                            <div
                                key={idx}
                                className={`${styles.calendarDay} ${day === today.getDate() && isCurrentMonth ? styles.today : ""}`}
                            >
                                {day}
                            </div>
                        ))}
                    </div> */}
                    <Calendar
                        defaultValue={date}
                        onChange={setDate}
                    />
                </div>

                {/* Statistics */}
                <div className={styles.statsWidget}>
                    <div className={styles.statItem}>
                        <div className={styles.statCircle}>
                            <span className={styles.statValue}>{allProgress?.completed_tasks_percentage || 0}%</span>
                        </div>
                        <span className={styles.statLabel}>All Rating</span>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statCircle}>
                            <span className={styles.statValue}>{progress?.completed_tasks_percentage || 0}%</span>
                        </div>
                        <span className={styles.statLabel}>{activeCategory}</span>
                    </div>
                </div>
            </aside>
            <Modal
                activeModal={isSelectPhone}
                setActiveModal={setIsSelectPhone}
                extraClass={styles.audioModal}
            >
                {
                    isSelectPhone === "loading"
                        ? <DefaultLoaderSmall />
                        : phonesList.map(item => (
                            <div
                                className={styles.audioModal__inner}
                                onClick={() => {
                                    onCall(isSelectedStudent, item.phone)
                                    setIsSelectPhone(false)
                                }}
                            >
                                <span>{item.personal ? "Personal" : item.parent ? "Parent" : "Other"}:</span>
                                {item.phone}
                            </div>
                        ))
                }
            </Modal>
        </div>
    )
}

const WrapperSlide = ({
    arr,
    index,
    activeCategory,
    getCardColor,
    setIsSelectPhone,
    setPhonesList,
    onCall,
    setIsSelectedStudent,
    setSelectedPerson
}) => {

    const { request } = useHttp()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const x = useMotionValue(0)
    const [width, setWidth] = useState(0)
    const wrapper = useRef()

    useEffect(() => {
        setWidth(wrapper.current?.scrollWidth - wrapper.current?.offsetWidth)
        x.set(0)
    }, [arr?.length])

    const controls = useDragControls()

    const onGetPnohe = (id) => {
        setIsSelectPhone("loading")
        request(`${BackUrl}task_debts/get_phones/${id}/`, "GET", null, headers())
            .then(res => {
                setIsSelectPhone("success")
                setPhonesList(res.phones)
                setIsSelectedStudent(id)
            })
    }

    const onCallPhone = (id, phone, student) => {
        request(`${BackUrl}task_leads/call-to-lead`, "POST", JSON.stringify({ lead_id: id }), headers())
            .then(res => {
                dispatch(onCallStart({
                    person: {
                        fullName: student.name,
                        id,
                        phone
                    },
                    callId: res.task_id,
                    callStatus: "loading",
                    callState: "processing",
                    type: activeCategory
                }))
            })
    }


    return (
        <motion.div
            key={index}
            className={styles.scroll}
            id="scroll"
            ref={wrapper}
        >
            <motion.div
                className={styles.scroll__inner}
                id="scroll__inner"
                drag={"x"}
                dragElastic={0}
                dragMomentum={false}
                dragConstraints={{ left: -width, right: 0 }}
                dragControls={controls}
            >
                {
                    arr?.map((student) => {
                        return (
                            <div
                                key={student.id}
                                className={classNames(
                                    styles.card,
                                    {
                                        [styles.cardRed]: student.moneyType === "red" || student.status === "red",
                                        [styles.cardYellow]: student.moneyType === "yellow" || student.status === "yellow",
                                        [styles.cardGray]: (student.moneyType !== "red" && student.moneyType !== "yellow") && (student.status !== "red" && student.status !== "yellow"),
                                    }
                                )}
                            >
                                <div className={styles.cardHeader}>
                                    <div
                                        className={styles.avatar}
                                        onClick={() => activeCategory !== "leads" && navigate(`../../profile/${student.id}`)}
                                    />
                                    <div className={styles.icons}>
                                        <i
                                            className={classNames(
                                                "fa-solid fa-list-ul",
                                                styles.icons__audio
                                            )}
                                            onClick={() => navigate(`../storyProfile/${student.student ?? student.id}/${activeCategory}`)}
                                        />
                                        <button
                                            className={styles.phoneButton}
                                            onClick={() => {
                                                setSelectedPerson(student)
                                                activeCategory === "leads"
                                                    ?
                                                    onCallPhone(student.id, student.phone, student)
                                                    : onGetPnohe(student.student)
                                            }}
                                        >
                                            <PhoneIcon size={20} />
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.cardContent}>
                                    <p
                                        className={styles.cardName}
                                    >
                                        {student.name} {student.surname}
                                    </p>
                                    {activeCategory === "debtors" &&
                                        <p className={styles.debtAmount}>{student.balance}</p>}
                                    {activeCategory === "newStudents" &&
                                        <p className={styles.subject}>{student.subjects[0]}</p>}
                                    {activeCategory === "leads" && <p className={styles.regDate}>{student.day}</p>}
                                </div>
                                <div className={styles.cardFooter}>
                                    <div className={styles.footerItem}>
                                        <span className={styles.label}>Parent number:</span>
                                        <span className={styles.value}>{student.parent}</span>
                                    </div>
                                    {activeCategory === "debtors" && (
                                        <>
                                            <div className={styles.footerItem}>
                                                <span className={styles.label}>Number:</span>
                                                <span className={styles.value}>{student.phone}</span>
                                            </div>
                                            <div className={styles.footerItem}>
                                                <span className={styles.label}>Tel status:</span>
                                                <span className={styles.value}>{student.reason}</span>
                                            </div>
                                        </>
                                    )}
                                    {activeCategory === "newStudents" && (
                                        <>
                                            <div className={styles.footerItem}>
                                                <span className={styles.label}>number:</span>
                                                <span className={styles.value}>{student.phone}</span>
                                            </div>
                                        </>
                                    )}
                                    {activeCategory === "leads" && (
                                        <>
                                            <div className={styles.footerItem}>
                                                <span className={styles.label}>number:</span>
                                                <span className={styles.value}>{student.phone}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })
                }
            </motion.div>
        </motion.div>
    )
}

const SwitchButton = ({ isCompleted, setIsCompleted, setSearchValue }) => {
    return (
        <div className={styles.switchBox}>
            <div className={`${styles.switch} ${isCompleted ? `${styles.completed}` : `${styles.inProgress} `}`}
                onClick={() => {
                    setIsCompleted(!isCompleted)
                    setSearchValue("")
                }}>
                <div className={styles.iconButton}>
                    {isCompleted ?
                        <div className={styles.icon__handlerSucces}>
                            <img className={styles.buttonIcon} src={switchCompletedBtn} alt="" />
                        </div>
                        :
                        <div className={styles.icon__handler}>
                            <img src={switchXButton} className={styles.buttonIcon} alt="" />
                        </div>
                    }
                </div>
                <span className={styles.textContent}>
                    {isCompleted ? (
                        <h1 className={styles.textContentSucces}>Completed</h1>
                    ) : (
                        <h1 className={styles.textContent}>In Progress</h1>
                    )}
                </span>

            </div>
        </div>
    );
};


const CommentCard = ({ comment, activeCategory }) => {
    const { request } = useHttp()
    const navigate = useNavigate()
    const audioRef = useRef(null)

    // const [audioSrc, setAudioSrc] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    // useEffect(() => {
    //     if (isPlaying && comment?.audio_url) {
    //         request(`${BackUrl}media/${comment?.audio_url.slice(1, 999)}`, "GET", null, headers())
    //             .then(res => console.log(res))
    //     }
    // }, [isPlaying,comment?.audio_url])

    const audioSrc = comment?.audio_url
        ? BackUrlForDoc + comment.audio_url
        : null

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio || !audioSrc) return

        if (!audio.src) {
            audio.src = audioSrc
        }

        if (audio.paused) {
            audio.play()
            setIsPlaying(true)
        } else {
            audio.pause()
            setIsPlaying(false)
        }
    }

    const stopAudio = () => {
        const audio = audioRef.current
        if (!audio) return

        audio.pause()
        audio.currentTime = 0
        setIsPlaying(false)
        setProgress(0)
        setCurrentTime(0)
    }

    const onTimeUpdate = () => {
        const audio = audioRef.current
        if (!audio) return

        setCurrentTime(audio.currentTime)
        setDuration(audio.duration || 0)
        setProgress((audio.currentTime / audio.duration) * 100 || 0)
    }

    const onSeek = (e) => {
        const audio = audioRef.current
        if (!audio) return

        const value = Number(e.target.value)
        audio.currentTime = (audio.duration * value) / 100
        setProgress(value)
    }

    const formatTime = (time = 0) => {
        const min = Math.floor(time / 60)
        const sec = Math.floor(time % 60)
        return `${min}:${sec < 10 ? "0" : ""}${sec}`
    }

    return (
        <div className={styles.column}>
            <div className={styles.commentCard}>
                <div className={styles.commentHeader}>
                    {/*<strong>*/}
                    {/*    Telefon qilingan: {comment.added_date} / {comment.to_date}*/}
                    {/*</strong>*/}

                    <strong>
                        {comment.name} {comment.surname}
                        {" "}
                        <span>
                            {
                                (comment.to_date || comment.date)
                                    ? `(${comment.added_date} / ${comment.to_date ?? comment.date})`
                                    : `(${comment.added_date})`
                            }
                        </span>
                    </strong>

                    <div className={styles.icons}>
                        <div className={styles.icons__options}>
                            {/* STOP */}
                            {/*<i*/}
                            {/*    className={classNames(*/}
                            {/*        "fa-solid fa-stop",*/}
                            {/*        styles.icons__audio*/}
                            {/*    )}*/}
                            {/*    onClick={stopAudio}*/}
                            {/*/>*/}

                            {/* PLAY / PAUSE */}
                            <i
                                className={classNames(
                                    "fa-solid fa-list-ul",
                                    styles.icons__audio
                                )}
                                onClick={() => navigate(`../storyProfile/${comment.student_id ?? comment.lead_id}/${activeCategory}`)}
                            />
                            {
                                activeCategory !== "leads" && (
                                    <i
                                        className={classNames(
                                            "fa-solid fa-user",
                                            styles.icons__audio
                                        )}
                                        onClick={() => navigate(`../../profile/${comment.user_id}`)}
                                    />
                                )
                            }
                            {
                                comment?.audio_url && (
                                    <i
                                        className={classNames(
                                            `fa-solid fa-${isPlaying ? "pause" : "play"}`,
                                            styles.icons__audio
                                        )}
                                        onClick={togglePlay}
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className={styles.commentText}>
                    Comment: {comment.comment || ""}
                </div>

                {/* TIME + SEEK */}
                {
                    comment?.audio_url && (
                        <div className={styles.audio}>
                            <p className={styles.audio__subTitle}>
                                {formatTime(currentTime)}
                                {" / "}
                                {
                                    duration
                                        ? formatTime(duration)
                                        : `${comment.duration >= 60 ? Math.floor(comment.duration / 60) : "0"}:${comment.duration
                                            ? (Number(comment.duration) - (60 * Math.floor(comment.duration / 60)))
                                                < 10
                                                ? `0${comment.duration}`
                                                : Number(comment.duration) - (60 * Math.floor(comment.duration / 60))
                                            : "00"}`
                                }
                            </p>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={onSeek}
                            />
                        </div>
                    )
                }
            </div>

            <audio
                ref={audioRef}
                onTimeUpdate={onTimeUpdate}
                onEnded={stopAudio}
            />
        </div>
    )
}

export default NewTaskManager
