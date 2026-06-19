import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import Input from "components/platform/platformUI/input"
import { fetchDiscountsData } from "slices/accountingProfileSlice"
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader"
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall"

import styles from "./accountingProfileDiscounts.module.sass"

const AccountingProfileDiscounts = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { locationId } = useParams()

    const { discountsData, discountsLoading } = useSelector(state => state.accountingProfileSlice)

    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        return `${year}-${month}`
    })

    useEffect(() => {
        if (currentMonth && locationId) {
            const [year, month] = currentMonth.split("-")
            dispatch(fetchDiscountsData({ locationId, year, month }))
        }
    }, [currentMonth, locationId])

    const formatCurrency = (amount) => {
        if (typeof amount === "number") {
            return `${new Intl.NumberFormat("uz-UZ").format(amount)} UZS`
        }
        return "0 UZS"
    }

    const renderAttendanceRows = () => {
        return discountsData?.attendance_discounts?.map((item) =>
            item.groups?.map((group, gi) => (
                <tr key={`${item.id}-${gi}`} className={styles.tableRow}>
                    {gi === 0 && (
                        <td className={styles.tableCell} rowSpan={item.groups.length}>
                            {item.student_name}
                        </td>
                    )}
                    <td className={styles.tableCell}>{group.group_name}</td>
                    <td className={styles.tableCell}>{group.subject_name}</td>
                    <td className={`${styles.tableCell} ${styles.tableCellRight}`}>
                        {group.scored_days}
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellRight} ${styles.tableCellBold}`}>
                        {formatCurrency(group.total_discount)}
                    </td>
                </tr>
            ))
        )
    }

    const renderManualRows = () => {
        return discountsData?.manual_discounts?.map((item) =>
            item.discounts?.map((d, di) => (
                <tr key={`${item.id}-${di}`} className={styles.tableRow}>
                    {di === 0 && (
                        <td className={styles.tableCell} rowSpan={item.discounts.length}>
                            {item.student_name}
                        </td>
                    )}
                    <td className={`${styles.tableCell} ${styles.tableCellRight} ${styles.tableCellBold}`}>
                        {formatCurrency(d.amount)}
                    </td>
                    <td className={styles.tableCell}>{d.calendar_day}-kun</td>
                </tr>
            ))
        )
    }

    return (
        <main className={styles.container}>
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <div className={styles.breadcrumb}>
                        <span className={styles.breadcrumbItem}>Moliya Boshqarma</span>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbItemActive}>Chegirmalar</span>
                    </div>
                </div>
            </nav>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Chegirmalar</h1>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>Orqaga</button>
                </div>

                <div className={styles.cardsGrid}>
                    <div className={`${styles.card} ${styles.cardAccent}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Umumiy Chegirma</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {discountsLoading ? <DefaultLoaderSmall /> : formatCurrency(discountsData?.total_discount)}
                            </p>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardPrimary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Davomat chegirmasi</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {discountsLoading ? <DefaultLoaderSmall /> : formatCurrency(discountsData?.total_attendance_discount)}
                            </p>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardSecondary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Bir martalik chegirma</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {discountsLoading ? <DefaultLoaderSmall /> : formatCurrency(discountsData?.total_manual_discount)}
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
                        <h3 className={styles.tableTitle}>Davomat Chegirmalari</h3>
                    </div>
                    <div className={`${styles.tableContent} ${discountsLoading ? styles.loading : ""}`}>
                        {discountsLoading
                            ? <DefaultLoader />
                            : <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead className={styles.table__head}>
                                        <tr className={styles.tableHeaderRow}>
                                            <th className={styles.tableHeaderCell}>O'quvchi</th>
                                            <th className={styles.tableHeaderCell}>Guruh</th>
                                            <th className={styles.tableHeaderCell}>Fan</th>
                                            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Kun</th>
                                            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Chegirma</th>
                                        </tr>
                                    </thead>
                                    <tbody>{renderAttendanceRows()}</tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>

                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <h3 className={styles.tableTitle}>Bir martalik chegirmalar</h3>
                    </div>
                    <div className={`${styles.tableContent} ${discountsLoading ? styles.loading : ""}`}>
                        {discountsLoading
                            ? <DefaultLoader />
                            : <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead className={styles.table__head}>
                                        <tr className={styles.tableHeaderRow}>
                                            <th className={styles.tableHeaderCell}>O'quvchi</th>
                                            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Miqdor</th>
                                            <th className={styles.tableHeaderCell}>Sana</th>
                                        </tr>
                                    </thead>
                                    <tbody>{renderManualRows()}</tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AccountingProfileDiscounts
