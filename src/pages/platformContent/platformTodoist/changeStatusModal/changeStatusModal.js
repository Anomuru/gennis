import classNames from "classnames"
import styles from "./changeStatusModal.module.sass"

const ChangeStatusModal = ({
    selectedTask,
    userId,
    statusList,
    formData,
    setFormData,
    onClose,
    onUpdate,
    getAllowedStatuses,
}) => {
    const allowed = getAllowedStatuses(selectedTask, userId, statusList)

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>Change task status</h2>

                <div className={styles.formGroup}>
                    <label>Status</label>
                    {allowed.length === 0 ? (
                        <p>Sizda hozirgi statusni o'zgartirish huquqi yo'q</p>
                    ) : (
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            required
                        >
                            {allowed.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div className={styles.formActions}>
                    <button className={styles.btnCancel} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className={classNames(styles.btnPrimary, {
                            [styles.disabled]: allowed.length === 0
                        })}
                        disabled={allowed.length === 0}
                        onClick={onUpdate}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChangeStatusModal
