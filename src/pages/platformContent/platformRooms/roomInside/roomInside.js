import React, {useCallback, useEffect, useRef, useState} from 'react';


import img from "assets/background-img/block_test.png"
import "./roomInside.sass"
import classNames from "classnames";
import { Link, useParams} from "react-router-dom";
import { BackUrl, BackUrlForDoc, headers } from "constants/global";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import { useDispatch, useSelector } from "react-redux";
import { fetchInsideRoom } from "slices/roomsSlice";
import Input from "components/platform/platformUI/input";
import { fetchDataToChange } from "slices/dataToChangeSlice";
import { useHttp} from "hooks/http.hook";
import { useAuth} from "hooks/useAuth";
import { setMessage} from "slices/messageSlice";



const RoomInside = () => {

    const {roomId} = useParams()

    const [activeOptions,setActiveOptions] = useState(false)
    
    const [activeChangeModal,setActiveChangeModal] = useState(false)
    const [activeChangeModalName,setActiveChangeModalName] = useState("")
    const [activeCheckPassword,setActiveCheckPassword] = useState(false)


    const {insideRoom} = useSelector(state => state.rooms)
    const {isCheckedPassword} = useSelector(state => state.me)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchInsideRoom(roomId))
    },[roomId])

    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    },[activeChangeModalName, isCheckedPassword])

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
        return insideRoom?.links?.map((link,index) => {
            if (link.type === "link") {
                return (
                    <Link to={`../${link.link}/${roomId}`} className="option">
                        <i className={`fas ${link.iconClazz}`} />
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
                        <i className={`fas ${link.iconClazz}`} />
                        <span>{link.title}</span>
                    </div>
                )
            }
        })
    },[changeModal, insideRoom])


    const renderedLinks = renderLinks()

    return (
        <div className="room">
            <div className="room__wrapper">
                <div className="room__links">
                    <div
                        onClick={() => setActiveOptions(!activeOptions)}
                        className="room__links-btn"
                    >
                        <i className="fas fa-ellipsis-v" />
                        <div
                            className={classNames('modalOptions', {
                                "active": activeOptions
                            })}
                        >
                            {renderedLinks}
                        </div>
                    </div>
                </div>
                <h1>{insideRoom.name}</h1>
                <div className="room__images">
                    {
                        insideRoom?.images?.map(item => {
                            return <img src={`${BackUrlForDoc}${item.name}`} alt=""/>
                        })
                    }
                </div>

                <div className="room__info">

                    <div className="room__info-item">
                        <span>O'rindiqlar soni:</span>
                        <span>{insideRoom.seats}</span>
                    </div>

                    <div className="room__info-item">
                        <span>Elektron doska: </span>
                        {
                            insideRoom.electronic?
                                <span className="true">
                                    <i className="fas fa-check"></i>
                                </span>
                                :
                                <span className="false">
                                    <i className="fas fa-times"></i>
                                </span>
                        }
                    </div>
                </div>
            </div>

            {/*<RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>*/}
                <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                    <CheckPassword/>
                </Modal>
                {
                    activeChangeModalName === "changeInfo" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <ChangeInfoRoom

                                roomId={roomId}
                                data={insideRoom}
                                setActiveChangeModal={setActiveChangeModal}
                            />
                        </Modal> :
                    activeChangeModalName === "changePhoto" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                           <ChangeRoomPhoto
                               roomId={roomId}
                               setActiveChangeModal={setActiveChangeModal}

                               data={insideRoom}
                           />
                        </Modal> : null

                }
            {/*</RequireAuthChildren>*/}


        </div>
    );
};



const ChangeInfoRoom = React.memo(({data,setActiveChangeModal,roomId}) => {

    const [name,setName] = useState(null)
    const [seats,setSeats] = useState(null)
    const [eBoard,setEBoard] = useState(false)
    const [selectedSubjects,setSelectedSubjects] = useState([])
    const [subjects,setSubjects] = useState([])

    const {dataToChange} = useSelector(state => state.dataToChange)


    const {request} = useHttp()
    const dispatch = useDispatch()




    useEffect(() => {
        setSeats(data.seats)
        setName(data.name)
        setEBoard(data.electronic)
    },[data])

    useEffect(()=>{
        if (dataToChange) {
            setSubjects(dataToChange.subjects)
        }
    },[dataToChange])



    const {selectedLocation} = useAuth()

    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    },[selectedLocation])

    useEffect(() => {
        if (data?.subjects && dataToChange?.subjects ) {
            const newData = dataToChange?.subjects?.map(sb => ({
                ...sb,
                disabled: data?.subjects?.some(item => item.name.toLowerCase() === sb.name.toLowerCase())
            }))
            setSubjects(newData)
        }
    },[data?.subjects, dataToChange?.subjects])

    useEffect(() => {
        if (subjects?.length) {
            // eslint-disable-next-line array-callback-return
            subjects.map(item => {
                if (item.disabled) {
                    setSelectedSubjects(sb => {
                        return [...sb,item]
                    })
                }
            })
        }
    },[subjects?.length])



    const onSubmit = (e) => {
        e.preventDefault()

        const newData = {
            name,
            seats,
            eBoard,
            selectedSubjects
        }





        request(`${BackUrl}edit_room/${data.id}`, "POST",JSON.stringify(newData),headers())
            .then(res => {
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
                setActiveChangeModal(false)
                dispatch(fetchInsideRoom(roomId))
            })
            .catch(() => {
                dispatch(setMessage({
                    msg: "Serverda yoki internetingizda hatolik",
                    type: "error",
                    active: true
                }))
            })

    }



    const onGetSubject = (subjectName) => {
        if (subjectName !== "Fan tanla") {
            const filteredSubjects = subjects.find(item => item.name === subjectName)
            setSubjects(subjects => {
                return subjects.map(item => {
                    if (item.name === subjectName) {
                        return {...item,disabled: true}
                    }
                    return item
                })
            })
            setSelectedSubjects([...selectedSubjects,filteredSubjects])
        }
    }

    const onDeleteSubject = (subjectName) => {
        if (subjectName !== "Fan tanla" ) {
            setSubjects(subjects => {
                return subjects.map(item => {
                    if (item.name === subjectName) {
                        return {...item,disabled: false}
                    }
                    return item
                })
            })
            setSelectedSubjects(selectedSubjects.filter(item => item.name !== subjectName))
        }
    }


    const renderSubjects = (list) => {
        return (
            list.map((item,index) => {
                return (
                    <div
                        key={index}
                        className="subjects__item"
                    >
                        <div className="subjects__item-info">
                            <span>
                                {item.name}
                            </span>
                            <i
                                onClick={() => onDeleteSubject(item.name)}
                                className="fas fa-times"
                            />
                        </div>
                    </div>
                )
            })
        )
    }




    return (
        <div className="changeRoom">
            <form action="" onSubmit={onSubmit}>
                <Input  defaultValue={data.name}  onChange={setName} title={"Hona nomi"}/>
                <Input  defaultValue={data.seats}  onChange={setSeats} title={"Oridiqlar soni"}/>

                <label htmlFor="" className="checkbox">
                    <input checked={eBoard} onChange={() => setEBoard(!eBoard)} type="checkbox"/>
                    <span>Elektron doska</span>
                </label>

                {
                    selectedSubjects.length < 3 ? (
                        <label htmlFor="subjects">
                            <select
                                id="subjects"
                                className="input-fields"
                                onChange={e => onGetSubject(e.target.value)}
                            >
                                <option value="Fan tanla" >Fan tanlang</option>
                                {
                                    subjects?.map(item => {
                                        return (
                                            <option disabled={item.disabled}  key={item.id} value={item.name}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </label>
                    ) : null
                }

                <div className="subjects">
                    <h3>Tanlangan fanlar:</h3>
                    <div className="subjects__wrapper">
                        {renderSubjects(selectedSubjects)}
                    </div>
                </div>



                <input  className="input-submit" type="submit"/>

            </form>

        </div>
    )
})



const ChangeRoomPhoto = ({data,setActiveChangeModal,roomId}) => {



    const [img,setImg] = useState({
        images: [],
        lastId: 1
    })

    const inputRef = useRef()

    const Open = (e) => {
        inputRef.current.click()
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
            images: [...images,...img.images],
            lastId: img.lastId+1
        })


    }



    const {request} = useHttp()
    const dispatch = useDispatch()

    const deletePhoto = (id) => {
        request(`${BackUrl}delete_room_img/${id}`, "GET",null,headers())
            .then(res => {
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
                dispatch(fetchInsideRoom(roomId))
            })
            .catch(() => {
                dispatch(setMessage({
                    msg: "Serverda yoki internetingizda hatolik",
                    type: "error",
                    active: true
                }))
            })
    }


    const onSubmit = (e) => {
        e.preventDefault()

        let images = new FormData();

        const token = sessionStorage.getItem("token")
        const headers1 = {
            "Authorization": "Bearer " + token
        }


        for (let i = 0 ; i < img.images.length ; i++) {
            images.append("file", img.images[i].file);
        }


        request(`${BackUrl}upload_room_img/${roomId}/change`,"POST",images,headers1)
            .then(res => {
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
                dispatch(fetchInsideRoom(roomId))
            })
            .catch(() => {
                dispatch(setMessage({
                    msg: "Serverda yoki internetingizda hatolik",
                    type: "error",
                    active: true
                }))

            })
    }

    const deleteSelectedImg = (id) => {

        const newArray = img.images.filter(item => item.id !== id)

        setImg({
            ...img,
            images: newArray
        })

    }

    return (
        <div className="changeRoom">
            <div>
                <h1>Delete Images</h1>
                <div className="images">
                    {data.images.length !== 0 ?
                        data?.images?.map(item => {
                            return (
                                <div className="images__item">
                                    <div className="images__item-del" onClick={() => deletePhoto(item.id)}>
                                        <i className="fas fa-times"></i>
                                    </div>
                                    <img src={`${BackUrlForDoc}${item.name}`} alt="rasm"/>
                                </div>

                            )
                        }) : null
                    }
                </div>
            </div>
            <form onSubmit={onSubmit}>
                <input
                    ref={inputRef}
                    onChange={(e) => getImg(e)}
                    className="img-input"
                    type="file"
                    multiple
                />
                <div onClick={Open}  className="addImg">
                    {img.images.length !== 0 ?
                        <h1>Rasm qo'shish</h1> : <h1>Rasmlarni tanlang</h1>
                    }
                </div>

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
                <input  className="input-submit" type="submit"/>
            </form>
        </div>
    )
}

export default RoomInside;