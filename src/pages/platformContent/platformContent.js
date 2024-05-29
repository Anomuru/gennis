import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import React, {Suspense, useEffect} from "react";
import "./platformContent.sass"
import {Navigate, Route, Routes} from "react-router-dom";
import {fetchNewStudents} from "slices/newStudentsSlice";
import {fetchFilters} from "slices/filtersSlice";
import {setSelectedLocation} from "slices/meSlice";
import {useDispatch, useSelector} from "react-redux";
import PlatformBooks from "pages/platformContent/platformBooks/platformBooks";
import BooksProfile from "pages/platformContent/platformBooks/profileBooks/booksProfile";
import {fetchLocations} from "slices/locationsSlice";
import RegisterUser from "components/register/registerUser/registerUser";
import PlatformTeachersRating from "pages/platformContent/platformTeachersRating/platformTeachersRating";
import TeacherDebtStudents from "pages/platformContent/platformTeacherDebtStudents/TeacherDebtStudents";
import WebSite from "pages/webSite";
import PlatformCapital from "pages/platformContent/platformCapital/PlatformCapital";





const PlatformHome =  React.lazy(() => import('./platformHome/platformHome'));
const PlatformNewStudents =  React.lazy(() => import('./platformNewStudents/platformNewStudents'));
const PlatformTeachers =  React.lazy(() => import('./platformCurrentLocTeachers/platformTeachers'));
const PlatformAllTeachers =  React.lazy(() => import('./platformAllTeachers/platformAllTeachers'));
const PlatformStudyingStudents =  React.lazy(() => import('./platformStudyingStudents/platformStudyingStudents'));
const PlatformEmployees =  React.lazy(() => import('./platformEmployees/platformEmployees'));
const PlatformAccounting =  React.lazy(() => import('./platformAccounting/platformAccounting'));
const PlatformEmployeeSalary =  React.lazy(() => import('pages/platformContent/employeeSalary/employeeSalaryList'));
const PlatformEmployeeMonthSalary =  React.lazy(() => import('pages/platformContent/employeeSalary/locationMonths/locationMonths'));
const PlatformUserProfile =  React.lazy(() => import('./platformUser/platformUserProfile/platformUserProfile'));
const PlatformUserPayment =  React.lazy(() => import('pages/platformContent/platformUser/studentPayment/studentPayment'));
const PlatformUserMeProfile =  React.lazy(() => import('./platformMe/platformMeProfile/platformMeProfile'));
const PlatformUserProfileChange =  React.lazy(() => import('./platformUser/platformUserChange/platformUserChange'));
const PlatformUserProfileChangePhoto =  React.lazy(() => import('./platformUser/platformUserChange/photo/photo'));
const PlatformGroups =  React.lazy(() => import('./platformGroupsToAdmins/platformGroupsToAdmins'));
const PlatformMyGroups =  React.lazy(() => import('./platformGroupsToUsers/platformGroupsToUsers'));
const PlatformStudentAttendance =  React.lazy(() => import('./platformUser/studentAttendance/studentAttendance'));
const PlatformStudentBallHistory =  React.lazy(() => import('./platformUser/studentBallHistory/studentBallHistory'));
const PlatformStudentGroupHistory =  React.lazy(() => import('./platformUser/studentGroupsHistroy/studentGroupHistory'));
const PlatformStudentAccount =  React.lazy(() => import('./platformUser/studentAccount/studentAccount'));
const PlatformStudentGroupsAttendances =  React.lazy(() => import('./platformUser/studentGroupsAttendance/studentGroupsAttendance'));
const PlatformCollection =  React.lazy(() => import('./platformAccounting/collection/collection'));
const PlatformHistoryAccounting =  React.lazy(() => import('./platformAccounting/historyAccounting/historyAccounting'));
const PlatformDeletedGroupStudents =  React.lazy(() => import('./platformDeletedGroupStudents/platformDeletedGroupsStudents'));
const PlatformCreateGroup =  React.lazy(() => import('./platformCreateGroup/platformCreateGroup'));
const PlatformAddGroup =  React.lazy(() => import('./platformAddGroup/platformAddGroup'));
const PlatformTimeTable =  React.lazy(() => import('pages/platformContent/platformTimeTable/day'));
const PlatformRoomTimeTable =  React.lazy(() => import('pages/platformContent/platformTimeTable/room'));
const PlatformGroupTime =  React.lazy(() => import('pages/platformContent/platformTimeTable/group'));

const PlatformRooms =  React.lazy(() => import('./platformRooms/platformRooms'));
const PlatformInsideRoom =  React.lazy(() => import('./platformRooms/roomInside/roomInside'));
const PlatformDeveloperTools =  React.lazy(() => import('./platformDeveloperTools/platformDeveloperTools'));
const PlatformCreateConstant =  React.lazy(() => import('./platformDeveloperTools/createConstant/createConstant'));
const PlatformChangeConstant =  React.lazy(() => import('./platformDeveloperTools/changeConstant/changeConstant'));
// const PlatformSurvey =  React.lazy(() => import('./platformSurvey/platformSurvey'));


const PlatformGroupInside =  React.lazy(() => import('./platformGroupsInside/platformGroupInside'));
const PlatformMakeAttendance =  React.lazy(() => import('./platformGroupsInside/makeAttendance/makeAttendance'));
const PlatformListAttendance =  React.lazy(() => import('./platformGroupsInside/listAttendance/listAttendance'));
const PlatformChangeGroupInfo =  React.lazy(() => import('./platformGroupsInside/changeGroupInfo/changeGroupInfo'));
const PlatformChangeGroupTime =  React.lazy(() => import('./platformGroupsInside/changeGroupTime/changeGroupTime'));
const PlatformChangeGroupTeacher =  React.lazy(() => import('./platformGroupsInside/changeGroupTeacher/changeGroupTeacher'));
const PlatformChangeGroupStudents =  React.lazy(() => import('./platformGroupsInside/changeGroupStudents/changeGroupStudents'));
const PlatformAddToGroup=  React.lazy(() => import('./platformGroupsInside/addToGroup/addToGroup'));
const PlatformMoveToGroup=  React.lazy(() => import('./platformGroupsInside/moveToGroup/moveToGroup'));
const PlatformQrCode =  React.lazy(() => import('./qrCode/qrCodeStudents/qrCodeStudents'));
const PlatformWebsiteEdit =  React.lazy(() => import('./platformWebsiteEdit/platformWebsiteEdit'));
const PlatformLead =  React.lazy(() => import('./platformLead/PlatformLead'));




const PlatformContent = () => {

    const dispatch = useDispatch()
    const {locations} = useSelector(state => state.locations)


    useEffect(() => {
        dispatch(fetchLocations())
    },[])



    return (
        <div className="content" >
            <Suspense fallback={<DefaultLoader/>} >
                <Routes>
                    <Route path="home" element={<PlatformHome/>}/>
                    {/*<Route path="registerStudent/*" element={<RegisterUser/>}/>*/}
                    <Route path="profile/:userId/*" element={<PlatformUserProfile/>}/>
                    <Route path="me/:userId" element={<PlatformUserMeProfile/>}/>
                    <Route path="changeInfo/:userId/:userRole" element={<PlatformUserProfileChange/>}/>
                    <Route path="changePhoto/:userId/:userRole" element={<PlatformUserProfileChangePhoto/>}/>
                    <Route path="studentPayment/:userId/:role/*" element={<PlatformUserPayment/>}/>

                    {/*<Route path="newStudents/:locationId" element={<PlatformNewStudents/>}/>*/}
                    {/*<Route path="studyingStudents/:locationId" element={<PlatformStudyingStudents/>}/>*/}
                    {/*<Route path="employees/:locationId" element={<PlatformEmployees/>}/>*/}
                    {/*<Route path="teachers/:locationId" element={<PlatformTeachers/>}/>*/}

                    <Route path="newStudents/:locationId/*" element={<PlatformNewStudents/>} />

                    {/*<Route path="newStudents/:locationId" element={<PlatformNewStudents/>}>*/}
                    {/*    <Route path="profileBooks/:userId" element={<PlatformUserProfile/>}  />*/}
                    {/*</Route>*/}



                    <Route path="studyingStudents/:locationId/*" element={<PlatformStudyingStudents/>} />

                    <Route path="employees/:locationId/*" element={<PlatformEmployees/>} />

                    <Route path="teachers/:locationId/*" element={<PlatformTeachers/>} />
                    <Route path="timeTable/:locationId" element={<PlatformTimeTable/>} />
                    <Route path="roomTimeTable/:roomId" element={<PlatformRoomTimeTable/>} />


                    <Route path="allTeachers/*" element={<PlatformAllTeachers/>} />
                    <Route path="teachersRating/:locationId" element={<PlatformTeachersRating/>} />

                    <Route path="groups/:locationId/*" element={<PlatformGroups/>}/>
                    <Route path="myGroups/:userId" element={<PlatformMyGroups/>}/>


                    {/*<Route path="overheadBooks.js/:locationId" element={<PlatformAccounting/>}/>*/}
                    <Route path="accounting/:locationId/*" element={<PlatformAccounting/>} />

                    <Route path="employeeSalary/:userId/*" element={<PlatformEmployeeSalary/>} />
                    <Route path="employeeMonthSalary/:monthId/:userId" element={<PlatformEmployeeMonthSalary/>}/>
                    <Route path="teacherDebtStudents/:userId" element={<TeacherDebtStudents/>}/>



                    <Route path="collection/:locationId" element={<PlatformCollection/>}/>
                    <Route path="historyAccounting/:locationId" element={<PlatformHistoryAccounting/>}/>
                    <Route path="createGroup/:locationId" element={<PlatformCreateGroup/>}/>
                    <Route path="addGroup/:locationId/:groupId" element={<PlatformAddGroup/>}/>

                    <Route path="insideGroup/:groupId/*" element={<PlatformGroupInside/>}/>
                    <Route path="makeAttendance/:groupId/:teacherId" element={<PlatformMakeAttendance/>}/>
                    <Route path="listAttendance/:groupId" element={<PlatformListAttendance/>}/>
                    <Route path="changeGroupInfo/:groupId" element={<PlatformChangeGroupInfo/>}/>
                    <Route path="changeGroupTime/:groupId" element={<PlatformChangeGroupTime/>}/>
                    <Route path="changeGroupTeacher/:groupId" element={<PlatformChangeGroupTeacher/>}/>
                    <Route path="changeGroupStudents/:groupId/:locationId" element={<PlatformChangeGroupStudents/>}/>
                    <Route path="addToGroup/:groupId/:locationId" element={<PlatformAddToGroup/>}/>
                    <Route path="groupTime/:groupId" element={<PlatformGroupTime/>}/>
                    <Route path="moveToGroup/:oldGroupId/:newGroupId" element={<PlatformMoveToGroup/>}/>


                    <Route path="rooms/:locationId" element={<PlatformRooms/>}/>
                    <Route path="insideRoom/:roomId" element={<PlatformInsideRoom/>}/>
                    <Route path="developerTools" element={<PlatformDeveloperTools/>}/>
                    <Route path="qrCode" element={<PlatformQrCode/>}/>
                    <Route path="createConstant/:name" element={<PlatformCreateConstant/>}/>
                    <Route path="changeConstant/:name" element={<PlatformChangeConstant/>}/>
                    {/*<Route path="survey/:locationId" element={<PlatformSurveyLazy/>}/>*/}

                    <Route path="studentAttendance/:studentId/:month/:year/:groupId" element={<PlatformStudentAttendance/>}/>
                    <Route path="studentAccount/:studentId/:role" element={<PlatformStudentAccount/>}/>
                    <Route path="studentGroupsAttendance/:studentId/:role" element={<PlatformStudentGroupsAttendances/>}/>
                    <Route path="ballHistory/:userId/:role" element={<PlatformStudentBallHistory/>}/>
                    <Route path="groupHistory/:userId/:role" element={<PlatformStudentGroupHistory/>}/>

                    <Route path="deletedGroupStudent/:locationId/*" element={<PlatformDeletedGroupStudents/>}/>

                    {/*<Route path="webSiteEdit/*" element={<WebSite/>}/>*/}
                    <Route path="lead/:locationId" element={<PlatformLead/>}/>
                    <Route path="capital/:locationId/*" element={<PlatformCapital/>}/>

                    <Route
                        path="accounting/:locationId"
                        element={<Navigate to="studentsPayments" replace />}
                    />

                    <Route
                        path="books/*"
                        element={<PlatformBooks/>}
                    />


                    {/*<Route*/}
                    {/*    path="registerStudent"*/}
                    {/*    element={<Navigate to="step_1" replace />}*/}
                    {/*/>*/}



                    {/*<Route*/}
                    {/*    path="newStudents/:locationId"*/}
                    {/*    element={<Navigate to="list" replace />}*/}
                    {/*/>*/}

                </Routes>
            </Suspense>
        </div>
    )
}



export default PlatformContent
