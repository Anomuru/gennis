import React, {useEffect, useState} from 'react';
import {NavLink, Routes, Route, Navigate} from "react-router-dom";
import {motion} from "framer-motion";


import RegisterUserStep1 from "components/register/registerUser/registerUserStep1/registerUserStep1";
import RegisterUserStep2 from "components/register/registerUser/registerUserStep2/registerUserStep2";

import "components/register/registerUser/registerUser.sass"
import {containerStudentsNum, itemStudentsNum} from "frame-motion";




const RegisterUser = () => {
    const [userData,setUserData] = useState(null)

    const updateUserData = (data) => {
        console.log(data)
        setUserData((prevUser) => ({ ...prevUser, ...data }));
    }

    useEffect(()=>{
        console.log(userData)
    },[userData])

    const handleClick = (e) => {
        e.preventDefault()
    }
    
    



    return (
        <motion.div className="register">


            <motion.div
                variants={containerStudentsNum}
                initial="hidden"
                exit="exit"
                animate="show"
                className="steps"
            >
                <motion.div className="steps__item" variants={itemStudentsNum}>
                    <NavLink
                        to="step_1"
                        className={
                            ({ isActive }) =>
                                "steps__item-link" + (isActive ? " steps__item-link_active" : "")
                        }
                        onClick={handleClick}
                    >
                        <span className="circle">
                            1
                        </span>
                        <span>
                            Step
                        </span>
                    </NavLink>
                </motion.div>
                <motion.div className="steps__item" variants={itemStudentsNum}>
                    <NavLink
                        to="step_2"
                        className={
                            ({ isActive }) =>
                                "steps__item-link" + (isActive ? " steps__item-link_active" : "")
                        }
                        onClick={handleClick}

                    >
                        <span className="circle">
                            2
                        </span>
                        <span>
                            Step
                        </span>
                    </NavLink>
                </motion.div>
            </motion.div>

            <Routes>
                <Route path="step_1" element={<RegisterUserStep1 userData={userData} updateUserData={updateUserData}/>}/>
                <Route path="step_2" element={<RegisterUserStep2 userData={userData} updateUserData={updateUserData}/>}/>



            </Routes>

        </motion.div>


    );
};

export default RegisterUser;