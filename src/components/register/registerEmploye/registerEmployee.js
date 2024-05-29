import React, {useEffect, useState} from 'react';
import {NavLink, Routes, Route} from "react-router-dom";
import {motion} from "framer-motion";




import "components/register/registerTeacher/registerTeacher.sass"
import {containerStudentsNum, itemStudentsNum} from "frame-motion";


import RegisterEmployeeStep1 from "./registerEmployeeStep1/registerEmployeeStep1";
import RegisterEmployeeStep2 from "./registerEmployeeStep2/registerEmployeeStep2";


const RegisterEmployee = () => {
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
                <Route path="step_1" element={<RegisterEmployeeStep1 userData={userData} updateUserData={updateUserData}/>}/>
                <Route path="step_2" element={<RegisterEmployeeStep2 userData={userData} updateUserData={updateUserData}/>}/>
            </Routes>

        </motion.div>


    );
};

export default RegisterEmployee;