import React from "react";
import styles from "./taskCard.module.sass";

/**
 * Context-aware Task Card
 * activeTaskType: "myTasks" | "givenTask" | "toReview"
 */

const STATUS_CONFIG = {
    completed: { label: "Completed", color: "#16a34a", bg: "#dcfce7" },
    in_progress: { label: "In Progress", color: "#2563eb", bg: "#dbeafe" },
    pending: { label: "Pending", color: "#d97706", bg: "#fef3c7" },
    cancelled: { label: "Cancelled", color: "#dc2626", bg: "#fee2e2" },
    review: { label: "Review", color: "#7c3aed", bg: "#ede9fe" },

    // ── добавленные ──
    not_started: { label: "Not Started", color: "#6b7280", bg: "#f3f4f6" },
    blocked: { label: "Blocked", color: "#dc2626", bg: "#fff1f2" },
    approved: { label: "Approved", color: "#059669", bg: "#d1fae5" },
    declined: { label: "Declined", color: "#b91c1c", bg: "#fecaca" },
    re_check: { label: "Re-check", color: "#d97706", bg: "#ffedd5" },
};

const DEADLINE_BORDER = {
    red: "#ef4444",
    green: "#22c55e",
    yellow: "#eab308",
};

function Avatar({ name, surname }) {
    const initials = `${name?.[0] ?? ""}${surname?.[0] ?? ""}`.toUpperCase();
    return (
        <div className={styles.avatar} title={`${name} ${surname}`}>
            {initials}
        </div>
    );
}

function MetaRow({ icon, label, value }) {
    return (
        <div className={styles.metaRow}>
            <span className={styles.metaIcon}>{icon}</span>
            <span className={styles.metaLabel}>{label}</span>
            <span className={styles.metaValue}>{value}</span>
        </div>
    );
}

export default function TaskCard({
    task,
    activeTaskType,
    userId,
    level,
    statusList = [],
    onView,
    onRedirect,
    onEdit,
    onDelete,
    onChangeStatus,
}) {
    const isMulti = task.children?.length > 1;
    const status = STATUS_CONFIG[task.status] ?? {
        label: task.status,
        color: "#6b7280",
        bg: "#f3f4f6",
    };

    const deadlineColor =
        task.status === "completed"
            ? "#22c55e"
            : DEADLINE_BORDER[task.deadline_color] ?? "#e5e7eb";

    const daysLeft = task.days_left ?? 0;
    const isOverdue = daysLeft < 0 && task.status !== "completed";
    const isMyTask = activeTaskType === "myTasks";
    const isGiven = activeTaskType === "givenTask";
    const isReview = activeTaskType === "toReview";

    // Format datetime nicely
    function fmtDate(dt) {
        if (!dt) return "—";
        const d = new Date(dt.replace(" ", "T"));
        return d.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    const isCreator = task.creator?.id === userId;

    return (
        <div
            className={styles.card}
            style={{ "--border-color": deadlineColor }}
            onClick={() => (isMulti ? null : onView(task))}
        >
            {/* Left accent bar */}
            <div className={styles.accentBar} />

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    {task.category && (
                        <span className={styles.category}>{task.category}</span>
                    )}
                    <h3 className={styles.title}>{task.title}</h3>
                </div>
                <span
                    className={styles.statusBadge}
                    style={{ color: status.color, background: status.bg }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isMulti) onChangeStatus?.(task);
                    }}
                >
                    {isMulti ? `${task.children.length} executors` : status.label}
                </span>
            </div>

            {/* Context-aware main info */}
            <div className={styles.meta}>
                {/* myTasks → show creator */}
                {isMyTask && task.creator && (
                    <MetaRow
                        icon="👤"
                        label="Creator:"
                        value={
                            <span className={styles.personRow}>
                                <Avatar
                                    name={task.creator.name}
                                    surname={task.creator.surname}
                                />
                                {task.creator.name} {task.creator.surname}
                            </span>
                        }
                    />
                )}

                {/* givenTask / toReview → show executor */}
                {(isGiven || isReview) && task.executor && (
                    <MetaRow
                        icon="🧑‍💼"
                        label="Executor:"
                        value={
                            <span className={styles.personRow}>
                                <Avatar
                                    name={task.executor.name}
                                    surname={task.executor.surname}
                                />
                                {task.executor.name} {task.executor.surname}
                                {isMulti && (
                                    <span className={styles.multiCount}>
                                        +{task.children.length - 1}
                                    </span>
                                )}
                            </span>
                        }
                    />
                )}

                {/* Redirect info */}
                {task.is_redirected &&
                    task.executor?.id !== task.redirected_by?.id && (
                        <MetaRow
                            icon="↪️"
                            label="Redirected by:"
                            value={task.redirected_by?.full_name}
                        />
                    )}

                {/* Deadline */}
                <MetaRow
                    icon="📅"
                    label="Deadline:"
                    value={
                        <span
                            className={styles.deadlineValue}
                            style={{ color: isOverdue ? "#ef4444" : "inherit" }}
                        >
                            {fmtDate(task.deadline_datetime)}
                            {isOverdue && (
                                <span className={styles.overdueBadge}>
                                    +{Math.abs(daysLeft)}d overdue
                                </span>
                            )}
                            {!isOverdue && daysLeft > 0 && task.status !== "completed" && (
                                <span className={styles.daysLeftBadge}>{daysLeft}d left</span>
                            )}
                        </span>
                    }
                />

                {/* KPI weight — always useful */}
                {task.kpi_weight != null && (
                    <MetaRow
                        icon="⚡"
                        label="KPI:"
                        value={
                            <span className={styles.kpiRow}>
                                <span className={styles.kpiWeight}>{task.kpi_weight}</span>
                                {task.max_bonus > 0 && (
                                    <span className={styles.bonus}>+{task.max_bonus}🎁</span>
                                )}
                                {task.max_penalty > 0 && (
                                    <span className={styles.penalty}>-{task.max_penalty}⚠️</span>
                                )}
                            </span>
                        }
                    />
                )}
            </div>

            {/* Tags */}
            {task.tags?.length > 0 && (
                <div className={styles.tags}>
                    {task.tags.slice(0, 3).map((tag) => (
                        <span key={tag.id} className={styles.tag}>
                            {tag.name}
                        </span>
                    ))}
                    {task.tags.length > 3 && (
                        <span className={styles.tagMore}>+{task.tags.length - 3}</span>
                    )}
                </div>
            )}

            {/* Footer: activity icons + actions */}
            <div className={styles.footer}>
                <div className={styles.activity}>
                    <span className={styles.activityItem} title="Comments">
                        💬 {task.comments?.length ?? 0}
                    </span>
                    <span className={styles.activityItem} title="Attachments">
                        📎 {task.attachments?.length ?? 0}
                    </span>
                    <span className={styles.activityItem} title="Subtasks">
                        ✅ {task.subtasks?.length ?? 0}
                    </span>
                </div>

                <div
                    className={styles.actions}
                    onClick={(e) => e.stopPropagation()}
                >
                    {level !== 4 && (!isMulti) && (
                        <button
                            className={styles.btnSecondary}
                            onClick={() => onRedirect?.(task)}
                        >
                            Redirect
                        </button>
                    )}
                    {isMulti && (
                        <button
                            className={styles.btnView}
                            onClick={() => onView?.(task)}
                        >
                            View All ({task.children.length})
                        </button>
                    )}
                    {!isMulti && (
                        <button
                            className={styles.btnView}
                            onClick={() => onView?.(task)}
                        >
                            View
                        </button>
                    )}
                    {isCreator && !isMulti && (
                        <>
                            <button
                                className={styles.btnEdit}
                                onClick={() => onEdit?.(task)}
                            >
                                Edit
                            </button>
                            <button
                                className={styles.btnDelete}
                                onClick={() => onDelete?.(task)}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}