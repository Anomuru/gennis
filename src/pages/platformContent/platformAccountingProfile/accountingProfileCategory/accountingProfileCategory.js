import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import classNames from "classnames"

import { fetchAccountingProfileData } from "slices/accountingProfileSlice"
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader"
import Input from "components/platform/platformUI/input"

import styles from "./accountingProfileCategory.module.sass"

const categories = [
    { id: 1, name: "Arenda", type: "arenda" },
    { id: 2, name: "Gaz", type: "gaz" },
    { id: 3, name: "Suv", type: "suv" },
    { id: 4, name: "Svet", type: "svet" },
    { id: 5, name: "Boshqa Xarajatlar", type: "other" },
]

const AccountingProfileCategory = () => {

    const navigate = useNavigate()
    const { categoryId, locationId, date } = useParams()
    const dispatch = useDispatch()

    const { loading, data } = useSelector(state => state.accountingProfileSlice)

    const [currentMonth, setCurrentMonth] = useState(null)
    const [sortData, setSortData] = useState([])

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

    useEffect(() => {
        if (!!data) {
            // setSortData(data.overhead_list.filter(item => item.))
            if (categoryId === "other") {
                setSortData(data.overhead_list?.filter(item => (
                    item.item_name !== "svet" &&
                    item.item_name !== "gaz" &&
                    item.item_name !== "suv" &&
                    item.item_name !== "arenda"
                )))
            } else setSortData(data.overhead_list?.filter(item => item.item_name === categoryId))
        }
    }, [data])

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
        return sortSalary(sortData)?.map((item, index) => {
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
                        <span className={styles.breadcrumbItemActive}>{categories.filter(item => item.type === categoryId)[0]?.name}</span>
                    </div>
                </div>
            </nav>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>{data.name}</h1>
                        {/* <p className={styles.subtitle}>Item Total Sum</p> */}
                    </div>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        Orqaga
                    </button>
                </div>

                <div className={styles.totalCard}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardLabel}>Umumiy Xarajat Summasi</h3>
                    </div>
                    <div className={styles.cardContent}>
                        <p className={styles.cardValue}>{formatCurrency(data[`total_${categoryId}`])}</p>
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
                            // defaultValue={`${getCurrentYear}-${getCurrentMonth}`}
                            type={"month"}
                        />
                    </div>
                </div>

                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <h3 className={styles.tableTitle}>Xarajat Tafsiloti</h3>
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

                {/* <button onClick={() => router.push("/category/overhead/overall")} className={styles.navButton}>
                    Umumiy Ma'lumotlarni Ko'rish
                </button> */}
            </div>
        </main>
    )
}

export default AccountingProfileCategory