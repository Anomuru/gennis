import React, {useEffect, useRef, useState} from 'react';

import "./platformRooms.sass"
import Modal from "components/platform/platformUI/modal";
import Input from "components/platform/platformUI/input";
import {BackUrl, BackUrlForDoc, headers} from "constants/global";
import {useDispatch, useSelector} from "react-redux";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {useHttp} from "hooks/http.hook";
import {fetchRooms} from "slices/roomsSlice";
import {Link, useParams} from "react-router-dom";
import {useAuth} from "hooks/useAuth";

const PlatformRooms = () => {


    const {locationId} = useParams()

    const [activeModal,setActiveModal] = useState(false)

    const {rooms} = useSelector(state => state.rooms)


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchRooms(locationId))
    },[locationId])



    const renderRooms = (data) => {
        return data.map(item => {
            return (
                <Link
                    className="rooms__wrapper-item"
                    to={`../insideRoom/${item.id}`}
                >
                    <div className="image">
                        <img src={`${BackUrlForDoc}${item.images[0]?.url}`} alt="img"/>
                    </div>
                    <div className="info">
                        <h1>{item.name}</h1>
                        <h4>
                            <span>Elektron doska: </span>
                            {
                                item.electronic_board ?
                                    <span className="true">
                                        <i className="fas fa-check"></i>
                                    </span>
                                    :
                                    <span className="false">
                                        <i className="fas fa-times"></i>
                                    </span>
                            }
                        </h4>
                        <h4>
                            <span>O’rindiqlar soni: </span>
                            <span>
                                {item.seats_number}
                            </span>
                        </h4>
                    </div>
                </Link>
            )
        })
    }

    return (
        <div className="rooms">
            <div className="rooms__tools">
                <div className="rooms__tools-item" onClick={() => setActiveModal(!activeModal)}>
                    <i className="fas fa-plus"></i>
                </div>
            </div>
            <div className="rooms__wrapper">
                {renderRooms(rooms)}
            </div>



            <RoomsRegister setActiveModal={setActiveModal} locationId={locationId}  activeModal={activeModal}/>

        </div>
    );
};


const RoomsRegister = ({activeModal,setActiveModal,locationId}) => {
    const [roomName,setRoomName] = useState(null)
    const [numberStudents,setNumberStudents] = useState(0)
    const [isDoska,setIsDoska] = useState(0)
    const [selectedSubjects,setSelectedSubjects] = useState([])
    const [subjects,setSubjects] = useState([
        {
            id: 1,
            name: "Ingliz tili"
        },
        {
            id: 2,
            name: "Rus tili"
        }
    ])

    const [activeError,setActiveError] = useState()
    const [errorMsg,setErrorMsg] = useState()


    const {dataToChange} = useSelector(state => state.dataToChange)

    // const [img,setImg] = useState({
    //     images: [],
    //     files: []
    // })

    const [img,setImg] = useState({
        images: [],
        lastId: 1
    })

    useEffect(()=>{
        if (dataToChange) {
            setSubjects(dataToChange.subjects)
        }
    },[dataToChange])

    const dispatch = useDispatch()
    const {request} = useHttp()


    const {selectedLocation} = useAuth()
    useEffect(()=>{
        dispatch(fetchDataToChange(selectedLocation))
    },[])


    const inputRef = useRef()

    const Open = (e) => {
        inputRef.current.click()
    }

    const onSubmit = (e) => {
        e.preventDefault()

        let images = new FormData();

        const token = sessionStorage.getItem("token")
        const headers1 = {
            "Authorization": "Bearer " + token,
            // "Content-Type": "multipart/form-data"
        }

        const data = {
            images,
            roomName,
            numberStudents,
            selectedSubjects,
            isDoska
        }

        // images.append('file', [...img.files]);

        for (let i = 0 ; i < img.images.length ; i++) {
            images.append("file", img.images[i].file);
        }

        request(`${BackUrl}create_room/${locationId}`, "POST",JSON.stringify(data),headers())
            .then(res => {
                if (res.ok) {
                    request(`${BackUrl}upload_room_img/${res.id}/new`,"POST",images,headers1)
                }
            })
            .then(() => {
                setActiveModal(false)
                dispatch(fetchRooms(locationId))
            })
            .catch(() => {
                setActiveError(true)
                setErrorMsg("Serverda yoki internetingizda hatolik")
            })

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
    const deleteSelectedImg = (id) => {
        const newArray = img.images.filter(item => item.id !== id)

        setImg({
            ...img,
            images: newArray
        })
    }


    return (
        <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
            <div className="rooms__register">
                <form className="rooms__register-wrapper" onSubmit={onSubmit}>
                    <h1>Register Room</h1>
                    <Input title={"Hona nomi"} onChange={setRoomName} />
                    <Input title={"O'rindiqlar soni"} onChange={setNumberStudents} type={"number"} />
                    <label htmlFor="" className="checkbox">
                        <input checked={isDoska} onChange={() => setIsDoska(!isDoska)} type="checkbox"/>
                        <span>Elektronniy doska</span>
                    </label>

                    <input
                        ref={inputRef}
                        onChange={(e) => getImg(e)}
                        className="img-input"
                        type="file"
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
        </Modal>
    )
}

export default PlatformRooms