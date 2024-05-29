import classNames from "classnames";
import {useState, useEffect, useContext, useRef} from "react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {motion} from "framer-motion";

import {useHttp} from "hooks/http.hook";
import {BackUrl, headers, ROLES} from "constants/global";
import {
    fetchingVideoItems,
    fetchedVideoItems,
} from "slices/webSiteSlice";
import Modal from "components/platform/platformUI/modal";
import {Context} from "pages/webSite";
import InputForm from "components/platform/platformUI/inputForm";
import WebButton from "components/webSite/webSiteUI/webButton/webButton";

import cls from './style.module.sass'
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import ReactPlayer from "react-player";

const About = () => {

    const {setSectionTop} = useContext(Context)

    const sectionRef = useRef()

    useEffect(() => {
        setSectionTop(cur => ({...cur, about: sectionRef?.current?.offsetTop}))
    }, [setSectionTop])

    const {request} = useHttp()
    const {register, handleSubmit, setValue} = useForm()
    const dispatch = useDispatch()
    const [changeStatus, setChangeStatus] = useState(false)
    const {
        video,
    } = useSelector(state => state.website)

    const onChange = () => {
        setValue("name", video?.name)
        setValue("text", video?.text)
        setValue("link", video?.url)
        setChangeStatus(true)
    }

    const onSubmit = (data) => {
        dispatch(fetchingVideoItems())
        request(`${BackUrl}add_home_video`, "POST", JSON.stringify(data), headers())
            .then(res => {
                setChangeStatus(false)
                dispatch(fetchedVideoItems(res.video))
            })
            .catch(err => console.log(err))
    }

    const animateText = {
        hidden: {
            opacity: 0,
            x: -150
        },
        show: (num) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                delay: num * 0.2
            }
        }),
        exit: {
            opacity: 1,
            x: 0
        }
    }

    const animateBox = {
        hidden: {
            opacity: 0,
            x: 150
        },
        show: (num) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                delay: num * 0.2
            }
        }),
        exit: {
            opacity: 1,
            x: 0
        }
    }

    return (
        <section
            className={cls.about}
            ref={sectionRef}
        >
            <RequireAuthChildren allowedRules={[ROLES.Smm]}>
                <i
                    className={classNames("fas fa-pen", cls.icon)}
                    onClick={onChange}
                />
            </RequireAuthChildren>

            <motion.div
                className={cls.about_info}
                variants={animateText}
                initial="hidden"
                whileInView="show"
                onViewportLeave="exit"
                viewport={{amount: .2, once: true}}
                custom={1}
            >
                <h1>
                    {video?.name}
                </h1>
                <p>
                    {video?.text}
                </p>
            </motion.div>
            <motion.div
                className={cls.about_img}
                variants={animateBox}
                initial="hidden"
                whileInView="show"
                onViewportLeave="exit"
                viewport={{amount: .2, once: true}}
                custom={2}
            >
                <div className={cls.square}>
                    <ReactPlayer
                        width="100%"
                        height="100%"
                        url={video?.url}
                    />
                </div>
            </motion.div>
            <RequireAuthChildren allowedRules={[ROLES.Smm]}>
                <Modal
                    activeModal={changeStatus}
                    setActiveModal={setChangeStatus}
                >
                    <form className={cls.about__modal} onSubmit={handleSubmit(onSubmit)}>
                        <h1>Malumotlarni o'zgartirish</h1>
                        <div className={cls.wrapper}>
                            <InputForm
                                required
                                register={register}
                                placeholder={'Title'}
                                name={'name'}
                            />
                            <InputForm
                                required
                                register={register}
                                placeholder={'Link'}
                                name={'link'}
                            />
                            <textarea
                                required
                                placeholder={'Text'}
                                {...register('text')}
                                cols="30"
                                rows="10"
                            />
                        </div>
                        <WebButton>O’zgartirish</WebButton>
                    </form>
                </Modal>
            </RequireAuthChildren>
        </section>
    )
}

export default About