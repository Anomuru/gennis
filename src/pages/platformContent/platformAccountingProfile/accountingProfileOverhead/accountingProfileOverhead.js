import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Input from "components/platform/platformUI/input"
import { fetchAccountingProfileData } from "slices/accountingProfileSlice"

import styles from "./accountingProfileOverhead.module.sass"
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall"

const categories = [
    { id: 1, name: "Arenda", type: "arenda" },
    { id: 2, name: "Gaz", type: "gaz" },
    { id: 3, name: "Suv", type: "suv" },
    { id: 4, name: "Svet", type: "svet" },
    { id: 5, name: "Boshqa Xarajatlar", type: "other" },
]

const AccountingProfileOverhead = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { locationId } = useParams()

    const { loading, data } = useSelector(state => state.accountingProfileSlice)
    const getCurrentYear = new Date().getFullYear()
    const getCurrentMonth = new Date().getMonth() + 1

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
        if (getCurrentYear && getCurrentMonth)
            setCurrentMonth(`${getCurrentYear}-${getCurrentMonth}`)
    }, [getCurrentYear, getCurrentMonth])

    useEffect(() => {
        if (currentMonth && locationId) {
            const [year, month] = currentMonth.split("-")
            dispatch(fetchAccountingProfileData({
                URL_TYPE: "overhead", locationId, year, month
            }))
        }
    }, [currentMonth])

    return (
        <main className={styles.container}>
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <div className={styles.breadcrumb}>
                        <span className={styles.breadcrumbItem}>Moliya Boshqarma</span>
                        <span className={styles.breadcrumbSeparator}>/</span>
                        <span className={styles.breadcrumbItemActive}>Qo'shimcha Xarajatlar</span>
                    </div>
                </div>
            </nav>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Xarajat Kategoriyalarini Tanlang</h1>
                        {/* <p className={styles.subtitle}>Select category to view details</p> */}
                    </div>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        Orqaga
                    </button>
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
                            defaultValue={`${getCurrentYear}-${getCurrentMonth}`}
                            type={"month"}
                        />
                    </div>
                </div>

                <div className={styles.cardsGrid}>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={styles.categoryCard}
                            onClick={() => navigate(`${category.type}/${currentMonth}`)}
                        >
                            <div className={styles.categoryCardHeader}>
                                <h3 className={styles.categoryCardTitle}>{category.name}</h3>
                            </div>
                            <div className={styles.categoryCardContent}>
                                {/* <p className={styles.categoryCardDescription}>{category.description}</p> */}
                                {
                                    loading
                                        ? <DefaultLoaderSmall />
                                        : <div className={styles.categoryCardTotal}>
                                            <p className={styles.categoryCardTotalLabel}>Umumiy Xarajat</p>
                                            <p className={styles.categoryCardTotalValue}>{formatCurrency(data[`total_${category.type}`])}</p>
                                        </div>
                                }
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => navigate(`overall/${currentMonth}`)} className={styles.navButton}>
                    Umumiy Ma'lumotlarni Ko'rish
                </button>
            </div>
        </main>
    )
}

export default AccountingProfileOverhead