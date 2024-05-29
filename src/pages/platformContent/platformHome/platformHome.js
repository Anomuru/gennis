import React, {useEffect, useRef, useState} from 'react';
import {useForm} from "react-hook-form";

import {AnimatePresence, motion} from "framer-motion";
import {onLikeClick} from "frame-motion";

import news from "assets/background-img/block_test.png"
import user from "assets/user-interface/user_image.png"

import cls from "./platformHome.module.sass"
import "styles/components/_form.sass"
import {useHttp} from "hooks/http.hook";
import {fetchMyInfo} from "slices/meSlice";
import {useDispatch, useSelector} from "react-redux";
import {useAuth} from "hooks/useAuth";
import {Link} from "react-router-dom";
import {BackUrl, BackUrlForDoc, headers} from "constants/global";
import img from "assets/user-interface/user_image.png";
import {setMessage} from "slices/messageSlice";
import Modal from "components/platform/platformUI/modal";






const PlatformHome = () => {


    const {id} = useAuth()
    const {rate} = useSelector(state => state.me)

    const dispatch = useDispatch()

    useEffect(()=> {
        dispatch(fetchMyInfo(id))

    },[dispatch, id])

    const commentsArr = [
        {
            id: 1,
            name: "Ulugbek",
            surname: "Fatxulleyev",
            comment: "lamskdmaa jdasjdna asndjasnd a sja nsjdn as ajsdnajs nd ns djfn sd fs fsd sd",
            like: 27,
            onLike: false
        },
        {
            id: 2,
            name: "Begzod",
            surname: "Jumaniyozv",
            comment: "lamskdmaa jdasjdna asndjasnd a sja nsjdn as ajsdnajs nd ns djfn sd fs fsd sd",
            like: 18,
            onLike: false
        }
    ]
    const subjectsGrade = [
        {
            name: "Ingliz tili",
            grade: 5.0
        },
        {
            name: "Rus tili",
            grade: 4.5
        },
        {
            name: "Matematika",
            grade: 3.9
        }
    ]
    // const events = [
    //     {
    //         img: news,
    //         desc: "kamsdk ajsndjans asdnjasndjas"
    //     },
    //     {
    //         img: news,
    //         desc: "kamsdk ajsndjans asdnjasndjas asdasd as"
    //     },
    //     {
    //         img: news,
    //         desc: "kamsdk ajsndjans asdnjasndjas asdas as as adas s asa sassaa"
    //     },
    //
    // ]


    const {request} = useHttp()



    return (
        <motion.div className={cls.platformHome}>
            <News/>
            {
                rate.length ?
                    <GradesOfSubjects subjects={rate}/>
                    : null
            }
            {/*<Events events={events}/>*/}
            <Comments />
        </motion.div>

    );
};

export default PlatformHome;

const Comments = () => {
    const {
        register,
        handleSubmit,
        reset
    } = useForm()


    const [comments,setComments] = useState([])
    const [commentsWidth,setCommentsWidth] = useState()
    const commentsCarousel = useRef()

    const {id} = useAuth()


    const onDoubleClick = (commentId) => {
        request(`${BackUrl}like_comment/${id}/${commentId}`,"GET",null,headers())
            .then(res => {
                const newComments = res.comments.map(item => ({...item,onLike : item.likes_info.some(user => user.user_id === id )}))
                const sortedByLike = newComments.sort((a, b) => b.likes - a.likes)
                setComments(sortedByLike)
            })
    }



    const renderComments = (comments) => {
        return comments.map(({name,surname,id,likes,onLike,comment,likes_info,img}) => {

            const activeAnimate = onLike ? "animate" : "inactive"
            const userImg = img ? `${BackUrlForDoc}${img}` : user

            return (
                <motion.div transition={{duration : 1}} key={id} layout className={cls.comment}  onDoubleClick={() => onDoubleClick(id)}>
                    <div className={cls.comment__userInfo}>
                        <img src={userImg} alt="user__photo"/>
                        <div>
                            <h3>{name}</h3>
                            <h3>{surname}</h3>
                        </div>
                    </div>
                    <h2 className={cls.comment__desc}>
                        {comment}
                    </h2>
                    <motion.div className={cls.comment__like}>
                        <span>{likes}</span>
                        <motion.i
                            variants={onLikeClick}
                            animate={activeAnimate}
                            className="fas fa-heart"
                            onClick={() => onDoubleClick(id)}
                        />
                    </motion.div>
                </motion.div>
            )
        })
    }

    useEffect(() => {
        setCommentsWidth(commentsCarousel.current.scrollWidth - commentsCarousel.current.offsetWidth)
    },[comments.length])


    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}home_comments`,"GET",null,headers())
            .then(res => {
                const newComments = res.comments.map(item => ({...item,onLike : item.likes_info.some(user => user.user_id === id )}))
                const sortedByLike = newComments.sort((a, b) => b.likes - a.likes)
                setComments(sortedByLike)
            })
    },[])


    const onSubmit = (data,e) => {
        e.preventDefault()
        const newData = {
            comment: data.comment,
            id
        }
        request(`${BackUrl}add_comment`,"POST",JSON.stringify(newData),headers())
            .then(res => {
                const newComments = res.comments.map(item => ({...item,onLike : item.likes_info.some(user => user.user_id === id )}))
                const sortedByLike = newComments.sort((a, b) => b.likes - a.likes)
                setComments(sortedByLike)
            })
        reset()
    }

    return (
        <motion.div className={cls.platformHome__item}>

            <h2 className={cls.title}>Izohlar :</h2>

            <motion.div
                className={`${cls.wrapper} ${cls.comments}`}
                ref={commentsCarousel}
            >
                <motion.div
                    className={cls.carousel}
                    drag={"x"}
                    dragConstraints={{left: -commentsWidth,right: 0}}
                >
                    <AnimatePresence>
                        {renderComments(comments)}
                    </AnimatePresence>

                </motion.div>
            </motion.div>

            <form className={cls.addComment} onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="comment">
                    <span className="name-field">Izoh qoshish</span>
                    <textarea
                        required={true}
                        id="comment"
                        {...register("comment")}
                    />
                </label>
                <input type="submit" className="input-submit" value="Kiritish"/>
            </form>
        </motion.div>
    )
}

const GradesOfSubjects = ({subjects}) => {

    const renderSubjectsGrade = (subjects) => {
        return (
            // eslint-disable-next-line array-callback-return
            subjects.map((item,index) => {
                const clazzCircle =
                    item.degree >= 5 ? "green" :
                        item.degree >= 4 ? "yellow" :
                            item.degree >= 3 ? "red":
                                null
                return (
                    <div key={index} className="grade">
                        <h3 className="grade__title">{item.subject}</h3>
                        <div className={`grade__circle ${clazzCircle}`}>
                            {item.degree}
                        </div>
                    </div>
                )
            })
        )
    }

    return (
        <div className="platformHome__item">
            <h2 className="platformHome__item-title">Mening baholarim :</h2>
            <div className="platformHome__item-wrapper platformHome__item-grades">
                {renderSubjectsGrade(subjects)}
            </div>
        </div>
    )
}

const Events = ({events}) => {

    const [eventsWidth,setEventsWidth] = useState()
    const eventsCarousel = useRef()


    useEffect(()=>{
        setEventsWidth(eventsCarousel.current.scrollWidth - eventsCarousel.current.offsetWidth)
    },[])

    const renderEvents = (events) => {
        return events.map((item,index) => {
            return (
                <div key={index} className="event">
                    <img src={item.img} alt="news"/>
                    <h3>{item.desc}</h3>
                </div>
            )
        })
    }

    return (
        <motion.div className="platformHome__item">
            <h2 className="platformHome__item-title">Yangiliklar :</h2>
            <motion.div
                ref={eventsCarousel}
                className="platformHome__item-wrapper platformHome__item-events"
            >
                <motion.div
                    drag={"x"}
                    dragConstraints={{right: 0,left: -eventsWidth}}
                    className="carousel"
                >
                    {renderEvents(events)}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}


const News = () => {

    const [activeAdd,setActiveAdd] = useState(false)


    const onToggleActive = () => {
        setActiveAdd(!activeAdd)
    }




    return (
        <motion.div className={cls.platformHome__item}>

            <div className={cls.header}>
                <h2 className={cls.title}>Yangiliklar :</h2>
                <div className={cls.add} onClick={onToggleActive}>
                    <i className="fas fa-plus"></i>
                </div>
            </div>

            <motion.div
                className={cls.wrapper}
            >


            </motion.div>


            <Modal activeModal={activeAdd} setActiveModal={setActiveAdd}>

            </Modal>

        </motion.div>
    )
}

