import classNames from "classnames";
import {useEffect, useState, useContext, useRef, useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {motion} from "framer-motion";
import {Link} from "react-router-dom";
import {isMobile, isMobileOnly} from "react-device-detect";

import {useHttp} from "hooks/http.hook";
import {BackUrl, BackUrlForDoc, headers, headersImg, ROLES} from "constants/global";
import {
    fetchingImageItems,
    fetchedImageItems,
    fetchedImageError,
    fetchedVideoItems,
    fetchedNews,
    fetchedCertificates,
    fetchedHrefs,
    fetchedSubjects,
    fetchedTeachers,
    fetchedAdvantages, fetchedLocations
} from "slices/webSiteSlice";
import Modal from "components/platform/platformUI/modal";
import Header from "components/webSite/header/Header";
import InputForm from "components/platform/platformUI/inputForm";
import {Context} from "pages/webSite";

import cls from './style.module.sass'
import WebButton from "components/webSite/webSiteUI/webButton/webButton";
import {setMessage} from "slices/messageSlice";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import {useAuth} from "hooks/useAuth";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import {createPortal} from "react-dom";
// import {animateBox, animateText} from "frame-motion";

const Home = () => {
    const {setSectionTop} = useContext(Context)

    const sectionRef = useRef()

    useEffect(() => {
        setSectionTop(cur => ({...cur, home: sectionRef?.current?.offsetTop}))
    }, [setSectionTop])

    const {register, handleSubmit, setValue} = useForm()
    const {request} = useHttp()
    const formData = new FormData()
    const dispatch = useDispatch()

    const [changeStatus, setChangeStatus] = useState(false)
    const [changeImage, setChangeImage] = useState({})
    const [mobileMenuStatus, setMobileMenuStatus] = useState(false)
    const [changeItem, setChangeItem] = useState({})
    const {image,locations} = useSelector(state => state?.website)
    const [loading, setLoading] = useState(false)


    const onChange = () => {
        setChangeItem(image)
        setChangeStatus(true)
    }

    const onSubmit = (data) => {
        dispatch(fetchingImageItems())

        formData.append('name', data.name)
        formData.append('text',data.text)
        formData.append('file', changeImage)

        request(`${BackUrl}add_home_design`, "POST", formData, headersImg())
            .then(res => {
                if (res.success) {
                    setChangeStatus(false)
                }
                dispatch(fetchedImageItems(res.design))
            })
            .catch(dispatch(fetchedImageError))
        formData.delete("name")
        formData.delete("text")
        formData.delete("file")
    }

    const onSubmitReg = (data) => {


        setLoading(true)
        request(`${BackUrl}register_lead`, 'POST', JSON.stringify(data))
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


    const {role} = useAuth()

    return (
        <section
            className={cls.home}
            ref={sectionRef}
            style={{backgroundImage: `url(${BackUrlForDoc + image?.img})`}}
        >
            {
                loading ? createPortal(
                    <div className={cls.overlay}>
                        <DefaultLoader/>
                    </div>,
                    document.body
                ) : null
            }
            {
                isMobile ?
                    <div className={cls.home__hamburger}>
                        <i
                            className={classNames((mobileMenuStatus ? "fas fa-times" : "fas fa-bars"), cls.home__hamburger_inner)}
                            onClick={() => setMobileMenuStatus(!mobileMenuStatus)}
                        />
                    </div>
                    : null
            }
            <div className={cls.home__back}></div>
            <Header
                status={mobileMenuStatus}
                setStatus={setMobileMenuStatus}
            />
            <motion.div className={cls.home_information}>

                {/*<RequireAuthChildren allowedRules={[ROLES.Smm]}>*/}
                    <i
                        className={classNames("fas fa-pen", cls.icon)}
                        onClick={onChange}
                    />
                {/*</RequireAuthChildren>*/}


                <motion.div className={cls.information_about}>
                    <motion.h1
                        // variants={animateText}
                        initial="hidden"
                        whileInView="show"
                        onViewportLeave="exit"
                        viewport={{amount: .2, once: true}}
                        custom={1}
                    >
                        {image?.name}
                    </motion.h1>
                    <motion.div
                        // variants={animateText}
                        initial="hidden"
                        whileInView="show"
                        onViewportLeave="exit"
                        viewport={{amount: .2, once: true}}
                        custom={2}
                        style={{
                            hyphens: "auto",
                            width: "100%",
                            overflowWrap: "anywhere"
                        }}
                    >
                        {image?.text}
                    </motion.div>
                    {
                        isMobile ?
                            <Link
                                to={'/login'}
                                style={{textDecoration: "none", width: "150px", height: "35px"}}
                            >
                                <WebButton style={"blackWhite"}>Login</WebButton>
                            </Link> : null
                    }
                </motion.div>


                <motion.div
                    className={cls.register}
                    // variants={animateBox}
                    initial="hidden"
                    whileInView="show"
                    onViewportLeave="exit"
                    viewport={{amount: .2, once: true}}
                    custom={3}
                >

                    <motion.form
                        onSubmit={handleSubmit(onSubmitReg)}
                    >
                        <h1>Ro’yxatdan o’tish</h1>
                        <input
                            required
                            type="text"
                            placeholder="Name"
                            {...register("name")}
                        />
                        <input
                            required
                            type="phone"
                            placeholder="+998 (__) ___ __ __"
                            {...register("phone")}
                        />
                        <select required  {...register("location_id")} >
                            <option value="">Filial</option>
                            {
                                locations.map(item => {
                                    return (

                                        <option value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                        <WebButton>Registratsiya</WebButton>
                    </motion.form>
                </motion.div>
            </motion.div>

            {/*<RequireAuthChildren allowedRules={[ROLES.Smm]}>*/}
                <ChangeModal
                    changeImage={changeImage}
                    image={image}
                    onSubmit={onSubmit}
                    changeStatus={changeStatus}
                    setChangeStatus={setChangeStatus}
                    setChangeImage={setChangeImage}
                    item={changeItem}
                />
            {/*</RequireAuthChildren>*/}

        </section>
    )
}

const ChangeModal = ({changeImage, image, onSubmit, changeStatus, setChangeStatus, setChangeImage, item}) => {
    useEffect(() => {
        setValue("name", item?.name)
        setValue("text", item?.text)
    }, [item])
    const {register, handleSubmit, setValue} = useForm()
    const {getRootProps, getInputProps} = useDropzone({
        onDrop: (acceptedFiles) => {
            setChangeImage(acceptedFiles[0])
        }
    })

    return (
        <Modal
            activeModal={changeStatus}
            setActiveModal={setChangeStatus}
        >
            <div className={cls.home__modal}>
                <h1>Malumotlarni o'zgartirish</h1>
                <div className={cls.wrapper}>
                    <div
                        className={cls.home__modal_img}
                        {...getRootProps()}
                    >
                        {
                            changeImage?.path ? <img src={URL.createObjectURL(changeImage)} alt=""/>
                                : image?.img ? <img src={BackUrlForDoc + image?.img} alt=""/>
                                    : <>
                                        <input
                                            required
                                            {...getInputProps()}
                                            type="file"
                                        />
                                        <i className="far fa-image"/>
                                    </>
                        }
                    </div>
                    <form
                        className={cls.home__modal_text}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <InputForm
                            required
                            register={register}
                            name={'name'}
                            placeholder={'Title'}
                        />
                        <textarea
                            placeholder="Text"
                            required
                            {...register("text")}
                            cols="30"
                            rows="10"
                        />
                        <WebButton>O'zgartirish</WebButton>
                    </form>
                </div>
            </div>
        </Modal>
    )
}

export default Home