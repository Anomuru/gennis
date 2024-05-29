import classNames from "classnames";
import {useCallback, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useDropzone} from "react-dropzone";
import {useDispatch, useSelector} from "react-redux";
import {isMobile} from "react-device-detect";
import {useParams} from "react-router-dom";

import {useHttp} from "hooks/http.hook";
import {BackUrl, BackUrlForDoc} from "constants/global";
import {
    fetchedStudents,
    fetchedGroups,
    changeTeacher,
    fetchedTeacher,
    fetchedResults
} from "slices/teacherInfoSlice";
import Modal from "components/platform/platformUI/modal";

import InputForm from "components/platform/platformUI/inputForm";
import cls from "./style.module.sass";
import img from "assets/Rectangle 864.png"
import certificat from "assets/dd20db0879a5d44f9368a 3.png"

const TeacherInfo = () => {
    useEffect(() => {
        request(`${BackUrl}get_teacher_data/${id}`)
            .then(res => {
                console.log(res, "res")
                const result = {
                    ...res?.data,
                    name: res?.full_name,
                    subject: res?.subjects
                }
                dispatch(fetchedTeacher(result))
                dispatch(fetchedResults(res?.list))
                // if (!res.status) {
                //     dispatch(fetchedTeacher({}))
                //     dispatch(fetchedResults(res?.list))
                // }
            })
            .catch(err => console.log(err))
    }, [])

    const token = sessionStorage.getItem("token")
    const {setValue} = useForm()
    const {id} = useParams()
    const formData = new FormData()
    const {request} = useHttp()
    const dispatch = useDispatch()
    const [changeStatus, setChangeStatus] = useState(false)
    const [addStatus, setAddStatus] = useState(false)
    const [image, setImage] = useState({})
    const [imageModalStatus, setImageModalStatus] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')
    const {
        students,
        groups,
        teacher,
        results
    } = useSelector(state => state?.teacherInfo)

    const onSubmitChange = (data) => {
        const res = {
            teacher_id: teacher?.id,
            ...data
        }
        // formData.append("res", JSON.stringify(res))
        // formData.append("img", image)
        // request(`${BackUrl}change_teacher_data`, "POST", formData, {"Authorization": "Bearer " + token})
        //     .then(res => dispatch(changeTeacher(res?.data)))
        //     .catch(err => console.log(err))
        // formData.delete("res")
        // formData.delete("img")
    }

    const onSubmitAdd = (data) => {
        const res = {
            teacher_id: teacher?.id,
            ...data
        }
        formData.append("res", JSON.stringify(res))
        formData.append("img", image)
        request(`${BackUrl}add_student_certificate`, "POST", formData, {"Authorization": "Bearer " + token})
            .then(res => console.log(res))
            .catch(err => console.log(err))
        formData.delete("res")
        formData.delete("img")
    }

    const onChange = (id) => {
        if (typeof id === "number" && id !== 0)
            request(`${BackUrl}get_student_in_group/${id}`)
                .then(res => {
                    console.log(res)
                    dispatch(fetchedStudents(res?.students))
                })
                .catch(err => console.log(err))
    }

    const onAddStatus = () => {
        request(`${BackUrl}get_groups/${1}`)
            .then(res => {
                dispatch(fetchedGroups(res?.groups))
            })
            .catch(err => console.log(err))
        setImage({})
        setAddStatus(true)
    }

    const onChangeStatus = () => {
        setValue("text", teacher?.text)
        setValue("telegram", teacher?.telegram)
        setValue("instagram", teacher?.instagram)
        setValue("facebook", teacher?.facebook)
        setImage({})
        setChangeStatus(true)
    }

    const onClick = (img) => {
        setSelectedItem(img)
        setImageModalStatus(true)
    }

    const ImageModal = useCallback(({status, setStatus, item}) => {
        return (
            <Modal
                activeModal={status}
                setActiveModal={setStatus}
            >
                <div className={cls.imageModal}>
                    <div className={cls.imageModal__container}>
                        <div className={cls.imageModal__container_inner}>
                            <img src={BackUrlForDoc + item} alt=""/>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }, [selectedItem])

    return (
        <div className={cls.main}>
            <div className={cls.main__container}>
                <ImageModal
                    status={imageModalStatus}
                    setStatus={setImageModalStatus}
                    item={selectedItem}
                />

                <div className={classNames(cls.main__container_inner, cls.column)}>
                    <div className={cls.image}>
                        <img src={img} alt=""/>
                    </div>
                    <div className={cls.info}>
                        <h1 className={cls.info_inner}>{teacher?.name}</h1>
                        <h2 className={cls.info_inner}>{teacher?.subject ? teacher?.subject[0] : null}</h2>
                        {
                            isMobile ? null : <>
                                <p>
                                    {
                                        teacher?.text ? teacher?.text : "Malumot kiritilmagan"
                                    }
                                </p>
                                <div className={cls.info_icons}>
                                    <a href={teacher?.telegram}>
                                        <i className="fab fa-telegram"/>
                                    </a>
                                    <a href={teacher?.instagram}>
                                        <i className="fab fa-instagram"/>
                                    </a>
                                    <a href={teacher?.facebook}>
                                        <i className="fab fa-facebook"/>
                                    </a>
                                </div>
                            </>
                        }
                    </div>
                </div>
                {
                    isMobile ? <div className={cls.mobileInfo}>
                        <p className={cls.mobileInfo_text}>
                            {
                                teacher?.text ? teacher?.text : "Malumot kiritilmagan"
                            }
                        </p>
                        <div className={cls.mobileInfo_icons}>
                            <a href={teacher?.telegram}>
                                <i className="fab fa-telegram"/>
                            </a>
                            <a href={teacher?.instagram}>
                                <i className="fab fa-instagram"/>
                            </a>
                            <a href={teacher?.facebook}>
                                <i className="fab fa-facebook"/>
                            </a>
                        </div>
                    </div> : null
                }
                <div className={classNames(cls.main__container_inner, cls.certifecat)}>
                    <img src={certificat} alt=""/>
                </div>
            </div>
            <div className={cls.main__container}>
                <h1>Natijalar</h1>
                <div className={classNames(cls.main__container_inner, cls.items)}>
                    {
                        results?.map((item, i) => {
                            return (
                                <div className={cls.item}>
                                    <div className={cls.background}>
                                        <div className={cls.info}>IELTS: 7.0</div>
                                    </div>
                                    <div className={cls.image}>
                                        <img className={cls.image__teacher} src={img} alt=""/>

                                        <div
                                            className={cls.image__item}
                                            onClick={() => onClick(item.img)}
                                        >
                                            <img className={cls.image__student} src={item.img} alt=""/>
                                        </div>
                                    </div>
                                    <div className={classNames(cls.teacher_name, cls.names)}>
                                        <div className={classNames(cls.name, cls.first)}>
                                            <i className={classNames("fas fa-user", cls.name_inner)}/>
                                            <h2 className={cls.name_inner}>{item.teacher}</h2>
                                        </div>
                                        <div className={cls.name}>
                                            <i className={classNames("fas fa-user-tie", cls.name_inner)}/>
                                            <h2 className={cls.name_inner}>{item.student}</h2>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}


export default TeacherInfo;