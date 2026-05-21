import PlatformNewStudents from "pages/platformContent/platformNewStudents/platformNewStudents";
import Radio from "components/platform/platformUI/radio/radio";
import { useEffect, useState } from "react";
import PlatformStudyingStudents from "pages/platformContent/platformStudyingStudents/platformStudyingStudents";
import PlatformDeletedGroupsStudents from "pages/platformContent/platformDeletedGroupStudents/platformDeletedGroupsStudents";
import { useLocation } from "react-router-dom";
import cls from "pages/platformContent/platformUsersPage/platformUsersPage.module.sass";
import { PlatformStudentsAttendance } from "../platformStudentsAttendance/platformStudentsAttendance";
import PlatformEmployees from "../platformEmployees/platformEmployees";
import PlatformTeachers from "../platformCurrentLocTeachers/platformTeachers";
import PlatformParentsList from "../platformParentsList/platformParentsList";
import { PlatformAssistants } from "../platformAssistents/platformAssistents";
import Button from "../../../components/platform/platformUI/button";
import { useNavigate } from "react-router-dom";
import PlatformGroupsToAdmins from "../platformGroupsToAdmins/platformGroupsToAdmins";

const studentsPage = [
    {
        name: "newStudents",
        label: "New students",
    },
    {
        name: "studyingStudents",
        label: "Studying students",
    },
    {
        name: "deletedStudents",
        label: "Deleted students",
    },
    {
        name: "attendance",
        label: "Davomat",
    },
];

const teacherPage = [
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

const PlatformStudentsPage = () => {
    const location = useLocation();
    const navigate = useNavigate()

    // active tab
    const [selectedTab, setSelectedTab] = useState(
        localStorage.getItem("selectedTab") || "student"
    );

    // students radio
    const [studentRadio, setStudentRadio] = useState(
        localStorage.getItem("studentRadio") ||
        "newStudents"
    );

    // workers radio
    const [workerRadio, setWorkerRadio] = useState(
        localStorage.getItem("workerRadio") ||
        "teachers"
    );

    // current active radio
    const selectRadio =
        selectedTab === "student"
            ? studentRadio
            : workerRadio;

    // save tab
    useEffect(() => {
        localStorage.setItem(
            "selectedTab",
            selectedTab
        );
    }, [selectedTab]);

    // save student radio
    useEffect(() => {
        localStorage.setItem(
            "studentRadio",
            studentRadio
        );
    }, [studentRadio]);

    // save worker radio
    useEffect(() => {
        localStorage.setItem(
            "workerRadio",
            workerRadio
        );
    }, [workerRadio]);

    // radio change
    const handleRadioChange = (value) => {
        if (selectedTab === "student") {
            setStudentRadio(value);
        } else {
            setWorkerRadio(value);
        }
    };

    const renderPage = () => {
        switch (selectRadio) {
            case "newStudents":
                return <PlatformNewStudents />;

            case "studyingStudents":
                return (
                    <PlatformStudyingStudents />
                );

            case "deletedStudents":
                return (
                    <PlatformDeletedGroupsStudents />
                );

            case "attendance":
                return (
                    <PlatformStudentsAttendance />
                );

            case "workers":
                return <PlatformEmployees />;

            case "teachers":
                return <PlatformTeachers />;

            case "parents":
                return <PlatformParentsList />;

            case "assistant":
                return <PlatformAssistants />;
            default:
                return null;
        }
    };

    const isProfilePage =
        location.pathname.includes("profile");

    return (
        <>
            {!isProfilePage && (
                <>
                    <div  className={cls.filters}>
                        <Button
                            // onClickBtn={() => navigate("../groups/5/list")}
                            active={
                                selectedTab ===
                                "groups"
                            }
                            onClickBtn={() =>
                                setSelectedTab(
                                    "groups"
                                )
                            }
                        >
                            Guruhlar
                        </Button>
                        <Button
                            active={
                                selectedTab ===
                                "student"
                            }
                            onClickBtn={() =>
                                setSelectedTab(
                                    "student"
                                )
                            }
                        >
                            O'quvchilar
                        </Button>

                        <Button
                            active={
                                selectedTab ===
                                "workers"
                            }
                            onClickBtn={() =>
                                setSelectedTab(
                                    "workers"
                                )
                            }
                        >
                            Ishchilar
                        </Button>

                    </div>


                    {selectedTab === "groups" ? "" : <div className={cls.filters}>
                        {(selectedTab ===
                            "student"
                                ? studentsPage
                                : teacherPage
                        ).map((item) => (
                            <div
                                className={
                                    cls.filters__item
                                }
                                key={item.name}
                            >
                                <Radio
                                    onChange={
                                        handleRadioChange
                                    }
                                    checked={
                                        selectRadio ===
                                        item.name
                                    }
                                    name="studentsRadio"
                                    value={item.name}
                                >
                                    {item.label}
                                </Radio>
                            </div>
                        ))}
                    </div>}
                </>
            )}

            {selectedTab === "groups" ? <PlatformGroupsToAdmins/> : renderPage()}
        </>
    );
};

export default PlatformStudentsPage;