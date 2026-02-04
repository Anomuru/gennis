import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import classNames from "classnames"

import Input from "components/platform/platformUI/input"
import { fetchAccountingProfileData } from "slices/accountingProfileSlice"
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall"
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader"

import styles from "./accountingProfileOverall.module.sass"

const overheadItems = [
    { id: 1, category: "Kommunal Xarajatlar", items: 3, total: 5000000 },
    { id: 2, category: "Sodir Tutar Xarajatlar", items: 3, total: 2300000 },
    { id: 3, category: "Ixcham va Asboblar", items: 2, total: 1800000 },
    { id: 4, category: "Transport", items: 2, total: 3500000 },
    { id: 5, category: "Boshqa Xarajatlar", items: 1, total: 1200000 },
]

const AccountingProfileOverall = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { locationId, date } = useParams()

    const { loading, data } = useSelector(state => state.accountingProfileSlice)

    const [currentMonth, setCurrentMonth] = useState(null)

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

    useEffect(() => {
        if (date)
            setCurrentMonth(date)
    }, [date])

    useEffect(() => {
        if (currentMonth && locationId) {
            const [year, month] = currentMonth.split("-")
            dispatch(fetchAccountingProfileData({
                URL_TYPE: "overhead", locationId, year, month
            }))
        }
    }, [currentMonth])

    function sortSalary(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return [];
        }

        return [...data].sort((a, b) => {
            const aVal = a?.item_sum ?? 0;
            const bVal = b?.item_sum ?? 0;

            return bVal - aVal; // сортировка по убыванию
        });
    }

    const render = () => {
        return sortSalary(data?.overhead_list)?.map((item, index) => {
            return (
                <tr key={item.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{item.item_name}</td>
                    <td className={`${styles.tableCell} ${styles.tableCellCenter} ${styles.tableCellMuted}`}>
                        {item.payment_type}
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellRight} ${styles.tableCellBold}`}>
                        {formatCurrency(item.item_sum)}
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
                        <span className={styles.breadcrumbItem}>Qo'shimcha Xarajatlar</span>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbItemActive}>Umumiy Xarajat</span>
                    </div>
                </div>
            </nav>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Umumiy Xarajatlar Ma'lumoti</h1>
                        {/* <p className={styles.subtitle}>Final Summary and Overview</p> */}
                    </div>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        Orqaga
                    </button>
                </div>

                <div className={styles.cardsGrid}>
                    <div className={`${styles.card} ${styles.cardPrimary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Umumiy Xarajat</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : formatCurrency(data?.total_arenda + data?.total_gaz + data?.total_suv + data?.total_svet + data?.total_other)
                                }
                            </p>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardSecondary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Arenda</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : formatCurrency(data?.total_arenda)
                                }
                            </p>
                        </div>
                    </div>
                    <div className={`${styles.card} ${styles.cardSecondary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Gaz</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : formatCurrency(data?.total_gaz)
                                }
                            </p>
                        </div>
                    </div>
                    <div className={`${styles.card} ${styles.cardSecondary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Suv</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : formatCurrency(data?.total_suv)
                                }
                            </p>
                        </div>
                    </div>
                    <div className={`${styles.card} ${styles.cardSecondary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Svet</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : formatCurrency(data?.total_svet)
                                }
                            </p>
                        </div>
                    </div>
                    <div className={`${styles.card} ${styles.cardSecondary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Boshqa Xarajatlar</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : formatCurrency(data?.total_other)
                                }
                            </p>
                        </div>
                    </div>

                    {/* <div className={`${styles.card} ${styles.cardTertiary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Kategoriya Soni</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>{ }</p>
                        </div>
                    </div> */}
                </div>

                {/* <div className={styles.sortCard}>
                    <div className={styles.sortHeader}>
                        <h3 className={styles.sortTitle}>Xarajatlarni Saralash</h3>
                        <div className={styles.sortButtons}>
                            <button
                                onClick={() => setSortBy("name")}
                                className={`${styles.sortBtn} ${sortBy === "name" ? styles.sortBtnActive : ""}`}
                            >
                                Nomi bo'yicha
                            </button>
                            <button
                                onClick={() => setSortBy("total")}
                                className={`${styles.sortBtn} ${sortBy === "total" ? styles.sortBtnActive : ""}`}
                            >
                                Summasi bo'yicha
                            </button>
                        </div>
                    </div>
                </div> */}

                <div className={styles.filterSection}>
                    <div className={styles.filterHeader}>
                        <h3 className={styles.filterTitle}>Filtrlash</h3>
                    </div>
                    <div className={styles.filterButtons}>
                        <Input
                            clazzLabel={styles.filterButtons__input}
                            onChange={setCurrentMonth}
                            value={currentMonth}
                            // defaultValue={`${getCurrentYear}-${getCurrentMonth}`}
                            type={"month"}
                        />
                    </div>
                </div>

                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <h3 className={styles.tableTitle}>Xarajat Kategoriyalari</h3>
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
                                        <thead className={styles.table__head}>
                                            <tr className={styles.tableHeaderRow}>
                                                <th className={styles.tableHeaderCell}>Xarajat nomi</th>
                                                <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellCenter}`}>To'lov turi</th>
                                                <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Umumiy Xarajat</th>
                                                {/* <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Foiz</th> */}
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

                <div className={styles.footerButtons}>
                    <button onClick={() => navigate("../../")} className={styles.homeBtn}>
                        Bosh Sahifaga
                    </button>
                </div>
            </div>
        </main>
    )
}

export default AccountingProfileOverall