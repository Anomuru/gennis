
import { useMemo } from "react";
// export const ClassroomUrl = `https://classroom.gennis.uz"/`
//

// export const BackUrlForDoc = `http://26.196.249.247:5002/`
export const BackUrlForDoc = `http://26.253.30.50:5002/`
export const BackUrl = `${BackUrlForDoc}api/`

// export const ClassroomUrl = `http://localhost:3000/`
// export const ClassroomUrlForDoc = "http://26.12.122.72:5001/"
//
// export const BackUrl = "https://admin.gennis.uz/api/"
// export const BackUrlForDoc = "https://admin.gennis.uz"
//


// export const BackUrl = "/api/"
// export const BackUrlForDoc = "/"
export const ClassroomUrlForDoc = "https://classroom.gennis.uz/"

export const headers = () => {
    const token = sessionStorage.getItem("token")
    return {
        "Authorization": "Bearer " + token,
        'Content-Type': 'application/json'
    }
}


export const headersImg = () => {
    const token = sessionStorage.getItem("token")
    return {
        "Authorization": "Bearer " + token,
    }
}

export function formatDate(date) {
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

export const ROLES = {
    User: "a21b32c43",
    Admin: "b55a77c90",
    Director: "c56b13a36",
    Programmer: "r2313m23s",
    Teacher: "b00c11a31",
    Student: "a43c33b82",
    Smm: "a21b00q41",
    Editor: "n41c88z45",
    Accountant: "ak47a76m69",
    Zavxos: "z2vs2221"
}


export const requireMenuItems = (id) => {
    return [
        {
            to: "home",
            name: "Bosh sahifa",
            classIcon: "fa-home",
            location: true,
            children: true,
            roles: [ROLES.Admin, ROLES.User, ROLES.Director, ROLES.Programmer, ROLES.Teacher, ROLES.Student, ROLES.Editor, ROLES.Smm, ROLES.Accountant]
        },
        {
            to: "adminItem",
            name: "Task Manager",
            classIcon: "fa-tasks",
            location: true,
            children: true,
            roles: [ROLES.Admin, ROLES.Director]
        },
        // {
        //     to: "adminRating",
        //     name: "Admin rating",
        //     classIcon: "fa-chart-bar",
        //     roles: [ROLES.Director,ROLES.Admin]
        // },
        // {
        //     to : "blockTest",
        //     name: "Block test",
        //     classIcon: "fa-tasks",
        //     location: true,
        //     children: true,
        //     roles: [ROLES.Admin,ROLES.Director]
        // },
        // {
        //     to : "/registerStudent",
        //     name: "Registratsiya",
        //     classIcon: "fa-edit",
        //     roles: [ROLES.Admin,ROLES.Director,ROLES.Programmer]
        // },
        {
            to: "newRegister",
            name: "Registratsiya",
            classIcon: "fa-edit",
            roles: [ROLES.Admin, ROLES.Director, ROLES.Programmer]
        },

        // {
        //     to : "schools",
        //     name: "Maktablar",
        //     classIcon: "fa-school",
        //     location: true,
        //     children: true,
        //     roles: [ROLES.Admin,ROLES.Director,ROLES.Programmer]
        // },
        // {
        //     to: "registeredSchoolStudents",
        //     name: "Registered Students",
        //     classIcon: "fa-users",
        //     location: true,
        //     children: true,
        //     roles: [ROLES.Admin,ROLES.Director]
        // },
        {
            to: "myStudents",
            name: "My students",
            classIcon: "fa-users",
            location: true,
            children: true,
            roles: [ROLES.Teacher]
        },
        {
            to: "students",
            name: "Studenlar",
            classIcon: "fa fa-users",
            location: true,
            children: true,
            roles: [ROLES.Admin, ROLES.Director, ROLES.Programmer]
        },

        {
            to: "users",
            name: "Userlar",
            classIcon: "fa fa-users",
            location: true,
            children: true,
            roles: [ROLES.Admin, ROLES.Director, ROLES.Programmer]
        },
        // {
        //     to : "/registerTeacher",
        //     name: "O'qituvchi Registrarsiyasi",
        //     classIcon: "fa-pen-square",
        //     roles: [ROLES.Admin,ROLES.Director]
        // },
        // {
        //
        //     to : "/registerEmployee",
        //     name: "Ishchilar Registrarsiyasi",
        //     classIcon: "fa-address-book",
        //     roles: [ROLES.Admin,ROLES.Director]
        // },
        // {
        //     to: "/",
        //     name: "Website",
        //     classIcon: "fa-edit",
        //     roles: [ROLES.Smm, ROLES.Director]
        // },
        {
            to: "lead",
            name: "Lead",
            classIcon: "fa-phone-alt",
            location: true,
            children: true,
            roles: [ROLES.Admin, ROLES.Director]
        },
        {
            to: "centreInfo",
            name: "Centre info",
            classIcon: "fa-info",
            location: true,
            children: true,
            roles: [ROLES.Admin, ROLES.Director]
        },
        // {
        //     to : "newStudents",
        //     name : "Yangi oq'uvchilar",
        //     classIcon: "fa-user",
        //     location: true,
        //     children: true,
        //     roles: [ROLES.Admin,ROLES.Director,ROLES.Programmer]
        // },
        // {
        //     to : "deletedGroupStudent",
        //     name : "Ochirilgan oq'uvchilar",
        //     classIcon: "fa-user-alt-slash",
        //     location: true,
        //     children: true,
        //     roles: [ROLES.Admin,ROLES.Director,ROLES.Programmer]
        // },
        // {
        //     to : "studyingStudents",
        //     name : "O'qityotgan oq'uvchilar",
        //     classIcon: "fa-user-graduate",
        //     location: true,
        //     children: true,
        //
        //     roles: [ROLES.Admin,ROLES.Director,ROLES.Programmer]
        // },
        {
            to: "groups",
            name: "Guruhlar",
            classIcon: "fa-users",
            location: true,
            children: true,

            roles: [ROLES.Admin, ROLES.Director, ROLES.Programmer]
        },
        // {
        //     to : "teachers",
        //     name : "O'qituvchilar",
        //     classIcon: "fa-user-tie",
        //     location: true,
        //     children: true,
        //     // children : [
        //     //     {
        //     //         childId : 1,
        //     //         to : "1",
        //     //         childName: "Xo'jakent",
        //     //         iconClazz : "fa-map-marker-alt"
        //     //     },
        //     //     {
        //     //         childId : 2,
        //     //         to : "2",
        //     //         childName: "Gazalkent",
        //     //         iconClazz : "fa-map-marker-alt"
        //     //     },
        //     //     {
        //     //         childId : 3,
        //     //         to : "3",
        //     //         childName: "Chirchiq",
        //     //         iconClazz : "fa-map-marker-alt"
        //     //     },
        //     //     {
        //     //         childId : 4,
        //     //         to : "4",
        //     //         childName: "Sergeli",
        //     //         iconClazz : "fa-map-marker-alt"
        //     //     }
        //     // ],
        //     roles: [ROLES.Admin,ROLES.Director,ROLES.Programmer]
        // },
        // {
        //
        //     to : "teachers",
        //     name : "O'qituvchilar",
        //     classIcon: "fa-user-tie",
        //     roles: [ROLES.Admin,ROLES.Director,ROLES.Programmer]
        // },
        // {
        //
        //     to : "employees",
        //     location: true,
        //     name : "Ishchilar",
        //     classIcon: "fa-id-badge",
        //     children: true,
        //     // children : [
        //     //     {
        //     //         childId : 1,
        //     //         to : "1",
        //     //         childName: "Xo'jakent",
        //     //         iconClazz : "fa-map-marker-alt"
        //     //     },
        //     //     {
        //     //         childId : 2,
        //     //         to : "2",
        //     //         childName: "Gazalkent",
        //     //         iconClazz : "fa-map-marker-alt"
        //     //     },
        //     //     {
        //     //         childId : 3,
        //     //         to : "3",
        //     //         childName: "Chirchiq",
        //     //         iconClazz : "fa-map-marker-alt"
        //     //     },
        //     //     {
        //     //         childId : 4,
        //     //         to : "4",
        //     //         childName: "Sergeli",
        //     //         iconClazz : "fa-map-marker-alt"
        //     //     }
        //     // ],
        //     roles: [ROLES.Admin,ROLES.Director,ROLES.Programmer]
        // },
        {
            to: "accounting",
            name: "Buxgalteriya hisobi",
            classIcon: "fa-file-invoice-dollar",
            location: true,
            children: true,
            // children : [
            //     {
            //         childId : 1,
            //         to : "1",
            //         childName: "Xo'jakent",
            //         iconClazz : "fa-map-marker-alt"
            //     },
            //     {
            //         childId : 2,
            //         to : "2",
            //         childName: "Gazalkent",
            //         iconClazz : "fa-map-marker-alt"
            //     },
            //     {
            //         childId : 3,
            //         to : "3",
            //         childName: "Chirchiq",
            //         iconClazz : "fa-map-marker-alt"
            //     },
            //     {
            //         childId : 4,
            //         to : "4",
            //         childName: "Sergeli",
            //         iconClazz : "fa-map-marker-alt"
            //     }
            // ],
            roles: [ROLES.Admin, ROLES.Director, ROLES.Programmer, ROLES.Accountant]
        },
        // {
        //     to : "books",
        //     name : "Kitoblar",
        //     classIcon: "fa-book",
        //     roles: [ROLES.Admin,ROLES.Director,ROLES.Programmer,ROLES.Editor,ROLES.Teacher,ROLES.Student]
        // },
        // {
        //     to : "rooms",
        //     name : "Honalar",
        //     classIcon: "fa-door-closed",
        //     location: true,
        //     children: true,
        //     // children : [
        //     //     {
        //     //         childId : 1,
        //     //         to : "1",
        //     //         childName: "Xo'jakent",
        //     //         iconClazz : "fa-map-marker-alt"
        //     //     },
        //     //     {
        //     //         childId : 2,
        //     //         to : "2",
        //     //         childName: "Gazalkent",
        //     //         iconClazz : "fa-map-marker-alt"
        //     //     },
        //     //     {
        //     //         childId : 3,
        //     //         to : "3",
        //     //         childName: "Chirchiq",
        //     //         iconClazz : "fa-map-marker-alt"
        //     //     },
        //     //     {
        //     //         childId : 4,
        //     //         to : "4",
        //     //         childName: "Sergeli",
        //     //         iconClazz : "fa-map-marker-alt"
        //     //     }
        //     // ],
        //     roles: [ROLES.Admin,ROLES.Director,ROLES.Programmer]
        // },
        // {
        //     to : "survey",
        //     name : "So'rovnoma",
        //     classIcon: "fa-poll-h",
        //     location: true,
        //     children : [
        //         {
        //             childId : 1,
        //             to : "1",
        //             childName: "Xo'jakent",
        //             iconClazz : "fa-map-marker-alt"
        //         },
        //         {
        //             childId : 2,
        //             to : "2",
        //             childName: "Gazalkent",
        //             iconClazz : "fa-map-marker-alt"
        //         },
        //         {
        //             childId : 3,
        //             to : "3",
        //             childName: "Chirchiq",
        //             iconClazz : "fa-map-marker-alt"
        //         }
        //     ],
        //     roles: [ROLES.Admin,ROLES.Director,ROLES.Programmer]
        // },
        //{
        //    to: "developerTools",
        //    name: "Developer Toold",
        //    classIcon: "fa-laptop-code",
        //    roles: [ROLES.Director]
        //},
        {
            to: `myGroups/${id}`,
            name: "Mening Guruhlarim",
            classIcon: "fa-users",
            roles: [ROLES.Teacher, ROLES.Student],
            // location: true
        },
        // {
        //     to : `qrCode`,
        //     name : "Qr code",
        //     classIcon: "fa-qrcode",
        //     roles: [ROLES.Programmer,ROLES.Director,ROLES.Admin],
        //     // location: true
        // },
        // {
        //     to : "deletedStudents",
        //     name : "Ochirilgan oq'uvchilar",
        //     classIcon: "fa-user-alt-slash",
        //     roles: [ROLES.Admin]
        // },
        {
            to: "capitalsCategory",
            name: "Capital Category",
            classIcon: "fa-coins",
            location: true,
            children: true,
            roles: [ROLES.Admin, ROLES.Director, ROLES.Programmer, ROLES.Accountant]
        },
        {
            to: "teacherEquipments",
            name: "Zavxoz profil",
            classIcon: "fa-toolbox icon-link",
            location: true,
            children: true,
            roles: [ROLES.Admin, ROLES.Director, ROLES.Programmer, ROLES.Accountant, ROLES.Zavxos]
        },
        // {
        //     to : "staffs",
        //     name : "Staffs",
        //     classIcon: "fa-users",
        //     roles: [ROLES.Director,ROLES.Programmer,ROLES.Accountant]
        // },
        {
            to: "bookKeeping",
            name: "Dividend",
            classIcon: "fa-search-dollar",
            roles: [ROLES.Director, ROLES.Programmer, ROLES.Accountant]
        },
        {
            to: "accountantBill",
            name: "Bill",
            classIcon: "fa-dollar-sign",
            roles: [ROLES.Director, ROLES.Programmer, ROLES.Accountant]
        },
        // {
        //     to: "parentSection",
        //     name: "Ota-ona bo'limi",
        //     classIcon: "fa-dollar-sign",
        //     roles: [ROLES.Director,ROLES.Programmer,ROLES.Accountant]
        // },
        // {
        //     to: `parentsList`,
        //     name: "Ota-onalar ro'yxati",
        //     classIcon: "fa-users",
        //     location: true,
        //     children: true,
        //     roles: [ROLES.Director,ROLES.Programmer, ROLES.Accountant , ROLES.Admin]
        // }
    ]
}

export const DatesList = () => {
    const years = useMemo(() =>
        [
            {
                num: "2023"
            },
            {
                num: "2022"
            },
            {
                num: "2021"
            },
            {
                num: "2020"
            },
            {
                num: "2019"
            },
            {
                num: "2018"
            },
            {
                num: "2017"
            },
            {
                num: "2016"
            },
            {
                num: "2015"
            },
            {
                num: "2014"
            },
            {
                num: "2013"
            },
            {
                num: "2012"
            },
            {
                num: "2011"
            },
            {
                num: "2010"
            },
            {
                num: "2009"
            },
            {
                num: "2008"
            },
            {
                num: "2009"
            },
            {
                num: "2007"
            },
            {
                num: "2006"
            },
            {
                num: "2005"
            },
            {
                num: "2004"
            },
            {
                num: "2003"
            },
            {
                num: "2002"
            },
            {
                num: "2001"
            },
            {
                num: "2000"
            },
            {
                num: "1999"
            },
            {
                num: "1998"
            },
            {
                num: "1997"
            },
            {
                num: "1996"
            },
            {
                num: "1995"
            },
            {
                num: "1994"
            },
            {
                num: "1993"
            },
            {
                num: "1992"
            },
            {
                num: "1991"
            },
            {
                num: "1990"
            },
            {
                num: "1989"
            },
            {
                num: "1988"
            },
            {
                num: "1987"
            },
            {
                num: "1986"
            },
            {
                num: "1985"
            },
            {
                num: "1984"
            },
            {
                num: "1983"
            },
            {
                num: "1982"
            },
            {
                num: "1981"
            },
            {
                num: "1980"
            },
            {
                num: "1979"
            },
            {
                num: "1978"
            },
            {
                num: "1977"
            },
            {
                num: "1976"
            },
            {
                num: "1975"
            },
            {
                num: "1974"
            },
            {
                num: "1973"
            },
            {
                num: "1972"
            },
            {
                num: "1971"
            },
            {
                num: "1970"
            },
        ]
        , [])

    const days = useMemo(() =>
        [
            {
                num: "01"
            },
            {
                num: "02"
            },
            {
                num: "03"
            },
            {
                num: "04"
            },
            {
                num: "05"
            },
            {
                num: "06"
            },
            {
                num: "07"
            },
            {
                num: "08"
            },
            {
                num: "09"
            },
            {
                num: "10"
            },
            {
                num: "11"
            },
            {
                num: "12"
            },
            {
                num: "13"
            },
            {
                num: "14"
            },
            {
                num: "15"
            },
            {
                num: "16"
            },
            {
                num: "17"
            },
            {
                num: "18"
            },
            {
                num: "19"
            },
            {
                num: "20"
            },
            {
                num: "21"
            },
            {
                num: "22"
            },
            {
                num: "23"
            },
            {
                num: "24"
            },
            {
                num: "25"
            },
            {
                num: "26"
            },
            {
                num: "27"
            },
            {
                num: "28"
            },
            {
                num: "29"
            },
            {
                num: "30"
            },
            {
                num: "31"
            }
        ]
        , [])
    const months = useMemo(() =>
        [
            {
                num: "01"
            },
            {
                num: "02"
            },
            {
                num: "03"
            },
            {
                num: "04"
            },
            {
                num: "05"
            },
            {
                num: "06"
            },
            {
                num: "07"
            },
            {
                num: "08"
            },
            {
                num: "09"
            },
            {
                num: "10"
            },
            {
                num: "11"
            },
            {
                num: "12"
            }
        ]
        , [])


    return { days, months, years }
}
