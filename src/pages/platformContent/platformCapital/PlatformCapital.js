import React, {useEffect, useState} from 'react';

import cls from "./platormCapital.module.sass"

import Modal from "components/platform/platformUI/modal";
import {useForm} from "react-hook-form";
import InputForm from "components/platform/platformUI/inputForm";
import Button from "components/platform/platformUI/button";
import ImgInput from "components/platform/platformUI/imgInput";
import {useHttp} from "hooks/http.hook";
import {BackUrl, BackUrlForDoc, headers, headersImg} from "constants/global";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import {setMessage} from "slices/messageSlice";
import {useDispatch, useSelector} from "react-redux";
import {Link, Route, Routes} from "react-router-dom";
import CapitalCategory from "./capitalCategory/CapitalCategory";
import {fetchCategories, onAddCategory} from "slices/capitalCategorySlice";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";




const PlatformCapital = () => {



    return (
        <Routes>
            <Route path={"/"} element={<PlatformCapitalIndex/>}/>
            <Route path={":id"} element={<CapitalCategory/>}/>
        </Routes>
    );
};



const PlatformCapitalIndex = () => {


    const {categories,fetchCategoriesStatus} = useSelector(state => state.capitalCategory)

    const [add, setAdd] = useState(false)
    const [loading, setLoading] = useState(false)
    const {register,handleSubmit} = useForm()
    const [img,setImg] = useState()

    console.log(categories)
    const {request} = useHttp()
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(fetchCategories())
    },[])


    const onSubmit = (data) => {
        const formData = new FormData()

        formData.append(`img`, img);
        formData.append(`info`, JSON.stringify(data));

        setLoading(true)
        request(`${BackUrl}add_capital_category`, 'POST', formData, headersImg())
            .then(res => {
                dispatch(onAddCategory({category: res.category}))
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
                setAdd(false)
                setLoading(false)
            })
    }


    if (fetchCategoriesStatus === "loading") {
        return <DefaultLoader/>
    }

    return (
        <div className={cls.categories}>
            <div className={cls.headers}>
                <h1  >Capital</h1>
                <div className={cls.plus} onClick={setAdd}>
                    <i className="fas fa-plus"></i>
                </div>
            </div>
            <div className={cls.wrapper}>
                {
                    categories.map(item => {
                        return (
                            <Link to={`${item.id}`}>
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
            <Modal activeModal={add} setActiveModal={setAdd}>
                <form className={cls.addModal} onSubmit={handleSubmit(onSubmit)}>
                    <h1>Kategoriya qo'shmoq</h1>
                    <ImgInput img={img} setImg={setImg}/>
                    <InputForm title={"Nomi"} register={register} name={"name"} type={"text"} required />
                    <InputForm title={"Raqami"} register={register} name={"number_category"} type={"text"} required />
                    { loading ? <DefaultLoaderSmall/> : <Button type={"submit"}>Tasdiqlash</Button> }
                </form>
            </Modal>

        </div>
    );
};

export default PlatformCapital;