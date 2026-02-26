import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import classNames from "classnames"

import Input from "components/platform/platformUI/input"
import { fetchAccountingProfileData } from "slices/accountingProfileSlice"
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader"

import styles from "./accountingProfileSalary.module.sass"
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall"

// https://admin.gennis.uz/api/account/home/salaries/?location_id=3&month=9&year=2025&type_salary=teacher

const moneyType = ["cash", "click", "bank"]

const AccountingProfileSalary = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { locationId } = useParams()

    const { loading, data } = useSelector(state => state.accountingProfileSlice)
    const getCurrentYear = new Date().getFullYear()
    const getCurrentMonth = new Date().getMonth() + 1

    const [salaryType, setSalaryType] = useState("cash")
    const [currentDate, setCurrentDate] = useState(null)
    const [activeCategory, setActiveCategory] = useState("teacher")


    useEffect(() => {
        if (getCurrentYear && getCurrentMonth)
            setCurrentDate(`${getCurrentYear}-${getCurrentMonth}`)
    }, [getCurrentYear, getCurrentMonth])

    useEffect(() => {
        if (currentDate && salaryType && locationId) {
            const [year, month] = currentDate.split("-")
            dispatch(fetchAccountingProfileData({
                URL_TYPE: "salaries", locationId, year, month, type_salary: activeCategory
            }))
        }
    }, [currentDate, salaryType, activeCategory])

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

    function sortSalary(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return [];
        }

        return [...data].sort((a, b) => {
            const getValue = (item) => {
                if (activeCategory === "teacher") return item?.teacher_salary ?? 0;
                if (activeCategory === "assistent") return item?.salary ?? item?.amount ?? 0;
                return item?.staff_salary ?? 0;
            }
            const aVal = getValue(a);
            const bVal = getValue(b);

            return bVal - aVal; // сортировка по убыванию
        });
    }


    const render = () => {
        return sortSalary(data?.salary_list)?.map((staff, index) => {
            return (
                <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}>{index + 1}</td>
                    <td className={styles.tableCell}>
                        {activeCategory === "teacher" ? staff.teacher_name : staff.staff_name || staff.assistent_name}
                        {staff.is_deleted ? " 🚫" : null}
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellRight}`}>{formatCurrency(
                        activeCategory === "teacher"
                            ? staff.teacher_salary
                            : activeCategory === "assistent"
                                ? (staff.assistent_salary || staff.amount)
                                : staff.staff_salary
                    )}</td>
                    <td className={`${styles.tableCell} ${styles.tableCellRight}`}>{formatCurrency(staff.taken_money)}</td>
                    <td className={`${styles.tableCell} ${styles.tableCellRight} ${styles.tableCellBold}`}>
                        {formatCurrency(staff.remaining_salary)}
                    </td>
                    {
                        activeCategory === "teacher" || activeCategory === "assistent"
                            ? <>
                                <td className={`${styles.tableCell} ${styles.tableCellRight}`}>{formatCurrency(staff.debt)}</td>
                                <td className={`${styles.tableCell} ${styles.tableCellRight}`}>{formatCurrency(staff.black_salary)}</td>
                                <td className={`${styles.tableCell} ${styles.tableCellRight}`}>{formatCurrency(staff.fine)}</td>
                            </>
                            : null
                    }
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
                        <span className={styles.breadcrumbItemActive}>Oyliklar</span>
                    </div>
                </div>
            </nav>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Oyliklar Boshqarma</h1>
                        {/* <p className={styles.subtitle}>Salary Management System</p> */}
                    </div>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        Orqaga
                    </button>
                </div>

                <div
                    className={classNames(styles.cardsGrid, {
                        [styles.teacher]: activeCategory === "teacher" || activeCategory === "assistent"
                    })}
                >
                    <div className={`${styles.card} ${styles.cardPrimary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Umumiy Oyliklar Summasi</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : formatCurrency(data?.total_salary)
                                }
                            </p>
                            {/* <p className={styles.cardDescription}>Total Monthly Salary</p> */}
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardSecondary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Umumiy Berilgan Oylik</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : formatCurrency(data?.taken_money)
                                }
                            </p>
                            {/* <p className={styles.cardDescription}>Total Paid Salary</p> */}
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.cardTertiary}`}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardLabel}>Umumiy Qolgan Oylik</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <p className={styles.cardValue}>
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : formatCurrency(data?.remaining_salary)
                                }
                            </p>
                            {/* <p className={styles.cardDescription}>Remaining Salary</p> */}
                        </div>
                    </div>

                    {
                        activeCategory === "teacher" || activeCategory === "assistent"
                            ? <>
                                <div className={`${styles.card} ${styles.cardDestructive}`}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardLabel}>Umumiy Qarzdorlik</h3>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <p className={styles.cardValue}>
                                            {
                                                loading
                                                    ? <DefaultLoaderSmall />
                                                    : formatCurrency(data?.debt)
                                            }
                                        </p>
                                        {/* <p className={styles.cardDescription}>Remaining Salary</p> */}
                                    </div>
                                </div>
                                <div className={`${styles.card} ${styles.cardPrimary}`}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardLabel}>Black</h3>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <p className={styles.cardValue}>
                                            {
                                                loading
                                                    ? <DefaultLoaderSmall />
                                                    : formatCurrency(data?.black_salary)
                                            }
                                        </p>
                                        {/* <p className={styles.cardDescription}>Remaining Salary</p> */}
                                    </div>
                                </div>
                                <div className={`${styles.card} ${styles.cardPrimary}`}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardLabel}>Umumiy Jariyma</h3>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <p className={styles.cardValue}>
                                            {
                                                loading
                                                    ? <DefaultLoaderSmall />
                                                    : formatCurrency(data?.fine)
                                            }
                                        </p>
                                        {/* <p className={styles.cardDescription}>Remaining Salary</p> */}
                                    </div>
                                </div>
                            </>
                            : null
                    }
                </div>

                <div className={styles.filterSection}>
                    <div className={styles.filterHeader}>
                        <h3 className={styles.filterTitle}>Filtrlash</h3>
                        <div className={styles.filterHeader__category}>
                            <span
                                onClick={() => setActiveCategory("teacher")}
                                className={classNames(styles.category, {
                                    [styles.active]: activeCategory === "teacher"
                                })}
                            >
                                O'qituvchilar
                            </span>
                            <span className={styles.category}>/</span>
                            <span
                                onClick={() => setActiveCategory("assistent")}
                                className={classNames(styles.category, {
                                    [styles.active]: activeCategory === "assistent"
                                })}
                            >
                                Asistentlar
                            </span>
                            <span className={styles.category}>/</span>
                            <span
                                onClick={() => setActiveCategory("staff")}
                                className={classNames(styles.category, {
                                    [styles.active]: activeCategory === "staff"
                                })}
                            >
                                Xodimlar
                            </span>
                        </div>
                    </div>
                    <div className={styles.filterButtons}>
                        {/* <div className={styles.filterButtons__btns}>
                            {
                                moneyType.map((item, index) => {
                                    return (
                                        <button
                                            key={"moneyType" + index}
                                            onClick={() => setSalaryType(item)}
                                            className={classNames(styles.filterBtn, {
                                                [styles.filterBtnActive]: salaryType === item
                                            })}
                                        >
                                            Cash
                                        </button>
                                    )
                                })
                            }
                        </div> */}
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
                        <h3 className={styles.tableTitle}>{activeCategory === "teacher" ? "O'qituvchilar" : activeCategory === "assistent" ? "Asistentlar" : "Xodimlar"}</h3>
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
                                                <th className={styles.tableHeaderCell}>Ism Familiya</th>
                                                <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Oylik</th>
                                                <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Berilgan</th>
                                                <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Qolgan</th>
                                                {
                                                    activeCategory === "teacher" || activeCategory === "assistent"
                                                        ? <>
                                                            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Qarzdorlik</th>
                                                            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Black</th>
                                                            <th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellRight}`}>Jarima</th>
                                                        </>
                                                        : null
                                                }
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

export default AccountingProfileSalary