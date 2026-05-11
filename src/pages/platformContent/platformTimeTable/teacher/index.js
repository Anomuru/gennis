import React, {useEffect, useState} from 'react';
import TeacherTimeTable from "components/platform/platformUI/tables/timeTable/teacher/index";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {useParams} from "react-router-dom";
import "./style.sass";

const Index = () => {

    const {locationId} = useParams();
    const teacherId = localStorage.getItem("teacher_id");

    const [transformedData, setTransformedData] = useState({ days: [], data: [] });

    const {request} = useHttp();

    useEffect(() => {
        if (!teacherId || !locationId) return;

        const fetchData = async () => {
            try {
                const res = await request(
                    `${BackUrl}time_table/teacher_time_table/${teacherId}/weekly-schedule?location_id=${locationId}`,
                    "GET",
                    null,
                    headers()
                );

                console.log("Teacher Time Table API Response:", res);

                const weeklySchedule =
                    res?.weekly_schedule || res?.data?.weekly_schedule || [];

                if (weeklySchedule.length > 0) {
                    const days = weeklySchedule.map(day => ({
                        name: day.week_name,
                        id: day.week_id,
                        order: day.week_order
                    }));

                    const groupsMap = {};

                    weeklySchedule.forEach((day, dayIndex) => {
                        day.lessons.forEach(lesson => {
                            const groupId = lesson.group.id;

                            if (!groupsMap[groupId]) {
                                groupsMap[groupId] = {
                                    name: lesson.group.name,
                                    lessonsMap: {}
                                };
                            }

                            groupsMap[groupId].lessonsMap[dayIndex] = (
                                <div>
                                <span>
                                    {lesson.start_time} - {lesson.end_time}
                                </span>
                                    <br />
                                    <span>
                                    ({lesson.room.name})
                                </span>
                                </div>
                            );
                        });
                    });

                    const tableData = Object.values(groupsMap).map(group => ({
                        name: group.name,
                        lessons: days.map(
                            (_, dayIndex) =>
                                group.lessonsMap[dayIndex] || "-"
                        )
                    }));

                    setTransformedData({
                        days,
                        data: tableData
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{padding: "2rem", width: "100%", overflowX: "auto"}}>
            <h2>O'qituvchi Dars Jadvali</h2>
            <br/>
            <TeacherTimeTable 
                data={transformedData.data} 
                days={transformedData.days} 
            />
        </div>
    );
};

export default Index;
