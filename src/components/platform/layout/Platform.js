import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import PlatformHeader from "components/platform/platformHeader/platformHeader";
import PlatformMenuBar from "components/platform/platformMenuBar/platformMenuBar";
import PlatformMessage from "components/platform/platformMessage";
import { TaskManagerModal } from "pages/platformContent/platformTaskManager/taskManagerModal/taskManagerModal";


const Platform = () => {
    const [menuActive, setMenuActive] = useState(false)


    const checkerClickOnMenu = (e) => {
        if (e.target.classList.contains('overlay')) {
            setMenuActive(false)
        }
    }

    return (
        <>
            <PlatformHeader setMenuActive={setMenuActive} menuActive={menuActive} />
            <div className="wrapper" onClick={checkerClickOnMenu}>
                <PlatformMenuBar setMenuActive={setMenuActive} menuActive={menuActive} />
                <Outlet />
            </div>
            <PlatformMessage />
            <TaskManagerModal />
        </>
    )
}




export default Platform;