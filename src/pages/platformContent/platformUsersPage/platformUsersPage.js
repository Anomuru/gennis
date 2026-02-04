import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {PlatformAssistants} from "../platformAssistents/platformAssistents";
import cls from "./platformUsersPage.module.sass";
import Radio from "components/platform/platformUI/radio/radio";
import PlatformEmployees from "pages/platformContent/platformEmployees/platformEmployees";
import PlatformTeachers from "pages/platformContent/platformCurrentLocTeachers/platformTeachers";
import PlatformParentsList from "pages/platformContent/platformParentsList/platformParentsList";

const studentsPage = [
    {
        name: "teachers",
        label: "O'qituvchilar",
    },
    {
        name: "workers",
        label: "Ishchilar",
    },
    {
        name: "parents",
        label: "Ota-onalar",
    },
    {
        name: "assistant",
        label: "Asistentlar",
    },
];

const PlatformUsersPage = () => {
    const location = useLocation(); // 👈
    const [selectRadio, setSelectRadio] = useState(
        localStorage.getItem("selectedUserTab") || studentsPage[0].name
    );


    useEffect(() => {
        localStorage.setItem("selectedUserTab", selectRadio);
    }, [selectRadio]);

    const renderPage = () => {
        switch (selectRadio) {
            case "workers":
                return <PlatformEmployees/>;
            case "teachers":
                return <PlatformTeachers/>;
            case "parents":
                return <PlatformParentsList/>;
            case "assistant" :
                return <PlatformAssistants/>
            default:
                return null;
        }
    };

    const isProfilePage = location.pathname.includes("profile");

    return (
        <>
            {!isProfilePage && (
                <div className={cls.filters}>
                    {studentsPage.map((item) => (
                        <div className={cls.filters__item} key={item.name}>
                            <Radio
                                onChange={setSelectRadio}
                                checked={selectRadio === item.name}
                                name="studentsRadio"
                                value={item.name}
                            >
                                {item.label}
                            </Radio>
                        </div>
                    ))}
                </div>
            )}
            {renderPage()}
        </>
    );
};

export default PlatformUsersPage;
