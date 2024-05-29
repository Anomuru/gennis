import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";

import "pages/platformContent/platformBooks/profileBooks/booksProfile.sass"
import Button from "components/platform/platformUI/button";
import book from "assets/book.png"
import BackButton from "components/platform/platformUI/backButton/backButton";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Input from "components/platform/platformUI/input";
import {useHttp} from "hooks/http.hook";
import {BackUrl, BackUrlForDoc, headers, ROLES} from "constants/global";
import {fetchBook, changeBook, deleteBook} from "slices/booksSlice";
import Confirm from "components/platform/platformModals/confirm/confirm";
import {fetchInsideRoom} from "slices/roomsSlice";
import Select from "components/platform/platformUI/select";
import {useAuth} from "hooks/useAuth";
import {setMessage} from "slices/messageSlice";
import bookImg from "../../../../assets/book.png";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";


const BooksProfile = () => {


    const {id} = useParams()

    const [activeOptions, setActiveOptions] = useState(false)
    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)


    const [selectedImg, setSelectedImg] = useState(null)

    const {isCheckedPassword} = useSelector(state => state.me)
    const {book} = useSelector(state => state.books)

    const [msg, setMsg] = useState(false)
    const [typeMsg, setTypeMsg] = useState(false)
    const [activeMessage, setActiveMessage] = useState(false)

    const refs = useRef([])

    const links = [
        {
            type: "btn",
            iconClazz: "fa-pen",
            name: "change",
            title: "Change",
            link: ""
        },
        {
            type: "btn",
            iconClazz: "fa-times",
            name: "delete",
            title: "Delete",
            link: ""
        }
    ]


    const dispatch = useDispatch()
    const {request} = useHttp()

    useEffect(() => {
        dispatch(fetchBook({id}))
    }, [id])


    useEffect(() => {
        if (Object.keys(book).length > 0) {
            setSelectedImg(book?.images[0]?.img)
        }
    }, [book])


    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    }, [activeChangeModalName, isCheckedPassword])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    const renderLinks = useCallback(() => {
        return links.map((link, index) => {
            if (link.type === "link") {
                return (
                    <Link to={`../${link.link}}`} className="option">
                        <i className={`fas ${link.iconClazz}`}/>
                        <span>{link.title}</span>
                    </Link>
                )
            }
            if (link.type === "btn") {
                return (
                    <div
                        key={index}
                        onClick={() => changeModal(link.name)}
                        className="option"
                    >
                        <i className={`fas ${link.iconClazz}`}/>
                        <span>{link.title}</span>
                    </div>
                )
            }
        })
    }, [])

    const renderedLinks = renderLinks()



    const changeActiveImg = (index) => {

        for (let i = 0; i < refs.current.length; i++) {
            if (i === index) {
                for (let x = 0; x < refs.current.length; x++) {
                    if (refs.current[x])
                    refs.current[x].classList.remove("active")
                }

                refs.current[index].classList.add("active")
                setSelectedImg(book.images.filter((item, m) => m === index)[0]?.img)

            }
        }
    }

    const navigate = useNavigate()
    const deleteBookFunc = (data) => {
        dispatch(deleteBook({id: book.id}))
        request(`${BackUrl}book_inside/${book.id}`, "DELETE", null, headers())
            .then(res => {
                setTypeMsg("success")
                setActiveMessage(true)
                setMsg(res.msg)
                navigate("..")
            })
            .catch(() => {
                setTypeMsg("error")
                setActiveMessage(true)
                setMsg("Serverda yoki internetingizda hatolik")
            })
    }

    return (
        <div className="bookProfile">
            <div className="bookProfile__header">
                <BackButton/>


                <div className="links">
                    <RequireAuthChildren allowedRules={[ROLES.Editor]}>
                        <div
                            onClick={() => setActiveOptions(!activeOptions)}
                            className="links-btn"
                        >
                            <i className="fas fa-ellipsis-v"/>
                            <div
                                className={classNames('modalOptions', {
                                    "active": activeOptions
                                })}
                            >
                                {renderedLinks}
                            </div>
                        </div>
                    </RequireAuthChildren>

                </div>
            </div>

            <div className="bookProfile__wrapper">
                <div className="bookProfile__slides">
                    <img className="main" src={`${BackUrlForDoc}${selectedImg}`} alt={"Img"}/>


                    <div className="wrapper">
                        {
                            book?.images?.map((item, index) => {

                                if (index === 0) {
                                    return (
                                        <img
                                            className={"active"}
                                            key={index}
                                            onClick={() => changeActiveImg(index)}
                                            src={`${BackUrlForDoc}${item?.img}`}
                                            ref={el => refs.current[index] = el}
                                            alt=""
                                        />
                                    )
                                }

                                return (
                                    <img
                                        key={index}
                                        onClick={() => changeActiveImg(index)}
                                        src={`${BackUrlForDoc}${item?.img}`}
                                        ref={el => refs.current[index] = el}
                                        alt=""
                                    />
                                )
                            })
                        }
                    </div>
                </div>

                <div className="bookProfile__info">
                    <h1>{book.name}</h1>
                    <p>{book.desc}</p>

                    <div className="line"></div>

                    <div onClick={() => changeModal("buy")} className="bookProfile__info-btn">
                        {book.price}
                    </div>
                </div>
            </div>

            <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                <CheckPassword/>
            </Modal>
            {
                activeChangeModalName === "change" && isCheckedPassword ?
                    <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                        <ChangeBook book={book} setTypeMsg={setTypeMsg} setMsg={setMsg}
                                    setActiveMessage={setActiveMessage} closeModal={setActiveChangeModal}/>
                    </Modal> :
                    activeChangeModalName === "delete" && isCheckedPassword ?
                        <>
                            <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                                <Confirm setActive={setActiveChangeModal} getConfirm={setIsConfirm}
                                         text={"Kitobni uchirishni hohlaysizmi"}/>
                            </Modal>
                            {
                                isConfirm === "yes" ?
                                    <Modal
                                        activeModal={activeChangeModal}
                                        setActiveModal={() => {
                                            setActiveChangeModal(false)
                                            setIsConfirm(false)
                                        }}
                                    >
                                        <ConfimReason getConfirm={deleteBookFunc} reason={true}/>
                                    </Modal> : null
                            }

                        </> :
                        activeChangeModalName === "buy" && isCheckedPassword ?
                            <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                                <Buying disableModal={() => setActiveChangeModal(false)} price={book.price}
                                        id={book.id}/>
                            </Modal> : null
            }
        </div>
    );
};

const ChangeBook = ({setTypeMsg, setMsg, setActiveMessage, book, closeModal}) => {

    const [name, setName] = useState("")
    const [editorShare, setEditorShare] = useState(0)
    const [eductionShare, setEductionShare] = useState(0)
    const [desc, setDesc] = useState("")
    const [img, setImg] = useState({
        images: [],
        lastId: 1
    })

    const refImg = useRef()


    useEffect(() => {

        setName(book.name)
        setEductionShare(book.share_price)
        setEditorShare(book.own_price)
        setDesc(book.desc)
    }, [book])

    const {request} = useHttp()
    const dispatch = useDispatch()
    const onSubmit = (e) => {
        e.preventDefault()

        let formData = new FormData();

        const token = sessionStorage.getItem("token")
        const headers1 = {
            "Authorization": "Bearer " + token,
            // "Content-Type": "multipart/form-data"
        }

        console.log(book.images.length)

        for (let i = 0; i < img.images.length; i++) {
            formData.append(`file-${book.images.length === 0 ? 0 : book.images.length}`, img.images[i].file);
        }

        const newData = {
            name,
            editorShare,
            eductionShare,
            desc
        }


        formData.append("info", JSON.stringify(newData))



        request(`${BackUrl}book_inside/${book.id}`, "POST", formData, {})
            .then(res => {
                if (res.success) {

                    setTypeMsg("success")
                    setMsg(res.msg)
                    setActiveMessage(true)
                    dispatch(changeBook({book: res.book}))
                    closeModal()

                    setImg({
                        images: [],
                        lastId: 1
                    })
                }
            })


    }

    const onClickImg = () => {
        refImg.current.click()
    }

    const getImg = (e) => {
        const images = []
        for (let i = 0; i < e.target.files.length; i++) {
            const data = {
                id: img.lastId,
                img: URL.createObjectURL(e.target.files[i]),
                file: e.target.files[i]
            }
            images.push(data)
        }

        setImg({
            images: [...images, ...img.images],
            lastId: img.lastId + 1
        })
    }

    const deleteSelectedImg = (id) => {
        const newArray = img.images.filter(item => item.id !== id)

        setImg({
            ...img,
            images: newArray
        })
    }

    const deletePhoto = (id) => {
        request(`${BackUrl}del_img_book/${book.id}/${id}`, "GET", null, headers())
            .then(res => {
                setTypeMsg("success")
                setActiveMessage(true)
                setMsg(res.msg)
                dispatch(fetchBook({id: book.id}))
            })
            .catch(() => {
                setTypeMsg("error")
                setActiveMessage(true)
                setMsg("Serverda yoki internetingizda hatolik")
            })
    }


    return (
        <div className="changeBookModal">
            <div>
                <h1>Delete Images</h1>
                <div className="images">
                    {book.images.length !== 0 ?
                        book?.images?.map((item) => {
                            if (item !== "")
                                return (
                                    <div className="images__item">
                                        <div className="images__item-del" onClick={() => deletePhoto(item.index)}>
                                            <i className="fas fa-times"></i>
                                        </div>
                                        <img src={`${BackUrlForDoc}${item.img}`} alt="rasm"/>
                                    </div>
                                )
                        }) : null
                    }
                </div>
            </div>
            <form className="modal-form" action="" onSubmit={onSubmit}>
                {
                    +img.images.length + +book.images.length < 3 &&
                    <div className={"img"} onClick={onClickImg}>
                        <input

                            onChange={(e) => getImg(e)}
                            ref={refImg}
                            type="file"
                        />
                        {img.images.length !== 0 ?
                            <h1>Rasm qo'shish</h1> : <h1>Rasmlarni tanlang</h1>
                        }
                    </div>
                }


                <div className="images">
                    {img.images.length !== 0 ?
                        img?.images?.map(item => {
                            return (
                                <div className="images__item">
                                    <div className="images__item-del" onClick={() => deleteSelectedImg(item.id)}>
                                        <i className="fas fa-times"></i>
                                    </div>
                                    <img src={item.img} alt="rasm"/>
                                </div>
                            )
                        }) : null
                    }
                </div>

                <Input value={name} title={"Nomi"} onChange={setName}/>

                <Input required={true} title={"Kitobсhi uchun dolya"} type={"number"} value={editorShare}
                       onChange={setEditorShare}/>
                <Input required={true} title={"Filial uchun dolya"} type={"number"} value={eductionShare}
                       onChange={setEductionShare}/>

                <textarea
                    onChange={e => setDesc(e.target.value)}
                    value={desc}
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                >

                    </textarea>
                <input
                    className="input-submit"
                    // disabled={isSubmit}
                    type="submit"
                />

            </form>
        </div>
    )
}

const Buying = ({price, id, disableModal}) => {

    const [active, setActive] = useState("me")
    const [activeModal, setActiveModal] = useState(false)

    const [count, setCount] = useState(1)
    const [teachers, setTeachers] = useState([])
    const [groups, setGroups] = useState([])
    const [students, setStudents] = useState([])
    const [locations, setLocations] = useState([])


    const [selectedTeacher, setSelectedTeacher] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null)


    const {role} = useAuth()


    const {request} = useHttp()

    useEffect(() => {
        request(`${BackUrl}filter_book/`, "GET", null, headers())
            .then(res => {
                if (role === ROLES.Teacher) {
                    setLocations(res.data[0].location_list)
                    setGroups(res.data[0].groups)
                } else {
                    setTeachers(res.data)
                }
            })
    }, [])


    useEffect(() => {
        if (selectedTeacher) {
            setGroups(teachers.filter(item => item.id === +selectedTeacher)[0].groups)
        }
    }, [selectedTeacher])


    useEffect(() => {
        if (selectedGroup) {
            setCount(groups.filter(item => item.id === +selectedGroup)[0].students)
            setStudents(groups.filter(item => item.id === +selectedGroup)[0].student_list)
        }
    }, [selectedGroup])

    const changeActive = (name) => {
        setActive(name)
    }

    const dispatch = useDispatch()
    const getConfirm = (ans) => {
        if (ans === "yes") {
            let data
            if (ROLES.Admin === role) {
                data = {
                    count,
                    book_id: id,
                    teacher_id: selectedTeacher,
                    group_id: selectedGroup,
                    students: students.filter(item => item.checked)
                }
            } else if (role === ROLES.Teacher) {
                data = {
                    count,
                    location_id: selectedLocation,
                    book_id: id,
                    group_id: selectedGroup,
                    students: students.filter(item => item.checked)
                }
            } else if (role === ROLES.Student) {
                data = {
                    count,
                    book_id: id,
                }
            }


            request(`${BackUrl}buy_book`, "POST", JSON.stringify(data), headers())
                .then(res => {
                    dispatch(setMessage({
                        msg: res.msg,
                        active: true,
                        type: "success"
                    }))
                    disableModal()
                })
                .catch(() => {
                    dispatch(setMessage({
                        msg: "Serverda yoki internetingizda hatolik bor",
                        active: true,
                        type: "error"
                    }))
                })
        } else {
            disableModal()
        }
    }

    const setChecked = (id) => {
        setStudents(students => students.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    checked: !item.checked && true
                }
            }
            return item
        }))
    }


    const onSubmit = (e) => {
        e.preventDefault()
        setActiveModal(true)
    }

    useEffect(() => {
        if (locations.length > 0) {
            setSelectedLocation(locations[0].id)
        }
    }, [locations])


    const totalPrice = active === "me" ? price * count : price * students.filter(item => item.checked).length

    return (
        <div className="buy">
            <form onSubmit={onSubmit}>
                <h1>Sotib olish</h1>

                {
                    role !== ROLES.Student &&
                    <div className="buy__header">
                        <Button active={active === "me"} onClickBtn={() => changeActive("me")}>O'zimga</Button>
                        <Button active={active === "other"} onClickBtn={() => changeActive("other")}>Boshqa</Button>
                    </div>
                }


                {
                    active === "me" ?
                        <>
                            {locations.length > 0 &&
                                <Select extra={{required: true}} defaultValue={selectedLocation} name={"locations"}
                                        group={true} options={locations}
                                        onChangeOption={setSelectedLocation}/>}
                            <Input others={{min: 1}} type={"number"} value={count} onChange={setCount}/>

                        </> :
                        <>
                            {
                                role !== ROLES.Teacher &&
                                <Select defaultValue={selectedTeacher} name={"teachers"} teachers={true}
                                        options={teachers}
                                        onChangeOption={setSelectedTeacher}/>

                            }


                            {groups.length > 0 &&
                                <Select defaultValue={selectedGroup} name={"groups"} group={true} options={groups}
                                        onChangeOption={setSelectedGroup}/>}


                        </>
                }


                <input
                    className="input-submit"
                    // disabled={isSubmit}
                    type="submit"
                    value={"sotib olish"}
                />


            </form>

            {
                students.length && active !== "me" &&
                <div className="students">
                    <h1>O'quvchiilar</h1>
                    {
                        students.map(item => (
                            <div className="students__item">
                                <span>{item.name}</span>
                                <span>{item.surname}</span>
                                <span>
                                    <input type="checkbox" onChange={() => setChecked(item.id)}/>
                                </span>
                            </div>
                        ))
                    }
                </div>
            }

            <Modal id={"confirm"} activeModal={activeModal} setActiveModal={setActiveModal}>
                <Confirm getConfirm={getConfirm}
                         text={`Siznig hisob raqamingizdan: <span style="color: red">${totalPrice.toLocaleString()}</span> so'm pul yechiladi`}/>
            </Modal>
        </div>
    )
}


export default BooksProfile;