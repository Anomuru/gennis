import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Button from "components/platform/platformUI/button"

import styles from "./platformOtchot.module.sass"

const PlatformOtchot = () => {

    const navigate = useNavigate()
    const [filterType, setFilterType] = useState("cash")

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Moliya Boshqarma</h1>
                    {/* <p className={styles.subtitle}>Financial Management Dashboard</p> */}
                </div>
                <Button active={true} onClickBtn={() => navigate(-1)}>Buxgalteriya</Button>
            </header>

            <div className={styles.mainContent}>
                {/* <div className={styles.filterSection}>
                    <div className={styles.filterHeader}>
                        <h3 className={styles.filterTitle}>Filtrlash</h3>
                    </div>
                    <div className={styles.filterButtons}>
                        <div className={styles.filterButtons__btns}>
                            <button
                                onClick={() => setFilterType("cash")}
                                className={`${styles.filterBtn} ${filterType === "cash" ? styles.filterBtnActive : ""}`}
                            >
                                Cash
                            </button>
                            <button
                                onClick={() => setFilterType("bank")}
                                className={`${styles.filterBtn} ${filterType === "bank" ? styles.filterBtnActive : ""}`}
                            >
                                Bank
                            </button>
                            <button
                                onClick={() => setFilterType("click")}
                                className={`${styles.filterBtn} ${filterType === "click" ? styles.filterBtnActive : ""}`}
                            >
                                Click
                            </button>
                        </div>
                        <Input clazzLabel={styles.filterButtons__input} onChange={() => { }} type={"date"} />
                    </div>
                </div> */}

                <div className={styles.categoryGrid}>

                    <div className={styles.categoryCard} onClick={() => navigate("students-debt")}>
                        <div className={styles.categoryCardHeader}>
                            <h3 className={styles.categoryCardTitle}>O'quvchilar Qarzdorligi</h3>
                            {/* <p className={styles.categoryCardSubtitle}>Student Debt Tracking</p> */}
                        </div>
                        <div className={styles.categoryCardContent}>
                            <p>O'quvchi qarzdorliklarini kuzatib borish</p>
                        </div>
                    </div>
                    <div className={styles.categoryCard} onClick={() => navigate("salary")}>
                        <div className={styles.categoryCardHeader}>
                            <h3 className={styles.categoryCardTitle}>Oyliklar</h3>
                            {/* <p className={styles.categoryCardSubtitle}>Salary Management</p> */}
                        </div>
                        <div className={styles.categoryCardContent}>
                            <p>O'qituvchi va xodimlar oyliklarini boshqarish</p>
                        </div>
                    </div>

                    <div className={styles.categoryCard} onClick={() => navigate("overhead")}>
                        <div className={styles.categoryCardHeader}>
                            <h3 className={styles.categoryCardTitle}>Qo'shimcha Xarajatlar</h3>
                            {/* <p className={styles.categoryCardSubtitle}>Overhead Expenses</p> */}
                        </div>
                        <div className={styles.categoryCardContent}>
                            <p>Qo'shimcha xarajatlarni boshqarish</p>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    )
}

export default PlatformOtchot;
