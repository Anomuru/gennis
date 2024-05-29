import classNames from "classnames";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useDropzone} from "react-dropzone";
import {useDispatch, useSelector} from "react-redux";
import {motion} from "framer-motion";
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {useHttp} from "hooks/http.hook";
import {BackUrl, BackUrlForDoc, ROLES} from "constants/global";
import {
    fetchingNews,
    addNew,
    changeNew
} from "slices/webSiteSlice";
import Modal from "components/platform/platformUI/modal";
import {Context} from "pages/webSite";

import cls from './style.module.sass'
import InputForm from "components/platform/platformUI/inputForm";
import WebButton from "components/webSite/webSiteUI/webButton/webButton";
import {isMobile, isMobileOnly} from "react-device-detect";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";

const list = [1, 2, 3, 4]

const News = () => {

    const {newsList, teachersLoadingStatus} = useSelector(state => state?.website)

    const {setSectionTop} = useContext(Context)

    const sectionRef = useRef()

    useEffect(() => {
        if (teachersLoadingStatus === 'success')
            setSectionTop(cur => ({...cur, news: sectionRef?.current?.offsetTop}))
    }, [setSectionTop, teachersLoadingStatus])

    const token = sessionStorage.getItem("token")
    const {request} = useHttp()
    const formData = new FormData()
    const {register, handleSubmit, setValue} = useForm()
    const dispatch = useDispatch()
    const [changeStatus, setChangeStatus] = useState(false)
    const [addStatus, setAddStatus] = useState(false)
    const [imagesList, setImagesList] = useState([])
    const [changeItem, setChangeItem] = useState({})
    const [changedImages, setChangedImages] = useState([])
    // scroll-x
    const [width, setWidth] = useState(0)
    const wrapper = useRef()

    useEffect(() => {
        setWidth(wrapper.current?.scrollWidth - wrapper.current?.offsetWidth)
    }, [newsList.length])

    const onSubmitAdd = (data) => {
        dispatch(fetchingNews())
        let linkList;
        let otherForChange;
        console.log(changedImages)
        if (changeStatus) {

            otherForChange = {
                list: changedImages[0] ? changedImages : []
            }
            linkList = [
                {
                    link_id: changeItem.links[0]?.id,
                    type: "instagram",
                    link: data?.instagram ? data?.instagram : ""
                },
                {
                    link_id: changeItem.links[1]?.id,
                    type: "facebook",
                    link: data?.facebook ? data?.facebook : ""
                },
                {
                    link_id: changeItem.links[2]?.id,
                    type: "telegram",
                    link: data?.telegram ? data?.telegram : ""
                }
            ]
        } else if (addStatus) {
            linkList = [
                {
                    type: "instagram",
                    link: data?.instagram ? data?.instagram : ""
                },
                {
                    type: "facebook",
                    link: data?.facebook ? data?.facebook : ""
                },
                {
                    type: "telegram",
                    link: data?.telegram ? data?.telegram : ""
                }
            ]
        }
        const res = {
            title: data.title,
            date: data.date,
            text: data.text,
            links: linkList,
            ...otherForChange
        }

        console.log(res, "res")

        imagesList.map(item => {
            formData.append(item.type, item.file)
            return null
        })
        formData.append('res', JSON.stringify(res))

        if (addStatus) {
            request(`${BackUrl}add_news`, "POST", formData, {"Authorization": "Bearer " + token})
                .then(res => {
                    dispatch(addNew(res?.new))
                    setAddStatus(!res.success)
                })
                .catch((err => console.log(err)))
            setChangedImages([])
        } else if (changeStatus) {
            request(`${BackUrl}change_news/${changeItem.id}`, "PUT", formData, {"Authorization": "Bearer " + token})
                .then(res => {
                    dispatch(changeNew(res.news))
                    setChangeStatus(!res.success)
                })
                .catch(err => console.log(err))
            setChangedImages([])
        }
        formData.delete('res')
        formData.delete('image_1')
        formData.delete('image_2')
        formData.delete('image_3')
        formData.delete('image_4')
    }

    const onImages = (value) => {
        const filtered = imagesList.filter(item => item.type !== value.type)
        setImagesList(arr => [...filtered, value])
    }

    const onChangeModal = (id) => {
        const filtered = newsList.filter(item => item.id === id)
        setChangeItem(...filtered)

        setValue("title", filtered[0]?.title)
        setValue("date", filtered[0]?.date)
        setValue("text", filtered[0]?.text)
        setValue("instagram", filtered[0]?.links[0]?.link)
        setValue("telegram", filtered[0]?.links[1]?.link)
        setValue("facebook", filtered[0]?.links[2]?.link)
        setChangeStatus(true)
    }

    const onAdd = () => {
        setValue("title", null)
        setValue("date", null)
        setValue("text", null)
        setValue("instagram", null)
        setValue("telegram", null)
        setValue("facebook", null)
        setAddStatus(true)
    }

    const animateBox = {
        hidden: {
            opacity: 0,
            y: 150
        },
        show: (num) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                delay: num * 0.2
            }
        }),
        exit: {
            opacity: 1,
            y: 0
        }
    }

    function compareById(a, b) {
        return a.id - b.id;
    }

    return (
        <section
            className={cls.news}
            ref={sectionRef}
        >
            {/*<RequireAuthChildren allowedRules={[ROLES.Smm]}>*/}
                <Modal
                    activeModal={addStatus ? addStatus : changeStatus}
                    setActiveModal={addStatus ? setAddStatus : setChangeStatus}
                >
                    <div className={cls.news__changeAdd}>
                        {
                            addStatus ? <h1>Yangilik kiritish</h1>
                                : <h1>Yangilikni o'zgartirish</h1>
                        }
                        <div className={cls.wrapper}>
                            <div className={cls.news__changeAdd_images}>
                                <div className={cls.items}>
                                    {
                                        list.map((item, i) => {
                                            return (
                                                <ImageDrop
                                                    key={i}
                                                    status={addStatus}
                                                    image={changeItem?.images ? changeItem?.images[i] : []}
                                                    setChangedImages={setChangedImages}
                                                    changedImages={changedImages}
                                                    onImages={onImages}
                                                    index={i}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <form
                                id={"news-form"}
                                className={cls.news__changeAdd_content}
                                onSubmit={handleSubmit(onSubmitAdd)}
                            >
                                <InputForm
                                    register={register}
                                    name={'title'}
                                    placeholder={'Title'}
                                />
                                <InputForm
                                    register={register}
                                    name={'date'}
                                    type={'date'}
                                />
                                <textarea
                                    placeholder="Text"
                                    required
                                    cols="30"
                                    rows="10"
                                    {...register('text')}
                                />
                                <InputForm
                                    required={false}
                                    register={register}
                                    name={'instagram'}
                                    placeholder={'Instagram'}
                                />
                                <InputForm
                                    required={false}
                                    register={register}
                                    name={'telegram'}
                                    placeholder={'Telegram'}
                                />
                                <InputForm
                                    required={false}
                                    register={register}
                                    name={'facebook'}
                                    placeholder={'Facebook'}
                                />
                                {changeStatus ? <WebButton form={"news-form"}>O’zgartirish</WebButton> : <WebButton form={"news-form"}>Qo'shish</WebButton>}
                            </form>

                        </div>
                    </div>
                </Modal>
            {/*</RequireAuthChildren>*/}

            <motion.div
                className={cls.news_block}
                ref={wrapper}
            >
                <motion.div
                    drag={"x"}
                    dragConstraints={{left: -width, right: 0}}
                    className={cls.news_block_inner}
                >
                    {
                        newsList && [...newsList].sort(compareById).map((item, i) => {
                            return (
                                <RenderNews
                                    item={item}
                                    index={i}
                                    animateBox={animateBox}
                                    onChangeModal={onChangeModal}
                                />
                            )
                        })
                    }
                </motion.div>
            </motion.div>
            {/*<RequireAuthChildren allowedRules={[ROLES.Smm]}>*/}
                <i
                    className={classNames("fas fa-plus", cls.plus)}
                    onClick={onAdd}
                />
            {/*</RequireAuthChildren>*/}

        </section>
    )
}

const RenderNews = ({item, index, animateBox, onChangeModal}) => {
    const ref = useRef([])

    function renderText(text) {
        if (window.innerWidth >= 1440 && text.length >= 570)
            return `${text.slice(0, 570)} ...`
        else if (window.innerWidth >= 1024 && text.length >= 540)
            return `${text.slice(0, 540)} ...`
        else if (isMobileOnly && (window.innerWidth >= 375 || window.innerWidth >= 320) && text.length >= 160)
            return `${text.slice(0, 160)} ...`
        else if (isMobileOnly && text.length >= 540)
            return `${text.slice(0, 540)} ...`
        else if (isMobile && text.length >= 260)
            return `${text.slice(0, 260)} ...`
        else
            return text
    }

    return (
        <motion.div
            key={index}
            variants={animateBox}
            initial="hidden"
            whileInView="show"
            onViewportLeave="exit"
            viewport={{amount: .2, once: true}}
            custom={
                index >= 3 ? (index % 3 === 0 ? 1 : index % 2 === 0 ? 2 : 3) : index + 1
            }
            ref={el => ref.current[index] = el}
            className={cls.box}
        >
            {/*<RequireAuthChildren allowedRules={[ROLES.Smm]}>*/}
                <i
                    className={classNames("fas fa-pen", cls.icon)}
                    onClick={() => onChangeModal(item.id)}
                />
            {/*</RequireAuthChildren>*/}

            <Example
                images={item.images}
            />
            <div className={cls.box_info}>
                <div className={cls.date}>{item.date}</div>
                <h3>{item.title}</h3>
                <div className={cls.info}>
                    {renderText(item.text)}
                </div>
            </div>
            <div className={cls.icons}>
                <i className="fab fa-instagram"/>
                <i className="fab fa-telegram"/>
                <i className="fab fa-facebook"/>
            </div>
        </motion.div>
    )
}

const ImageDrop = ({onImages, index, setChangedImages, changedImages, image, status}) => {
    useEffect(() => {
        if (status) {
            setImg({})
        }
    }, [status])

    const [img, setImg] = useState({})
    const {getInputProps, getRootProps} = useDropzone({
        onDrop: (acceptedFiles) => {
            onImages({
                type: `image_${index + 1}`,
                file: acceptedFiles[0]
            })
            setImg(acceptedFiles[0])
            if (image?.id) {
                const filtered = changedImages.filter(item => item !== image?.id)
                setChangedImages([...filtered, image?.id])
            }
        }
    })

    const ImageRender = useCallback(({img, image}) => {
        return (
            img?.path ? <img src={URL.createObjectURL(img)} alt=""/>
                : status ? <>
                    <i className="far fa-image"/>
                    <input
                        type="file"
                        {...getInputProps()}
                    />
                </> : image?.url ? <img src={BackUrlForDoc + image.url} alt=""/> : <>
                    <i className="far fa-image"/>
                    <input
                        type="file"
                        {...getInputProps()}
                    />
                </>
        )
    }, [img, image])

    return (
        <div
            className={cls.items__item}
            {...getRootProps()}
        >
            <ImageRender
                img={img}
                image={image}
            />
        </div>
    )
}

const Example = ({images}) => {
    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false
    }

    return (
        <div className={cls.box__img}>
            <Slider {...settings}>
                {
                    images.map(item => {
                        return (
                            <div
                                className={cls.img}
                            >
                                <img
                                    src={BackUrlForDoc + item?.url}
                                    alt=""
                                />
                            </div>
                        )
                    })
                }
            </Slider>
        </div>
    )
}

export default News;