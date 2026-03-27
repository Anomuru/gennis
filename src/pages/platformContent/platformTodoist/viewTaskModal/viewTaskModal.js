import React from "react";
import classNames from "classnames";
import styles from "./viewTaskModal.module.sass";

const STATUS_CONFIG = {
    completed: { label: "Completed", color: "#16a34a", bg: "#dcfce7" },
    in_progress: { label: "In Progress", color: "#2563eb", bg: "#dbeafe" },
    not_started: { label: "Not Started", color: "#6b7280", bg: "#f3f4f6" },
    pending: { label: "Pending", color: "#d97706", bg: "#fef3c7" },
    cancelled: { label: "Cancelled", color: "#dc2626", bg: "#fee2e2" },
    review: { label: "Review", color: "#7c3aed", bg: "#ede9fe" },
};

function Avatar({ name, surname, size = 32 }) {
    const initials = `${name?.[0] ?? ""}${surname?.[0] ?? ""}`.toUpperCase();
    const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
    const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length];
    return (
        <div
            className={styles.avatar}
            style={{ width: size, height: size, background: color, fontSize: size * 0.35 }}
            title={`${name} ${surname}`}
        >
            {initials}
        </div>
    );
}

function PersonChip({ label, name, surname, extra }) {
    return (
        <div className={styles.personChip}>
            <span className={styles.chipLabel}>{label}</span>
            <div className={styles.chipBody}>
                <Avatar name={name} surname={surname} size={28} />
                <div>
                    <span className={styles.chipName}>{name} {surname}</span>
                    {extra && <span className={styles.chipExtra}>{extra}</span>}
                </div>
            </div>
        </div>
    );
}

function CollapsibleSection({ title, count, sectionKey, activeCollapsibles, toggleCollapsible, children, onAdd, addLabel }) {
    const isOpen = activeCollapsibles.has(sectionKey);
    return (
        <div className={classNames(styles.collapsible, { [styles.active]: isOpen })}>
            <button className={styles.collapsibleHeader} onClick={() => toggleCollapsible(sectionKey)}>
                <span className={styles.collapsibleTitle}>
                    {title}
                    {count > 0 && <span className={styles.collapsibleCount}>{count}</span>}
                </span>
                <span className={classNames(styles.collapsibleArrow, { [styles.open]: isOpen })}>▾</span>
            </button>
            {isOpen && (
                <div className={classNames(styles.collapsibleBody, { [styles.active]: isOpen && !!children })}>
                    <div className={styles.collapsibleBodyContent}>
                        {children}
                    </div>
                    {onAdd && (
                        <button className={styles.addBtn} onClick={onAdd}>
                            + {addLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function ViewTaskModal({
    selectedTask,
    categoryList,
    statusList,
    userId,
    userName,
    BackUrlForDoc,
    activeCollapsibles,
    toggleCollapsible,
    tasksProfileLoading,
    onClose,
    onChangeStatus,
    openNestedModal,
    handleCompleteSubtask,
    compareByOrder,
}) {
    if (!selectedTask) return null;

    const isFromOffice = !!selectedTask.management_id;
    const canInteract = (
        userId === selectedTask.creator_id ||
        userId === selectedTask.executor_id ||
        userId === selectedTask.reviewer_id
    );
    const status = STATUS_CONFIG[selectedTask.status] ?? { label: selectedTask.status, color: "#6b7280", bg: "#f3f4f6" };
    const daysLeft = selectedTask.days_left ?? 0;
    const isOverdue = daysLeft < 0 && selectedTask.status !== "completed";
    const departmentName = categoryList?.find(i => i.id === selectedTask.category)?.name ?? "—";

    function fmtDate(dt) {
        if (!dt) return "—";
        const d = new Date(dt.replace(" ", "T"));
        return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>

                {/* ── Top bar ── */}
                <div className={styles.topBar}>
                    <div className={styles.topBarLeft}>
                        <span className={styles.deptBadge}>{departmentName}</span>
                        <h2 className={styles.modalTitle}>{selectedTask.title}</h2>
                    </div>
                    <div className={styles.topBarRight}>
                        <button
                            className={styles.statusBtn}
                            style={{ color: status.color, background: status.bg, ...(!canInteract ? { cursor: "default", opacity: 0.7 } : {}) }}
                            onClick={() => canInteract && onChangeStatus?.(selectedTask)}
                        >
                            {status.label}
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>✕</button>
                    </div>
                </div>

                {/* ── Overdue / days left banner ── */}
                {isOverdue && (
                    <div className={styles.overdueBanner}>
                        ⚠️ Просрочено на <strong>{Math.abs(daysLeft)} дней</strong>
                        {selectedTask.finish_datetime && ` · Завершено: ${fmtDate(selectedTask.finish_datetime)}`}
                    </div>
                )}

                <div className={styles.body}>

                    {/* ── People row ── */}
                    <div className={styles.peopleRow}>
                        <PersonChip
                            label="Creator"
                            name={isFromOffice ? "Boshqarma" : selectedTask.creator?.name}
                            surname={isFromOffice ? "" : selectedTask.creator?.surname}
                        />
                        <PersonChip
                            label={selectedTask.is_redirected && selectedTask.executor?.id !== selectedTask.redirected_by?.id ? "Executor (Redirected)" : "Executor"}
                            name={selectedTask.executor?.name}
                            surname={selectedTask.executor?.surname}
                            extra={selectedTask.is_redirected && selectedTask.executor?.id !== selectedTask.redirected_by?.id
                                ? `← ${selectedTask.redirected_by?.name} ${selectedTask.redirected_by?.name}` : null}
                        />
                        <PersonChip
                            label="Reviewer"
                            name={selectedTask.reviewer?.name ?? selectedTask.reviewer_name?.split(" ")[0] ?? "—"}
                            surname={selectedTask.reviewer?.surname ?? selectedTask.reviewer_name?.split(" ").slice(1).join(" ") ?? ""}
                        />
                    </div>

                    {/* ── Meta grid ── */}
                    <div className={styles.metaGrid}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>📅 Deadline</span>
                            <span className={classNames(styles.metaVal, { [styles.redText]: isOverdue })}>
                                {fmtDate(selectedTask.deadline_datetime)}
                            </span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>🕐 Created</span>
                            <span className={styles.metaVal}>{fmtDate(selectedTask.created_at)}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>⚡ KPI Weight</span>
                            <span className={styles.metaVal}>
                                <span className={styles.kpiWeight}>{selectedTask.kpi_weight}</span>
                                {selectedTask.max_bonus > 0 && <span className={styles.bonus}> +{selectedTask.max_bonus}🎁</span>}
                                {selectedTask.max_penalty > 0 && <span className={styles.penalty}> -{selectedTask.max_penalty}⚠️</span>}
                            </span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>🔁 Recurring</span>
                            <span className={styles.metaVal}>
                                {selectedTask.is_recurring ? `Yes (${selectedTask.recurring_type})` : "No"}
                            </span>
                        </div>
                    </div>

                    {/* ── Description ── */}
                    <div className={styles.section}>
                        <span className={styles.sectionLabel}>Description</span>
                        <div className={classNames(styles.descBox, { [styles.empty]: !selectedTask.description })}>
                            {selectedTask.description || "No description"}
                        </div>
                    </div>

                    {/* ── Tags ── */}
                    {selectedTask.tags?.length > 0 && (
                        <div className={styles.section}>
                            <span className={styles.sectionLabel}>Tags</span>
                            <div className={styles.tagsRow}>
                                {selectedTask.tags.map(tag => (
                                    <span key={tag.id} className={styles.tag}>{tag.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Subtasks ── */}
                    <CollapsibleSection
                        title="Subtasks"
                        count={selectedTask.subtasks?.length}
                        sectionKey="subtasks"
                        activeCollapsibles={activeCollapsibles}
                        toggleCollapsible={toggleCollapsible}
                        onAdd={canInteract ? () => openNestedModal("createSubtask") : null}
                        addLabel="Add Subtask"
                    >
                        {tasksProfileLoading === "subtasks"
                            ? <div className={styles.loader}>Loading...</div>
                            : [...(selectedTask.subtasks ?? [])].sort(compareByOrder).map(st => {
                                const isMySubtask = st.creator_name === null || st.creator_name === userName;
                                return (
                                    <div key={st.id} className={classNames(styles.nestedItem, { [styles.done]: st.is_done })}>
                                        <div className={styles.nestedLeft}>
                                            <button
                                                className={classNames(styles.checkBtn, { [styles.checked]: st.is_done })}
                                                onClick={() => canInteract && handleCompleteSubtask(st.is_done, st.id)}
                                                style={!canInteract ? { cursor: "default", opacity: 0.7 } : {}}
                                            >
                                                {st.is_done ? "✓" : ""}
                                            </button>
                                            <span>{st.order}. {st.title}</span>
                                        </div>
                                        {canInteract && isMySubtask && (
                                            <div className={styles.nestedActions}>
                                                <button className={styles.btnEdit} onClick={() => openNestedModal("editSubtask", st)}>Edit</button>
                                                <button className={styles.btnDelete} onClick={() => openNestedModal("deleteSubtask", st)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        }
                    </CollapsibleSection>

                    {/* ── Attachments ── */}
                    <CollapsibleSection
                        title="Attachments"
                        count={selectedTask.attachments?.length}
                        sectionKey="attachments"
                        activeCollapsibles={activeCollapsibles}
                        toggleCollapsible={toggleCollapsible}
                        onAdd={canInteract ? () => openNestedModal("createAttachment") : null}
                        addLabel="Add Attachment"
                    >
                        {[...(selectedTask.attachments ?? [])].reverse().map(att => {
                            const isMyAttachment = att.creator_name === null || att.creator_name === userName;
                            return (
                                <div key={att.id} className={styles.mediaItem}>
                                    <div className={styles.mediaHeader}>
                                        <span className={styles.mediaDate}>{att.uploaded_at}</span>
                                        {canInteract && isMyAttachment && (
                                            <div className={styles.nestedActions}>
                                                <button className={styles.btnEdit} onClick={() => openNestedModal("editAttachment", att)}>Edit</button>
                                                <button className={styles.btnDelete} onClick={() => openNestedModal("deleteAttachment", att)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                    {att.note && <p className={styles.mediaNote}>{att.note}</p>}
                                    {att.file_path && (
                                        <img crossOrigin="anonymous" src={att.file_path} className={styles.mediaImg} alt="" />
                                    )}
                                </div>
                            );
                        })}
                    </CollapsibleSection>

                    {/* ── Comments ── */}
                    <CollapsibleSection
                        title="Comments"
                        count={selectedTask.comments?.length}
                        sectionKey="comments"
                        activeCollapsibles={activeCollapsibles}
                        toggleCollapsible={toggleCollapsible}
                        onAdd={canInteract ? () => openNestedModal("createComment") : null}
                        addLabel="Add Comment"
                    >
                        {[...(selectedTask.comments ?? [])].reverse().map(com => {
                            const displayName = com.user
                                ? (com.user.full_name ?? `${com.user.name} ${com.user.surname}`)
                                : (com.creator_name ?? "—");
                            const displayAvatarName = com.user?.name ?? com.creator_name?.split(" ")[0] ?? "—";
                            const displayAvatarSurname = com.user?.surname ?? com.creator_name?.split(" ").slice(1).join(" ") ?? "";
                            const isMyComment = com.user_id !== null ? com.user_id === userId : com.creator_name === null || com.creator_name === userName;
                            return (
                                <div key={com.id} className={styles.commentItem}>
                                    <div className={styles.commentHeader}>
                                        <div className={styles.commentMeta}>
                                            <Avatar name={displayAvatarName} surname={displayAvatarSurname} size={24} />
                                            <span className={styles.commentAuthor}>{displayName}</span>
                                            <span className={styles.mediaDate}>{com.created_at}</span>
                                        </div>
                                        {canInteract && isMyComment && (
                                            <div className={styles.nestedActions}>
                                                <button className={styles.btnEdit} onClick={() => openNestedModal("editComment", com)}>Edit</button>
                                                <button className={styles.btnDelete} onClick={() => openNestedModal("deleteComment", com)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                    <p className={styles.commentText}>{com.text}</p>
                                    {com.attachment_path && (
                                        <img crossOrigin="anonymous" src={BackUrlForDoc + com.attachment_path} className={styles.mediaImg} alt="" />
                                    )}
                                </div>
                            );
                        })}

                    </CollapsibleSection>

                    {/* ── Proofs ── */}
                    <CollapsibleSection
                        title="Proofs"
                        count={selectedTask.proofs?.length}
                        sectionKey="proofs"
                        activeCollapsibles={activeCollapsibles}
                        toggleCollapsible={toggleCollapsible}
                        onAdd={canInteract ? () => openNestedModal("createProof") : null}
                        addLabel="Add Proof"
                    >
                        {[...(selectedTask.proofs ?? [])].reverse().map(proof => {
                            const isMyProof = proof.creator_name === null || proof.creator_name === userName;
                            return (
                                <div key={proof.id} className={styles.mediaItem}>
                                    <div className={styles.mediaHeader}>
                                        <span className={styles.mediaDate}>{proof.created_at}</span>
                                        {canInteract && isMyProof && (
                                            <div className={styles.nestedActions}>
                                                <button className={styles.btnEdit} onClick={() => openNestedModal("editProof", proof)}>Edit</button>
                                                <button className={styles.btnDelete} onClick={() => openNestedModal("deleteProof", proof)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                    {proof.comment && <p className={styles.mediaNote}>{proof.comment}</p>}
                                    {proof.file_path && (
                                        <img crossOrigin="anonymous" src={BackUrlForDoc + proof.file_path} className={styles.mediaImg} alt="" />
                                    )}
                                </div>
                            );
                        })}
                    </CollapsibleSection>

                </div>
            </div>
        </div>
    );
}