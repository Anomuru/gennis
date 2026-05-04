import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import cls from "./platformLoanProfile.module.sass";
import { BackUrl, headers } from "constants/global";
import { setMessage } from "slices/messageSlice";
import { useHttp } from "hooks/http.hook";
import Modal from "components/platform/platformUI/modal";
import InputForm from "components/platform/platformUI/inputForm";
import Confirm from "components/platform/platformModals/confirm/confirm";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";

const PaymentTypeSelect = ({ register, name }) => {
    const { dataToChange } = useSelector(state => state.dataToChange);
    return (
        <label className="input-label">
            <span className="name-field">To'lov turi</span>
            <select className="input-fields" {...register(name, { required: true })}>
                <option value="">Tanlang</option>
                {dataToChange?.payment_types?.map(pt => (
                    <option key={pt.id} value={pt.id}>{pt.name}</option>
                ))}
            </select>
        </label>
    );
};

const PlatformLoanProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { request } = useHttp();
    const { dataToChange } = useSelector(state => state.dataToChange);

    const [loan, setLoan] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loadingLoan, setLoadingLoan] = useState(true);

    const [repayModal, setRepayModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const repayForm = useForm();
    const editForm = useForm();
    const cancelForm = useForm();
    const payEditForm = useForm();

    const [payEditModal, setPayEditModal] = useState(false);
    const [payEditItem, setPayEditItem] = useState(null);
    const [payDeleteModal, setPayDeleteModal] = useState(false);
    const [payDeleteId, setPayDeleteId] = useState(null);
    const [payEditSubmitting, setPayEditSubmitting] = useState(false);

    useEffect(() => {
        fetchLoan();
    }, [id]);

    const fetchLoan = () => {
        setLoadingLoan(true);
        request(`${BackUrl}account/branch_loans/${id}/`, "GET", null, headers())
            .then(res => {
                if (res.success && res.data) {
                    setLoan(res.data);
                    setPayments(res.data.transactions || []);
                    editForm.reset({
                        due_date: res.data.due_date,
                        reason: res.data.reason,
                        notes: res.data.notes || ""
                    });
                }
            })
            .catch(() => {})
            .finally(() => setLoadingLoan(false));
    };

    const onRepay = (data) => {
        setSubmitting(true);
        const body = {
            amount: Number(data.amount),
            payment_type_id: Number(data.payment_type_id),
            date: data.date
        };
        request(`${BackUrl}account/branch_loans/${id}/repay/`, "POST", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({ msg: res.message || "To'lov amalga oshirildi", type: "success", active: true }));
                    setRepayModal(false);
                    repayForm.reset();
                    fetchLoan();
                }
            })
            .catch(() => {})
            .finally(() => setSubmitting(false));
    };

    const onEdit = (data) => {
        setSubmitting(true);
        const body = {
            due_date: data.due_date,
            reason: data.reason,
            notes: data.notes
        };
        request(`${BackUrl}account/branch_loans/${id}/update/`, "PATCH", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({ msg: res.message || "Qarz yangilandi", type: "success", active: true }));
                    setEditModal(false);
                    fetchLoan();
                }
            })
            .catch(() => {})
            .finally(() => setSubmitting(false));
    };

    const onCancel = (data) => {
        setSubmitting(true);
        const body = { cancelled_reason: data.cancelled_reason };
        request(`${BackUrl}account/branch_loans/${id}/cancel/`, "POST", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({ msg: res.message || "Qarz bekor qilindi", type: "success", active: true }));
                    setCancelModal(false);
                    cancelForm.reset();
                    fetchLoan();
                }
            })
            .catch(() => {})
            .finally(() => setSubmitting(false));
    };

    const openEditPayment = (p) => {
        setPayEditItem(p);
        const matchedType = dataToChange?.payment_types?.find(
            pt => pt.name?.toLowerCase() === p.payment_type?.toLowerCase()
        );
        payEditForm.reset({ amount: p.amount, reason: p.reason || "", payment_type_id: matchedType?.id ?? "" });
        setPayEditModal(true);
    };

    const onEditPayment = (data) => {
        const body = { amount: Number(data.amount), reason: data.reason, payment_type_id: Number(data.payment_type_id) };
        setPayEditSubmitting(true);
        request(`${BackUrl}account/branch_transaction/${payEditItem.id}`, "PUT", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({ msg: res.message || "Yangilandi", type: "success", active: true }));
                    setPayEditModal(false);
                    fetchLoan();
                }
            })
            .catch(() => {})
            .finally(() => setPayEditSubmitting(false));
    };

    const openDeletePayment = (id) => { setPayDeleteId(id); setPayDeleteModal(true); };
    const confirmDeletePayment = () => {
        request(`${BackUrl}account/branch_transaction/${payDeleteId}`, "DELETE", null, headers())
            .then(res => {
                if (res.success) {
                    setPayments(prev => prev.filter(p => p.id !== payDeleteId));
                    dispatch(setMessage({ msg: res.message || "O'chirildi", type: "success", active: true }));
                }
            })
            .catch(() => {})
            .finally(() => { setPayDeleteModal(false); setPayDeleteId(null); });
    };

    const fmtAmount = (num) => {
        if (!num) return "0";
        const mln = num / 1000000;
        if (mln >= 1) return `${mln.toFixed(1)} mln`;
        return new Intl.NumberFormat("uz-UZ").format(num);
    };

    const fmtDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    const getDaysRemaining = () => {
        if (!loan?.due_date || loan.is_settled || loan.status === "cancelled") return null;
        const now = new Date();
        const due = new Date(loan.due_date);
        const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getProgressPercent = () => {
        if (!loan) return 0;
        if (loan.principal_amount === 0) return 0;
        return Math.round((loan.paid_total / loan.principal_amount) * 100);
    };

    const getStatusBadge = (status) => {
        if (status === "active") return <span className={cls.badgeActive}>Faol</span>;
        if (status === "settled") return <span className={cls.badgeSettled}>Yopilgan</span>;
        if (status === "cancelled") return <span className={cls.badgeCancelled}>Bekor qilingan</span>;
        return null;
    };

    const getDirBadge = (dir) => {
        if (dir === "out") return <span className={cls.badgeDirOut}>↑ Berilgan</span>;
        if (dir === "in") return <span className={cls.badgeDirIn}>↓ Olingan</span>;
        return null;
    };

    const getAccentClass = () => {
        if (!loan) return cls.accentActive;
        if (loan.status === "cancelled") return cls.accentCancelled;
        if (loan.status === "settled") return cls.accentSettled;
        return cls.accentActive;
    };

    const getBorderClass = () => {
        if (!loan) return cls.borderActive;
        if (loan.status === "cancelled") return cls.borderCancelled;
        return cls.borderActive;
    };

    if (loadingLoan) {
        return (
            <div className={cls.page}>
                <div className={cls.container}>
                    <div className={cls.skeleton}></div>
                </div>
            </div>
        );
    }

    if (!loan) {
        return (
            <div className={cls.page}>
                <div className={cls.container}>
                    <p>Qarz topilmadi</p>
                </div>
            </div>
        );
    }

    const daysRemaining = getDaysRemaining();
    const progressPercent = getProgressPercent();

    return (
        <div className={cls.page}>
            <div className={cls.container}>
                {/* Main Card */}
                <div className={`${cls.mainCard} ${getAccentClass()}`}>
                    {/* Header */}
                    <div className={cls.header}>
                        <div className={cls.avatarRow}>
                            <div className={cls.avatar}>
                                {loan.counterparty?.surname?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div className={cls.nameBlock}>
                                <div className={cls.name}>
                                    {loan.counterparty?.surname} {loan.counterparty?.name}
                                </div>
                                <div className={cls.phone}>{loan.counterparty?.phone || "—"}</div>
                            </div>
                        </div>
                        <div className={cls.badges}>
                            {getStatusBadge(loan.status)}
                            {getDirBadge(loan.direction)}
                        </div>
                    </div>

                    {/* Amount Block */}
                    <div className={cls.amountBlock}>
                        <div className={cls.amountLeft}>
                            <div className={cls.amountLabel}>JAMI QARZ</div>
                            <div className={cls.amountValue}>
                                {fmtAmount(loan.principal_amount)} <span className={cls.unit}>so'm</span>
                            </div>
                            {daysRemaining !== null && (
                                <div className={cls.amountSubtext}>
                                    {daysRemaining > 0 ? `${daysRemaining} kun qoldi` : `${Math.abs(daysRemaining)} kun kechikdi`}
                                </div>
                            )}
                        </div>
                        <div className={cls.donutWrap}>
                            <svg className={cls.donut} width="100" height="100" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#ebebeb" strokeWidth="10" />
                                <circle
                                    cx="50" cy="50" r="40" fill="none"
                                    stroke="#3b6ef0" strokeWidth="10" strokeLinecap="round"
                                    strokeDasharray={`${progressPercent * 2.51} 251`}
                                    transform="rotate(-90 50 50)"
                                    className={cls.donutProgress}
                                />
                            </svg>
                            <div className={cls.donutLabel}>{progressPercent}%</div>
                        </div>
                    </div>

                    {/* Stat Chips */}
                    <div className={cls.statChips}>
                        <div className={cls.chip}>
                            <div className={cls.chipLabel}>TO'LANGAN</div>
                            <div className={`${cls.chipValue} ${cls.chipPaid}`}>
                                {fmtAmount(loan.paid_total)}
                            </div>
                        </div>
                        <div className={cls.chip}>
                            <div className={cls.chipLabel}>QOLGAN</div>
                            <div className={`${cls.chipValue} ${cls.chipRemaining}`}>
                                {fmtAmount(loan.remaining_amount)}
                            </div>
                        </div>
                        <div className={cls.chip}>
                            <div className={cls.chipLabel}>BERILGAN</div>
                            <div className={`${cls.chipValue} ${cls.chipIssued}`}>
                                {fmtDate(loan.issued_date)}
                            </div>
                        </div>
                    </div>

                    {/* Notes Block */}
                    <div className={`${cls.notesBlock} ${getBorderClass()}`}>
                        <div className={cls.notesReason}>
                            Sabab
                            {loan.status === "cancelled" && loan.cancelled_reason && (
                                <span className={cls.cancelledReason}> · {loan.cancelled_reason}</span>
                            )}
                        </div>
                        <div className={cls.notesText}>{loan.reason || "—"}</div>
                        {loan.notes && <div className={cls.notesText}>{loan.notes}</div>}
                        <div className={cls.notesMuddat}>Muddat: {fmtDate(loan.due_date)}</div>
                    </div>

                    {/* Settled Banner */}
                    {loan.is_settled && loan.settled_date && (
                        <div className={cls.settledBanner}>
                            ✓ Qarz {fmtDate(loan.settled_date)} da to'liq yopildi
                        </div>
                    )}

                    {/* Action Buttons */}
                    {loan.status !== "cancelled" && (
                        <div className={cls.actions}>
                            <button className={cls.btnPrimary} onClick={() => setRepayModal(true)}>
                                To'lov kiritish
                            </button>
                            <button className={cls.btnSecondary} onClick={() => setEditModal(true)}>
                                Tahrirlash
                            </button>
                            <button className={cls.btnDanger} onClick={() => setCancelModal(true)}>
                                Bekor
                            </button>
                        </div>
                    )}
                </div>

                {/* Payment History Card */}
                <div className={cls.historyCard}>
                    <div className={cls.historyHeader}>
                        <span className={cls.historyTitle}>To'lovlar tarixi</span>
                        <span className={cls.historyCount}>{payments.length}</span>
                    </div>
                    {payments.length === 0 ? (
                        <div className={cls.historyEmpty}>Hali to'lovlar yo'q</div>
                    ) : (
                        <div className={cls.historyList}>
                            {payments.map((p, i) => (
                                <React.Fragment key={p.id}>
                                    {i > 0 && <div className={cls.historyDivider}></div>}
                                    <div className={cls.historyRow}>
                                        <div className={cls.historyLeft}>
                                            <div className={cls.historyDot}></div>
                                            <div>
                                                <div className={cls.historyName}>
                                                    {p.direction === "give" ? "Qarz berildi" : `To'lov #${payments.filter((t, idx) => idx <= i && t.direction === "receive").length}`}
                                                </div>
                                                <div className={cls.historyMeta}>
                                                    {p.date} · {p.payment_type || "—"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cls.historyRight}>
                                            <div className={p.direction === "give" ? cls.historyAmountNegative : cls.historyAmount}>
                                                {p.direction === "give" ? `-${fmtAmount(p.amount)}` : `+${fmtAmount(p.amount)}`}
                                            </div>
                                            <div className={cls.historyActions}>
                                                <i className={`fas fa-pen ${cls.editBtn}`} onClick={() => openEditPayment(p)} />
                                                <i className={`fas fa-times ${cls.deleteBtn}`} onClick={() => openDeletePayment(p.id)} />
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <Modal activeModal={repayModal} setActiveModal={setRepayModal}>
                <form className={cls.modalForm} onSubmit={repayForm.handleSubmit(onRepay)}>
                    <h2 className={cls.modalTitle}>To'lov kiritish</h2>
                    <InputForm title="Summa" register={repayForm.register} name="amount" type="number" required />
                    <InputForm title="Sana" register={repayForm.register} name="date" type="date" required />
                    <PaymentTypeSelect register={repayForm.register} name="payment_type_id" />
                    {submitting ? <DefaultLoaderSmall /> : (
                        <button className="input-submit" type="submit">Tasdiqlash</button>
                    )}
                </form>
            </Modal>

            <Modal activeModal={editModal} setActiveModal={setEditModal}>
                <form className={cls.modalForm} onSubmit={editForm.handleSubmit(onEdit)}>
                    <h2 className={cls.modalTitle}>Qarzni tahrirlash</h2>
                    <InputForm title="Muddat" register={editForm.register} name="due_date" type="date" required />
                    <InputForm title="Sabab" register={editForm.register} name="reason" type="text" required />
                    <label className="input-label">
                        <span className="name-field">Izoh</span>
                        <textarea className="input-fields" {...editForm.register("notes")} rows={3}></textarea>
                    </label>
                    {submitting ? <DefaultLoaderSmall /> : (
                        <button className="input-submit" type="submit">Saqlash</button>
                    )}
                </form>
            </Modal>

            <Modal activeModal={cancelModal} setActiveModal={setCancelModal}>
                <form className={cls.modalForm} onSubmit={cancelForm.handleSubmit(onCancel)}>
                    <h2 className={cls.modalTitle}>Qarzni bekor qilish</h2>
                    <label className="input-label">
                        <span className="name-field">Bekor qilish sababi</span>
                        <textarea className="input-fields" {...cancelForm.register("cancelled_reason", { required: true })} rows={3}></textarea>
                    </label>
                    {submitting ? <DefaultLoaderSmall /> : (
                        <div className={cls.modalActions}>
                            <button type="button" className={cls.btnSecondary} onClick={() => setCancelModal(false)}>Yopish</button>
                            <button type="submit" className={cls.btnDanger}>Bekor qilish</button>
                        </div>
                    )}
                </form>
            </Modal>

            <Modal activeModal={payEditModal} setActiveModal={setPayEditModal}>
                <form className={cls.modalForm} onSubmit={payEditForm.handleSubmit(onEditPayment)}>
                    <h2 className={cls.modalTitle}>To'lovni tahrirlash</h2>
                    <InputForm title="Summa" register={payEditForm.register} name="amount" type="number" required />
                    <InputForm title="Sabab" register={payEditForm.register} name="reason" type="text" />
                    <PaymentTypeSelect register={payEditForm.register} name="payment_type_id" />
                    {payEditSubmitting ? <DefaultLoaderSmall /> : (
                        <div className={cls.modalActions}>
                            <button type="button" className={cls.btnSecondary} onClick={() => setPayEditModal(false)}>Bekor</button>
                            <button type="submit" className="input-submit">Saqlash</button>
                        </div>
                    )}
                </form>
            </Modal>

            <Modal activeModal={payDeleteModal} setActiveModal={setPayDeleteModal}>
                <Confirm text="To'lovni o'chirishni tasdiqlaysizmi?" setActive={setPayDeleteModal}
                    getConfirm={r => { if (r === "yes") confirmDeletePayment(); }} />
            </Modal>
        </div>
    );
};

export default PlatformLoanProfile;
