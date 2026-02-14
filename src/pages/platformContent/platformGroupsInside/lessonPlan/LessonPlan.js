import React, { useCallback, useEffect, useRef, useState } from 'react';
import cls from "./lessonPlan.module.sass"

import { useForm } from "react-hook-form";

import classNames from "classnames";
import { BackUrl, BackUrlForDoc, headers } from "constants/global";
import userImg from "assets/user-interface/user_image.png";
import { useHttp } from "hooks/http.hook";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "hooks/useAuth";

import { setMessage } from "slices/messageSlice";
import BackButton from "components/platform/platformUI/backButton/backButton";
import Button from "components/platform/platformUI/button";
import Select from "components/platform/platformUI/select";
import Input from "components/platform/platformUI/input";
import Form from "components/platform/platformUI/form/Form";
import Textarea from "components/platform/platformUI/textarea";
import Modal from "components/platform/platformUI/modal";
import InputForm from "components/platform/platformUI/inputForm";


const LessonPlan = ({ backBtn }) => {


    const { groupId } = useParams()

    const [planId, setPlanId] = useState()

    const [year, setYear] = useState()
    const [years, setYears] = useState([])

    const [month, setMonth] = useState()
    const [months, setMonths] = useState([])


    const [day, setDay] = useState()
    const [days, setDays] = useState([])


    const [activeModal, setActiveModal] = useState(false)
    const [canChange, setCanChange] = useState(false)
    const [students, setStudents] = useState([])

    const [ball, setBall] = useState()
    const [conclusion, setConclusion] = useState()

    const { register, handleSubmit, setValue } = useForm()

    const { request } = useHttp()

    useEffect(() => {
        console.log(groupId)
        if (groupId) {
            request(`${BackUrl}teacher/lesson_plan_list/${groupId}`, "GET", null, headers())
                .then(res => {
                    if (res.month_list.length === 1) {
                        setMonth(res.month_list[0])
                    }
                    setMonths(res.month_list)
                    if (res.years_list.length === 1) {
                        setYear(res.years_list[0])
                    }
                    setYears(res.years_list)
                    setMonth(res.month)
                    setYear(res.year)
                })
        }
    }, [groupId])


    useEffect(() => {
        if (year && month) {
            request(`${BackUrl}teacher/lesson_plan_list/${groupId}/${year}-${month}`, "GET", null, headers())
                .then(res => {
                    console.log(res)
                    setDays(res.days)
                })
        }

    }, [year && month])

    useEffect(() => {
        const data = {
            month,
            day,
            year,
            group_id: groupId
        }

        if (year && month && day && groupId) {
            request(`${BackUrl}teacher/get_lesson_plan`, "POST", JSON.stringify(data), headers())
                .then(res => {
                    setCanChange(res.status)
                    setValue("homework", res.lesson_plan.homework)
                    setValue("objective", res.lesson_plan.objective)
                    setBall(res.lesson_plan.ball)
                    setConclusion(res.lesson_plan.conclusion)
                    setValue("assessment", res.lesson_plan.assessment)
                    setValue("resources", res.lesson_plan.resources)
                    setValue("main_lesson", res.lesson_plan.main_lesson)
                    setValue("activities", res.lesson_plan.activities)
                    setStudents(res.lesson_plan.students)
                    setPlanId(res.lesson_plan.id)
                })
        }


    }, [month, year, day, groupId])

    const dispatch = useDispatch()

    const onSubmit = (data) => {

        request(`${BackUrl}change_lesson_plan/${planId}`, "POST", JSON.stringify({ ...data, students }), headers())
            .then(res => {
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
            })


    }


    const toggleModal = useCallback(() => {
        setActiveModal(!activeModal)
    }, [activeModal])


    const onChangeStudents = (id, text) => {
        setStudents(st => st.map(item => {
            if (item.student.id === id) {
                return {
                    ...item,
                    comment: text
                }
            }
            return item
        }))
    }


    const { data } = useSelector(state => state.group)

    const { name, teacher } = data
    const { id: meId } = useAuth()

    return (
        <div className={cls.lessonPlan}>
            {backBtn ? <BackButton /> : null}

            <div className={cls.header}>
                <h1>Lesson plan</h1>

                <Button onClickBtn={toggleModal}>Students</Button>
            </div>




            <div className={cls.subheader}>
                {
                    years.length > 1 ?
                        <Select
                            name={"years"}
                            value={year}
                            title={"Yil"}
                            options={years}
                            onChangeOption={(e) => {
                                setYear(e)
                            }}
                        /> : null
                }
                {
                    months.length > 1 ?
                        <Select
                            name={"month"}
                            value={month}
                            title={"Oy"}
                            options={months}
                            onChangeOption={(e) => {
                                setDay("")
                                setMonth(e)
                            }}
                        /> : null
                }
                {
                    days.length > 0 ?
                        <Select
                            name={"day"}
                            value={day}
                            title={"Kun"}
                            options={days}
                            onChangeOption={(e) => {

                                setDay(e)
                            }}
                        /> : null
                }
            </div>




            <Form id={"lessonPlan"} extraClassname={cls.form} typeSubmit={"handle"} onSubmit={handleSubmit(onSubmit)}>

                <InputForm required={true} register={register} name={"objective"} title={"Objective"} />

                <div className={cls.wrapper}>
                    <Textarea required register={register} name={"homework"} title={"Homework"} />
                    <Textarea required register={register} name={"resources"} title={"Resources"} />
                    <Textarea required register={register} name={"main_lesson"} title={"Main Lesson"} />
                    <Textarea required register={register} name={"activities"} title={"Activities"} />
                    <Textarea required register={register} name={"assessment"} title={"Assessment"} />
                </div>

                <div className={cls.separator}></div>

                <div className={cls.footerFields}>
                    <div>
                        <h2>Ball:</h2>
                        <h1>{ball}</h1>
                    </div>
                    <div className={cls.conclusion}>
                        <h2>Conclusion:</h2>
                        <p>{conclusion}</p>
                    </div>
                </div>
            </Form>

            <div className={cls.commentedStudents}>
                {
                    students.filter(item => item.comment.length).map(item => {

                        return (
                            <div className={cls.item}>
                                <h1>{item.student.name} {item.student.surname}</h1>
                                <p>
                                    {item.comment}
                                </p>

                            </div>
                        )
                    })
                }
            </div>

            <div className={cls.footer}>
                {
                    teacher?.id === meId && canChange ? <Button form={"lessonPlan"} type={"submit"} >Tasdiqlash</Button> : null
                }

            </div>

            <Modal
                // title={"Studentlar"}
                activeModal={activeModal}
                setActiveModal={toggleModal}
            >
                <Students students={students} setStudents={onChangeStudents} />
            </Modal>

        </div>
    );
};

const Students = ({ students = [], setStudents }) => {

    const insideRefArray = useRef([])

    // const [students,setStudents] = useState([])
    //
    //

    //
    //
    // const onSubmit = (id,text) => {
    //     setData(id,text)
    // }

    const onOpen = (index) => {
        for (let i = 0; i < insideRefArray.current.length; i++) {
            if (insideRefArray.current[i]) {

                const elem = insideRefArray.current[i]
                elem.querySelector(".arrow").style.transform = "rotate(-90deg)"
                elem.querySelector(".accordion").style.height = 0
            }
        }
        const elem = insideRefArray.current[index]

        if (elem.querySelector(".accordion").getBoundingClientRect().height === 0) {
            elem.querySelector(".arrow").style.transform = "rotate(0)"
            elem.querySelector(".accordion").style.height = elem.querySelector(".accordion").scrollHeight + "px"
        } else {
            elem.querySelector(".accordion").style.height = 0
        }
    }

    useEffect(() => {
        if (insideRefArray.current.length > 0) {
            for (let i = 0; i < insideRefArray.current.length; i++) {
                const elem = insideRefArray.current[i]
                if
                    (
                    elem?.querySelector(".accordion").getBoundingClientRect().height > 0 &&
                    elem?.querySelector(".accordion").getBoundingClientRect().height !== elem.querySelector(".accordion").scrollHeight
                ) {
                    elem.querySelector(".accordion").style.height = elem.querySelector(".accordion").scrollHeight + "px"
                }
            }
        }
    }, [students])

    // useEffect(() => {
    //     for (let i= 0; i < students.length; i++) {
    //
    //         if (students[i].type !== "") {
    //             const elem = insideRefArray.current[i]
    //
    //             elem.querySelector(".accordion").style.height = 0
    //
    //         }
    //     }
    // },[students])

    const renderStudents = useCallback(() => {
        return students.map((user, index) => {
            return (
                <div className={cls.item} ref={(element) => insideRefArray.current[index] = element}>
                    <div className={cls.top} onClick={() => onOpen(index)}>
                        <img src={user.img ? `${BackUrlForDoc}${user.img}` : userImg} alt="" />
                        <div className={cls.info}>
                            <h1>{user.student.name}</h1>
                            <h1>{user.student.surname}</h1>
                        </div>
                        <i className="fa-solid fa-caret-down arrow" style={{ fontSize: "2rem" }} />
                    </div>

                    <div
                        className={classNames(cls.inside, "accordion")}
                    >
                        <Textarea defaultValue={user.comment} onChange={(e) => setStudents(user.student.id, e)} title={"Comment"} />
                        {/*<Button  onClick={() => } form={"lessonPlan"} type={"submit"} >Tasdiqlash</Button>*/}
                    </div>
                </div>
            )
        })
    }, [students])



    return (
        <div className={cls.students}>
            {renderStudents()}

        </div>

    )

}

export default LessonPlan;