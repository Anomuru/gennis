import cls from "../style.module.sass"
import InputForm from "components/platform/platformUI/inputForm";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";
import Input from "components/platform/platformUI/input";

import Select, {SelectForm} from "components/platform/platformUI/select";
import classNames from "classnames";
import Button from "components/platform/platformUI/button";
import {setMessage} from "slices/messageSlice";
import {useDispatch, useSelector} from "react-redux";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";

export const RegisterAssistant = ({
                                    locations,
                                    subjects,
                                    genders,
                                    deleteSub,
                                    onChangeSub,
                                    selectedSubjects,
                                    language,
                                    setSelectedSubjects,
                                    setSubjects
                                }) => {
    const {
        register,
        formState: {errors},
        handleSubmit,
        clearErrors,
        setError,
        setValue,
        reset
    } = useForm({
        mode: "onBlur"
    })
    const [loading, setLoading] = useState(false)
    const {request} = useHttp()
    const [activeError, setActiveError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isCheckLen, setIsCheckLen] = useState(false)
    const [isCheckPass, setIsCheckPass] = useState(false)
    const [password, setPassword] = useState("12345678")
    const {location} = useSelector(state => state.me)
    const [selectedSubjectId, setSelectedSubjectId] = useState("all");
    const [lang, setLang] = useState(1)


    const dispatch = useDispatch()

    const [confirmPassword, setConfirmPassword] = useState("12345678")
    const [selectedLocation, setSelectedLocation] = useState(location)

    const [selectedGender, setSelectedGender] = useState(genders)
    const checkUsername = (username) => {
        setLoading(true)
        request(`${BackUrl}checks/check_username`, "POST", JSON.stringify(username))
            .then(res => {
                setLoading(false)
                if (res.found) {
                    setError('username', {
                        type: "manual",
                        message: "username band"

                    }, {shouldFocus: true})
                    setActiveError(true)
                    setErrorMessage("Username band")
                } else {
                    setActiveError(false)
                }
            })
    }

    const onCheckLength = (value) => {
        setIsCheckLen(value?.length < 8)
        setIsCheckPass(confirmPassword?.length !== 0 ? value !== confirmPassword : false)
        setPassword(value)
    }

    useEffect(() => {
        setIsCheckPass(confirmPassword !== password)

    }, [confirmPassword, password])
    const onSubmit = (data) => {

        const res = {
            ...data,
            selectedSubjects,
            location: selectedLocation,
            language: lang,
            password,
            password_confirm: confirmPassword,
            // sex: selectedGender
        }
        console.log(res)
        setLoading(true)
        request(`${BackUrl}teacher/assistent/crud/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                reset()
                setLoading(false)
                dispatch(setMessage({
                    msg: "Assistent created successfully",
                    type: res.isError ? "error" : "success",
                    active: true
                }))
                const selectData = subjects.map(item => {
                    return {
                        ...item,
                        disabled: false
                    }
                })
                setSubjects(selectData)
                setSelectedSubjects([]);
                setSelectedSubjectId("all")
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })

    }

    return (
        <form className={cls.form}
              id="form"
              onSubmit={handleSubmit(onSubmit)}
        >

            <InputForm
                register={register}
                name={"username"}
                title={"Username"}
                onBlur={checkUsername}
                required
            />
            {activeError ? <span className={cls.form__error}>
                              Username band
                          </span> :
                errors?.username &&
                <span className={cls.form__error}>
                                     {errors?.username?.message}
                          </span>}
            <InputForm
                register={register}
                name={"name"}
                title={"Ism"}
                required
            />
            <InputForm
                register={register}
                name={"surname"}
                title={"Familiya"}
                required
            />
            <InputForm
                register={register}
                name={"father_name"}
                title={"Otasining ismi"}
                required
            />
            <InputForm
                register={register}
                name={"birth_day"}
                title={"Tug'ilgan sana"}
                type={"date"}
                required
            />
            <InputForm
                register={register}
                name={"phone"}
                title={"Telefon raqam"}
                type={"number"}
                required
            />
            <Input
                register={register}
                name={"password"}
                title={"Parol"}
                required
                defaultValue={password}
                type={"password"}
                onChange={onCheckLength}
            />
            {isCheckLen ? <p className={cls.error}>Parolingiz 8 ta dan kam bo'lmasligi
                kerak</p> : null

            }
            <Input
                register={register}
                name={"password_confirm"}
                title={"Parolni qayta kiriting"}
                required
                defaultValue={confirmPassword}
                type={"password"}
                onChange={setConfirmPassword}

            />
            {isCheckPass ? <p className={cls.error}>Parol har xil</p> : null}
            <textarea
                {...register("comment")}

                placeholder={"Qo'shimcha ma'lumot (shart emas)"}
                cols="30"
                rows="10"
            />
            <Select title={"O'quv markazi joylashuvi"} defaultValue={selectedLocation} options={locations}
                    onChangeOption={setSelectedLocation}/>
            <SelectForm
                title={"Fan"}
                options={[{ id: "all", name: "Tanlang" }, ...subjects]}
                value={selectedSubjectId}
                onChangeOption={(val) => {
                    setSelectedSubjectId(val);
                    onChangeSub(val);
                }}
            />
            {
                selectedSubjects.length > 0
                    ?
                    <div className={cls.place}>
                        {
                            selectedSubjects.map((item, i) => {
                                return <p
                                    key={i}
                                    className={cls.place__inner}
                                >
                                    {item.name}
                                    <i
                                        className={classNames("fas fa-times", cls.innerIcon)}
                                        onClick={() => deleteSub(item.id)}
                                    />
                                </p>
                            })
                        }
                    </div>
                    :
                    null
            }

            {/*<Select title={"Ta'lim vaqti"} defaultValue={selectedShift} options={shifts} onChangeOption={setSelectedShift}/>*/}

            {loading ? <DefaultLoaderSmall/> :  <Button type={"submit"} formId={"form"}>Yakunlash</Button>}

        </form>
    );
};

