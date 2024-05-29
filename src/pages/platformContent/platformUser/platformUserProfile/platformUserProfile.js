import React, {useCallback, useEffect, useState} from 'react';
import {Navigate, Redirect, Route, Routes} from "react-router-dom"
import classNames from "classnames";

import "./platformUserProfile.sass"
import img from "assets/user-interface/user_image.png"
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import  {fetchUserData} from "slices/usersProfileSlice";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import {fetchDataToChange} from "slices/dataToChangeSlice";
import {BackUrl, BackUrlForDoc, headers, ROLES} from "constants/global";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Confirm from "components/platform/platformModals/confirm/confirm";
import {useHttp} from "hooks/http.hook";
import Input from "components/platform/platformUI/input";
import {useAuth} from "hooks/useAuth";
import Select from "components/platform/platformUI/select";
import {setMessage} from "slices/messageSlice";


const PlatformUserPayment =  React.lazy(() => import('../../platformUser/studentPayment/studentPayment'));
const PlatformUserProfileChange =  React.lazy(() => import('../../platformUser/platformUserChange/platformUserChange'));
const PlatformUserProfileChangePhoto =  React.lazy(() => import('../../platformUser/platformUserChange/photo/photo'));
const PlatformStudentBallHistory =  React.lazy(() => import('../../platformUser/studentBallHistory/studentBallHistory'));
const PlatformStudentGroupHistory =  React.lazy(() => import('../../platformUser/studentGroupsHistroy/studentGroupHistory'));
const PlatformStudentAccount =  React.lazy(() => import('../../platformUser/studentAccount/studentAccount'));
const PlatformStudentGroupsAttendances =  React.lazy(() => import('../../platformUser/studentGroupsAttendance/studentGroupsAttendance'));
const PlatformEmployeeSalary =  React.lazy(() => import('pages/platformContent/employeeSalary/employeeSalaryList'));
const PlatformEmployeeMonthSalary =  React.lazy(() => import('pages/platformContent/employeeSalary/locationMonths/locationMonths'));
const StudentTimeTable =  React.lazy(() => import('pages/platformContent/platformTimeTable/student'));


const PlatformUserProfile = () => {
    const {userId} = useParams()


    return (
        <>
            <Routes>
                <Route path="info" element={<UserContent userId={userId}/>}/>
                <Route path="changeInfo/:userId/:userRole" element={<PlatformUserProfileChange/>}/>
                <Route path="changePhoto/:userId/:userRole" element={<PlatformUserProfileChangePhoto/>}/>
                <Route path="studentPayment/:userId/:role/*" element={<PlatformUserPayment/>}/>
                <Route path="studentAccount/:studentId/:role" element={<PlatformStudentAccount/>}/>
                <Route path="studentGroupsAttendance/:studentId/:role" element={<PlatformStudentGroupsAttendances/>}/>
                <Route path="ballHistory/:userId/:role" element={<PlatformStudentBallHistory/>}/>
                <Route path="groupHistory/:userId/:role" element={<PlatformStudentGroupHistory/>}/>
                <Route path="employeeSalary/:userId/*" element={<PlatformEmployeeSalary/>} />
                <Route path="employeeMonthSalary/:monthId/:userId" element={<PlatformEmployeeMonthSalary/>}/>
                <Route path="timeTable/:userId/*" element={<StudentTimeTable/>}/>

                <Route path="*"  element={
                    <Navigate to="info" replace />
                }
                />
            </Routes>
        </>
    );
};


const UserContent = ({userId}) => {


    const [activeOptions,setActiveOptions] = useState(false)
    const {user,fetchUserDataStatus} = useSelector(state => state.usersProfile)
    const [activeChangeModal,setActiveChangeModal] = useState(false)
    const [activeChangeModalName,setActiveChangeModalName] = useState("")
    const [activeCheckPassword,setActiveCheckPassword] = useState(false)



    const {isCheckedPassword} = useSelector(state => state.me)

    const dispatch = useDispatch()
    const {selectedLocation} = useAuth()

    useEffect(()=> {
        const data = {
            id : userId
        }
        dispatch(fetchUserData(data))

    },[dispatch, userId])



    useEffect(() => {
        dispatch(fetchDataToChange(selectedLocation))
    },[dispatch])



    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    },[activeChangeModalName, isCheckedPassword])




    // const {} = useSelector(state => state.me)

    const handleClick = (e) => {
        if (!e.target.classList.contains("modalOptions") && activeOptions) {
            setActiveOptions(false)
        }
    }

    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    const {request} = useHttp()
    const getConfirmDelete = (name) => {
        if (name === "yes") {
            request(`${BackUrl}delete_group/`,"GET",null, headers())
                .then(res => console.log(res))
        }
        setActiveChangeModal(false)
    }

    const renderElements = useCallback(() => {

        const keysUser = Object.keys(user)

        // eslint-disable-next-line array-callback-return
        return keysUser.map(item => {
            if (item === "info" && user[item].length !== 0) {
                return (
                    <div className="profile__main-item information">
                        <h1>Foydalanuvchi ma'lumotlari:</h1>
                        <div className="information__container">
                            <UserInfo data={user[item]}/>
                        </div>
                    </div>
                )
            }
            if (item === "rate" && user[item].length !== 0) {
                return (
                    <div className="profile__main-item degree">
                        <h1>Baholar:</h1>
                        <div className="degree__container">
                            <UserDegree data={user[item]} />
                        </div>
                    </div>
                )
            }
            if (item === "groups" && user[item].length !== 0) {
                return (
                    <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director]}>
                        <div className="profile__main-item groups">
                            <h1>Gruppalar:</h1>
                            <div className="groups__container">
                                <UserGroups data={user[item]}/>
                            </div>
                        </div>
                    </RequireAuthChildren>
                )
            }
        })
    },[user])



    const renderLinks = useCallback(() => {
        const keysUser = Object.keys(user)
        return keysUser.map(item => {
            if (item === "links") {
                // eslint-disable-next-line array-callback-return
                return user[item].map(link => {
                    if (link.type === "link") {
                        return (
                            <Link to={`../${link.link}/${user.id}/${user.role}`} className="option">
                                <i className={`fas ${link.iconClazz}`} />
                                <span>{link.title}</span>
                            </Link>
                        )
                    }
                    if (link.type === "btn") {
                        return (
                            <div
                                onClick={() => changeModal(link.name)}
                                className="option"
                            >
                                <i className={`fas ${link.iconClazz}`} />
                                <span>{link.title}</span>
                            </div>
                        )
                    }
                })
            }
            return null
        })
    },[changeModal, user])



    const renderedItems = renderElements()
    const renderedLinks = renderLinks()



    if (fetchUserDataStatus === 'loading') {
        return <DefaultLoader/>
    }

    const userImg = user.photo_profile ? `${BackUrlForDoc}${user.photo_profile}` : null

    return (
        <>
            <div className="profile" onClick={handleClick}>
                <div className="profile__container">
                    <header className="profile__header">
                        <div>
                            <img className="profile-img" src={userImg ? userImg : img} alt=""/>
                            <h2 className="profile-username">{user.username}</h2>
                        </div>
                        <div>
                            <i className="fas fa-user profile-rankIcon" />
                            <span className="profile-rankName">{user.type_role}</span>
                        </div>
                        <div>
                            <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                                <div
                                    onClick={() => setActiveOptions(!activeOptions)}
                                    className="profile__header-btn"
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
                            </RequireAuthChildren>
                        </div>
                    </header>

                    <div className="profile__subHeader">

                    </div>

                    <main className="profile__main">
                        {renderedItems}
                    </main>
                </div>
            </div>

            <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                    <CheckPassword/>
                </Modal>
                {
                    activeChangeModalName === "delayDay" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <StudentPaymentChange
                                userId={userId}

                                setActiveChangeModal={setActiveChangeModal}
                            />
                        </Modal> :
                        activeChangeModalName === "paymentExcuse" && isCheckedPassword ?
                            <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                                <StudentPaymentReason
                                    userId={userId}
                                    setActiveChangeModal={setActiveChangeModal}
                                />
                            </Modal> : null
                }
            </RequireAuthChildren>
        </>
    );
}


const UserInfo = React.memo(({data}) => {
    const keysData = Object.keys(data)
    return keysData.map(key => {



        const style = {
            order: data[key].order,
            display: data[key].display ? data[key].display : "flex"
        }

        if (Array.isArray(data[key].value)) {
            return (
                <div style={style} className="information__item array">
                    <span>{data[key].name}:</span>
                    <div>
                        {
                            data[key].value.map( item => {
                                return (
                                    <span> {item.name}</span>
                                )
                            })
                        }
                    </div>
                </div>
            )
        }
        return (
            <div style={style} className="information__item">
                <span>{data[key].name}:</span>
                <span>
                    {
                        data[key]?.type === "icon" ?
                            data[key].value ? <i className="fas fa-check green"></i> : <i className="fas fa-times red"></i>
                            : data[key].value
                    }

                </span>
            </div>
        )
    })

})

const UserDegree = React.memo(({data}) => {

    return data?.map(item => {
        const clazzCircle =
            item.degree >= 5 ? "green" :
            item.degree >= 4 ? "yellow" :
            item.degree >= 3 ? "red":
                null

        return (
            <Link to={"../../"}>
                <div className="degree__item">
                    <h1>{item.subject}</h1>
                    <div className={`circle ${clazzCircle}`}>
                        <span>{item.degree}</span>
                    </div>
                </div>
            </Link>
        )
    })
})

const UserGroups = React.memo(({data}) => {

    const stringCheck = (name) => {
        if (name.length > 10) {
            return (
                <>
                    {name.substring(0,10)}...
                    <div className="popup">
                        {name}
                    </div>
                </>
            )
        }
        return name
    }



    return data.map((item,index) => {
        const userImg = item.photo_profile ? `${BackUrl}${item.photo_profile}` : null
        return (
            <Link to={`../../../insideGroup/${item.id}`}>
                <div className="groups__item">
                    <h1 className="index">{index+1}.</h1>
                    <img src={userImg ? userImg : img} alt="teacherImg"/>
                    <h1 className="name">{item?.nameGroup}</h1>
                </div>
            </Link>
        )
    })
})

const StudentPaymentChange = ({userId,setActiveChangeModal}) => {

    const [reason,setReason] = useState()
    const [date,setDate] = useState()

    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmit = (e) => {
        e.preventDefault()


        const data = {
            date,
            reason
        }

        request(`${BackUrl}extend_att_date/${userId}`, "POST", JSON.stringify(data),headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                    setActiveChangeModal(false)
                } else {
                    dispatch(setMessage({
                        msg: "Serverda hatolik",
                        type: "error",
                        active: true
                    }))

                }
            })

    }

    return (
        <div className="studentPaymentChange">
            <form action="" onSubmit={onSubmit}>
                <h1>O'quvchi tolovini uzaytirish</h1>
                <Input
                    name={"reason"}
                    onChange={setReason}
                    title={"Sabab"}
                    required={true}
                    type="text"
                />
                <input className="input-fields" type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                <input type="submit" className="input-submit"/>
            </form>
        </div>
    )
}

const StudentPaymentReason = ({userId,setActiveChangeModal}) => {

    const [reason,setReason] = useState()
    const [date,setDate] = useState()
    const [select,setSelect] = useState(false)

    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmit = (e) => {
        e.preventDefault()

        const data = {
            date : date ? date : "",
            reason : reason ? reason : "",
            select
        }


        request(`${BackUrl}debt_reason/${userId}`, "POST", JSON.stringify(data),headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                    setActiveChangeModal(false)
                } else {
                    dispatch(setMessage({
                        msg: "Serverda hatolik",
                        type: "error",
                        active: true
                    }))

                }
            })

    }


    const options = [
        {
            name: "Tel Ko'targan",
            value: "yes"
        },
        {
            name: "Tel Ko'tarmagan",
            value: "no"
        },
    ]


    return (
        <div className="studentPaymentChange">
            <form action="" onSubmit={onSubmit}>
                <h1>O'quvchi tolov sababi</h1>
                <Select options={options} name={""} title={""} onChangeOption={setSelect} />
                {
                    select === "yes" ?
                        <>
                            <Input
                                name={"reason"}
                                onChange={setReason}
                                title={"Sabab"}
                                required={true}
                                type="text"
                            />
                            <Input
                                name={"date"}
                                onChange={setDate}
                                title={"sana"}
                                required={true}
                                type="date"
                            />
                        </>
                        : null
                }
                <input type="submit" className="input-submit"/>
            </form>
        </div>
    )
}

export default PlatformUserProfile;