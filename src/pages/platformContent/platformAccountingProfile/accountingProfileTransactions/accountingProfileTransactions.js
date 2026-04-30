import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import classNames from "classnames"

import Input from "components/platform/platformUI/input"
import { fetchAccountingProfileData } from "slices/accountingProfileSlice"
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader"

import styles from "./accountingProfileTransactions.module.sass"
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall"

const AccountingProfileTransactions = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { locationId } = useParams()

    const { loading, data } = useSelector(state => state.accountingProfileSlice)
    const getCurrentYear = new Date().getFullYear()
    const getCurrentMonth = new Date().getMonth() + 1

    const [currentDate, setCurrentDate] = useState(null)

    useEffect(() => {
        if (getCurrentYear && getCurrentMonth)
            setCurrentDate(`${getCurrentYear}-${getCurrentMonth}`)
    }, [getCurrentYear, getCurrentMonth])

    useEffect(() => {
        if (currentDate && locationId) {
            const [year, month] = currentDate.split("-")
            dispatch(fetchAccountingProfileData({
                URL_TYPE: "branch_transaction", locationId, year, month
            }))
        }
    }, [currentDate, locationId])

    const formatCurrency = (amount) => {
        if (typeof amount === "number") {
            const formatted = new Intl.NumberFormat("uz-UZ", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);

            return `${formatted} UZS`
        }
        return "0 UZS"
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        return date.toLocaleDateString("uz-UZ", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        })
    }

    const render = () => {
        if (!data?.transactions || data.transactions.length === 0) {
            return (
                <tr>
                    <td colSpan="6" className={styles.emptyState}>
                        Ma'lumot topilmadi
                    </td>
                </tr>
            )
        }

        return data.transactions.map((transaction, index) => {
            return (
                <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}>{index + 1}</td>
                    <td className={styles.tableCell}>{formatDate(transaction.date)}</td>
                    <td className={styles.tableCell}>{transaction.description || "-"}</td>
                    <td className={`${styles.tableCell} ${styles.tableCellRight}`}>
                        {formatCurrency(transaction.income)}
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellRight}`}>
                        {formatCurrency(transaction.expense)}
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellRight} ${styles.tableCellBold}`}>
                        {formatCurrency(transaction.balance)}
                    </td>
                </tr>
            )
        })
    }

    return (
        <main className={styles.container}>
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <div className={styles.breadcrumb}>
                        <span className={styles.breadcrumbItem}>Moliya Boshqarma</span>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbItemActive}>Tranzaksiyalar</span>
                    </div>
                </div>
            </nav>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Filial Tranzaksiyalari</h1>
                    </div>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        Orqaga
                    </button>
                </div>

                <div className={styles.cardsGrid}>
                    <div className={`${styles.card} ${styles.cardPrimary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Umumiy Kirim</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : formatCurrency(data?.total_income)
                                }
                            </p>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardSecondary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Umumiy Chiqim</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : formatCurrency(data?.total_expense)
                                }
                            </p>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardTertiary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Balans</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : formatCurrency(data?.balance)
                                }
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
                            onChange={setCurrentDate}
                            value={currentDate}
                            type={"month"}
                        />
                    </div>
                </div>

                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <h3 className={styles.tableTitle}>Tranzaksiyalar Ro'yxati</h3>
                    </div>
                    <div
                        className={classNames(styles.tableContent, {
                            [styles.loading]: loading
                        })}
                    >
                        {
                            loading
                                ? <DefaultLoader />
                                : <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead className={styles.table__header}>
                                            <tr className={styles.tableHeaderRow}>
                                                <th className={styles.tableHeaderCell}>№</th>
                                                <th className={styles.tableHeaderCell}>Sana</th>
                                                <th className={styles.tableHeaderCell}>Tavsif</th>
                                                <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Kirim</th>
                                                <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Chiqim</th>
                                                <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Balans</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {render()}
                                        </tbody>
                                    </table>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AccountingProfileTransactions
