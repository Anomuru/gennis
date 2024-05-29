import React, {useCallback, useEffect, useRef, useState} from 'react';


import "./platformWebsiteEdit.sass"
import Modal from "components/platform/platformUI/modal";
import img from "assets/user-interface/user_image.png"
import {useHttp} from "hooks/http.hook";
import {BackUrl, BackUrlForDoc, headers} from "constants/global";
import Select from "components/platform/platformUI/select";
import {Routes, Route, Outlet, useNavigate} from "react-router-dom";
import Input from "components/platform/platformUI/input";


const PlatformWebsiteEdit = () => {

    const options = [
        "Advantages","Comments","Events","Gallery"
    ]


    const [select,setSelect] = useState("Advantages")


    const navigate = useNavigate()

    useEffect(() => {
        navigate(select)
    },[navigate, select])



    return (
        <div className="websiteEdit">
            <Select number={true} title={"pages"} options={options} onChangeOption={setSelect} defaultValue={select}/>

            <div className="websiteEdit__content">
                <Routes>
                    <Route path="Advantages" element={<Advantages/>}/>
                    <Route path="Comments" element={<Comments/>}/>
                    <Route path="Events" element={<Events/>}/>
                    <Route path="Gallery" element={<Gallery/>}/>
                </Routes>


                <Outlet/>
            </div>

        </div>
    );
};



const Advantages = () => {

    const [advantages,setAdvantages] = useState([])
    const [active,setActive] = useState(false)
    const [advantage,setAdvantage] = useState({
        title: "",
        img: null,
        change: false
    })
    const inputRef = useRef()
    const [changing,setChanging] = useState(null)

    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}home_advantages`,"GET",null,headers())
            .then(res => {
                setAdvantages(res.advantages)
            })
    },[])


    const delAdvantages = (id) => {
        const newAdvantages = advantages.filter(item => item.id !== id)
        setAdvantages(newAdvantages)
        request(`${BackUrl}delete_advantage/${id}`,"GET",null,headers())
    }

    const changeAdvantages = (id) => {
        const newAdvantages = advantages.filter((item,i) => item.id === id )
        setAdvantage({
            ...newAdvantages[0],
            title: newAdvantages[0].name,
            img: `${BackUrlForDoc}${newAdvantages[0].img}`
        })

        setActive(true)
        setChanging(id)
    }


    const getImg = (e) => {
        const images = {
            img: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        }
        setAdvantage(item => ({...item,img: images}))
    }

    const Open = (e) => {
        inputRef.current.click()
    }



    const onSubmit = (e) => {
        e.preventDefault()
        setActive(false)

        let data = new FormData();
        data.append('file', advantage.img.file);
        const token = sessionStorage.getItem("token")
        const headers1 = {
            "Authorization": "Bearer " + token
        }

        if (changing) {
            request(`${BackUrl}change_advantage/${changing}`,"POST",JSON.stringify({name: advantage.title}),headers())
                .then(res => {
                    if (res.id && advantage.img.file) {
                        request(`${BackUrl}advantage_img/${res.id}`,"POST",data,headers1)
                            .then(() => {
                                request(`${BackUrl}home_advantages`,"GET",null,headers())
                                    .then(res => {
                                        setAdvantages(res.advantages)
                                    })
                            })
                    }
                })
                .then(() => {
                    request(`${BackUrl}home_advantages`,"GET",null,headers())
                        .then(res => {
                            setAdvantages(res.advantages)
                        })
                })
            setChanging(null)
        } else {
            request(`${BackUrl}add_advantages`,"POST",JSON.stringify({name: advantage.title}),headers())
                .then(res => {
                    if (res.id) {
                        request(`${BackUrl}advantage_img/${res.id}`,"POST",data,headers1)
                            .then(() => {
                                request(`${BackUrl}home_advantages`,"GET",null,headers())
                                    .then(res => {
                                        setAdvantages(res.advantages)
                                    })
                            })
                    }
                })
        }



        setAdvantage({
            title: "",
            img: null,
            change: false
        })



    }

    const renderAdvantages = (advantages) => {
        return advantages.map(item => {
            return (
                <div className="advantagesEdit__wrapper-item">
                    <div className="advantagesEdit__wrapper-item-header">
                        <i className="fas fa-edit" onClick={() => changeAdvantages(item.id)}/>
                        <i className="fas fa-times" onClick={() => delAdvantages(item.id)}/>
                    </div>
                    <div className="advantagesEdit__wrapper-item-content">
                        <img src={`${BackUrlForDoc}${item.img}`} alt="Img"/>
                        <div className="desc">{item.name}</div>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className="advantagesEdit">
            <div className="advantagesEdit__header">
                <div className="advantagesEdit__header-item">
                    <h1>Advantages</h1>
                </div>
                <div className="advantagesEdit__header-item">
                    <i onClick={() => setActive(true)} className="fas fa-plus" />
                </div>
            </div>

            <div className="advantagesEdit__wrapper">
                {renderAdvantages(advantages)}
            </div>



            <Modal setActiveModal={setActive} activeModal={active}>
                <div className="edit">
                    <form className="edit__wrapper" onSubmit={onSubmit}>
                        <input
                            ref={inputRef}
                            onChange={(e) => getImg(e)}
                            className="img-input"
                            type="file"
                        />
                        <div onClick={Open}  className="addImg">
                            {
                                advantage.img ?
                                    <img
                                        src={advantage.img.img ? advantage.img.img :advantage.img}
                                        alt=""
                                    />
                                    :
                                    <h1>
                                        Rasm tanlang
                                    </h1>
                            }
                        </div>
                        <textarea
                            value={advantage.title}
                            onChange={(e) => setAdvantage(item => ({...item,title: e.target.value}))}
                        />
                        <input type="submit" className="input-submit" value="Submit"/>
                    </form>
                </div>
            </Modal>
        </div>
    )
}


const Comments = () => {

    const [ comments, setComments ] = useState([])
    const { request } = useHttp()

    useEffect(() => {
        request(`${BackUrl}home_comments`,"GET",null,headers())
            .then(res => {
                setComments(res.comments)
            })
    },[])

    const delComment = (id) => {
        setComments(prev => prev.filter(item => item.id !== id))
        request(`${BackUrl}delete_comment/${id}`,"GET",null,headers())
    }



    const renderComments = (comments) => {
        return comments.map(item => {
            const userImg = item.img ? `${BackUrlForDoc}${item?.img}` : img

            return (
                <div className="commentsEdit__item" >
                    <div className="commentsEdit__item-header" >
                        <div className="info">
                            <img src={userImg} alt="UserImg"/>
                            <div>
                                <span>{item.name}</span>
                                <span>{item.surname}</span>
                            </div>
                        </div>
                        <div className="links">
                            <i onClick={() => delComment(item.id)} className="fas fa-times" />
                        </div>
                    </div>

                    <p>
                        {item.comment}
                    </p>
                </div>
            )
        })
    }


    return (
        <div className="commentsEdit">
            {renderComments(comments)}
        </div>
    )
}


const Events = () => {

    const [events,setEvents] = useState([])
    const [active,setActive] = useState(false)
    const [event,setEvent] = useState({
        title: "",
        desc: "",
        img: null,
        change: false
    })
    const [linksInput,setLinksInput] = useState([])
    const inputRef = useRef()
    const [changing,setChanging] = useState(null)

    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}home_news`,"GET",null,headers())
            .then(res => {
                setEvents(res.news)
            })
    },[])


    const delAdvantages = (id) => {
        const newAdvantages = events.filter(item => item.id !== id)
        setEvents(newAdvantages)
        request(`${BackUrl}delete_news/${id}`,"GET",null,headers())
    }



    const changeAdvantages = (id) => {
        const newAdvantages = events.filter((item) => item.id === id )
        setEvent({
            ...newAdvantages[0],
            title: newAdvantages[0].title,
            desc: newAdvantages[0].desc,
            img: `${BackUrlForDoc}${newAdvantages[0].img}`
        })

        setLinksInput(newAdvantages[0].links)
        setActive(true)
        setChanging(id)
    }


    const getImg = (e) => {
        const images = {
            img: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        }
        setEvent(item => ({...item,img: images}))
    }

    const Open = (e) => {
        inputRef.current.click()
    }



    const onSubmit = (e) => {
        e.preventDefault()


        let data = new FormData();
        data.append('file', event.img.file);
        const token = sessionStorage.getItem("token")
        const headersPhoto = {
            "Authorization": "Bearer " + token
        }


        const infoData = {
            ...event,
            links: linksInput
        }



        if (changing) {
            request(`${BackUrl}change_news/${changing}`,"POST",JSON.stringify(infoData),headers())
                .then(res => {
                    if (res.news_id && event.img.file) {
                        request(`${BackUrl}news_img/${res.news_id}`,"POST",data,headersPhoto)
                            .then(() => {
                                request(`${BackUrl}home_news`,"GET",null,headers())
                                    .then(res => {
                                        setEvents(res.news)
                                    })
                            })
                    }
                })
                .then(() => {
                    request(`${BackUrl}home_news`,"GET",null,headers())
                        .then(res => {
                            setEvents(res.news)
                        })
                })
            setChanging(null)
        } else {
            request(`${BackUrl}add_news`,"POST",JSON.stringify(infoData),headers())
                .then(res => {
                    if (res.news_id) {
                        request(`${BackUrl}news_img/${res.news_id}`,"POST",data,headersPhoto)
                            .then(() => {
                                request(`${BackUrl}home_news`,"GET",null,headers())
                                    .then(res => {
                                        console.log("data",res)
                                        setEvents(res.news)
                                    })
                            })
                    }
                })
        }

        setActive(false)
        setEvent({
            title: "",
            desc: "",
            img : null,
            change: false
        })
    }

    const renderAdvantages = (events) => {
        return events.map(item => {
            return (
                <div className="eventsEdit__wrapper-item">
                    <div className="eventsEdit__wrapper-item-header">
                        <i className="fas fa-edit" onClick={() => changeAdvantages(item.id)}/>
                        <i className="fas fa-times" onClick={() => delAdvantages(item.id)}/>
                    </div>
                    <div className="eventsEdit__wrapper-item-content">
                        <img src={`${BackUrlForDoc}${item.img}`} alt="Img"/>
                        <h1 className="title">{item.title}</h1>
                        <p className="desc">{item.desc}</p>

                        <div className="links">
                            {
                               item.links.map(link => {
                                   return (
                                       <a href={link.link}>
                                           <i className={`fab fa-${link.type}`} />
                                       </a>
                                   )
                               })
                            }
                        </div>
                    </div>
                </div>
            )
        })
    }


    const options = [
        {
            name: "telegram"
        },
        {
            name: "instagram"
        },
    ]


    const renderLinksInput = useCallback(() => {
        return linksInput.map(eventItem => {
            return (
                <div className="links__item">
                    <Select
                        onChangeOption={(e) => setLinksInput(items => {
                            return items.map(item => {
                                if (item.currentId ? item.currentId === eventItem.currentId : item.link_id === eventItem.link_id) {
                                    return {...item,type: e}
                                }
                                return item
                            })
                        })}
                        defaultValue={eventItem.type}
                        name="type"
                        title="Turi"
                        options={options}
                    />
                    <Input
                        onChange={(e) => setLinksInput(items => {
                            return items.map(item => {
                                if (item.currentId ? item.currentId === eventItem.currentId : item.link_id === eventItem.link_id) {
                                    return {...item,link: e}
                                }
                                return item
                            })
                        })}
                        defaultValue={eventItem.link}
                        title={"link"}
                    />
                </div>
            )
        })
    },[linksInput.length])


    const onAddLinksInput = () => {
        const link = {
            currentId: linksInput.length + 1,
            type: "",
            link : ""
        }
        setLinksInput([...linksInput,link])
    }


    const rendered = renderLinksInput()

    return (
        <div className="eventsEdit">
            <div className="eventsEdit__header">
                <div className="eventsEdit__header-item">
                    <h1>Events</h1>
                </div>
                <div className="eventsEdit__header-item">
                    <i onClick={() => setActive(true)} className="fas fa-plus" />
                </div>
            </div>
            <div className="eventsEdit__wrapper">
                {renderAdvantages(events)}
            </div>
            <Modal setActiveModal={setActive} activeModal={active}>
                <div className="edit">
                    <form className="edit__wrapper" onSubmit={onSubmit}>
                        <input
                            ref={inputRef}
                            onChange={(e) => getImg(e)}
                            className="img-input"
                            type="file"
                        />
                        <div onClick={Open}  className="addImg">
                            {
                                event.img ?
                                    <img
                                        src={event.img.img ? event.img.img : event.img}
                                        alt="Img"
                                    />
                                    :
                                    <h1>
                                        Rasm tanlang
                                    </h1>
                            }
                        </div>
                        <Input
                            title={"Title"}
                            defaultValue={event.title}
                            onChange={(e) => setEvent(item => ({...item,title: e}))}
                        />
                        <label className={"input-label"} htmlFor="comment">
                            <span className="name-field">Desc</span>
                            <textarea
                                value={event.desc}
                                onChange={(e) => setEvent(item => ({...item,desc: e.target.value}))}
                            />
                        </label>
                        {
                            linksInput.length < 2 ?
                                <div className="button">
                                    <i onClick={onAddLinksInput} className="fas fa-plus" />
                                </div> : null
                        }

                        <div className="links">
                            {rendered}
                        </div>

                        <input type="submit" className="input-submit" value="Submit"/>
                    </form>
                </div>
            </Modal>
        </div>
    )
}


const Gallery = () => {

    const [images,setImages] = useState([
        {id: 1, img: null,localImg: null},
        {id: 2, img: null,localImg: null},
        {id: 3, img: null,localImg: null},
        {id: 4, img: null,localImg: null},
        {id: 5, img: null,localImg: null},
        {id: 6, img: null,localImg: null},
        {id: 7, img: null,localImg: null},
        {id: 8, img: null,localImg: null}
    ])



    const [activeModal,setActiveModal] = useState(false)
    const [layoutId,setLayoutId] = useState(null)

    const poper = (id) => {
        setLayoutId(id)
        setActiveModal(true)

    }
    const renderItems = (images) => {
        return images.map(({id,img,localImg}) => {
            return (
                <div
                    className="galleryEdit__item"
                    onClick={() => poper(id)}
                >
                    {
                        img ?
                            <img
                                src={ `${BackUrlForDoc}${img}`}
                                alt="Img"
                            />
                            : null
                    }
                </div>

            )
        })
    }

    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}gallery`,"GET",null,headers())
            .then(res => {
                setImages(res.gallery)
            })
    },[])

    return (
        <div className="galleryEdit">
            <div className="galleryEdit__wrapper">
                {renderItems(images)}
            </div>
            <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                <PopupImg
                    setActiveModal={setActiveModal}
                    setImages={setImages}
                    images={images}
                    loyautId={layoutId}
                />
            </Modal>
        </div>
    )
}


const PopupImg = ({loyautId,images, setImages,setActiveModal}) => {
    const selected = images.filter(item => item.id === loyautId);

    const inputRef = useRef()

    const getImg = (e) => {
        const images = {
            img: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        }
        setImages(items => items.map(item => {
            if (item.id === loyautId) {
                return {...item,localImg: images}
            }
            return item
        }))
    }

    const Open = (e) => {
        inputRef.current.click()
    }

    const {request} = useHttp()

    const onSubmit = (e) => {
        e.preventDefault()

        let data = new FormData();
        data.append('file', selected[0].localImg.file);
        const token = sessionStorage.getItem("token")
        const headers1 = {
            "Authorization": "Bearer " + token
        }

        request(`${BackUrl}add_gallery/${selected[0].id}`,"POST",data,headers1)
            .then((res) => {
                setActiveModal(false)
                setImages(res.gallery)
            })


    }

    return (
        <div  className="imgEdit">
            <form className="imgEdit-wrapper" onSubmit={onSubmit}>
                <div onClick={Open}  className="addImg">
                    <input
                        ref={inputRef}
                        onChange={(e) => getImg(e)}
                        className="img-input"
                        type="file"
                    />
                    {
                        selected[0]?.localImg ?
                            <img
                                src={selected[0].localImg ? selected[0].localImg.img : `${BackUrlForDoc}${img}`}
                                alt="Img"
                            />
                            :
                            <h1>
                                Rasm tanlang
                            </h1>
                    }
                </div>

                <input type="submit" className="input-submit" />
            </form>
        </div>
    )
}


export default PlatformWebsiteEdit;
