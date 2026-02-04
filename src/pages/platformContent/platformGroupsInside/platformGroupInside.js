import React, { useCallback, useEffect, useState } from 'react';
import classNames from "classnames";

import cls from "./platformGroupInside.module.sass"
import { Link, Route, useNavigate, useParams, Routes, Navigate, NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroup, setActiveBtn } from "slices/groupSlice";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import { BackUrl, BackUrlForDoc, headers, ROLES } from "constants/global";
import { useHttp } from "hooks/http.hook";
import user_img from "assets/user-interface/user_image.png";
import BackButton from "../../../components/platform/platformUI/backButton/backButton";
import ObserveTeacherLesson from "pages/platformContent/platformGroupsInside/observeTeacherLesson/ObserveTeacherLesson";
import LessonPlan from "pages/platformContent/platformGroupsInside/lessonPlan/LessonPlan";
import ObservedTeacherLessons
    from "pages/platformContent/platformGroupsInside/observedTeacherLessons/ObservedTeacherLessons";
import GroupTest from "pages/platformContent/platformGroupsInside/groupTest/groupTest";
import Info from "pages/platformContent/platformGroupsInside/info";
import Addition from "pages/platformContent/platformGroupsInside/addition";


const PlatformMakeAttendance = React.lazy(() => import('./makeAttendance/makeAttendance'));
const PlatformListAttendance = React.lazy(() => import('./listAttendance/listAttendance'));
const PlatformChangeGroupInfo = React.lazy(() => import('./changeGroupInfo/changeGroupInfo'));
const PlatformChangeGroupTime = React.lazy(() => import('./changeGroupTime/changeGroupTime'));
const PlatformChangeGroupTeacher = React.lazy(() => import('./changeGroupTeacher/changeGroupTeacher'));
const PlatformChangeGroupAssistent = React.lazy(() => import('./changeGroupAssistent/changeGroupAssistent'));
const PlatformChangeGroupStudents = React.lazy(() => import('./changeGroupStudents/changeGroupStudents'));
const PlatformAddToGroup = React.lazy(() => import('./addToGroup/addToGroup'));
const PlatformMoveToGroup = React.lazy(() => import('./moveToGroup/moveToGroup'));
const PlatformGroupTime = React.lazy(() => import('pages/platformContent/platformTimeTable/group'));

const PlatformGroupInside = () => {
    const { groupId } = useParams()

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchGroup(groupId))
    }, [groupId])

    return (
        <Routes>
            <Route path="info" element={<GroupInfo groupId={groupId} />}>
                <Route path={'information'} element={<Info />} />
                <Route path={'addition'} element={<Addition />} />
            </Route>
            <Route path="makeAttendance" element={<PlatformMakeAttendance />} />
            <Route path="listAttendance" element={<PlatformListAttendance />} />
            <Route path="changeGroupInfo" element={<PlatformChangeGroupInfo />} />
            <Route path="changeGroupTime" element={<PlatformChangeGroupTime />} />
            <Route path="changeGroupTeacher" element={<PlatformChangeGroupTeacher />} />
            <Route path="changeGroupAssistent" element={<PlatformChangeGroupAssistent />} />
            <Route path="changeGroupStudents" element={<PlatformChangeGroupStudents />} />
            <Route path="addToGroup" element={<PlatformAddToGroup />} />
            <Route path="groupTime" element={<PlatformGroupTime />} />
            <Route path="moveToGroup/:oldGroupId/:newGroupId" element={<PlatformMoveToGroup />} />
            <Route path="lessonPlan" element={<LessonPlan backBtn={true} />} />
            <Route path="observeTeacherLesson/*" element={<ObserveTeacherLesson />} />
            <Route path="observedTeacherLessons" element={<ObservedTeacherLessons />} />
            <Route path="test" element={<GroupTest />} />

            <Route
                path="*"
                element={
                    <Navigate to="info/information" replace />
                }
            />
        </Routes>
    )
}


const GroupInfo = ({ groupId }) => {
    const {
        btns,
        groupName,
        links,
        locationId,
        fetchGroupStatus,
        isTime,
        msg
    } = useSelector(state => state.group)
    const { isCheckedPassword } = useSelector(state => state.me)

    const [activeOptions, setActiveOptions] = useState(false)
    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)


    const renderBtns = useCallback(() => {
        return btns.map(btn => {
            return (
                <NavLink
                    className={({ isActive }) =>
                        isActive ? `${cls.subheader__linksItem} ${cls.active}` : cls.subheader__linksItem
                    }
                    to={btn.name}
                    onClick={() => activateBtn(btn.id)}
                >
                    {btn.title}

                </NavLink>
            )
        })
    }, [btns])


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
    }, [activeChangeModalName, isCheckedPassword])

    const renderLinks = useCallback(() => {
        return links.map(link => {
            if (link.type === "link") {
                return (
                    <Link to={`../../../${link.link}/${locationId}/${groupId}`} className={cls.option}>
                        <span className={cls.icon}>
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
                        className={cls.option}
                    >
                        <span className={cls.icon}>
                            <i className={`fas ${link.iconClazz}`} />
                        </span>
                        <span>{link.title}</span>
                    </div>
                )
            }
        })
    }, [changeModal, groupId, links, locationId])

    const { request } = useHttp()

    const getConfirmDelete = (name) => {
        if (name === "yes") {
            request(`${BackUrl}group_change/delete_group/${groupId}`, "GET", null, headers())
                .then(res => console.log(res))
        }
        setActiveChangeModal(false)
    }

    const dispatch = useDispatch()

    const activateBtn = (id) => {
        dispatch(setActiveBtn({ id }))
    }

    const renderedBtns = renderBtns()
    const renderedLinks = renderLinks()


    // if (fetchGroupsStatus === "loading") {
    //     return <DefaultLoader/>
    // } else if (fetchGroupsStatus === "error") {
    //     console.log('error')
    // }



    return (
        <div className={cls.insideGroup}>
            <header className={cls.header}>
                <div>
                    <BackButton />
                </div>
                <div>
                    <h2>{groupName}</h2>
                </div>
                <div>
                    <RequireAuthChildren allowedRules={[ROLES.Admin, ROLES.Director, ROLES.Programmer]}>
                        <div
                            onClick={() => setActiveOptions(!activeOptions)}
                            className={cls.headerBtn}
                        >

                            <i className="fas fa-ellipsis-v" />

                            <div
                                className={classNames(cls.modalOptions, {
                                    [cls.active]: activeOptions
                                })}
                            >
                                {renderedLinks}
                            </div>
                        </div>
                    </RequireAuthChildren>
                </div>
            </header>
            <div className={cls.error}>
                <h1>{!isTime ? "Guruhga dars jadvali belgilanmagan !" : null}</h1>
                {msg && msg?.map(item => (
                    <h1>{item}</h1>
                ))}

            </div>

            <div className={cls.subheader}>
                <div className={cls.subheader__links}>
                    {renderedBtns}
                </div>
            </div>

            {/*<Routes>*/}
            {/*    <Route path={'information'} element={<Info/>}/>*/}
            {/*    <Route path={'addition'} element={<Addition/>}/>*/}
            {/*</Routes>*/}
            <Outlet />

            <RequireAuthChildren allowedRules={[ROLES.Admin, ROLES.Director, ROLES.Programmer]}>
                <Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>
                    <CheckPassword />
                </Modal>
                {
                    activeChangeModalName === "deleteGroup" && isCheckedPassword ?
                        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>
                            <Confirm setActive={setActiveChangeModal} text={"Gruppani ochirishni hohlaysizmi ?"}
                                getConfirm={getConfirmDelete} />
                        </Modal> : null
                }
            </RequireAuthChildren>

        </div>
    );

}


export default PlatformGroupInside;