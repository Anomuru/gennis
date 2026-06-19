import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import Input from "components/platform/platformUI/input"
import { fetchAccountingProfileData } from "slices/accountingProfileSlice"
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader"
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall"

import styles from "./accountingProfileStudentsDebt.module.sass"

const AccountingProfileStudentsDebt = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { locationId } = useParams()

    const { loading, data } = useSelector(state => state.accountingProfileSlice)

    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        return `${year}-${month}`
    })

    useEffect(() => {
        if (currentMonth && locationId) {
            const [year, month] = currentMonth.split("-")
            dispatch(fetchAccountingProfileData({ URL_TYPE: "debtors", locationId, year, month }))
        }
    }, [currentMonth, locationId])

    const formatCurrency = (amount, key) => {
        if (typeof amount === "number") {
            return `${new Intl.NumberFormat("uz-UZ").format(amount)} UZS`
        }
        if (Array.isArray(amount)) {
            const sum = amount.reduce((acc, item) => {
                const value = item[key]
                return acc + (typeof value === "number" ? value : 0)
            }, 0)
            return `${new Intl.NumberFormat("uz-UZ").format(sum)} UZS`
        }
        return "0 UZS"
    }

    function processStudents(list) {
        if (!Array.isArray(list) || list.length === 0) return []
        return list
            .map(student => {
                const totalDebt = Array.isArray(student.groups)
                    ? student.groups.reduce((sum, g) => sum + (g?.total_debt ?? 0), 0)
                    : 0
                return { ...student, totalDebt }
            })
            .sort((a, b) => {
                if (a.totalDebt === 0 && b.totalDebt === 0) return 0
                if (a.totalDebt === 0) return 1
                if (b.totalDebt === 0) return -1
                return a.totalDebt - b.totalDebt
            })
    }

    const renderRows = () => {
        return processStudents(data?.student_list)?.map((item) => (
            <tr key={item.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                    {item.student_name}
                    {item.is_deleted ? " 🚫" : null}
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellRight}`}>
                    {formatCurrency(item.groups, "total_debt")}
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellRight}`}>
                    {formatCurrency(item.groups, "payment")}
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellRight} ${styles.tableCellBold}`}>
                    {formatCurrency(item.groups, "remaining_debt")}
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellCenter} ${styles.tableCellMuted}`}>
                    {formatCurrency(item.groups, "total_discount")}
                </td>
            </tr>
        ))
    }

    return (
        <main className={styles.container}>
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <div className={styles.breadcrumb}>
                        <span className={styles.breadcrumbItem}>Moliya Boshqarma</span>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbItemActive}>O'quvchilar Qarzdorligi</span>
                    </div>
                </div>
            </nav>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>O'quvchilar Qarzdorligi</h1>
                    </div>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>Orqaga</button>
                </div>

                <div className={styles.cardsGrid}>
                    <div className={`${styles.card} ${styles.cardPrimary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Hisoblangan to'lov</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {loading ? <DefaultLoaderSmall /> : formatCurrency(data?.total_debt)}
                            </p>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardSecondary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>To'langan</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {loading ? <DefaultLoaderSmall /> : formatCurrency(data?.payment)}
                            </p>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardTertiary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Qolgan</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {loading ? <DefaultLoaderSmall /> : formatCurrency(data?.remaining_debt)}
                            </p>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardDestructive}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Umumiy Qarzdorlar</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {loading
                                    ? <DefaultLoaderSmall />
                                    : `${data?.student_list?.length || 0} ( ${data?.student_list?.filter(i => i.is_deleted)?.length} 🚫 )`
                                }
                            </p>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardAccent}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Umumiy Chegirma</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {loading ? <DefaultLoaderSmall /> : formatCurrency(data?.total_discount)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.filterSection}>
                    <div className={styles.filterHeader}>
                        <h3 className={styles.filterTitle}>Filtrlash</h3>
                    </div>
                    <div className={styles.filterButtons}>
                        <Input
                            clazzLabel={styles.filterButtons__input}
                            onChange={setCurrentMonth}
                            value={currentMonth}
                            type={"month"}
                        />
                    </div>
                </div>

                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <h3 className={styles.tableTitle}>O'quvchi Qarzdorligi Jadavali</h3>
                    </div>
                    <div className={`${styles.tableContent} ${loading ? styles.loading : ""}`}>
                        {loading
                            ? <DefaultLoader />
                            : <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead className={styles.table__head}>
                                        <tr className={styles.tableHeaderRow}>
                                            <th className={styles.tableHeaderCell}>O'quvchi</th>
                                            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Hisoblangan to'lov</th>
                                            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>To'langan</th>
                                            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Qolgan</th>
                                            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellCenter}`}>Chegirma</th>
                                        </tr>
                                    </thead>
                                    <tbody>{renderRows()}</tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AccountingProfileStudentsDebt
