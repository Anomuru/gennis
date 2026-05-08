import { configureStore } from "@reduxjs/toolkit";

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
import taskManager from "slices/taskManagerSlice";
import accountantSlice from "slices/accountantSlice";
import { slice } from "../pages/webSite/test/register";
import assistantSlice from "../slices/assistantSlice";
import blockTestSlice from "../slices/blockTestSlice";
import otchotSlice from "../slices/otchotSlice";
import billSlice from "../slices/billSlice";
import schoolProfile from "slices/schoolProfileSlice";
import schools from "slices/schoolsSlice";
import schoolTeacherProfile from "slices/schoolTeacherProfileSlice";
import parentSlice from "slices/parentSectionSlice"
import adminRatingSlice from "slices/adminRatingSlice";
import currentFilterSlice from "slices/currentFilterSlice";
import teacherEquipmentsSlice from "slices/teacherEquipmentsSlice";
import newAccountingSlice from "pages/platformContent/platformAccounting2.0/model/accountingSlice"
import groupsAttendanceSlice from "slices/groupsAttendanceSlice";
import accountingProfileSlice from "slices/accountingProfileSlice";
import todoistSlice from "slices/todoistSlice";
import taskManagerModalSlice from "slices/taskManagerModalSlice";
import chatsSlice from "slices/chatsSlice";

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
        capitalCategory,
        slice,
        blockTestSlice,
        taskManager,
        accountantSlice,
        otchotSlice,
        billSlice,
        schoolProfile,
        schools,
        schoolTeacherProfile,
        parentSlice,
        adminRatingSlice,
        currentFilterSlice,
        groupsAttendanceSlice,
        teacherEquipmentsSlice,
        newAccountingSlice,
        accountingProfileSlice,
        todoistSlice,
        taskManagerModalSlice,
        assistantSlice,
        chatsSlice
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            stringMiddlewere
        ),
    devTools: process.env.NODE_ENV !== "production",
})

export default store