import classNames from "classnames";
import {motion} from "framer-motion";

import cls from './style.module.sass'
import img from 'assets/website/best-shirts-men 1.png'
import {isMobile} from "react-device-detect";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {Context} from "pages/webSite";
import {useSelector} from "react-redux";
import {BackUrlForDoc} from "constants/global";
import Modal from "components/platform/platformUI/modal";

const Result = () => {

    const {
        certificates,
        subjectsLoadingStatus
    } = useSelector(state => state?.website)
    const {setSectionTop} = useContext(Context)

    const sectionRef = useRef()

    useEffect(() => {
        if (subjectsLoadingStatus === 'success')
            setSectionTop(cur => ({...cur, result: sectionRef?.current?.offsetTop}))
    }, [setSectionTop, subjectsLoadingStatus])

    const [imageModalStatus, setImageModalStatus] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')
    const [width, setWidth] = useState(0)
    const ref = useRef([])
    const wrapper = useRef()

    useEffect(() => {
        setWidth(wrapper.current?.scrollWidth - wrapper.current?.offsetWidth)
    }, [certificates.length])

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

    const onClick = (img) => {
        setSelectedItem(img)
        setImageModalStatus(true)
    }

    const ImageModal = useCallback(({status, setStatus, item}) => {
        return (
            <Modal
                activeModal={status}
                setActiveModal={setStatus}
            >
                <div className={cls.imageModal}>
                    <div className={cls.imageModal__container}>
                        <div className={cls.imageModal__container_inner}>
                            <img src={BackUrlForDoc + item} alt=""/>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }, [selectedItem])

    const renderResults = (arr) => {
        return arr.map((item, i) => {
            // if (window.innerWidth <= 768 && i >= 2) return null
            // if (window.innerWidth <= 1024 && i >= 3) return null
            // if (isMobile && i >= 1) return null
            // if (isMobile && i >= 1 && window.innerWidth <= 375) return null
            return (
                <motion.div
                    key={i}
                    variants={animateChildren}
                    initial="hidden"
                    whileInView="show"
                    onViewportLeave="exit"
                    viewport={{amount: .2, once: true}}
                    custom={item}
                    ref={el => ref.current[i] = el}
                    className={classNames(cls.splide__slide, cls.result_box)}
                >

                    <div className={cls.background}>
                        <div className={cls.info}>
                            {item.text.slice(0, 8)}
                            {/*IELTS: 7.0*/}
                        </div>
                    </div>
                    <div
                        className={cls.image}
                        // style={window.innerWidth <= 425 ? {
                        //     justifyContent: "space-around"
                        // } : null}
                    >
                        <img src={img} alt=""/>

                        <div
                            className={cls.image__item}
                            onClick={() => onClick(item.certificate)}
                        >
                            <img src={BackUrlForDoc + item.certificate} alt=""/>
                        </div>
                    </div>
                    <div className={cls.teacher_name}>
                        <div className={classNames(cls.name, cls.first)}>
                            <i className="fas fa-user"/>
                            <h2>{item.teacher}</h2>
                        </div>
                        <div className={cls.name}>
                            <i className="fas fa-user-tie"/>
                            <h2>{item.student}</h2>
                        </div>
                    </div>
                </motion.div>
            )
        })
    }

    return (
        <section
            className={cls.result}
            ref={sectionRef}
        >
            <ImageModal
                status={imageModalStatus}
                setStatus={setImageModalStatus}
                item={selectedItem}
            />
            <div className={cls.splide}>
                <motion.div
                    className={cls.splide__track}
                    ref={wrapper}
                >
                    <motion.div
                        className={classNames(cls.splide__list, {
                            [cls.scroll]: certificates.length > 4
                        })}
                        drag={"x"}
                        dragConstraints={{left: -width, right: 0}}
                    >
                        {renderResults(certificates)}
                    </motion.div>
                </motion.div>
                {/*<div className={cls.splide_slider}>*/}
                {/*    <div className={cls.splide_slider_progress}>*/}
                {/*        <div className={cls.splide_slider_progress_bar}/>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </section>
    )
}

export default Result