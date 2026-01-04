import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHttp } from "hooks/http.hook";


import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BackUrl, DatesList, headers, ROLES } from "constants/global";
import Message from "components/platform/platformMessage";
import { fetchDataToChange } from "slices/dataToChangeSlice";
import { useAuth } from "hooks/useAuth";
import { setMessage } from "slices/messageSlice";

const PersonalInfo = React.memo(({ accessData, userId }) => {

    const {
        handleSubmit,
    } = useForm({
        mode: "onBlur"
    })
    const dispatch = useDispatch()


    return (
        <div>
            <AllLabels
                userId={userId}
                data={accessData.activeToChange}
                extraInfo={accessData.extraInfo}
            />
        </div>
    );
});


const AllLabels = React.memo(({ data, extraInfo, userId }) => {

    const { days, months, years } = DatesList()
    const { dataToChange } = useSelector(state => state.dataToChange)

    const [subjects, setSubjects] = useState(null)
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [shift, setShift] = useState("")

    const { type } = useSelector(state => state.message)

    const user = useSelector(state => state.usersProfile.user)

    useEffect(() => {
        setSelectedSubjects([])
        setSubjects(null)
        setShift(extraInfo?.shift?.value)
    }, [])

    useEffect(() => {
        setSubjects(dataToChange.subjects)
    }, [dataToChange])


    const dispatch = useDispatch()


    const { selectedLocation } = useAuth()


    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    }, [selectedLocation])

    useEffect(() => {
        if (extraInfo?.subject?.value?.length && dataToChange?.subjects) {
            const newData = dataToChange?.subjects?.map(sb => ({
                ...sb,
                disabled: extraInfo?.subject?.value.some(item => item.name.toLowerCase() === sb.name.toLowerCase())
            }))
            setSubjects(newData)
        }
    }, [extraInfo?.subject?.value?.length, dataToChange?.subjects])

    useEffect(() => {
        if (subjects?.length) {
            // eslint-disable-next-line array-callback-return
            subjects.map(item => {
                if (item.disabled) {

                    setSelectedSubjects(sb => {
                        return [...sb, item]
                    })
                }
            })
        }
    }, [subjects?.length])


    const {
        register,
        formState: { errors },
        handleSubmit,
        setError
    } = useForm({
        mode: "onBlur"
    })

    const { request } = useHttp()


    const { role } = useAuth()

    const onSubmit = (data, e) => {
        e.preventDefault()

        const newData = {
            type: "info",
            ...data,
            selectedSubjects,
            shift,
            role
        }


        request(`${BackUrl}student/change_student_info/${userId}`, "POST", JSON.stringify(newData), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                }
                if (res.found) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "error",
                        active: true
                    }))
                }

            })
            .catch()

    }

    const checkUsername = async (username) => {
        request(`${BackUrl}checks/check_exist_username/${userId}`, "POST", JSON.stringify({ username }), headers())
            .then(res => {
                if (res.found) {
                    setError('username', {
                        type: "manual",
                        message: "username band"
                    }, { shouldFocus: true })
                    dispatch(setMessage({
                        msg: "username band",
                        type: "error",
                        active: true
                    }))

                }
            })
    }


    const renderOptionsDate = (list) => {
        return (
            list.map((item, index) => {
                return (
                    <option key={index} value={item.num}>{item.num}</option>
                )
            })
        )
    }


    const onGetSubject = (subjectName) => {
        if (subjectName !== "Fan tanla") {
            const filteredSubjects = subjects?.find(item => item.name === subjectName)
            setSubjects(subjects => {
                return subjects.map(item => {
                    if (item.name === subjectName) {
                        return { ...item, disabled: true }
                    }
                    return item
                })
            })
            const newData = [...selectedSubjects, filteredSubjects]
            setSelectedSubjects(newData)
        }
    }

    const onDeleteSubject = (subjectName) => {
        if (subjectName !== "Fan tanla") {
            setSubjects(subjects => {
                return subjects.map(item => {
                    if (item.name === subjectName) {
                        return { ...item, disabled: false }
                    }
                    return item
                })
            })
            setSelectedSubjects(selectedSubjects.filter(item => item.name !== subjectName))
        }
    }

    const renderOptions = (list) => {
        return (
            list.map((item, index) => {
                return (
                    <option key={index} value={item.name}>{item.name}</option>
                )
            })
        )
    }


    const selectedSubjectLevel = (name, value) => {
        if (value !== "defaultLevel") {
            setSelectedSubjects(subjects => {
                return subjects.map(item => {
                    if (item.name === name) {
                        return { ...item, selectedLevel: value }
                    }
                    return item
                })
            })
        }
    }


    const renderSubjects = useCallback(() => {
        return selectedSubjects?.map((item, index) => {
            return (
                <div
                    key={index}
                    className="subjects__item"
                >
                    <div className="subjects__item-info">
                        <span>
                            {item?.name}
                        </span>
                        <i
                            onClick={() => onDeleteSubject(item?.name)}
                            className="fas fa-times"
                        />
                    </div>
                    {
                        item?.levels ? (
                            <label htmlFor={item.name}>
                                <span className="name-field">{item.name} Darajalari</span>
                                <select
                                    id={item.name}
                                    className="input-fields"
                                    onChange={e => selectedSubjectLevel(item.name, e.target.value)}
                                    defaultValue={item.selectedLevel}
                                >
                                    <option value="defaultLevel">Darajani tanlang</option>
                                    {renderOptions(item.levels)}
                                </select>
                            </label>
                        ) : null
                    }
                </div>
            )
        })
    }, [selectedSubjects])


    // useEffect(()=> {
    //     if (extraInfo?.subject?.value && subjects?.length > 0) {
    //         extraInfo?.subject?.value?.map(elem => {
    //             setSubjects(subjects =>
    //                 subjects.map(item => {
    //                     if (item.name === elem.name) {
    //
    //                         return {...item,disabled: true}
    //                     }
    //                     return item
    //                 })
    //             )
    //             // const filteredSubjects = subjects?.find(item => item.name === elem.name)
    //
    //         })
    //     }
    //
    // },[extraInfo, subjects?.length])

    const times = [
        {
            id: 1,
            name: "Hamma vaqt"
        },
        {
            id: 2,
            name: "1-smen"
        },
        {
            id: 3,
            name: "2-smen"
        }
    ]

    console.log(extraInfo, "extraInfo")


    const renderedSelectedOptions = renderSubjects()

    return (
        <form
            action=""
            onSubmit={handleSubmit(onSubmit)}
        >
            {
                data?.username ?
                    <label htmlFor="username">
                        <span className="name-field">Username</span>
                        <input
                            defaultValue={extraInfo?.username?.value}
                            id="username"
                            className="input-fields"
                            {...register("username", {
                                required: "Iltimos to'ldiring",
                                onBlur: event => checkUsername(event.target.value)
                            })}
                        />
                        {
                            errors?.username &&
                            <span className="error-field">
                                {errors?.username?.message}
                            </span>
                        }
                    </label> : null
            }
            {
                user?.crm_username ?
                    <label htmlFor="crm_username">
                        <span className="name-field">Crm Username</span>
                        <input
                            defaultValue={extraInfo?.crm_username?.value}
                            id="username"
                            className="input-fields"
                            {...register("crm_username", {
                                required: "Iltimos to'ldiring",
                                // onBlur: event => checkUsername(event.target.value)
                            })}
                        />
                        {
                            errors?.crm_username &&
                            <span className="error-field">
                                {errors?.crm_username?.message}
                            </span>
                        }
                    </label> : null
            }
            {
                data?.name ?
                    <label htmlFor="name">
                        <span className="name-field">Ism</span>
                        <input
                            defaultValue={extraInfo?.name?.value}
                            id="name"
                            className="input-fields "
                            {...register("name", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                        {
                            errors?.name &&
                            <span className="error-field">
                                {errors?.name?.message}
                            </span>
                        }
                    </label> : null
            }
            {
                data?.surname ?
                    <label htmlFor="surname">
                        <span className="name-field">Familiya</span>
                        <input
                            defaultValue={extraInfo?.surname?.value}
                            id="surname"
                            className="input-fields"
                            {...register("surname", {
                                required: "Iltimos to'ldiring",
                            })}
                        />
                        {
                            errors?.surname &&
                            <span className="error-field">
                                {errors?.surname?.message}
                            </span>
                        }
                    </label> : null
            }
            {
                data?.fathersName ?
                    <label htmlFor="fatherName">
                        <span className="name-field">Otasining ismi</span>
                        <input
                            defaultValue={extraInfo?.fathersName?.value}
                            id="fatherName"
                            className="input-fields "
                            {...register("fatherName", {
                                required: "Iltimos to'ldiring"
                            })}
                        />
                        {
                            errors?.fatherName &&
                            <span className="error-field">
                                {errors?.fatherName?.message}
                            </span>
                        }
                    </label> : null
            }
            {
                data?.birth ?
                    <>
                        <h3>Tug'ulgan sana</h3>
                        <div className="birth">
                            <label htmlFor="birthDay" className="selectLabel">
                                <span className="name-field">Kun</span>
                                <select
                                    name="birthDay"
                                    id="birthDay"
                                    {...register("birthDay", { required: true })}
                                    defaultValue={extraInfo?.birthDay?.value}
                                >
                                    {
                                        renderOptionsDate(days)
                                    }
                                </select>
                            </label>
                            <label htmlFor="birthMonth" className="selectLabel">
                                <span className="name-field">Oy</span>
                                <select
                                    name="birthMonth"
                                    id="birthMonth"
                                    {...register("birthMonth", { required: true })}
                                    defaultValue={extraInfo?.birthMonth?.value}
                                >
                                    {
                                        renderOptionsDate(months)
                                    }
                                </select>
                            </label>
                            <label htmlFor="birthYear" className="selectLabel">
                                <span className="name-field">Yil</span>
                                <select
                                    name="birthYear"
                                    id="birthYear"
                                    {...register("birthYear", { required: true })}
                                    defaultValue={extraInfo?.birthYear?.value}
                                >
                                    {
                                        renderOptionsDate(years)
                                    }
                                </select>
                            </label>
                        </div>
                    </> : null
            }
            {
                data?.phone ?
                    <label htmlFor="phone">
                        <span className="name-field">Telefon raqam</span>
                        <input
                            defaultValue={extraInfo?.phone?.value}
                            id="phone"
                            className="input-fields "
                            {...register("phone", {
                                required: "Iltimos to'ldiring"
                            })}
                        />
                        {
                            errors?.phone &&
                            <span className="error-field">
                                {errors?.phone?.message}
                            </span>
                        }
                    </label> : null
            }
            {
                data?.parent_phone ?
                    <label htmlFor="parentPhone">
                        <span className="name-field">Ota-onaning telefon raqami</span>
                        <input
                            defaultValue={extraInfo?.parentPhone?.value}
                            id="parentPhone"
                            className="input-fields "
                            {...register("parentPhone", {
                                required: "Iltimos to'ldiring"
                            })}
                        />
                        {
                            errors?.parentPhone &&
                            <span className="error-field">
                                {errors?.parentPhone?.message}
                            </span>
                        }
                    </label> : null
            }
            {
                data?.address ?
                    <label htmlFor="address">
                        <span className="name-field">Manzil</span>
                        <input
                            defaultValue={extraInfo?.address?.value}
                            id="address"
                            className="input-fields "
                            {...register("address", {
                                required: "Iltimos to'ldiring"
                            })}
                        />
                        {
                            errors?.address &&
                            <span className="error-field">
                                {errors?.address?.message}
                            </span>
                        }
                    </label>
                    : null
            }
            {
                data?.comment ?
                    <label htmlFor="comment">
                        <span className="name-field">Qo'shimcha ma'lumot (shart emas)</span>
                        <textarea
                            defaultValue={extraInfo?.comment?.value}
                            id="comment"
                            {...register("comment")}
                        />
                    </label> : null
            }

            {
                data?.color ?
                    <input
                        defaultValue={extraInfo?.color?.value}
                        {...register("color")}
                        className="input-color"
                        type="color"
                    /> : null
            }
            {
                data?.shift ?
                    <label htmlFor="subjects">
                        <select
                            defaultValue={extraInfo?.shift?.value}
                            id="subjects"
                            className="input-fields"
                            onChange={e => setShift(e.target.value)}
                        >
                            {
                                times?.map((item, index) => {
                                    return (
                                        <option disabled={item.disabled} key={index}
                                            value={item.name}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </label> : null
            }
            {
                data?.subject && role !== "a43c33b82" ?
                    <>

                        <label htmlFor="subjects">
                            <select
                                id="subjects"
                                className="input-fields"
                                onChange={e => onGetSubject(e.target.value)}
                            >
                                <option value="Fan tanla">Fan tanlang</option>
                                {
                                    subjects?.map((item, index) => {
                                        return (
                                            <option disabled={item.disabled} key={index}
                                                value={item.name}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </label>

                        <div className="subjects">
                            <h3>Tanlangan fanlar:</h3>
                            <div className="subjects__wrapper">
                                {renderedSelectedOptions}
                            </div>
                        </div>
                    </>
                    : null
            }
            {/*{*/}
            {/*    data?.studyLang ?*/}
            {/*        <label htmlFor="studyLang">*/}
            {/*            <span className="name-field">Ta'lim tili</span>*/}
            {/*            <select*/}
            {/*                id="studyLang"*/}
            {/*                className="input-fields "*/}
            {/*                {...register("studyLang",{*/}
            {/*                    required: "Iltimos to'ldiring"*/}
            {/*                })}*/}
            {/*            >*/}
            {/*                <option value="Uzbek">Uzbek tili</option>*/}
            {/*                <option value="Rus">Rus tili</option>*/}
            {/*            </select>*/}
            {/*        </label> : null*/}
            {/*}*/}
            <input disabled={type === "error"} className="input-submit" type="submit" value="Submit" />
        </form>
    )
})

export default PersonalInfo;