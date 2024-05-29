import React, {useEffect} from 'react';
import {NavLink, Route, Routes, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Payment from "pages/platformContent/platformUser/studentPayment/payment/payment";
import Charity from "pages/platformContent/platformUser/studentPayment/charity/charity";
import Discount from "pages/platformContent/platformUser/studentPayment/discount/discount";


import "./studentPayment.sass"
import LocationMoneys from "pages/platformContent/platformAccounting/locationMoneys/locationMoneys";
import {useAuth} from "hooks/useAuth";
import {setClearPassword} from "slices/meSlice";
import BookPayment from "pages/platformContent/platformUser/studentPayment/bookPayment/bookPayment";


const StudentPayment = () => {


    const {userId,userRole} = useParams()

    const {isCheckedPassword,role,activeToChange,extraInfo} = useSelector(state => state.me)
    const {user} = useSelector(state => state.usersProfile)
    const {selectedLocation} = useAuth()

    const dispatch = useDispatch()

    useEffect(() => {
        if (isCheckedPassword) {
            setInterval(() => {
                dispatch(setClearPassword())
            },(1000 * 60) * 15)
        }
    },[dispatch, isCheckedPassword])



    // const checkUserRole = useMemo(() => {
    //     let data = {
    //         activeToChange: null,
    //         extraInfo: null
    //     }
    //     if (role === userRole) {
    //         data.activeToChange = activeToChange
    //         data.extraInfo = extraInfo
    //         // console.log(data)
    //         return data
    //     }
    //     if (role === "b55a77c90" || role === "c56b13a36" || role === "a20b03c13") {
    //         data.activeToChange = user.activeToChange
    //         data.extraInfo = user.extraInfo
    //         return data
    //     }
    //     return data
    //
    //
    //
    // },[role, userRole, activeToChange, extraInfo, user])


    return (
        isCheckedPassword ?
            <div className="payment">
                <LocationMoneys locationId={selectedLocation} />

                <h1 className="payment__title">O'quvchi tolovlari</h1>
                <div className="payment__btns">
                    <NavLink
                        className={({ isActive }) =>
                            "payment__btns-item" + (isActive ? " active" : "")
                        }
                        to="payment"
                    >
                        To'lov
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            "payment__btns-item" + (isActive ? " active" : "")
                        }
                        to="charity"
                    >
                        Xayriya
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            "payment__btns-item" + (isActive ? " active" : "")
                        }
                        to="discount"
                    >
                        Chegirma
                    </NavLink>
                </div>

                <div className="payment__container">
                    <Routes>
                        <Route path="payment" element={<Payment/>} />
                        <Route path="charity" element={<Charity/>} />
                        <Route path="discount" element={<Discount/>} />
                    </Routes>
                </div>
            </div>
            :
            <Modal activeModal={!isCheckedPassword} link={-1} >
                <CheckPassword />
            </Modal>
    )
};

export default StudentPayment;