import {motion} from "framer-motion";
import {isMobile} from "react-device-detect";

import cls from './style.module.sass';
import {useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Context} from "pages/webSite";
import {useDispatch, useSelector} from "react-redux";
import Modal from "components/platform/platformUI/modal";
import InputForm from "components/platform/platformUI/inputForm";
import {useForm} from "react-hook-form";
import classNames from "classnames";
import WebButton from "components/webSite/webSiteUI/webButton/webButton";
import {BackUrl, ClassroomUrl, ClassroomUrlForDoc} from "constants/global";
import {setMessage} from "slices/messageSlice";
import {useHttp} from "hooks/http.hook";
import {createPortal} from "react-dom";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";

const animateChildren = {
    hidden: {
        opacity: 0,
        y: 100
    },
    show: (num) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: .7,
            delay: num * .1
        }
    }),
    exit: {
        opacity: 1,
        y: 0,
    }
}


const Course = () => {

    const {
        subjects,
        subjectsLoadingStatus,
        locations
    } = useSelector(state => state?.website)
    const {setSectionTop} = useContext(Context)

    const sectionRef = useRef()

    useLayoutEffect(() => {
        if (subjectsLoadingStatus === "success") {
            setSectionTop(cur => ({...cur, course: sectionRef?.current?.offsetTop}))
        }
    }, [setSectionTop, subjectsLoadingStatus])

    const {register, handleSubmit} = useForm()
    const [modalStatus, setModalStatus] = useState(false)
    const [clickedSubject, setClickedSubject] = useState()
    const [width, setWidth] = useState(0)
    const ref = useRef([])
    const wrapper = useRef()
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setWidth(wrapper.current?.scrollWidth - wrapper.current?.offsetWidth)
    }, [subjects.length])

    const renderCourses = (arr, setStatus) => {
        if (arr.length === 0) {
            return <h2>No</h2>
        }
        return arr.map((item, i) => {
            // if (isMobile && i >= 1) return null
            return (
                <motion.div
                    variants={animateChildren}
                    initial="hidden"
                    whileInView="show"
                    onViewportLeave="exit"
                    viewport={{amount: .2, once: true}}
                    custom={isMobile ? 1 :i}
                    ref={el => ref.current[i] = el}
                    className={cls.box}
                >
                    <div className={cls.box_icon}>
                        <img src={`${ClassroomUrlForDoc}${item.img}`} alt=""/>
                    </div>
                    <div>
                        {item.desc}
                    </div>
                    {/*<button*/}
                    {/*    className={cls.reg_item}*/}
                    {/*    onClick={() => setStatus(true)}*/}
                    {/*>*/}
                    {/*    Ro'yxatdan o'tish*/}
                    {/*</button>*/}
                    <WebButton
                        onClick={() => {
                            setClickedSubject(item.id)
                            setModalStatus(true)
                        }}
                    >
                        Ro'yxatdan o'tish
                    </WebButton>
                </motion.div>
            )
        })
    }


    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmitReg = (data) => {
        setModalStatus(false)
        setLoading(true)
        console.log({...data,subject_id: clickedSubject})
        request(`${BackUrl}register_lead`, 'POST', JSON.stringify({...data,subject_id: clickedSubject}))
            .then(res => {
                setLoading(false)
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                } else {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "error",
                        active: true
                    }))
                }
            })
            .catch(err => {
                setLoading(false)
            })
    }

    return (
        <section
            className={cls.course}
            ref={sectionRef}
        >
            {
                loading ? createPortal(
                    <div className={cls.overlay}>
                        <DefaultLoader/>
                    </div>,
                    document.body
                ) : null
            }
            <Modal
                activeModal={modalStatus}
                setActiveModal={setModalStatus}
            >
                <div className={cls.course__modal}>
                    <div className={cls.wrapper}>
                        <h1>Darslikka ro'yhatdan o'tish</h1>
                        <form onSubmit={handleSubmit(onSubmitReg)} className={cls.wrapper__container }>
                            <InputForm
                                required
                                register={register}
                                name={"name"}
                                placeholder={"Name"}
                            />
                            <InputForm
                                required
                                register={register}
                                name={"phone"}
                                type={"number"}
                                placeholder={"+998 (__) ___ __ __"}
                            />
                            <select required {...register("location_id")} >
                                <option value="">Filial</option>
                                {
                                    locations.map(item => {
                                        return (

                                            <option value={item.id}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                            {/*<button>*/}
                            {/*    Registratsiya*/}
                            {/*</button>*/}
                            <WebButton>Registratsiya</WebButton>
                        </form>
                    </div>
                </div>
            </Modal>
            <motion.div
                className={classNames(cls.course_block, {
                    [cls.wrap]: !(isMobile || window.innerWidth <= 768)
                })}
                ref={wrapper}
            >
                {
                    isMobile || window.innerWidth <= 768 ? <motion.div
                        className={classNames(cls.course_block_inner, {
                            // [cls.wrap]: !isMobile && 768 <= window.innerWidth
                        })}
                        drag={"x"}
                        dragConstraints={{left: -width, right: 0}}
                    >
                        {renderCourses(subjects)}
                    </motion.div> : renderCourses(subjects)
                }

            </motion.div>
        </section>
    )
}

export default Course