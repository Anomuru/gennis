import React, {useCallback, useEffect, useState} from 'react';
import classNames from "classnames";

import "./platformGroupInside.sass"
import {Link, Route, useNavigate, useParams, Routes, Navigate, NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchGroup, setActiveBtn} from "slices/groupSlice";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import {BackUrl, BackUrlForDoc, headers, ROLES} from "constants/global";
import {useHttp} from "hooks/http.hook";
import user_img from "assets/user-interface/user_image.png";
import {useAuth} from "hooks/useAuth";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import BackButton from "../../../components/platform/platformUI/backButton/backButton";


const PlatformMakeAttendance =  React.lazy(() => import('./makeAttendance/makeAttendance'));
const PlatformListAttendance =  React.lazy(() => import('./listAttendance/listAttendance'));
const PlatformChangeGroupInfo =  React.lazy(() => import('./changeGroupInfo/changeGroupInfo'));
const PlatformChangeGroupTime =  React.lazy(() => import('./changeGroupTime/changeGroupTime'));
const PlatformChangeGroupTeacher =  React.lazy(() => import('./changeGroupTeacher/changeGroupTeacher'));
const PlatformChangeGroupStudents =  React.lazy(() => import('./changeGroupStudents/changeGroupStudents'));
const PlatformAddToGroup=  React.lazy(() => import('./addToGroup/addToGroup'));
const PlatformMoveToGroup=  React.lazy(() => import('./moveToGroup/moveToGroup'));
const PlatformGroupTime =  React.lazy(() => import('pages/platformContent/platformTimeTable/group'));

const PlatformGroupInside = () => {
    const {groupId} = useParams()


    return (
        <Routes>
            <Route path="info" element={<GroupInfo groupId={groupId}/>}/>
            <Route path="makeAttendance/:groupId/:teacherId" element={<PlatformMakeAttendance/>}/>
            <Route path="listAttendance/:groupId" element={<PlatformListAttendance/>}/>
            <Route path="changeGroupInfo/:groupId" element={<PlatformChangeGroupInfo/>}/>
            <Route path="changeGroupTime/:groupId" element={<PlatformChangeGroupTime/>}/>
            <Route path="changeGroupTeacher/:groupId" element={<PlatformChangeGroupTeacher/>}/>
            <Route path="changeGroupStudents/:groupId/:locationId" element={<PlatformChangeGroupStudents/>}/>
            <Route path="addToGroup/:groupId/:locationId" element={<PlatformAddToGroup/>}/>
            <Route path="groupTime/:groupId" element={<PlatformGroupTime/>}/>
            <Route path="moveToGroup/:oldGroupId/:newGroupId" element={<PlatformMoveToGroup/>}/>

            <Route path="*"  element={
                <Navigate to="info" replace />
            }
            />
        </Routes>
    )
}


const GroupInfo = ({groupId}) => {
    const {data,btns,groupName,id,teacherId,links,locationId,fetchGroupsStatus,isTime} = useSelector(state => state.group)
    const {isCheckedPassword} = useSelector(state => state.me)

    const [activeOptions,setActiveOptions] = useState(false)
    const [activeChangeModal,setActiveChangeModal] = useState(false)
    const [activeChangeModalName,setActiveChangeModalName] = useState("")
    const [activeCheckPassword,setActiveCheckPassword] = useState(false)


    const renderBtns = useCallback(() => {
        return btns.map(btn => {
            return (
                <div
                    onClick={() => activateBtn(btn.id)}
                    className={classNames('subheader__links-item', {
                        active: btn.active
                    })}
                >
                    {btn.title}
                </div>
            )
        })
    },[btns])



    const renderInfo = useCallback(() => {
        // eslint-disable-next-line array-callback-return
        return btns.map(btn => {
            if (btn.active) {
                if (btn.name === "information") {
                    return(
                        <main className="main">
                            <InformationsGroup data={data} id={id} locationId={locationId}/>
                        </main>
                    )
                }
                if (btn.name === "addition") {
                    return (
                        <main className="main main-flex">
                            <AdditionGroup id={id} teacherId={teacherId}/>
                        </main>
                    )
                }
            }

        })
    },[btns, data, id, locationId, teacherId])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    },[activeChangeModalName, isCheckedPassword])

    const renderLinks = useCallback(() => {
        return links.map(link => {
            if (link.type === "link") {
                return (
                    <Link to={`../../../${link.link}/${locationId}/${groupId}`} className="option">
                        <span className="icon">
                            <i className={`fas ${link.iconClazz}`} />
                        </span>
                        <span>{link.title}</span>
                    </Link>

                    // <Link to={`../${link.link}/${locationId}/${groupId}`} className="option">
                    //     <span className="icon">
                    //         <i className={`fas ${link.iconClazz}`} />
                    //     </span>
                    //     <span>{link.title}</span>
                    // </Link>
                )
            }
            if (link.type === "btn") {
                return (
                    <div
                        onClick={() => changeModal(link.name)}
                        className="option"
                    >
                        <span className="icon">
                            <i className={`fas ${link.iconClazz}`} />
                        </span>
                        <span>{link.title}</span>
                    </div>
                )
            }
        })
    },[changeModal, groupId, links, locationId])

    const {request} = useHttp()

    const getConfirmDelete = (name) => {
        if (name === "yes") {
            request(`${BackUrl}delete_group/${groupId}`,"GET",null, headers())
                .then(res => console.log(res))
        }
        setActiveChangeModal(false)
    }


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchGroup(groupId))
    },[dispatch, groupId])

    const activateBtn = (id) => {
        dispatch(setActiveBtn({id}))
    }

    const renderedBtns = renderBtns()
    const renderedInfo = renderInfo()
    const renderedLinks = renderLinks()


    // if (fetchGroupsStatus === "loading") {
    //     return <DefaultLoader/>
    // } else if (fetchGroupsStatus === "error") {
    //     console.log('error')
    // }



    return (
        <div className="insideGroup">
            <header className="header">
                <div>
                    <BackButton/>
                </div>
                <div>
                    <h2>{groupName}</h2>
                </div>
                <div>
                    <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                        <div
                            onClick={() => setActiveOptions(!activeOptions)}
                            className="header-btn"
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
            <div className="error">
                <h1>{!isTime ? "Guruhga dars jadvali belgilanmagan !" : null}</h1>
            </div>

            <div className="subheader">
                <div className="subheader__links ">
                    {renderedBtns}
                </div>
            </div>

            {renderedInfo}

            <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                    <CheckPassword/>
                </Modal>
                {
                    activeChangeModalName === "deleteGroup" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <Confirm setActive={setActiveChangeModal} text={"Gruppani ochirishni hohlaysizmi ?"} getConfirm={getConfirmDelete}/>
                        </Modal> : null
                }
            </RequireAuthChildren>

        </div>
    );

}

const PlatformGroupInside1 = ({groupId}) => {



    const {data,btns,groupName,id,teacherId,links,locationId,fetchGroupsStatus,isTime} = useSelector(state => state.group)
    const {isCheckedPassword} = useSelector(state => state.me)

    const [activeOptions,setActiveOptions] = useState(false)
    const [activeChangeModal,setActiveChangeModal] = useState(false)
    const [activeChangeModalName,setActiveChangeModalName] = useState("")
    const [activeCheckPassword,setActiveCheckPassword] = useState(false)



    const renderBtns = useCallback(() => {
        return btns.map(btn => {
            return (
                <div
                    onClick={() => activateBtn(btn.id)}
                    className={classNames('subheader__links-item', {
                        active: btn.active
                    })}
                >
                    {btn.title}
                </div>
            )
        })
    },[btns])



    const renderInfo = useCallback(() => {
        // eslint-disable-next-line array-callback-return
        return btns.map(btn => {
            if (btn.active) {
                if (btn.name === "information") {
                    return(
                        <main className="main">
                            <InformationsGroup data={data} id={id} locationId={locationId}/>
                        </main>
                    )
                }
                if (btn.name === "addition") {
                    return (
                        <main className="main main-flex">
                            <AdditionGroup id={id} teacherId={teacherId}/>
                        </main>
                    )
                }
            }

        })
    },[btns, data, id, locationId, teacherId])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    },[activeChangeModalName, isCheckedPassword])

    const renderLinks = useCallback(() => {
        return links.map(link => {
            if (link.type === "link") {
                return (
                    <Link to={`../../${link.link}/${locationId}/${groupId}`} className="option">
                        <span className="icon">
                            <i className={`fas ${link.iconClazz}`} />
                        </span>
                        <span>{link.title}</span>
                    </Link>

                    // <Link to={`../${link.link}/${locationId}/${groupId}`} className="option">
                    //     <span className="icon">
                    //         <i className={`fas ${link.iconClazz}`} />
                    //     </span>
                    //     <span>{link.title}</span>
                    // </Link>
                )
            }
            if (link.type === "btn") {
                return (
                    <div
                        onClick={() => changeModal(link.name)}
                        className="option"
                    >
                        <span className="icon">
                            <i className={`fas ${link.iconClazz}`} />
                        </span>
                        <span>{link.title}</span>
                    </div>
                )
            }
        })
    },[changeModal, groupId, links, locationId])

    const {request} = useHttp()

    const getConfirmDelete = (name) => {
        if (name === "yes") {
            request(`${BackUrl}delete_group/${groupId}`,"GET",null, headers())
                .then(res => console.log(res))
        }
        setActiveChangeModal(false)
    }


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchGroup(groupId))
    },[dispatch, groupId])

    const activateBtn = (id) => {
        dispatch(setActiveBtn({id}))
    }

    const renderedBtns = renderBtns()
    const renderedInfo = renderInfo()
    const renderedLinks = renderLinks()


    if (fetchGroupsStatus === "loading") {
        return <DefaultLoader/>
    } else if (fetchGroupsStatus === "error") {
        console.log('error')
    }

    return (
        <div className="insideGroup">
            <header className="header">
                <div>
                    <Link to={-1} className="backBtn">
                        <i className="fas fa-arrow-left" />
                        Ortga
                    </Link>
                </div>
                <div>
                    <h2>{groupName}</h2>
                </div>
                <div>
                    <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                        <div
                            onClick={() => setActiveOptions(!activeOptions)}
                            className="header-btn"
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
            <div className="error">
                <h1>{!isTime ? "Guruhga dars jadvali belgilanmagan !" : null}</h1>
            </div>

            <div className="subheader">
                <div className="subheader__links ">
                    {renderedBtns}
                </div>
            </div>

            {renderedInfo}

            <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                    <CheckPassword/>
                </Modal>
                {
                    activeChangeModalName === "deleteGroup" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <Confirm setActive={setActiveChangeModal} text={"Gruppani ochirishni hohlaysizmi ?"} getConfirm={getConfirmDelete}/>
                        </Modal> : null
                }
            </RequireAuthChildren>

        </div>
    );
};


const InformationsGroup = ({data, id,locationId}) => {

    const {role} = useAuth()
    const renderInformation = (data) => {
        const dataKeys = Object.keys(data)
        return (
            <div className="main__item information">
                <div className="information__header">
                    <h1>Gruppa ma'lumotlari</h1>
                    <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                        <Link
                            to={`../changeGroupInfo/${id}`}
                            className="information__icons"
                        >
                            <i className="fas fa-edit" />
                        </Link>
                    </RequireAuthChildren>

                </div>
                <div className="information__container">
                    {
                        dataKeys.map(item => {
                            return (
                                <div className="information__item">
                                    <span>{data[item].name}: </span>
                                    <span>{data[item].value}</span>
                                </div>
                            )
                        })

                        // data.map(item => {
                        //     return (
                        //         <div className="information__item">
                        //             <span>{item.name}: </span>
                        //             <span>{item.value}</span>
                        //         </div>
                        //     )
                        // })
                    }
                </div>
            </div>
        )
    }

    const stringCheck = (name,length = 10) => {
        if (name.length > length) {
            return (
                <>
                    {name.substring(0,length)}...
                </>
            )
        }
        return name
    }

    const navigate = useNavigate()

    const LinkToUser = (e,id) => {
        if (role !== ROLES.Student) {
            navigate(`../../../profile/${id}`)
        }
    }



    const renderStudents = (data) => {
        return (
            <div className="main__item students">
                <div className="students__header">
                    <h1>O'quvchilar</h1>
                    <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer]}>
                        <Link
                            to={`../changeGroupStudents/${id}/${locationId}`}
                            className="students__icons"
                        >
                            <i className="fas fa-edit" />
                        </Link>
                    </RequireAuthChildren>
                </div>
                <div className="students__container">
                    {
                        data.map(item => {
                            const userImg = item.photo_profile ? `${BackUrlForDoc}${item.photo_profile}` : user_img
                            return (
                                <div className="students__item" onClick={e => LinkToUser(e,item.id)}>
                                    <div>
                                        <img src={userImg} alt=""/>
                                    </div>
                                    <div className="info">
                                        <span>{stringCheck(item.name)}</span>
                                        <span>{stringCheck(item.surname)}</span>
                                    </div>
                                    <RequireAuthChildren allowedRules={[ROLES.Admin,ROLES.Director,ROLES.Programmer,ROLES.Teacher]}>
                                        <div>
                                            <div className={`money ${item.moneyType}`}>{item.money}</div>
                                        </div>
                                    </RequireAuthChildren>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    const keys = Object.keys(data)

    // eslint-disable-next-line array-callback-return
    return keys.map(key => {
        if (key === "information") {
            return renderInformation(data[key])
        }
        if (key === "students") {
            return renderStudents(data[key])
        }
    })
}

const AdditionGroup = ({id,teacherId}) => {
    return (
        <>
            <RequireAuthChildren allowedRules={[ROLES.Teacher,ROLES.Admin]}>
                <Link to={`../makeAttendance/${id}/${teacherId}`} className="main__item checkAttendance">
                    <div className="checkAttendance__container">
                        <div  className="subheader__item">
                            <i className="fas fa-calendar-check" />
                        </div>
                    </div>
                </Link>
            </RequireAuthChildren>
            <RequireAuthChildren allowedRules={[ROLES.Teacher,ROLES.Admin,ROLES.Director]}>
                <Link to={`../listAttendance/${id}`} className="main__item checkAttendance">
                    <div className="checkAttendance__container">
                        <div  className="subheader__item">
                            <i className="fas fa-calendar-alt" />
                        </div>
                    </div>
                </Link>
            </RequireAuthChildren>
            <RequireAuthChildren allowedRules={[ROLES.Teacher,ROLES.Admin,ROLES.Director]}>
                <Link to={`../groupTime/${id}`} className="main__item checkAttendance">
                    <div className="checkAttendance__container">
                        <div  className="subheader__item">
                            <i className="fas fa-clock" />
                        </div>
                    </div>
                </Link>
            </RequireAuthChildren>
        </>

    )
}

export default PlatformGroupInside;