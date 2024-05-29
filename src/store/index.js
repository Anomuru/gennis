import {configureStore} from "@reduxjs/toolkit";

import me from "slices/meSlice";
import message from "slices/messageSlice";
import website from "slices/webSiteSlice";
import newStudents from "slices/newStudentsSlice";
import studyingStudents from "slices/studyingStudentsSlice";
import teachers from "slices/teachersSlice";
import groups from "slices/groupsSlice";
import filters from "slices/filtersSlice";
import employees from "slices/employeesSlice";
import admins from "slices/adminsSlice";
import accounting from "slices/accountingSlice";
import usersProfile from "slices/usersProfileSlice";
import group from "slices/groupSlice";
import makeAttendanceSlice from "slices/makeAttendanceSlice";
import register from "slices/registerSlice";
import attendances from "slices/attendancesSlice";
import dataToChange from "slices/dataToChangeSlice";
import teacherSalary from "slices/teacherSalarySlice";
import studentAttendance from "slices/studentAttendanceSlice";
import studentAccount from "slices/studentAccountSlice";
import deletedGroupStudents from "slices/deletedGroupStudentsSlice";
import qrCode from "slices/qrCodeSlice";
import rooms from "slices/roomsSlice";
import books from "slices/booksSlice";
import locations from "slices/locationsSlice";
import ui from "slices/uiSlice";
import leads from "slices/leadsSlice";
import teacherInfo from "slices/teacherInfoSlice";
import capitalCategory from "slices/capitalCategorySlice";

const stringMiddlewere = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
}

const store = configureStore({
    reducer: {
        me,
        message,
        website,
        newStudents,
        teachers,
        groups,
        filters,
        studyingStudents,
        employees,
        admins,
        accounting,
        usersProfile,
        group,
        makeAttendanceSlice,
        register,
        attendances,
        dataToChange,
        teacherSalary,
        studentAttendance,
        studentAccount,
        deletedGroupStudents,
        qrCode,
        rooms,
        books,
        locations,
        ui,
        leads,
        teacherInfo,
        capitalCategory
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            stringMiddlewere
        ),
    devTools: process.env.NODE_ENV !== "production",
})

export default store