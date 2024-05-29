import classNames from "classnames";
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";

import cls from "./style.module.sass";
import logo from "assets/website/logo.png"
import {useForm} from "react-hook-form";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers, ROLES} from "constants/global";
import {Context} from "pages/webSite";
import Modal from "components/platform/platformUI/modal";
import InputForm from "components/platform/platformUI/inputForm";
import {useDispatch, useSelector} from "react-redux";
import {isMobileOnly} from "react-device-detect";
import {motion} from "framer-motion";
import {changeLocation, changeHrefs} from "slices/webSiteSlice";
import WebButton from "components/webSite/webSiteUI/webButton/webButton";
import {setMessage} from "slices/messageSlice";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import {createPortal} from "react-dom";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";

const list = [
    {
        label: "Youtube",
        icon: `fab fa-youtube ${cls.icons}`,
        src: "https:/genniscampus/"
    }, {
        label: "Telegram",
        icon: `fab fa-telegram ${cls.icons}`,
        src: "https:/genniscampus/"
    }, {
        label: "Instagram",
        icon: `fab fa-instagram ${cls.icons}`,
        src: "https:/genniscampus/"
    }, {
        label: "Facebook",
        icon: `fab fa-facebook ${cls.icons}`,
        src: "https:/genniscampus/"
    }
]

const Footer = () => {

    const {
        hrefs,
        locations,
        teachersLoadingStatus
    } = useSelector(state => state?.website)

    const {setSectionTop} = useContext(Context)

    const sectionRef = useRef()

    useEffect(() => {
        if (teachersLoadingStatus === 'success')
            setSectionTop(cur => ({...cur, contact: sectionRef?.current?.offsetTop}))
    }, [setSectionTop, teachersLoadingStatus])

    const token = sessionStorage.getItem("token")
    const formData = new FormData()
    const {register, handleSubmit, setValue} = useForm()
    const dispatch = useDispatch()
    const {request} = useHttp()
    const [changeStatus, setChangeStatus] = useState(false)
    const [changeLocStatus, setChangeLocStatus] = useState(false)
    const [changeItem, setChangeItem] = useState({})
    const [changeLoc, setChangeLoc] = useState({})
    const [changeImage, setChangeImage] = useState({})
    const [activeLoc, setActiveLoc] = useState(0)
    const [selectedItem, setSelectedItem] = useState(locations[0])
    const [loading, setLoading] = useState(false)

    const onSubmitHrefs = (data) => {
        const res = {
            id: changeItem?.id,
            link: data?.link,
            name: data?.name
        }
        console.log(res)
        formData.append("res", JSON.stringify(res))
        formData.append("img", changeImage)
        request(`${BackUrl}change_link`, "POST", formData, {"Authorization": "Bearer " + token})
            .then(res => {
                setChangeStatus(false)
                dispatch(changeHrefs(res?.link))
            })
            .catch(err => console.log(err))
        formData.delete("res")
        formData.delete("img")
    }

    const onSubmitLoc = (data) => {
        const res = {
            link: data?.locLink?.slice(
                data?.locLink.indexOf("src") + 5,
                data?.locLink.indexOf("style") - 7
            ),
            number: data?.locNumber,
            location: data?.locLocation
        }
        request(`${BackUrl}change_locations/${changeLoc?.id}`, "POST", JSON.stringify(res), headers())
            .then(res => {
                setChangeLocStatus(false)
                setSelectedItem(res?.location)
                dispatch(changeLocation(res?.location))
            })
            .catch(err => console.log(err))
    }

    const onChangeModal = (id) => {
        hrefs.filter(item => {
            if (item.id === id) {
                setChangeItem(item)
                setValue("name", item.name)
                setValue("link", item.link)
            }
        })
        setChangeStatus(true)
    }

    const onChangeLoc = (id) => {
        locations.filter(item => {
            if (item.id === id) {
                setChangeLoc(item)
                setValue("locLink", item.link)
                setValue("locLocation", item.location)
                setValue("locNumber", item.number)
            }
        })
        setChangeLocStatus(true)
    }

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

    const ModalChange = useCallback(({changeStatus, setChangeStatus, onSubmitHrefs, changeItem, changeImage}) => {
        return (
            <Modal
                activeModal={changeStatus}
                setActiveModal={setChangeStatus}
            >
                <div className={cls.footer__modal}>
                    <div className={cls.wrapper}>
                        <h1>Silkani o'zgartirish</h1>
                        <form
                            className={cls.wrapper__container}
                            onSubmit={handleSubmit(onSubmitHrefs)}
                        >
                            <InputForm
                                required
                                value={changeItem?.name}
                                defaultValue={changeItem?.name}
                                register={register}
                                name={"name"}
                                placeholder={"Name"}
                            />
                            <InputForm
                                required
                                value={changeItem?.link}
                                register={register}
                                name={"link"}
                                placeholder={"Link"}
                            />
                            <WebButton>
                                O'zgartirish
                            </WebButton>
                        </form>
                    </div>
                </div>
            </Modal>
        )
    }, [changeItem])

    const ModalChangeLocation = useCallback(({status, setStatus, onSubmitLoc, changeItem}) => {
        return (
            <Modal
                activeModal={status}
                setActiveModal={setStatus}
            >
                <div className={cls.footer__modalLoc}>
                    <div className={cls.footer__modalLoc_inner}>
                        <h1>Lokatsiyani o'zgartirish</h1>
                        <form
                            className={cls.wrapperLoc}
                            onSubmit={handleSubmit(onSubmitLoc)}
                        >
                            <h1>{changeItem?.name}</h1>
                            <InputForm
                                register={register}
                                name={'locLink'}
                                placeholder={'Link'}
                            />
                            <InputForm
                                register={register}
                                name={'locLocation'}
                                placeholder={'Location'}
                            />
                            <InputForm
                                register={register}
                                name={'locNumber'}
                                placeholder={'Number'}
                            />
                            <WebButton>O'zgartirish</WebButton>
                        </form>
                    </div>
                </div>
            </Modal>
        )
    }, [changeLoc])

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

    const selectItem = (id) => {
        locations.filter(item => {
            if (item.id === id) {
                setSelectedItem((item))
            }
            return null
        })
    }

    function compareById(a, b) {
        return a.id - b.id;
    }

    return (
        <footer
            className={cls.footer}
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
            <ModalChange
                changeImage={changeImage}
                setChangeImage={setChangeImage}
                changeItem={changeItem}
                changeStatus={changeStatus}
                setChangeStatus={setChangeStatus}
                onSubmitHrefs={onSubmitHrefs}
            />
            <ModalChangeLocation
                status={changeLocStatus}
                setStatus={setChangeLocStatus}
                onSubmitLoc={onSubmitLoc}
                changeItem={changeLoc}
            />
            <div className={cls.footer__wrapper}>
                <div className={cls.footer_branches}>
                    <div className={cls.location}>
                        <i className="fab fa-location-dot"/>
                        <h2>Filiallar</h2>
                    </div>
                    <div className={cls.branch}>
                        {
                            locations && [...locations].sort(compareById).map((item, i) => {
                                return (
                                    <div
                                        className={classNames(cls.branch_inner, {
                                            [cls.active]: i === activeLoc
                                        })}
                                        onClick={() => {
                                            setActiveLoc(i)
                                            selectItem(item.id)
                                        }}
                                    >
                                        {item.name}
                                        <RequireAuthChildren allowedRules={[ROLES.Smm]}>
                                            <i
                                                className={classNames("fas fa-pen", cls.changeLoc)}
                                                onClick={() => onChangeLoc(item.id)}
                                            />
                                        </RequireAuthChildren>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={cls.footer_main}>
                    <div className={classNames(cls.connect, cls.connect_none)}>
                        <h1>Biz bilan bog’laning!</h1>
                        <div className={cls.connects}>
                            {
                                hrefs.map((item, i) => {
                                    return (
                                        <div key={i} className={cls.links}>
                                            <RequireAuthChildren allowedRules={[ROLES.Smm]}>
                                                <i
                                                    className={classNames("fas fa-pen", cls.change)}
                                                    onClick={() => onChangeModal(item.id)}
                                                />
                                            </RequireAuthChildren>

                                            <i className={classNames(list[i]?.icon, cls.bigIcon, {
                                                [cls.red]: i === 0
                                            })}/>
                                            <h2>{item.name}</h2>
                                            <a href={item?.link}>{list[i]?.src}</a>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={cls.box}>
                        <div className={cls.number}>
                            <h2>{locations[activeLoc]?.name}</h2>
                            <div className={cls.phone}>
                                <i className="fas fa-phone-alt"/>{selectedItem?.number}
                            </div>
                        </div>
                        <div className={cls.number}>
                            <h2>Manzil</h2>
                            <div>{selectedItem?.location}</div>
                        </div>
                    </div>
                    <iframe
                        src={selectedItem?.link}
                        style={{width: "600", height: "450", border: 0}} allowFullScreen="" loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"/>
                </div>
            </div>
            {
                isMobileOnly ? <div className={classNames(cls.connect)}>
                    <h1>Biz bilan bog’laning!</h1>
                    <div className={cls.connects}>
                        {
                            hrefs.map((item, i) => {
                                return (
                                    <motion.div
                                        key={i}
                                        variants={animateChildren}
                                        initial="hidden"
                                        whileInView="show"
                                        onViewportLeave="exit"
                                        viewport={{amount: .2, once: true}}
                                        custom={i + 1}
                                        className={cls.links}
                                    >
                                        <RequireAuthChildren allowedRules={[ROLES.Smm]}>
                                            <i
                                                className={classNames("fas fa-pen", cls.change)}
                                                onClick={() => onChangeModal(item.id)}
                                            />
                                        </RequireAuthChildren>
                                        <i className={list[i]?.icon}/>
                                        <h2>{item.name}</h2>
                                        <a href={item?.link}>{list[i]?.src}</a>
                                    </motion.div>
                                )
                            })
                        }
                    </div>
                </div> : null
            }
            <div className={classNames(cls.footer_register, cls.none_footer)}>
                <div className={cls.logo}><img src={logo} alt=""/></div>
                <form
                    onSubmit={handleSubmit(onSubmitReg)}
                >
                    <input
                        required
                        type="text"
                        placeholder="Enter your name"
                        {...register("name")}
                    />
                    <input
                        required
                        type="number"
                        placeholder="Enter your number"
                        {...register("phone")}
                    />
                    <select required {...register("location_id")}>
                        <option value="">Filial</option>
                        {
                            locations.map(item => {
                                return (
                                    <option value={item.id}>{item.name}</option>
                                )
                            })
                        }
                    </select>
                    <WebButton>Yuborish</WebButton>
                </form>
            </div>
        </footer>
    )
}

export default Footer