import React, {useEffect, useState} from 'react';

import cls from "./platformCentreInfo.module.sass"
import Modal from "components/platform/platformUI/modal";
import InputForm from "components/platform/platformUI/inputForm";
import {useForm} from "react-hook-form";
import Button from "components/platform/platformUI/button";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setMessage} from "slices/messageSlice";
import Select from "components/platform/platformUI/select";
import Form from "../../../components/platform/platformUI/form/Form";


const PlatformCentreInfo = () => {


    const {locationId} = useParams()
    const [active,setActive] = useState(false)
    const [locationType,setLocationType] = useState(false)
    const [dataInfo,setDataInfo] = useState({})


    const {register,handleSubmit,setValue} = useForm()


    const {request} = useHttp()


    useEffect(() => {
        request(`${BackUrl}programmers/change_location_info/${locationId}`, "GET", null, headers())
            .then(res => {
                setDataInfo(res.data)
                setValue("campus_name", res.data.campus_name)
                setValue("address", res.data.address)
                setValue("code", res.data.code)
                setValue("director_fio", res.data.director_fio)
                setValue("district", res.data.district)
                setValue("bank_sheet", res.data.bank_sheet)
                setValue("inn", res.data.inn)
                setValue("bank", res.data.bank)
                setValue("mfo", res.data.mfo)
                setValue("tel", res.data.number_location)


                setLocationType(res.data.location_type)
            })
    },[locationId])

    const dispatch = useDispatch()

    const onSubmit = (data) => {
        request(`${BackUrl}programmers/change_location_info/${locationId}`,"POST",JSON.stringify({...data,location_type: locationType}), headers())
            .then(res => {
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
                setActive(false)
                setDataInfo(res.data)
            })
    }

    const location_types = [
        "Shahri","Tumani"
    ]


    return (
        <div className={cls.centreInfo}>
            <div className={cls.header}>
                <h1>Centre Info</h1>


                <div className={cls.plus} onClick={() => setActive(true)}>
                    <i className="fas fa-pen"></i>
                </div>
            </div>


            <div className={cls.wrapper}>

                <div className={cls.box}>
                    <h1>Name: <span>{dataInfo.name}</span></h1>
                    <h1>Campus name: <span>{dataInfo.campus_name}</span></h1>
                    <h1>Address: <span>{dataInfo.address}</span></h1>
                    <h1>Code: <span>{dataInfo.code}</span></h1>
                    <h1>Director: <span>{dataInfo.director_fio}</span></h1>
                    <h1>Location type: <span>{dataInfo.location_type}</span></h1>
                    <h1>District: <span>{dataInfo.district}</span></h1>
                    <h1>Bank sheet: <span>{dataInfo.bank_sheet}</span></h1>
                    <h1>INN: <span>{dataInfo.inn}</span></h1>
                    <h1>Bank: <span>{dataInfo.bank}</span></h1>
                    <h1>Mfo: <span>{dataInfo.mfo}</span></h1>
                    <h1>tel: <span>{dataInfo.number_location}</span></h1>
                </div>
            </div>



            <Modal activeModal={active} setActiveModal={setActive}>
                <Form onSubmit={handleSubmit(onSubmit)} extraClassname={cls.changeInfo}>

                    <InputForm type={"text"} register={register} required title={"Campus name"} name={"campus_name"} />
                    <InputForm placeholder={"Toshkent viloyati Boʻstonliq tumani Xoʻjakent qishlogʻi Nurchilar MFY"} type={"text"} register={register} required title={"Address"} name={"address"} />
                    <InputForm type={"number"} register={register} required title={"Code"} name={"code"} />
                    <InputForm register={register} required title={"Director F.I.O"} name={"director_fio"} />
                    <Select
                        required
                        value={locationType}
                        onChangeOption={setLocationType}
                        options={location_types}
                        title={"Location Type"}
                        name={"location_type"}
                    />
                    <InputForm register={register} required title={"District"} name={"district"} />
                    <InputForm register={register} required title={"Bank sheet"} name={"bank_sheet"} />
                    <InputForm register={register} required title={"INN"} name={"inn"} />
                    <InputForm register={register} required title={"bank"} name={"bank"} />
                    <InputForm register={register} required title={"mfo"} name={"mfo"} />
                    <InputForm register={register} required title={"tel"} name={"tel"} />
                    {/*<Button formId={"info"} type={"submit"}>Tasdiqlash</Button>*/}
                </Form>
            </Modal>
        </div>
    );
};

export default PlatformCentreInfo;