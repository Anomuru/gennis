
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Modal from "components/platform/platformUI/modal";
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMyInfo, setClearPassword } from "slices/meSlice";

import PasswordChange from "pages/platformContent/platformUser/platformUserChange/password/passwordChange"
import PersonalInfo from "pages/platformContent/platformUser/platformUserChange/personalInfo/personalInfo"



import "./platformUserChange.sass"
import Delete from "pages/platformContent/platformUser/platformUserChange/delete/delete";
import { fetchUserData } from "slices/usersProfileSlice";
import GiveSalaryEmployee from "../giveSalaryEmployee/giveSalaryEmployee";
import { ROLES } from "constants/global";
import classNames from "classnames";
import { useAuth } from "hooks/useAuth";
import BlockUser from "./blockUser/blockUser";
import Contract from "./contract/contract";
import ChangeLocTeacher from "./changeLocTeacher/changeLocTeacher";
import ChangeLocStudent from "./changeLocStudent/changeLocStudent";
import BackButton from "../../../../components/platform/platformUI/backButton/backButton";
import MakeObserver
    from "pages/platformContent/platformUser/platformUserChange/makeObserver/makeObserver";
import ReturnDeletedTeacher
    from "pages/platformContent/platformUser/platformUserChange/returnDeletedTeacher/returnDeletedTeacher";


const PlatformUserChange = () => {


    const { userId, userRole } = useParams()
    const { id } = useAuth()

    const { isCheckedPassword, role, activeToChange, extraInfo, contract_url } = useSelector(state => state.me)
    const { user } = useSelector(state => state.usersProfile)

    const [activeRoute, setActiveRoute] = useState("personalInfo")
    const dispatch = useDispatch()

    useEffect(() => {
        const data = {
            id: userId,
            role
        }

        dispatch(fetchUserData(data))
        dispatch(fetchMyInfo(id))
    }, [dispatch, id, role, userId])


    useEffect(() => {
        if (isCheckedPassword) {
            setInterval(() => {
                dispatch(setClearPassword())
            }, (1000 * 60) * 15)
        }
    }, [dispatch, isCheckedPassword])


    const checkUserRole = useMemo(() => {

        let data = {
            activeToChange: null,
            extraInfo: null,
            contract: null
        }
        if (role === userRole) {
            data.activeToChange = activeToChange
            data.extraInfo = { ...extraInfo, level: { value: user.level } }
            data.contract = contract_url
            return data
        }
        if (role === ROLES.Admin || role === ROLES.Director || role === ROLES.Programmer) {

            data.activeToChange = user.activeToChange
            data.extraInfo = { ...user.info, address: { value: user.address }, level: { value: user.level } }
            data.contract = user.contract_url
            return data
        }
        return data



    }, [role, userRole, activeToChange, extraInfo, user])


    return (
        isCheckedPassword ?

            <div className="changeInfo">
                <header>
                    <BackButton />
                </header>
                <main>
                    <h1 className="changeInfo__title">Ma'lumotlarni O'zgartirish</h1>
                    <div className="changeInfo__btns">
                        <div
                            onClick={() => setActiveRoute("personalInfo")}
                            className={classNames("changeInfo__btns-item", {
                                active: activeRoute === "personalInfo"
                            })}
                        >
                            Shaxsiy ma'lumotlar
                        </div>
                        <div
                            onClick={() => setActiveRoute("password")}
                            className={classNames("changeInfo__btns-item", {
                                active: activeRoute === "password"
                            })}
                        >
                            Parol
                        </div>
                        {
                            // eslint-disable-next-line no-mixed-operators
                            user.role === ROLES.Student && (role === ROLES.Admin || role === ROLES.Director) ?
                                <div
                                    onClick={() => setActiveRoute("contract")}
                                    className={classNames("changeInfo__btns-item", {
                                        active: activeRoute === "contract"
                                    })}
                                >
                                    Shartnoma
                                </div>
                                :
                                null
                        }
                        {
                            // eslint-disable-next-line no-mixed-operators
                            user?.isSalary && (role === ROLES.Admin || role === ROLES.Director) ?
                                <div
                                    onClick={() => setActiveRoute("employeeSalary")}
                                    className={classNames("changeInfo__btns-item", {
                                        active: activeRoute === "employeeSalary"
                                    })}
                                >
                                    Oylik berish
                                </div>
                                :
                                null
                        }
                        {
                            // eslint-disable-next-line no-mixed-operators
                            user.role === ROLES.Student && (role === ROLES.Admin || role === ROLES.Director) ?
                                <div
                                    onClick={() => setActiveRoute("deleteUser")}
                                    className={classNames("changeInfo__btns-item", {
                                        active: activeRoute === "deleteUser"
                                    })}
                                >
                                    O'quvchini ochirish
                                </div>
                                :
                                null
                        }
                        {
                            // eslint-disable-next-line no-mixed-operators
                            user.role === ROLES.Student && (role === ROLES.Admin || role === ROLES.Director) ?
                                <div
                                    onClick={() => setActiveRoute("blockUser")}
                                    className={classNames("changeInfo__btns-item", {
                                        active: activeRoute === "blockUser"
                                    })}
                                >
                                    O'quvchini Blocklash
                                </div>
                                :
                                null
                        }
                        {
                            // eslint-disable-next-line no-mixed-operators
                            user.role === ROLES.Teacher && (role === ROLES.Admin || role === ROLES.Director) ?
                                <div
                                    onClick={() => setActiveRoute("changeLocTeacher")}
                                    className={classNames("changeInfo__btns-item", {
                                        active: activeRoute === "changeLocTeacher"
                                    })}
                                >
                                    O'qituvchini filialga qoshish
                                </div>
                                :
                                null
                        }
                        {
                            // eslint-disable-next-line no-mixed-operators
                            user.role === ROLES.Student && role === ROLES.Director ?
                                <div
                                    onClick={() => setActiveRoute("changeLocStudent")}
                                    className={classNames("changeInfo__btns-item", {
                                        active: activeRoute === "changeLocStudent"
                                    })}
                                >
                                    O'quvchini filialini almashtirish
                                </div>
                                :
                                null
                        }

                        {
                            // eslint-disable-next-line no-mixed-operators
                            user.role === ROLES.Teacher && (role === ROLES.Admin || role === ROLES.Director) ?
                                <div
                                    onClick={() => setActiveRoute("makeObserver")}
                                    className={classNames("changeInfo__btns-item", {
                                        active: activeRoute === "makeObserver"
                                    })}
                                >
                                    Observer qilish
                                </div>
                                :
                                null
                        }
                        {
                            // eslint-disable-next-line no-mixed-operators
                            user.deleted && (role === ROLES.Admin || role === ROLES.Director) ?
                                <div
                                    onClick={() => setActiveRoute("returnDeleted")}
                                    className={classNames("changeInfo__btns-item", {
                                        active: activeRoute === "returnDeleted"
                                    })}
                                >
                                    Foydalanuvchini qaytarish
                                </div>
                                :
                                null
                        }
                    </div>


                    <div className="changeInfo__container">
                        {
                            activeRoute === "personalInfo" ?
                                <PersonalInfo userId={userId} accessData={checkUserRole} />
                                : activeRoute === "password" ? <PasswordChange userId={userId} />
                                    : activeRoute === "deleteUser" ? <Delete />
                                        : activeRoute === "blockUser" ? <BlockUser userId={userId} />
                                            : activeRoute === "contract" ? <Contract accessData={checkUserRole} userId={userId} />
                                                : activeRoute === "employeeSalary" ? <GiveSalaryEmployee userRole={userRole} userId={userId} />
                                                    : activeRoute === "changeLocTeacher" ? <ChangeLocTeacher userRole={userRole} userId={userId} />
                                                        : activeRoute === "changeLocStudent" ? <ChangeLocStudent userRole={userRole} userId={userId} />
                                                            : activeRoute === "makeObserver" ? <MakeObserver userRole={userRole} userId={userId} />
                                                                : activeRoute === "returnDeleted" ? <ReturnDeletedTeacher userRole={userRole} userId={userId} />
                                                                    : null
                        }
                    </div>
                </main>
            </div>
            :
            <Modal activeModal={!isCheckedPassword} link={-1} >
                <CheckPassword />
            </Modal>
    );
};

export default PlatformUserChange;