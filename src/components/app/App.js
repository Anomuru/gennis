import RegisterTeacher from "components/register/registerTeacher/registerTeacher";
import React from "react";
import {Route, Routes, Navigate} from "react-router-dom";


import Platform from "components/platform/layout/Platform";
import PlatformContent from "pages/platformContent/platformContent";
import Website from "pages/webSite";
import Login from "pages/login/Login";
import FastRegister from "pages/fastRegister";
import RegisterUser from "components/register/registerUser/registerUser";
import RegisterEmployee from "components/register/registerEmploye/registerEmployee";

import "./app.sass"
import RequireAuth from "components/requireAuth/requireAuth";

import QrCodeRegister from "pages/platformContent/qrCode/qrCodeRegister/qrCodeRegister";
import {ROLES} from "constants/global";

const App = () => {

    return (
        <Routes>
            <Route path="/*"  element={<Website/>} />

            <Route path="/login" element={<Login/>} />

            <Route path="/register"  element={<FastRegister/>}/>
            <Route element={<RequireAuth allowedRules={[ROLES.Admin,ROLES.Director]}/>} >
                <Route path="registerTeacher/*"  element={<RegisterTeacher/>}/>
                <Route path="registerEmployee/*"  element={<RegisterEmployee/>}/>
            </Route>


            <Route element={<RequireAuth allowedRules={[ROLES.Admin,ROLES.Director,ROLES.User,ROLES.Student,ROLES.Teacher,ROLES.Programmer,ROLES.Smm,ROLES.Editor]}/>} >
                <Route path="/platform"  element={<Platform/>} >
                    <Route path="/platform/*" element={<PlatformContent/>}/>
                </Route>

                <Route path="registerStudent/*"  element={<RegisterUser/>}/>


            </Route>


            {/*<Route path="/platform"  element={<Platform/>} >*/}
            {/*    <Route path="/platform/*" element={<PlatformContent/>}/>*/}
            {/*</Route>*/}

            <Route
                path="/platform/"
                element={<Navigate to="home" replace />}
            />
            <Route
                path="registerStudent"
                element={<Navigate to="/registerStudent/step_1" replace />}
            />
            <Route
                path="registerTeacher"
                element={<Navigate to="/registerTeacher/step_1" replace />}
            />
            <Route
                path="registerEmployee"
                element={<Navigate to="/registerEmployee/step_1" replace />}
            />

            <Route
                path="/discountUserChirchik"
                element={<QrCodeRegister/>}
            />


        </Routes>

    )
}

export default App
