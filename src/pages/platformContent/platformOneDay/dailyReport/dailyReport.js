import { useState, useEffect } from "react"
import { useHttp } from "hooks/http.hook"
import { useNavigate, useParams } from "react-router-dom"

import { BackUrl, headers } from "constants/global"
import Button from "components/platform/platformUI/button"
import Input from "components/platform/platformUI/input"
import Table from "components/platform/platformUI/table"

import cls from "./dailyReport.module.sass"
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader"

export const DailyReport = () => {

    const navigate = useNavigate()
    const { request } = useHttp()
    const { locationId } = useParams()
    const getCurrentYear = new Date().getFullYear()
    const getCurrentMonth = new Date().getMonth() + 1

    const [reportData, setReportData] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState(null)

    useEffect(() => {
        if (getCurrentYear && getCurrentMonth)
            setSelectedMonth(`${getCurrentYear}-${getCurrentMonth}`)
    }, [getCurrentYear, getCurrentMonth])

    useEffect(() => {
        if (locationId && selectedMonth) {
            setLoading(true)
            const [year, month] = selectedMonth.split("-")
            request(`${BackUrl}account/daily_datas/list/?location_id=${locationId}&month=${month}&year=${year}`, "GET", null, headers())
                .then(res => {
                    setLoading(false)
                    setReportData(res.reports_list)
                })
        }
    }, [selectedMonth, locationId])

    function sortSalary(data) {
        // if (!Array.isArray(data) || data.length === 0) {
        //     return [];
        // }

        return [...data].reverse();
    }

    const render = () => {
        if (reportData.length === 0) {
            return <h1 className={cls.items__none}>Bu Oyda Hisobotlar yo'q</h1>
        }
        return sortSalary(reportData).map(item => {
            const [year, month, day] = item.date.split("-")
            return (
                <div className={cls.item}>
                    <h2>
                        {day}
                    </h2>
                    <Table className={cls.item__table}>
                        <thead>
                            <tr>
                                <th>Yangi guruhlar</th>
                                <th>O'chirilgan guruhlar</th>
                                <th>To'lovlar soni</th>
                                <th>To'lovlar qiymati</th>
                                <th>Yangi o‘quvchilar</th>
                                <th>Guruhdan o'chirilgan o'quvchilar</th>
                                <th>Registratsiyadan o'chirilgan o'quvchilar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{item.groups.new}</td>
                                <td>{item.groups.deleted}</td>
                                <td>{item.payments.count}</td>
                                <td>{item.payments.sum}</td>
                                <td>{item.students.new}</td>
                                <td>{item.students.deleted_from_groups}</td>
                                <td>{item.students.deleted_registrations}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            )
        })
    }

    return (
        <div className={cls.dailyReport}>
            <div className={cls.dailyReport__header}>
                <div>
                    <h1>Kunlik Hisobotlar</h1>
                    <Input
                        type={"month"}
                        onChange={setSelectedMonth}
                        value={selectedMonth}
                    />
                </div>
                <Button
                    onClickBtn={() => navigate(-1)}
                >
                    Orqaga
                </Button>
            </div>
            <div className={cls.items}>
                {
                    loading
                        ? <DefaultLoader />
                        : render()
                }
            </div>
        </div>
    );
}
