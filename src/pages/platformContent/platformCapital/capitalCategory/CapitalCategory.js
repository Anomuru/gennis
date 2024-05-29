import React, {useEffect, useState} from 'react';

import cls from "./capitalCategory.module.sass"
import {Link, NavLink, useParams} from "react-router-dom";
import {BackUrl, BackUrlForDoc, headers, headersImg} from "constants/global";

import img from "assets/book.png"
import Button from "components/platform/platformUI/button";
import BackButton from "components/platform/platformUI/backButton/backButton";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import {useHttp} from "hooks/http.hook";
import {setMessage} from "slices/messageSlice";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import ImgInput from "components/platform/platformUI/imgInput";
import InputForm from "components/platform/platformUI/inputForm";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import {fetchCategory} from "slices/capitalCategorySlice";


const CapitalCategory = () => {
    const {category} = useSelector(state => state.capitalCategory)

    const {id} = useParams()

    const [categories,setCategories] = useState([])
    const [canDelete,setCanDelete] = useState(false)
    const [activeModal,setActiveModal] = useState(false)
    const [typeModal, setTypeModal] = useState("add")

    const [loading, setLoading] = useState(false)
    const {register,handleSubmit,setValue} = useForm()
    const [img,setImg] = useState()



    useEffect(() => {
        dispatch(fetchCategory(id))
    },[id])

    useEffect(() =>{
        if (Object.keys(category).length) {
            setValue("name", category.name)
            setValue("number_category", category.number_category)
        }
    }, [category])



    const {request} = useHttp()
    const dispatch = useDispatch()


    const onDelete = (data) => {
        if (data === "yes") {
            request(`${BackUrl}`, "DELETE", null,headers())
                .then(res => {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                })
        }
    }

    const onChange = (data) => {
        const formData = new FormData()

        formData.append(`img`, img);
        formData.append(`info`, JSON.stringify(data));
        setLoading(true)


        request(`${BackUrl}add_capital_category`, 'POST', formData, headersImg())
            .then(res => {
                setCategories(data => [...data, res.category])
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
                setActiveModal(false)
                setLoading(false)
            })
    }


    const toggleChangeAddModal = (type) => {
        setTypeModal(type)
        setActiveModal(true)
    }

    return (
        <div className={cls.capitalCategory}>
            <BackButton/>

            <div className={cls.header}>
                <NavLink>
                    <Button>Category</Button>
                </NavLink>

                <Button>Sub category</Button>
            </div>
            <div className={cls.infoCategory}>
                <img src={`${BackUrlForDoc}${category.img}`} alt=""/>
                <div>
                    <h1>Texnikalar</h1>
                    <h2>Kategoriya raqami: 01</h2>

                    <div className={cls.btns}>
                        <Button onClickBtn={() => toggleChangeAddModal("change")} type={"submit"}>O'zgartirish</Button>
                        <Button onClickBtn={() => setCanDelete(true)} type={"danger"}>O'chirish</Button>
                    </div>
                </div>
            </div>
            <div className={cls.subHeader}>
                <h1>Kategoriya mahsulotlari: </h1>

                <div className={cls.plus} onClick={() => toggleChangeAddModal("add")}>
                    <i className="fas fa-plus"></i>
                </div>
            </div>
            <div className={cls.wrapper}>
                <Link to={"../2"}>
                    <div className={cls.category}>
                        <img src={img} alt=""/>
                        <div className={cls.info}>
                            <h1>Kompyuterlar</h1>
                        </div>

                        <h2 className={cls.numberCategory}>01</h2>
                    </div>
                </Link>
                {
                    categories.map(item => {
                        return (
                            <Link to={item.id}>
                                <div className={cls.category}>
                                    <img src={`${BackUrlForDoc}${item.img}`} alt=""/>
                                    <div className={cls.info}>
                                        <h1>{item.name}</h1>
                                    </div>
                                    <h2 className={cls.numberCategory}>{item.number_category}</h2>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>


            <div className={cls.subHeader}>
                <h1>Pastki kategoriyalar: </h1>

                <div className={cls.plus} onClick={() => toggleChangeAddModal("add")}>
                    <i className="fas fa-plus"></i>
                </div>
            </div>
            <div className={cls.wrapper}>

                <Link to={"../2"}>
                    <div className={cls.category}>
                        <img src={img} alt=""/>
                        <div className={cls.info}>
                            <h1>Kompyuterlar</h1>
                        </div>

                        <h2 className={cls.numberCategory}>01</h2>
                    </div>
                </Link>

                {
                    categories.map(item => {
                        return (
                            <Link to={item.id}>
                                <div className={cls.category}>
                                    <img src={`${BackUrlForDoc}${item.img}`} alt=""/>
                                    <div className={cls.info}>
                                        <h1>{item.name}</h1>
                                    </div>

                                    <h2 className={cls.numberCategory}>{item.number_category}</h2>
                                </div>
                            </Link>

                        )
                    })
                }
            </div>

            <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                <form className={cls.addModal} onSubmit={handleSubmit(onChange)}>
                    <h1>Kategoriya  { typeModal === "add" ? "qo'shmoq" : "o'zgartirmoq" } </h1>
                    <ImgInput  databaseImg={category?.img} img={img} setImg={setImg}/>
                    <InputForm title={"Nomi"} register={register} name={"name"} type={"text"} required />
                    <InputForm title={"Raqami"} register={register} name={"number_category"} type={"text"} required />
                    { loading ? <DefaultLoaderSmall/> : <Button type={"submit"}>Tasdiqlash</Button> }
                </form>
            </Modal>
            <Modal activeModal={canDelete} setActiveModal={setCanDelete}>
                <Confirm  text={'Katgoriyani uchirishni hohlaysizmi'} setActive={setCanDelete} getConfirm={onDelete}/>
            </Modal>
        </div>
    );
};

export default CapitalCategory;


