import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Radio from "components/platform/platformUI/radio/radio";
import PlatformTaskManager from "pages/platformContent/platformTaskManager/platformTaskManager";
import PlatformAdminRating from "pages/platformContent/platformAdminRating/platformAdminRating";
import TaskManagerProfile from '../platformTaskManager/taskManagerProfile/taskManagerProfile';

import cls from "./platformAdminItem.module.sass";
import Button from 'components/platform/platformUI/button';
import NewTaskManager from '../platformTaskManager/newTaskManager/newTaskManager';

const studentsPage = [
    {
        name: "taskManager",
        label: "Task manager"
    },
    {
        name: "adminRanking",
        label: "Admin ranking"
    },
];

const PlatformAdminItem = () => {

    const navigate = useNavigate()
    const location = useLocation()


    // 🔑 localStorage dan oxirgi tanlovni olish
    // const savedRadio = localStorage.getItem("platformAdminRadio");

    // const [selectRadio, setSelectRadio] = useState(savedRadio || studentsPage[0].name);

    // 🔑 har safar o‘zgarganda localStorage ga yozib qo‘yish
    // useEffect(() => {
    //     localStorage.setItem("platformAdminRadio", selectRadio);
    // }, [selectRadio]);

    // const renderPage = () => {
    //     switch (selectRadio) {
    //         case "taskManager":
    //             return <PlatformTaskManager />;
    //         case "adminRanking":
    //             return <PlatformAdminRating />;
    //         default:
    //             return null;
    //     }
    // };

    return (
        <>
            {/* <div className={cls.filters}>
                {studentsPage.map(item => (
                    <div key={item.name} className={cls.filters__item}>
                        <Button
                            onClickBtn={() => navigate(item.name)}
                        // active
                        // checked={selectRadio === item.name}
                        // name="studentsRadio"
                        // value={item.name}
                        >
                            {item.label}
                        </Button>
                    </div>
                ))}
            </div> */}
            {/* {renderPage()} */}
            <Routes>
                {/* <Route path='taskManager' element={<PlatformTaskManager />} /> */}
                <Route path='taskManager' element={<NewTaskManager />} />
                <Route path='adminRanking' element={<PlatformAdminRating />} />
                <Route path='storyProfile/:storyId/:storyType' element={<TaskManagerProfile />} />
                <Route index element={<Navigate to={"taskManager"} />} />
            </Routes>
            <Outlet />
        </>
    );
};

export default PlatformAdminItem;
