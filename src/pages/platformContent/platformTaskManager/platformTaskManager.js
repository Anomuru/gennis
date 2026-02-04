import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import classNames from "classnames";
import { get, useForm } from "react-hook-form";
import Calendar from "react-calendar";
import { useDispatch, useSelector } from "react-redux";
import 'react-calendar/dist/Calendar.css';
import { motion, useDragControls, useMotionValue, useMotionValueEvent } from "framer-motion";

import Modal from "components/platform/platformUI/modal";
import InputForm from "components/platform/platformUI/inputForm";
import Button from "components/platform/platformUI/button";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import Select from "components/platform/platformUI/select";
import Confirm from "components/platform/platformModals/confirm/confirm";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import PlatformMessage from "components/platform/platformMessage";
import { useHttp } from "hooks/http.hook";
import { BackUrl, formatDate, headers } from "constants/global";
import {
    changeNewStudentsDel,
    changeLead,
    deleteLead,
    fetchedProgress,
    fetchingProgress,
    fetchNewStudentsData,
    fetchDebtorStudentsData,
    fetchLeadsData,
    fetchCompletedDebtorsData,
    fetchedSearch,
    fetchingSearch,
    fetchDebtorsData,
    onDelDebtors,
    onChangeProgress,
    fetchUserDataWithHistory,
    fetchNewStudentsTaskData,
    onDelNewStudents,
    fetchCompletedNewStudentsTaskData, fetchCompletedLeadsData, onDelLeads
} from "slices/taskManagerSlice";

import cls from "./platformTaskManager.module.sass";
import unknownUser from "assets/user-interface/user_image.png";
import taskCardBack from "assets/background-img/TaskCardBack.png";
import taskCardBack2 from "assets/background-img/TaskCardBack2.png";
import taskCardBack3 from "assets/background-img/greenBg.png";
import taskCardBack4 from "assets/background-img/blackBg.png";
import taskCardBack5 from "assets/background-img/navyBg.png";
import taskCardBack6 from "assets/background-img/grayBg.png";
import switchXButton from "assets/icons/bx_task-x.svg";
import switchCompletedBtn from "assets/icons/progress.svg";


import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import { setMessage } from "slices/messageSlice";
import { json, Link, useNavigate, useParams } from "react-router-dom";
import Input from "components/platform/platformUI/input";
import PlatformSearch from "components/platform/platformUI/search";
import Table from "components/platform/platformUI/table";
import { fetchDataToChange } from "slices/dataToChangeSlice";
import Form from "../../../components/platform/platformUI/form/Form";

const FuncContext = createContext(null)
const options = [
    {
        name: "tel ko'tardi",
        label: "yes"
    },
    {
        name: "tel ko'tarmadi",
        label: "no"
    }
]
const menuList = [
    {
        name: "debtors",
        label: "Qarzdorlar"
    },
    {
        name: "newStudents",
        label: "Yangi o’quvchilar"
    },
    {
        name: "leads",
        label: "Lead"
    }
]
const colorStatusList = ["red", "yellow", "green", "navy", "black", "noColor"]

const PlatformTaskManager = () => {

    const { locationId } = useParams()

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
        profile
    } = useSelector(state => state.taskManager)


    const [activeMenu, setActiveMenu] = useState(menuList[0].name)
    const [isCompleted, setIsCompleted] = useState(false)

    const dispatch = useDispatch()
    const { request } = useHttp()
    const { register, handleSubmit, setValue } = useForm()


    const [activeModal, setActiveModal] = useState(false)
    const [leadId, setLeadId] = useState()
    const [date, setDate] = useState(new Date())
    const [studentId, setStudentId] = useState()
    const [studentSelect, setStudentSelect] = useState()
    const [dellLead, setDellLead] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [leadActive, setLeadActive] = useState(false)
    const [tableData, setTableDate] = useState([])


    const [data, setData] = useState(null)
    const [banListColors, setBanListColors] = useState([])

    const [selectedAudioId, setSelectedAudioId] = useState({ id: null, state: null })
    const [isCall, setIsCall] = useState(false)
    const [audioCom, setAudioCom] = useState(null)
    const [audioDate, setAudioDate] = useState(null)


    useEffect(() => {
        const oldCompleted = JSON.parse(localStorage.getItem("isCompleted"))
        const type = localStorage.getItem("taskMenuType")
        if (oldCompleted) {
            setIsCompleted(oldCompleted)
        } else {
            setIsCompleted(false)
        }

        setActiveMenu(type)
    }, [])



    // Cards color banList

    useEffect(() => {


        if (isCompleted) {
            switch (activeMenu) {
                case "leads":
                    setBanListColors(["red", "yellow"])
                    break;
                case "newStudents":
                    setBanListColors(["green", "red", "navy", "black"])
                    break;
                case "debtors":
                    setBanListColors([])
                    break;
            }
        } else {
            switch (activeMenu) {
                case "debtors":
                    setBanListColors(["green"])
                    break;
                case "newStudents":
                    setBanListColors(["green", "red", "navy", "black"])
                    break;
                case "leads":
                    setBanListColors(["green"])
                    break;
            }
        }


    }, [isCompleted, activeMenu])


    // Fetch data from type and date

    useEffect(() => {
        if (!locationId && !date) return;

        const formatted = formatDate(date)

        if (isCompleted) {
            switch (activeMenu) {
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
            switch (activeMenu) {
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


    }, [activeMenu, locationId, date, isCompleted])

    // set current data from fetched data

    useEffect(() => {
        if (!locationId && !date) return;


        if (isCompleted) {
            switch (activeMenu) {
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
            switch (activeMenu) {
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

    useEffect(() => {
        if (!selectedAudioId.id) return;

        let isActive = true;
        let timeoutId = null;

        setIsCall(true);

        const poll = async () => {
            if (!isActive) return;

            try {
                const response = await request(
                    `${BackUrl}task_leads/call-status/${selectedAudioId.id}`,
                    "GET",
                    null,
                    headers()
                );

                setSelectedAudioId(prev => ({ ...prev, state: response?.state }))

                // ❗ проверка состояния
                if (response?.state === "SUCCESS") {
                    // setIsCall(false);
                    setSelectedAudioId(prev => ({ ...prev, state: response?.state, lead_id: response?.result?.lead_info_id }))
                    isActive = false; // останавливаем polling
                    return;
                }

                // продолжаем polling
                timeoutId = setTimeout(poll, 5000);

            } catch (error) {
                console.error(error);
                timeoutId = setTimeout(poll, 5000);
            }
        };

        poll();

        return () => {
            isActive = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [selectedAudioId?.id]);



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


    const renderMenuItems = useCallback(() => {
        return menuList.map((item, i) => {
            return (
                <div className={cls.otherItems}>
                    <p
                        className={classNames(cls.other__item, {
                            [cls.active]: activeMenu === item?.name
                        })}
                    >
                        {calcLengthData(item?.name, isCompleted)}
                    </p>
                    <h2
                        key={i}
                        className={classNames(cls.other__item, {
                            [cls.active]: activeMenu === item?.name
                        })}
                        onClick={() => {
                            setActiveMenu(item?.name)
                            // setIsCompleted(false)
                            setSearchValue("")
                            localStorage.setItem("taskMenuType", item?.name)
                        }}
                    >
                        {item?.label}
                    </h2>
                </div>
            )
        })
    }, [activeMenu, menuList, unCompleted, completed])




    const onChangeIsCompleted = (status) => {
        setData([])
        setIsCompleted(status)
    }





    function showMessage(msg) {
        setValue("comment", "")
        setValue("date", "")
        setStudentSelect(null)
        setActiveModal(false)
        dispatch(setMessage({
            msg: msg,
            type: "success",
            active: true
        }))
    }

    const onSubmit = () => {

        console.log("hello")

        const res = {
            id: 18,
            comment: audioCom,
            date: audioDate,
        }

        console.log(selectedAudioId, "selectedAudioId")


        if (activeMenu === "newStudents") {


            dispatch(onDelNewStudents({ id: res.id }))


            request(`${BackUrl}task_new_students/call_to_new_students`, "POST", JSON.stringify(res), headers())
                .then(res => {


                    console.log(res)

                    if (res?.student.student_id) {
                        dispatch(onChangeProgress({
                            progress: res.student.task_statistics,
                            allProgress: res.student.task_daily_statistics
                        }))

                        showMessage(res.student.msg)
                    } else {
                        showMessage(res.msg)
                    }
                })
                .catch(err => console.log(err))

        } else if (activeMenu === "debtors") {

            const result = {
                select: studentSelect,
                ...res
            }

            request(`${BackUrl}task_debts/call_to_debts`, "POST", JSON.stringify(result), headers())
                .then(res => {

                    console.log(res)
                    dispatch(onDelDebtors({ id: result.id }))
                    dispatch(onChangeProgress({ progress: res.task_statistics, allProgress: res.task_daily_statistics }))

                    showMessage(res.message)
                })
                .catch(err => console.log(err))


        } else if (activeMenu === "leads") {

            request(`${BackUrl}task_leads/task_leads_update/${selectedAudioId?.lead_id}`, "POST", JSON.stringify({
                ...res,
                location_id: locationId
            }), headers())
                .then(res => {
                    if (res.lead_id) {
                        dispatch(onDelLeads({ id: res?.lead_id }))
                        dispatch(onChangeProgress({
                            progress: res.task_statistics,
                            allProgress: res.task_daily_statistics
                        }))
                    }
                    showMessage(res.msg)
                    setIsCall(false)
                })
                .catch(err => console.log(err))


        }
    }

    const onClick = (id) => {
        // setActiveModal(true)
        // dispatch(fetchUserDataWithHistory({ id, type: activeMenu }))
        setStudentId(id)
    }

    const onChange = (value) => {
        setStudentSelect(value)
    }

    const onDelete = (data) => {
        const res = {
            location_id: locationId,
            status: studentId?.status,
            ...data
        }
        request(`${BackUrl}task_leads/task_leads_delete/${studentId?.id}`, "DELETE", JSON.stringify(res), headers())
            .then((res) => {
                setIsConfirm(false)
                setDellLead(false)
                dispatch(onDelLeads({ id: studentId?.id }))
                dispatch(onChangeProgress({ progress: res.task_statistics, allProgress: res.task_daily_statistics }))
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
            })

        if (data.confirm === "no") {
            setDellLead(false)
        }
    }

    const onLeadAdd = (source) => {
        console.log(source)
        const data = {
            ...source,
            recommended_by_id: leadId
        }
        const formatted = formatDate(date)
        request(`${BackUrl}register_lead/recommend`, "POST", JSON.stringify(data), headers())
            .then((res) => {
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
                dispatch(fetchLeadsData({ locationId, date: formatted }))
                setLeadActive(false)
                setActiveModal(false)

            })


    }


    // const onSearch = (value) => {
    //     setSearchValue(value)
    //     if (value !== "") {
    //         dispatch(fetchingSearch())
    //
    //         request(`${BackUrl}student/search_student_in_task/${locationId}`, "POST", JSON.stringify({
    //             text: value,
    //             type: activeMenu,
    //             status: isCompleted
    //         }), headers())
    //             .then(res => {
    //                 dispatch(fetchedSearch(res.students))
    //             })
    //             .catch(err => console.log(err))
    //     }
    // }


    const contextObj = useMemo(() => ({
        activeMenu: activeMenu,
        getStudentId: setStudentId,
        click: onClick,
        onDelete: setDellLead,
        isCompleted: isCompleted,
        dispatch: dispatch,
        location: locationId,
        completedLength: completedDebtorStudent.length,
        setSelectedAudioId: setSelectedAudioId
    }), [activeMenu, isCompleted, locationId, completedDebtorStudent])


    // const resetStat = () => {
    //     request(`${BackUrl}`, "")
    // }


    const searchedData = useMemo(() => {
        const filteredData = data?.slice() || []


        if (searchValue && !isNaN(+searchValue) && typeof +searchValue === "number") {
            return filteredData.filter(item => {

                return item.phone.includes(searchValue) ||
                    item?.parent?.includes(+searchValue)
            })
        }

        return filteredData.filter(item =>
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.surname.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.username.toLowerCase().includes(searchValue.toLowerCase())
        )
    }, [data, searchValue])


    const renderData = useCallback(() => {

        // if (unCompletedStatus === "loading" || unCompletedStatus === "idle" || completedStatus === "loading" || completedStatus === "idle" ) {
        //     return <DefaultLoaderSmall/>
        // }

        switch (isTable) {
            case true:
                return (
                    <TableData
                        isCompleted={isCompleted}
                        arr={searchedData}
                        activeType={activeMenu}
                    />
                )
            case false:
                return (
                    <RenderCards
                        isCompleted={isCompleted}
                        arr={searchedData}
                        activeType={activeMenu}
                        banList={banListColors}
                        status={unCompletedStatus || completedStatus}

                    />
                )
        }
    }, [isTable, searchedData, isCompleted, activeMenu, banListColors, unCompletedStatus, completedStatus, searchValue])


    return (
        <div className={cls.tasks}>
            <div className={cls.tasks__inner}>
                <div className={cls.header}>
                    <PlatformSearch search={searchValue} setSearch={setSearchValue} />
                    {/*<h1>My tasks</h1>*/}
                    {/*<div className={cls.header__search}>*/}

                    <div style={{ display: "flex", gap: "2rem" }}>
                        <SwitchButton
                            isCompleted={isCompleted}
                            setIsCompleted={onChangeIsCompleted}
                            setSearchValue={setSearchValue}
                        />
                    </div>

                    {/*<PlatformSearch search={search} setSearch={setSearch}/>*/}
                    {/*<Input*/}
                    {/*    placeholder={"Qidiruv"}*/}
                    {/*    // onChange={}*/}
                    {/*/>*/}
                    {/*</div>*/}
                </div>


                <div className={cls.contentTask}>
                    <div className={cls.contentTask__inner}>
                        <h1>My tasks</h1>
                        <Completed
                            style={isCompleted ? "#34c9eb" : "#ff8c42"}
                            progress={isCompleted ? allProgress?.completed_tasks : allProgress?.in_progress_tasks}
                            progressStatus={progressStatus}
                        />
                    </div>
                    {
                        tableData.is_selected === true && !isCompleted ? null : <div className={cls.menuTask}>
                            <div className={cls.menuTask__list}>
                                <div className={cls.other}>
                                    {renderMenuItems()}
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className={cls.tasks__handler}>
                    <FuncContext.Provider value={contextObj}>
                        <div className={cls.items}>
                            {renderData()}
                        </div>
                    </FuncContext.Provider>


                    <div className={cls.tasks__banner}>
                        <div className={cls.info}>
                            <div className={cls.info__date}>
                                <Calendar
                                    defaultValue={date}
                                    onChange={setDate}
                                />
                            </div>
                        </div>
                        <div className={cls.info__progress}>
                            <div className={cls.completeTask}>
                                <div className={cls.completeTask__precent}>
                                    <div>
                                        <div className={cls.circleProgress}>
                                            <Completed progress={`${allProgress?.completed_tasks_percentage || 0}%`} />
                                        </div>
                                        <h2>All Rating</h2>
                                    </div>
                                    <div>
                                        <div className={cls.circleProgress}>
                                            <Completed progress={`${progress?.completed_tasks_percentage || 0}%`} />
                                        </div>
                                        <h2>{activeMenu}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>


            <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                <div className={cls.userbox}>
                    <div className={cls.userbox__img}>
                        <Link to={`../../profile/${studentId}`}>
                            <img src={profile.img ? profile.img : unknownUser} alt="" />
                        </Link>
                        {
                            activeMenu === "leads" ?
                                <Button extraClass={cls.userbox__btn} children={"+"} onClickBtn={() => {
                                    setLeadActive(!leadActive)
                                    setLeadId(studentId)
                                }} /> : null
                        }


                    </div>
                    <h2 className={cls.userbox__name}>
                        <span>{profile.name} {profile.surname}</span> <br />
                    </h2>
                    <div className={cls.userbox__info}>
                        <div className={cls.userbox__infos}>
                            <p className={cls.userbox__subjects}>
                                Balance :
                                <span>{profile.balance ? profile.balance : <>No balance</>} </span>
                            </p>
                            <p className={cls.userbox__number}>
                                Number :
                                <span>{profile.phone} </span>
                            </p>
                        </div>
                    </div>
                    {
                        isCompleted ? null : <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={cls.userbox__inputs}>
                                {
                                    activeMenu === "debtors" ? <Select
                                        options={options}
                                        // defaultValue={options[0].name}
                                        onChangeOption={onChange}
                                    /> : null
                                }
                                {
                                    studentSelect === "tel ko'tarmadi" ? null : <>
                                        <InputForm placeholder="koment" type="text" register={register} name={"comment"}
                                            required />
                                        <InputForm placeholder="keyingiga qoldirish" type="date" register={register}
                                            name={"date"}
                                            required />
                                    </>
                                }
                            </div>
                            <div className={cls.userbox__footer_btn}>
                                <Button type={"submit"} formId>
                                    Button
                                </Button>
                            </div>
                        </form>
                    }
                </div>
                {profile.comments?.length >= 1 ? <div className={cls.wrapperList}>
                    {
                        profile.comments && profile.comments?.map((item) => {
                            return (
                                <div className={cls.wrapperList__box}>
                                    <div className={cls.wrapperList__items}>
                                        <div className={cls.wrapperList__number}>
                                            Telefon qilingan :
                                            <span>
                                                {activeMenu === "newStudents" ? item.day : `${item.added_date} / ${item.to_date}`}
                                            </span>
                                        </div>
                                        <div className={cls.wrapperList__number}>
                                            Comment : <span>{item.comment}</span>
                                        </div>
                                        <div className={cls.wrapperList__number}>
                                            {item.shift}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div> : null}
                {profile.invitations?.length >= 1 ? <div className={cls.wrapperList}>
                    {
                        profile.invitations && profile.invitations?.map((item) => {
                            return (
                                <div className={cls.wrapperList__box}>
                                    <div className={cls.wrapperList__items}>
                                        <div className={cls.wrapperList__comment}>
                                            Ism-familiya : <span>{item.name}</span>
                                        </div>
                                        <div className={cls.wrapperList__smen}>
                                            {item.phone}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div> : null}
            </Modal>
            <Modal activeModal={leadActive} setActiveModal={() => setLeadActive(!leadActive)}>
                <Form extraClassname={cls.leadModal} onSubmit={handleSubmit(onLeadAdd)}>
                    <InputForm
                        register={register}
                        name={"name"}
                        type={"text"}
                        required
                        placeholder={"Ism-Familiya"}
                    />
                    <InputForm
                        register={register}
                        name={"phone"}
                        type={"number"}
                        required
                        placeholder={"Telefon raqami"}
                    />

                </Form>
            </Modal>
            <Modal activeModal={dellLead} setActiveModal={() => setDellLead(false)}>
                <Confirm setActive={setDellLead} getConfirm={setIsConfirm} text={"O'chirishni hohlaysizmi"} />
            </Modal>
            {
                isConfirm === "yes" ?
                    <Modal
                        activeModal={dellLead}
                        setActiveModal={() => {
                            setDellLead(false)
                            setIsConfirm(false)
                        }}
                    >
                        <ConfimReason getConfirm={onDelete} reason={true} />
                    </Modal> : null
            }
            <PlatformMessage />
            <Modal
                activeModal={isCall}
                setActiveModal={setIsCall}
                extraClass={cls.audioModal}
            >
                <div className={cls.audioModal__loader}>
                    <CallStatusLoader
                        status={selectedAudioId.state}
                    // status={"SUCCESS"}
                    />
                </div>
                {
                    selectedAudioId.state === "SUCCESS" && (
                        <>
                            <Input
                                title={"Koment"}
                                placeholder={"Koment"}
                                onChange={setAudioCom}
                            />
                            <Input
                                type={"date"}
                                title={"Kun"}
                                // placeholder={"Koment"}
                                onChange={setAudioDate}
                            />
                            <Button onClickBtn={onSubmit}>Kiritish</Button>
                        </>
                    )
                }
            </Modal>
        </div>
    );
};

const TableData = ({ arr }) => {

    const stringCheck = (name, length = 10) => {
        if (name?.length > length) {
            return (
                <>
                    {name.substring(0, length)}...
                    <div className={cls.popup}>
                        {name}
                    </div>
                </>
            )
        }
        return name
    }
    const renderData = () => {
        return arr?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{stringCheck(item.name)}</td>
                <td>{stringCheck(item.surname)}</td>
                <td>{item?.phone}</td>
                <td>{stringCheck(item?.reason, 20)}</td>
            </tr>
        ))
    }
    const render = renderData()


    return (
        <Table className={cls.table_results}>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Ism</th>
                    <th>Familiya</th>
                    <th>Telefon raqami</th>
                    <th>Sababi</th>
                </tr>
            </thead>
            <tbody>
                {render}
            </tbody>
        </Table>
    )
}


const Completed = ({ progress, progressStatus, style = "black" }) => {
    if (progressStatus === "loading" || progressStatus === "idle") {
        return <DefaultLoaderSmall />
    } else {
        return (
            <h1 style={{ color: style, fontSize: "2.6rem" }}>{progress} </h1>
        )
    }
}


const RenderCards = ({ isCompleted, arr, status, activeType, banList }) => {

    const filteredItems = useCallback((color) => {
        return arr?.filter(item => {

            if (activeType === "leads") {
                return item.status === color
            }

            if (typeof item.moneyType === "string" && item.moneyType) {
                return item.moneyType === color
            }

            if (color === "noColor" && typeof item.moneyType !== "string") {
                return item
            }

        })
    }, [arr, activeType])

    if (status === "loading" || status === "idle") {
        return <DefaultLoader />
    }


    if (activeType === "newStudents") {

        return (
            <RenderItem
                arr={arr}
                index={1}
            />
        )
    }

    return colorStatusList.map((item, i) => {

        switch (activeType) {
            case "debtors":
                if (banList?.includes(item)) return null

                return (
                    <RenderItem
                        arr={filteredItems(item)}
                        index={i}
                    />
                )

            case "leads":
                if (banList?.includes(item)) return null
                return (
                    <RenderItem
                        arr={filteredItems(item)}
                        index={i}
                    />
                )
        }
    })
}


// const Leads = ({isCompleted, arr, arrStatus}) => {
//     if (arrStatus === "loading" || arrStatus === "idle") {
//         return <DefaultLoader/>
//     } else {
//         const filteredRed = arr.filter(item => item.status === "red")
//         const filteredYellow = arr.filter(item => item.status === "yellow")
//         const filteredGreen = arr.filter(item => item.status === "green")
//         return (
//             colorStatusList.map((item, i) => {
//                 if (isCompleted && (item === "red" || item === "yellow")) return null
//                 if (!isCompleted && item === "green") return null
//                 return (
//                     <RenderItem
//                         arr={item === "red" ? filteredRed : item === "yellow" ? filteredYellow : filteredGreen}
//                         index={i}
//                     />
//                 )
//             })
//         )
//     }
// }
//
// const Student = ({arr, arrStatus}) => {
//     const filteredRed = arr.filter(item => item.status === "red")
//     const filteredYellow = arr.filter(item => item.status === "yellow")
//
//     if (arrStatus === "loading" || arrStatus === "idle") {
//         return <DefaultLoader/>
//     }
//     return (
//         colorStatusList.map((item, i) => {
//             if (item === "green") return null
//             return (
//                 <RenderItem
//                     arr={item === "red" ? filteredRed : filteredYellow}
//                     index={i}
//
//                 />
//
//
//             )
//         })
//     )
// }

const RenderItem = React.memo(({ arr, index }) => {


    useEffect(() => {
        const elem = document.querySelectorAll("#main")
        const elements = document.querySelectorAll("#scroll__inner")
        const components = document.querySelectorAll("#scroll")
        elements.forEach((item, i) => {
            if (!item.innerHTML) {
                components[i].style.display = "none"
                if (elem[i]) elem[i].style.display = "none"
            } else {
                components[i].style.display = "flex"
                if (elem[i]) elem[i].style.display = "flex"
            }
        })
    }, [arr])

    const x = useMotionValue(0)
    const [width, setWidth] = useState(0)
    const wrapper = useRef()
    const { activeMenu, isCompleted, setSelectedAudioId } = useContext(FuncContext)

    useEffect(() => {
        setWidth(wrapper.current?.scrollWidth - wrapper.current?.offsetWidth)
        x.set(0)
    }, [arr?.length, isCompleted, activeMenu])
    const controls = useDragControls()

    return (
        <motion.div
            key={index}
            className={cls.scroll}
            id="scroll"
            ref={wrapper}
        >
            <motion.div
                className={cls.scroll__inner}
                id="scroll__inner"
                drag={"x"}
                style={{
                    x
                }}
                dragElastic={0}
                dragMomentum={false}
                dragConstraints={{ left: -width, right: 0 }}
                dragControls={controls}
            >
                {
                    arr?.map((item, i) => {
                        return (
                            <TaskCard
                                item={item}
                                index={i}
                                type={activeMenu}
                                setSelectedAudioId={setSelectedAudioId}
                            />
                        )
                    })
                }
            </motion.div>
        </motion.div>
    )
})

const TaskCard = ({ item, index, type, setSelectedAudioId }) => {

    const navigate = useNavigate()
    const { request } = useHttp()

    const { activeMenu, click, onDelete, getStudentId, isCompleted } = useContext(FuncContext)
    const [style, setStyle] = useState({})
    const [taskId, setTaskId] = useState(null)

    const renderBgImage = (color) => {
        switch (color) {
            case "red":
                return `url(${taskCardBack})`
            case "yellow":
                return `url(${taskCardBack2})`
            case "green":
                return `url(${taskCardBack3})`
            case "black":
                return `url(${taskCardBack4})`
            case "navy":
                return `url(${taskCardBack5})`
            default:
                return `url(${taskCardBack6})`

        }
    }




    useEffect(() => {
        switch (activeMenu) {
            case "leads":
                setStyle({
                    backImage: renderBgImage(item?.status),
                })
                break;
            default:

                setStyle({
                    // generalBack: `${cls.b}`,
                    // generalBack: item?.moneyType === "red" ?
                    //     "#FFE4E6" : item.moneyType === 'navy' ? "navy" : item.moneyType === "black" ? "black" :  "#FEF9C3",

                    backImage: renderBgImage(item?.moneyType)
                })
                break;
        }
    }, [activeMenu, item.moneyType, item?.status])


    const onPhone = () => {
        let post;
        if (activeMenu === "leads") {
            post = { lead_id: item.id }
        }


        request(`${BackUrl}task_leads/call-to-lead`, "POST", JSON.stringify(post), headers())
            .then(res => {
                setSelectedAudioId({ id: res.task_id, state: res?.state })
                click(item?.id)
            })
    }

    // const onGet = () => {
    //     request(`${BackUrl}task_leads/call-status/${taskId}`, "GET", null, headers())
    // }



    return (
        <motion.div
            key={index}
            className={classNames(cls.item, cls[item?.moneyType || item?.status || "noColor"])}
            style={{
                color: item.moneyType === "navy" ? "white" : item.moneyType === "black" ? "white" : ""
            }}
        >
            {
                (activeMenu === "leads" && !isCompleted) ?
                    <i
                        className={classNames("fas fa-trash", cls.icon)}
                        onClick={() => {
                            onDelete(true)
                            getStudentId({ id: item?.id, status: item?.status })
                        }}
                    /> : null
            }
            <i
                className={classNames(
                    "fa-solid fa-phone-flip",
                    cls.item__phone
                )}
                onClick={onPhone}
            />
            <div
                className={classNames(cls.item__info, {
                    [cls.active]: activeMenu === "leads"
                })}

            >
                {
                    activeMenu === "leads" ? null : <h2
                        className={cls.debt}

                    >
                        {
                            activeMenu === "debtors" ? item?.balance : item?.registered_date
                        }
                    </h2>
                }
                <h2
                    style={{ color: item.moneyType === "navy" ? "white" : item?.moneyType === "black" ? "white" : "" }}
                    className={cls.username}
                // onClick={onGet}
                >
                    {item?.name} {item?.surname}</h2>
                <ul
                    className={classNames(cls.infoList, {
                        [cls.active]: activeMenu === "leads"
                    })}
                >
                    <li className={cls.infoList__item}>number: <span>{item?.phone}</span></li>

                    {/*{*/}
                    {/*    activeMenu === "debtors" ? <>*/}
                    {/*        <li className={cls.infoList__item}>Ingliz tili: <span>390000</span></li>*/}
                    {/*        <li className={cls.infoList__item}>IT: <span>390000</span></li>*/}
                    {/*    </> : null*/}
                    {/*}*/}
                    {
                        activeMenu === "leads" ?
                            <li className={cls.infoList__item}>Register date: <span>{item?.day}  </span></li> :
                            <>
                                {/*<li className={cls.infoList__item}>Koment: <span>{item?.comment}  </span></li>*/}


                            </>
                    }
                    {
                        activeMenu === "newStudents" ?
                            <>
                                {/*{item?.subjects?.map(item =>*/}
                                {/*    (*/}
                                {/*        <li className={cls.infoList__item}>Fan: <span>{item}</span></li>*/}
                                {/*    )*/}
                                {/*)}*/}
                                <li className={cls.infoList__item}>Fani: <span>{item?.subjects.map(item => (
                                    `${item ? item : item?.name} `
                                ))}</span></li>
                                <li className={cls.infoList__item}>Number: <span>{item?.phone}</span></li>
                                <li className={cls.infoList__item}>Parent number: <span>{item?.parent}</span></li>
                            </> : null
                    }
                    {
                        activeMenu === "debtors" ?
                            <>

                                <li className={cls.infoList__item}>Tel status: <span>{item?.reason}</span></li>

                                <li className={cls.infoList__item}>Number: <span>{item?.phone}</span></li>
                                <li className={cls.infoList__item}>Parent number: <span>{item?.parent}</span></li>
                            </>


                            : null
                    }
                </ul>
            </div>
            <div
                className={cls.item__image}
                style={{ backgroundImage: style.backImage }}
            >
                <div
                    className={cls.circle}
                    onClick={
                        () =>
                            navigate(`../storyProfile/${item.id}/${type}`)
                        // (item.status === "green" || isCompleted) ? null :
                        // {
                        // click(item?.id)
                        // }
                    }
                >
                    <img src={unknownUser} alt="" />
                </div>
            </div>
        </motion.div>
    )
}

const SwitchButton = ({ isCompleted, setIsCompleted, setSearchValue }) => {
    return (
        <div className={cls.switchBox}>
            <div className={`${cls.switch} ${isCompleted ? `${cls.completed}` : `${cls.inProgress} `}`}
                onClick={() => {
                    setIsCompleted(!isCompleted)
                    setSearchValue("")
                }}>
                <div className={cls.iconButton}>
                    {isCompleted ?
                        <div className={cls.icon__handlerSucces}>
                            <img className={cls.buttonIcon} src={switchCompletedBtn} alt="" />
                        </div>
                        :
                        <div className={cls.icon__handler}>
                            <img src={switchXButton} className={cls.buttonIcon} alt="" />
                        </div>
                    }
                </div>
                <span className={cls.textContent}>
                    {isCompleted ? (
                        <h1 className={cls.textContentSucces}>Completed</h1>
                    ) : (
                        <h1 className={cls.textContent}>In Progress</h1>
                    )}
                </span>

            </div>
        </div>
    );
};

const CallStatusLoader = ({ status }) => {
    const [showCheckmark, setShowCheckmark] = useState(false)

    useEffect(() => {
        if (status === "SUCCESS") {
            // Small delay to allow smooth transition
            setTimeout(() => setShowCheckmark(true), 100)
        } else {
            setShowCheckmark(false)
        }
    }, [status])

    return (
        <div className={cls.container}>
            <div className={cls.loaderWrapper}>
                {/* Circular Loader */}
                <span
                    className={classNames(cls.parent, {
                        [cls.fadeOut]: status === "SUCCESS"
                    })}
                >
                    <span className={cls.loader} />
                </span>

                {/* Checkmark */}
                <svg
                    className={`${cls.checkmark} ${showCheckmark ? cls.show : ""}`}
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path className={cls.checkmarkPath} d="M 25 52 L 42 68 L 75 32" />
                </svg>
            </div>

            {/* Status text */}
            <p className={cls.statusText}>{status === "STARTED" ? "Calling in progress..." : status === "SUCCESS" ? "Call successed" : "Call connected"}</p>
        </div>
    )
}


export default PlatformTaskManager;
