import {motion} from "framer-motion";

import cls from './style.module.sass'
import {isMobile} from "react-device-detect";
import {useContext, useEffect, useRef, useState} from "react";
import {Context} from "pages/webSite";
import {useSelector} from "react-redux";
import {BackUrlForDoc} from "constants/global";
import {Link} from "react-router-dom";
import classNames from "classnames";

const Teacher = () => {
    const {
        teachers,
        teachersLoadingStatus
    } = useSelector(state => state?.website)
    const {setSectionTop} = useContext(Context)

    const sectionRef = useRef()

    useEffect(() => {
        if (teachersLoadingStatus === 'success')
            setSectionTop(cur => ({...cur, teacher: sectionRef?.current?.offsetTop}))
    }, [setSectionTop, teachersLoadingStatus])

    const [width, setWidth] = useState(0)
    const ref = useRef([])
    const wrapper = useRef()

    useEffect(() => {
        setWidth(wrapper.current?.scrollWidth - wrapper.current?.offsetWidth)
    }, [teachers.length])


    const animateChildren = {
        hidden: {
            opacity: 0,
            x: 100
        },
        show: (num) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: .7,
                delay: num * .15
            }
        }),
        exit: {
            opacity: 1,
            x: 0,
        }
    }

    const renderTeachers = (arr) => {
        return arr.map((item, i) => {
            if (i >= 4 && (!isMobile && window.innerWidth <= 768)) return null
            // if (window.innerWidth <= 768 && i >= 2) return null
            // if (isMobile && i >= 2) return null
            // if (i >= 1 && window.innerWidth <= 425) return null
            return (
                <motion.div
                    key={i}
                    variants={animateChildren}
                    initial="hidden"
                    whileInView="show"
                    onViewportLeave="exit"
                    viewport={{amount: .2, once: true}}
                    custom={isMobile ? 1 :i}
                    ref={el => ref.current[i] = el}
                    className={cls.box}
                >
                    <Link
                        to={`/teacherInfo/${item?.id}`}
                        style={{
                            width: "90%",
                            height: "160px"
                        }}
                    >
                        <img src={BackUrlForDoc + item.teacher_img} alt=""/>
                    </Link>
                    <div className={cls.texts}>
                        <h2>{item.full_name}</h2>
                        <h4>{item.subjects[0]}</h4>
                        <div>
                            {/*Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem*/}
                            {/*Ipsum*/}
                            {/*has been the*/}
                            {/*industry's standard dummy text ever since the 1500s, when an unknown printer*/}
                            {/*took a*/}
                            {/*galley of type*/}
                            {/*and scrambled it to make a type specimen book.*/}
                            {item.text}
                        </div>
                        <div className={cls.icons}>
                            <i className="fab fa-telegram"/>
                            <i className="fab fa-instagram"/>
                            <i className="fab fa-facebook"/>
                        </div>
                    </div>
                </motion.div>
            )
        })
    }

    return (
        <section
            className={cls.teacher}
            ref={sectionRef}
        >
            <div className={cls.teacher_side}/>
            <motion.div
                className={classNames(cls.teacher_main, {
                    [cls.wrap]: !(isMobile || window.innerWidth <= 768)
                })}
                ref={wrapper}
            >
                {
                    isMobile || window.innerWidth <= 768 ? <motion.div
                        className={cls.teacher_main_inner}
                        drag={"x"}
                        dragConstraints={{left: -width, right: 0}}
                    >
                            {renderTeachers(teachers)}
                    </motion.div> : renderTeachers(teachers)
                }
            </motion.div>
        </section>
    )
}

export default Teacher