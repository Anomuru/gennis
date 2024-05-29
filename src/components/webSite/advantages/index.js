import {motion} from "framer-motion";
import {useContext, useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import classNames from "classnames";
import {useDispatch} from "react-redux";

import Modal from "components/platform/platformUI/modal";
import InputForm from "components/platform/platformUI/inputForm";
import {Context} from "pages/webSite";
import {useHttp} from "hooks/http.hook";
import {BackUrl, BackUrlForDoc, headers, ROLES} from "constants/global";

import cls from "./style.module.sass";

import {useDropzone} from "react-dropzone";
import {changeAdvantages, changeAdvantagesImage} from "slices/webSiteSlice";
import WebButton from "components/webSite/webSiteUI/webButton/webButton";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";

const Advantages = () => {

    const {
        advantages,
        teachersLoadingStatus
    } = useSelector(state => state?.website)
    const {setSectionTop} = useContext(Context)

    const sectionRef = useRef()

    useEffect(() => {
        if (teachersLoadingStatus === 'success')
            setSectionTop(cur => ({...cur, advantages: sectionRef?.current?.offsetTop}))
    }, [setSectionTop, teachersLoadingStatus])

    const token = sessionStorage.getItem("token")
    const {request} = useHttp()
    const formData = new FormData()
    const dispatch = useDispatch()
    const {register, handleSubmit, setValue} = useForm()
    const [changeStatus, setChangeStatus] = useState(false)
    const [changeImage, setChangeImage] = useState({})
    const [changedItem, setChangedItem] = useState({})
    const {getInputProps, getRootProps} = useDropzone({
        onDrop: (acceptedFiles) => {
            setChangeImage(acceptedFiles[0])
        }
    })

    const onChangeModal = (id) => {
        advantages.map(item => {
            if (item.id === id) {
                setValue("advantageName", item?.name)
                setValue("advantageText", item?.text)
                setChangedItem(item)
            }
            return null
        })
        setChangeImage({})
        setChangeStatus(true)
    }

    const onSubmit = (data) => {
        const res = {
            name: data.advantageName,
            text: data.advantageText
        }
        request(`${BackUrl}change_advantage/${changedItem?.id}`, "POST", JSON.stringify(res), headers())
            .then(res => {
                setChangeStatus(false)
                dispatch(changeAdvantages(res?.advantage))
            })
            .catch(err => console.log(err))
        formData.append("file", changeImage)
        request(`${BackUrl}advantage_img/${changedItem?.id}`, "POST", formData, {"Authorization": "Bearer " + token})
            .then(res => {
                setChangeStatus(false)

                dispatch(changeAdvantagesImage(res?.advantage))
            })
            .catch(err => console.log(err))
        formData.delete("file")
    }

    const animateBoxes = {
        hidden: {
            opacity: 0
        },
        show: (num) => ({
            opacity: 1,
            transition: {
                duration: .7,
                delay: num * .15
            }
        }),
        exit: {
            opacity: 1
        }
    }

    function compareById(a, b) {
        return a.id - b.id;
    }

    return (
        <div
            className={cls.advantages}
            ref={sectionRef}
        >
            <RequireAuthChildren allowedRules={[ROLES.Smm]}>
                <Modal
                    activeModal={changeStatus}
                    setActiveModal={setChangeStatus}
                >
                    <div
                        className={cls.advantages__modal}
                    >
                        <h1>Afzallikni o'zgartirish</h1>
                        <form
                            className={cls.wrapper}
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className={cls.wrapper__container}>
                                <div className={cls.wrapper__container_item}>
                                    <InputForm
                                        required
                                        register={register}
                                        name={'advantageName'}
                                        placeholder={'Title'}
                                        value={changedItem?.name}
                                        defaultValue={changedItem?.name}
                                    />
                                    <textarea
                                        required
                                        cols="30"
                                        rows="10"
                                        {...register("advantageText", {
                                            value: changedItem?.text
                                        })}
                                        placeholder={"Text"}
                                    />
                                </div>
                                <div
                                    className={cls.wrapper__container_item}
                                    {...getRootProps()}
                                >
                                    {
                                        changeImage?.path ? <img src={
                                            URL.createObjectURL(changeImage)
                                        } alt=""/> : changedItem?.img ?
                                            <img src={BackUrlForDoc + changedItem?.img} alt=""/> : <>
                                                <div className={cls.image}>
                                                    <i className="far fa-image"/>
                                                    <h2>Rasm tashlang</h2>
                                                </div>
                                                <input
                                                    type="file"
                                                    {...getInputProps()}
                                                />
                                            </>
                                    }
                                </div>
                            </div>
                            <WebButton>O'zgartirish</WebButton>
                        </form>
                    </div>
                </Modal>
            </RequireAuthChildren>
            {
                advantages && [...advantages]?.sort(compareById).map((item, i) => {
                    return (
                        <motion.div
                            key={i}
                            variants={animateBoxes}
                            initial="hidden"
                            whileInView="show"
                            onViewportLeave="exit"
                            viewport={{amount: .2, once: true}}
                            custom={i + 1}
                            className={cls.advantages_box}
                        >
                            <RequireAuthChildren allowedRules={[ROLES.Smm]}>
                                <i
                                    className={classNames("fas fa-pen", cls.icon, {
                                        [cls.top]: item?.name.length >= 25 && window.innerWidth === 1440
                                    })}
                                    onClick={() => onChangeModal(item.id)}
                                />
                            </RequireAuthChildren>
                            <h1>{item?.name}</h1>
                            <div className={cls.box}>
                                <img src={`${BackUrlForDoc}${item?.img}`} alt=""/>
                                <div className={cls.info}>
                                    {item?.text}
                                </div>
                            </div>
                        </motion.div>
                    )
                })
            }
        </div>
    )
}

export default Advantages