import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Button from "components/platform/platformUI/button";
import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import Table from "components/platform/platformUI/table";
import InputForm from "components/platform/platformUI/inputForm";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";
import { setMessage } from "slices/messageSlice";
import { fetchDataToChange } from "slices/dataToChangeSlice";

import cls from "./platformHarajatTurlari.module.sass";

const now = new Date();
const TODAY = now.toISOString().slice(0, 10);

const MONTHS = [
    { value: 1, name: "Yanvar" }, { value: 2, name: "Fevral" },
    { value: 3, name: "Mart" }, { value: 4, name: "Aprel" },
    { value: 5, name: "May" }, { value: 6, name: "Iyun" },
    { value: 7, name: "Iyul" }, { value: 8, name: "Avgust" },
    { value: 9, name: "Sentyabr" }, { value: 10, name: "Oktyabr" },
    { value: 11, name: "Noyabr" }, { value: 12, name: "Dekabr" },
];
const YEARS = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

const MonthYearFilter = ({ month, year, onMonth, onYear }) => (
    <div className={cls.logsControls}>
        <select className={cls.select} value={month} onChange={e => onMonth(Number(e.target.value))}>
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
        </select>
        <select className={cls.select} value={year} onChange={e => onYear(Number(e.target.value))}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
    </div>
);

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

const PlatformHarajatTurlari = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { locationId } = useParams();
    const { request } = useHttp();
    const { dataToChange } = useSelector(state => state.dataToChange);

    const [activeTab, setActiveTab] = useState("types");

    // ── Types ──
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const addForm = useForm();
    const editForm = useForm();
    const addChangeable = addForm.watch("changeable");
    const editChangeable = editForm.watch("changeable");

    // ── Logs ──
    const [logMonth, setLogMonth] = useState(now.getMonth() + 1);
    const [logYear, setLogYear] = useState(now.getFullYear());
    const [statusFilter, setStatusFilter] = useState("all");
    const [logs, setLogs] = useState([]);
    const [logSummary, setLogSummary] = useState(null);
    const [logsLoading, setLogsLoading] = useState(false);
    const [payModal, setPayModal] = useState(false);
    const [payItem, setPayItem] = useState(null);
    const [paySubmitting, setPaySubmitting] = useState(false);
    const payForm = useForm();

    // ── Transactions ──
    const [txMonth, setTxMonth] = useState(now.getMonth() + 1);
    const [txYear, setTxYear] = useState(now.getFullYear());
    const [dirFilter, setDirFilter] = useState("all");
    const [txs, setTxs] = useState([]);
    const [txSummary, setTxSummary] = useState(null);
    const [txLoading, setTxLoading] = useState(false);
    const [txSubmitting, setTxSubmitting] = useState(false);
    const [txAddModal, setTxAddModal] = useState(false);
    const [txEditModal, setTxEditModal] = useState(false);
    const [txEditItem, setTxEditItem] = useState(null);
    const [txDeleteModal, setTxDeleteModal] = useState(false);
    const [txDeleteId, setTxDeleteId] = useState(null);
    const txAddForm = useForm();
    const txEditForm = useForm();

    // ── Deleted types ──
    const [showDeleted, setShowDeleted] = useState(false);
    const [deletedTypes, setDeletedTypes] = useState([]);
    const [deletedLoading, setDeletedLoading] = useState(false);

    // ── Generate logs ──
    const [generating, setGenerating] = useState(false);

    // ── Deleted transactions ──
    const [showDeletedTx, setShowDeletedTx] = useState(false);
    const [deletedTxs, setDeletedTxs] = useState([]);
    const [deletedTxLoading, setDeletedTxLoading] = useState(false);

    // ── Loans ──
    const [loanView, setLoanView] = useState("list");
    const [loanStatusFilter, setLoanStatusFilter] = useState("");
    const [loanDirFilter, setLoanDirFilter] = useState("");
    const [loanSearch, setLoanSearch] = useState("");
    const [loans, setLoans] = useState([]);
    const [loansCount, setLoansCount] = useState(0);
    const [loansLoading, setLoansLoading] = useState(false);
    const [loanPage, setLoanPage] = useState(1);
    const [loanCreateModal, setLoanCreateModal] = useState(false);
    const [loanRepayModal, setLoanRepayModal] = useState(false);
    const [loanCancelModal, setLoanCancelModal] = useState(false);
    const [loanEditModal, setLoanEditModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [loanSubmitting, setLoanSubmitting] = useState(false);
    const loanCreateForm = useForm();
    const loanRepayForm = useForm();
    const loanCancelForm = useForm();
    const loanEditForm = useForm();
    const LOANS_PER_PAGE = 15;

    useEffect(() => {
        fetchTypes();
        dispatch(fetchDataToChange(locationId));
    }, [locationId]);

    useEffect(() => { fetchLogs(); }, [locationId, logMonth, logYear, statusFilter]);
    useEffect(() => { fetchTxs(); }, [locationId, txMonth, txYear, dirFilter]);
    useEffect(() => { if (showDeleted) fetchDeletedTypes(); }, [locationId, showDeleted]);
    useEffect(() => { if (showDeletedTx) fetchDeletedTxs(); }, [locationId, txMonth, txYear, showDeletedTx]);
    useEffect(() => { if (activeTab === "loans") fetchLoans(); }, [locationId, activeTab, loanPage, loanStatusFilter, loanDirFilter, loanSearch]);

    // ── Types API ──
    const fetchTypes = () => {
        setLoading(true);
        request(`${BackUrl}account/overhead_type?location_id=${locationId}`, "GET", null, headers())
            .then(res => { if (res.success) setTypes(res.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    const onAddType = (data) => {
        const changeable = !!data.changeable;
        const body = { name: data.name, changeable, location_id: Number(locationId), ...(changeable ? {} : { cost: Number(data.cost) }) };
        setSubmitting(true);
        request(`${BackUrl}account/overhead_type`, "POST", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    setTypes(prev => [...prev, res.data]);
                    dispatch(setMessage({ msg: res.message, type: "success", active: true }));
                    addForm.reset({ name: "", cost: "", changeable: false });
                    setAddModal(false);
                }
            })
            .catch(() => {})
            .finally(() => setSubmitting(false));
    };

    const openEditType = (item) => {
        setEditItem(item);
        editForm.reset({ name: item.name, cost: item.cost ?? "", changeable: item.changeable });
        setEditModal(true);
    };

    const onEditType = (data) => {
        const changeable = !!data.changeable;
        const body = { name: data.name, changeable, location_id: Number(locationId), ...(changeable ? {} : { cost: Number(data.cost) }) };
        setSubmitting(true);
        request(`${BackUrl}account/overhead_type/${editItem.id}`, "PUT", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    setTypes(prev => prev.map(t => t.id === editItem.id ? { ...t, ...body, id: editItem.id } : t));
                    dispatch(setMessage({ msg: res.message || "Yangilandi", type: "success", active: true }));
                    setEditModal(false);
                    setEditItem(null);
                }
            })
            .catch(() => {})
            .finally(() => setSubmitting(false));
    };

    const openDeleteType = (id) => { setDeleteId(id); setDeleteModal(true); };
    const confirmDeleteType = () => {
        request(`${BackUrl}account/overhead_type/${deleteId}`, "DELETE", null, headers())
            .then(res => {
                if (res.success) {
                    setTypes(prev => prev.filter(t => t.id !== deleteId));
                    dispatch(setMessage({ msg: res.message || "O'chirildi", type: "success", active: true }));
                }
            })
            .catch(() => {})
            .finally(() => { setDeleteModal(false); setDeleteId(null); });
    };

    const fetchDeletedTypes = () => {
        setDeletedLoading(true);
        request(`${BackUrl}account/overhead_type/deleted?location_id=${locationId}`, "GET", null, headers())
            .then(res => { if (res.success) setDeletedTypes(res.data); })
            .catch(() => {})
            .finally(() => setDeletedLoading(false));
    };

    // ── Logs API ──
    const fetchLogs = () => {
        setLogsLoading(true);
        request(`${BackUrl}account/overhead_type_logs/${logMonth}/${logYear}?location_id=${locationId}&status=${statusFilter}`, "GET", null, headers())
            .then(res => { if (res.success) { setLogs(res.data); setLogSummary(res.summary); } })
            .catch(() => {})
            .finally(() => setLogsLoading(false));
    };

    const openPay = (log) => {
        setPayItem(log);
        payForm.reset({ date: TODAY, payment_type_id: "" });
        setPayModal(true);
    };

    const onPay = (data) => {
        const body = { log_id: payItem.id, payment_type_id: Number(data.payment_type_id), location_id: Number(locationId), date: data.date };
        setPaySubmitting(true);
        request(`${BackUrl}account/overhead_type_logs/pay`, "POST", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({ msg: res.message, type: "success", active: true }));
                    setPayModal(false);
                    fetchLogs();
                }
            })
            .catch(() => {})
            .finally(() => setPaySubmitting(false));
    };

    const generateLogs = () => {
        setGenerating(true);
        request(`${BackUrl}account/overhead_type_logs/generate/${logMonth}/${logYear}`, "POST", JSON.stringify({ location_id: Number(locationId) }), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({ msg: res.message || "Generatsiya muvaffaqiyatli", type: "success", active: true }));
                    fetchLogs();
                }
            })
            .catch(() => {})
            .finally(() => setGenerating(false));
    };

    // ── Transactions API ──
    const fetchTxs = () => {
        setTxLoading(true);
        request(`${BackUrl}account/branch_transaction/${txMonth}/${txYear}?location_id=${locationId}&direction=${dirFilter}`, "GET", null, headers())
            .then(res => { if (res.success) { setTxs(res.data); setTxSummary(res.summary); } })
            .catch(() => {})
            .finally(() => setTxLoading(false));
    };

    const openAddTx = () => {
        txAddForm.reset({ amount: "", is_give: "", reason: "", date: TODAY, payment_type_id: "", person_name: "", person_surname: "", person_phone: "" });
        setTxAddModal(true);
    };

    const onAddTx = (data) => {
        const isGive = data.is_give === "true";
        const body = { amount: Number(data.amount), is_give: isGive, reason: data.reason, payment_type_id: Number(data.payment_type_id), location_id: Number(locationId), date: data.date, person_name: data.person_name, person_surname: data.person_surname, person_phone: data.person_phone };
        setTxSubmitting(true);
        request(`${BackUrl}account/branch_transaction`, "POST", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({ msg: res.message || "Qo'shildi", type: "success", active: true }));
                    setTxAddModal(false);
                    fetchTxs();
                }
            })
            .catch(() => {})
            .finally(() => setTxSubmitting(false));
    };

    const openEditTx = (tx) => {
        setTxEditItem(tx);
        const matchedType = dataToChange?.payment_types?.find(
            pt => pt.name?.toLowerCase() === tx.payment_type?.toLowerCase()
        );
        txEditForm.reset({ amount: tx.amount, reason: tx.reason, payment_type_id: matchedType?.id ?? "" });
        setTxEditModal(true);
    };

    const onEditTx = (data) => {
        const body = { amount: Number(data.amount), reason: data.reason, payment_type_id: Number(data.payment_type_id) };
        setTxSubmitting(true);
        request(`${BackUrl}account/branch_transaction/${txEditItem.id}`, "PUT", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({ msg: res.message || "Yangilandi", type: "success", active: true }));
                    setTxEditModal(false);
                    fetchTxs();
                }
            })
            .catch(() => {})
            .finally(() => setTxSubmitting(false));
    };

    const openDeleteTx = (id) => { setTxDeleteId(id); setTxDeleteModal(true); };
    const confirmDeleteTx = () => {
        const deleted = txs.find(t => t.id === txDeleteId);
        request(`${BackUrl}account/branch_transaction/${txDeleteId}`, "DELETE", null, headers())
            .then(res => {
                if (res.success) {
                    setTxs(prev => prev.filter(t => t.id !== txDeleteId));
                    if (deleted && txSummary) {
                        setTxSummary(prev => {
                            const total_given = deleted.is_give
                                ? prev.total_given - deleted.amount
                                : prev.total_given;
                            const total_received = !deleted.is_give
                                ? prev.total_received - deleted.amount
                                : prev.total_received;
                            return { total_given, total_received, net: total_received - total_given };
                        });
                    }
                    dispatch(setMessage({ msg: res.message || "O'chirildi", type: "success", active: true }));
                }
            })
            .catch(() => {})
            .finally(() => { setTxDeleteModal(false); setTxDeleteId(null); });
    };

    const fetchDeletedTxs = () => {
        setDeletedTxLoading(true);
        request(`${BackUrl}account/branch_transaction/deleted/${txMonth}/${txYear}?location_id=${locationId}`, "GET", null, headers())
            .then(res => { if (res.success) setDeletedTxs(res.data); })
            .catch(() => {})
            .finally(() => setDeletedTxLoading(false));
    };

    // ── Loans API ──
    const fetchLoans = () => {
        setLoansLoading(true);
        const offset = (loanPage - 1) * LOANS_PER_PAGE;
        let url = `${BackUrl}account/branch_loans/?location_id=${locationId}&limit=${LOANS_PER_PAGE}&offset=${offset}`;
        if (loanStatusFilter) url += `&status=${loanStatusFilter}`;
        if (loanDirFilter) url += `&direction=${loanDirFilter}`;
        if (loanSearch) url += `&search=${loanSearch}`;

        request(url, "GET", null, headers())
            .then(res => {
                if (res.success && res.data) {
                    setLoans(res.data.data || []);
                    setLoansCount(res.data.pagination?.total || 0);
                }
            })
            .catch(() => {})
            .finally(() => setLoansLoading(false));
    };

    const openCreateLoan = () => {
        loanCreateForm.reset({
            counterparty_name: "",
            counterparty_surname: "",
            counterparty_phone: "",
            direction: "",
            principal_amount: "",
            issued_date: TODAY,
            due_date: "",
            payment_type_id: "",
            reason: ""
        });
        setLoanCreateModal(true);
    };

    const onCreateLoan = (data) => {
        const body = {
            location_id: Number(locationId),
            direction: data.direction,
            principal_amount: Number(data.principal_amount),
            issued_date: data.issued_date,
            due_date: data.due_date,
            payment_type_id: Number(data.payment_type_id),
            reason: data.reason,
            counterparty_id: 0,
            counterparty_name: data.counterparty_name,
            counterparty_surname: data.counterparty_surname,
            counterparty_phone: data.counterparty_phone
        };

        setLoanSubmitting(true);
        request(`${BackUrl}account/branch_loans/`, "POST", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({ msg: res.message || "Tranzaksiya yaratildi", type: "success", active: true }));
                    setLoanCreateModal(false);
                    fetchLoans();
                }
            })
            .catch(() => {})
            .finally(() => setLoanSubmitting(false));
    };

    const openRepayLoan = (loan) => {
        setSelectedLoan(loan);
        loanRepayForm.reset({
            amount: "",
            date: TODAY,
            payment_type_id: ""
        });
        setLoanRepayModal(true);
    };

    const onRepayLoan = (data) => {
        const body = {
            amount: Number(data.amount),
            payment_type_id: Number(data.payment_type_id),
            date: data.date
        };

        setLoanSubmitting(true);
        request(`${BackUrl}account/branch_loans/${selectedLoan.id}/repay/`, "POST", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({ msg: res.message || "To'lov qabul qilindi", type: "success", active: true }));
                    setLoanRepayModal(false);
                    fetchLoans();
                }
            })
            .catch(() => {})
            .finally(() => setLoanSubmitting(false));
    };

    const openCancelLoan = (loan) => {
        setSelectedLoan(loan);
        loanCancelForm.reset({ cancelled_reason: "" });
        setLoanCancelModal(true);
    };

    const onCancelLoan = (data) => {
        const body = { cancelled_reason: data.cancelled_reason };

        setLoanSubmitting(true);
        request(`${BackUrl}account/branch_loans/${selectedLoan.id}/cancel/`, "POST", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({ msg: res.message || "Tranzaksiya bekor qilindi", type: "success", active: true }));
                    setLoanCancelModal(false);
                    fetchLoans();
                }
            })
            .catch(() => {})
            .finally(() => setLoanSubmitting(false));
    };

    const openEditLoan = (loan) => {
        setSelectedLoan(loan);
        loanEditForm.reset({
            due_date: loan.due_date,
            reason: loan.reason || "",
            notes: loan.notes || ""
        });
        setLoanEditModal(true);
    };

    const onEditLoan = (data) => {
        const body = {
            due_date: data.due_date,
            reason: data.reason,
            notes: data.notes
        };

        setLoanSubmitting(true);
        request(`${BackUrl}account/branch_loans/${selectedLoan.id}/update/`, "PATCH", JSON.stringify(body), headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({ msg: res.message || "Yangilandi", type: "success", active: true }));
                    setLoanEditModal(false);
                    fetchLoans();
                }
            })
            .catch(() => {})
            .finally(() => setLoanSubmitting(false));
    };

    const fmtShort = (num) => {
        if (!num) return "0";
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)} mln`;
        if (num >= 1000) return `${Math.round(num / 1000)} ming`;
        return num.toLocaleString();
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: { label: "Faol", className: cls.badgeActive },
            settled: { label: "Yopilgan", className: cls.badgeSettled },
            cancelled: { label: "Bekor qilingan", className: cls.badgeCancelled }
        };
        const badge = badges[status] || badges.active;
        return <span className={badge.className}>{badge.label}</span>;
    };

    const getDirBadge = (direction) => {
        const isOut = direction === "out";
        return (
            <span className={isOut ? cls.badgeDirOut : cls.badgeDirIn}>
                {isOut ? "↑ Berilgan" : "↓ Olingan"}
            </span>
        );
    };

    const isOverdue = (loan) => {
        if (loan.status !== "active") return false;
        const daysLeft = Math.ceil((new Date(loan.due_date) - new Date()) / 86400000);
        return daysLeft < 0;
    };

    const totalPages = Math.ceil(loansCount / LOANS_PER_PAGE);

    if (loading) return <DefaultLoader />;

    return (
        <div className={cls.page}>

            <div className={cls.header}>
                <div className={cls.tabs}>
                    {[
                        { key: "types", label: "Harajat turlari" },
                        { key: "logs", label: "Oylik xarajatlar" },
                        { key: "loans", label: "Tranzaksiyalar" },
                    ].map(t => (
                        <button key={t.key}
                            className={`${cls.tabSwitch} ${activeTab === t.key ? cls.tabSwitchActive : ""}`}
                            onClick={() => setActiveTab(t.key)}
                        >{t.label}</button>
                    ))}
                </div>
                <div className={cls.headerBtns}>
                    {activeTab === "loans" && (
                        <Button onClickBtn={openCreateLoan}>+ Tranzaksiya Qo'shish</Button>
                    )}
                    <Button onClickBtn={() => navigate(-1)}>Orqaga</Button>
                </div>
            </div>

            {/* ── Tab: Types ── */}
            {activeTab === "types" && (
                <Table>
                    <thead>
                        <tr><th>#</th><th>Nomi</th><th>Narxi</th><th>Turi</th><th></th></tr>
                    </thead>
                    <tbody>
                        {types.length === 0 ? (
                            <tr><td colSpan={5} className={cls.empty}>Ma'lumot yo'q</td></tr>
                        ) : types.map((item, i) => (
                            <tr key={item.id}>
                                <td>{i + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.cost != null ? item.cost.toLocaleString() : "—"}</td>
                                <td>
                                    <span className={item.changeable ? cls.tagVariable : cls.tagFixed}>
                                        {item.changeable ? "O'zgaruvchan" : "Doimiy"}
                                    </span>
                                </td>
                                <td className={cls.actions}>
                                    {!item.changeable && (
                                        <i className={`fas fa-pen ${cls.editBtn}`} onClick={() => openEditType(item)} />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* ── Tab: Logs ── */}
            {activeTab === "logs" && (
                <div className={cls.logsSection}>
                    <div className={cls.logsHeader}>
                        <MonthYearFilter month={logMonth} year={logYear} onMonth={setLogMonth} onYear={setLogYear} />
                    </div>
                    {logSummary && (
                        <div className={cls.summary}>
                            <div className={cls.summaryCard}><span>Jami</span><strong>{logSummary.total_sum?.toLocaleString() ?? 0}</strong><small>{logSummary.total_count} ta</small></div>
                            <div className={`${cls.summaryCard} ${cls.summaryPaid}`}><span>To'langan</span><strong>{logSummary.paid_sum?.toLocaleString() ?? 0}</strong><small>{logSummary.paid_count} ta</small></div>
                            <div className={`${cls.summaryCard} ${cls.summaryUnpaid}`}><span>To'lanmagan</span><strong>{logSummary.unpaid_sum?.toLocaleString() ?? 0}</strong><small>{logSummary.unpaid_count} ta</small></div>
                        </div>
                    )}
                    <div className={cls.statusTabs}>
                        {[["all", "Barchasi"], ["paid", "To'langan"], ["unpaid", "To'lanmagan"]].map(([val, label]) => (
                            <button key={val} className={`${cls.tab} ${statusFilter === val ? cls.tabActive : ""}`} onClick={() => setStatusFilter(val)}>{label}</button>
                        ))}
                    </div>
                    {logsLoading ? <DefaultLoaderSmall /> : (
                        <Table>
                            <thead><tr><th>#</th><th>Nomi</th><th>Narxi</th><th>Holat</th><th>To'langan sana</th><th></th></tr></thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr><td colSpan={6} className={cls.empty}>Ma'lumot yo'q</td></tr>
                                ) : logs.map((log, i) => (
                                    <tr key={log.id}>
                                        <td>{i + 1}</td>
                                        <td>{log.overhead_type_name}</td>
                                        <td>{log.cost != null ? log.cost.toLocaleString() : "—"}</td>
                                        <td><span className={log.is_paid ? cls.tagFixed : cls.tagVariable}>{log.is_paid ? "To'langan" : "To'lanmagan"}</span></td>
                                        <td>{log.paid_date ?? "—"}</td>
                                        <td>{!log.is_paid && <button className={cls.payBtn} onClick={() => openPay(log)}>To'lash</button>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            )}

            {/* ── Tab: Loans ── */}
            {activeTab === "loans" && (
                <div className={cls.loansSection}>
                    <div className={cls.loansToolbar}>
                        <div className={cls.loansFilters}>
                            <select className={cls.select} value={loanStatusFilter} onChange={e => { setLoanStatusFilter(e.target.value); setLoanPage(1); }}>
                                <option value="">Hammasi</option>
                                <option value="active">Faol</option>
                                <option value="settled">Yopilgan</option>
                                <option value="cancelled">Bekor qilingan</option>
                            </select>
                            <select className={cls.select} value={loanDirFilter} onChange={e => { setLoanDirFilter(e.target.value); setLoanPage(1); }}>
                                <option value="">Hammasi</option>
                                <option value="out">↑ Berilgan</option>
                                <option value="in">↓ Olingan</option>
                            </select>
                            <input
                                type="text"
                                className={cls.searchInput}
                                placeholder="🔍 Qidirish..."
                                value={loanSearch}
                                onChange={e => { setLoanSearch(e.target.value); setLoanPage(1); }}
                            />
                        </div>
                    </div>

                    {loansLoading ? <DefaultLoaderSmall /> : (
                        <>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Kontragent</th>
                                        <th>Telefon</th>
                                        <th>Sabab</th>
                                        <th>Asosiy summa</th>
                                        <th>To'langan</th>
                                        <th>Qoldiq</th>
                                        <th>Yo'nalish</th>
                                        <th>Status</th>
                                        <th>Berilgan sana</th>
                                        <th>Muddat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loans.length === 0 ? (
                                        <tr><td colSpan={11} className={cls.empty}>Ma'lumot topilmadi</td></tr>
                                    ) : loans.map((loan, i) => {
                                        const overdue = isOverdue(loan);
                                        return (
                                            <tr
                                                key={loan.id}
                                                className={`${overdue ? cls.rowOverdue : ""} ${cls.clickableRow}`}
                                                onClick={() => navigate(`/platform/accounting/${locationId}/loan/${loan.id}`)}
                                            >
                                                <td>{(loanPage - 1) * LOANS_PER_PAGE + i + 1}</td>
                                                <td className={cls.counterpartyName}>
                                                    {loan.counterparty?.name} {loan.counterparty?.surname}
                                                </td>
                                                <td className={cls.counterpartyPhone}>
                                                    {loan.counterparty?.phone || "—"}
                                                </td>
                                                <td className={cls.reasonCell}>{loan.reason || "—"}</td>
                                                <td className={cls.amountCell}>{fmtShort(loan.principal_amount)} so'm</td>
                                                <td className={cls.paidCell}>{fmtShort(loan.paid_total)}</td>
                                                <td className={cls.remainingCell}>{fmtShort(loan.remaining_amount)}</td>
                                                <td>{getDirBadge(loan.direction)}</td>
                                                <td>{getStatusBadge(loan.status)}</td>
                                                <td className={cls.dateCell}>{loan.issued_date || "—"}</td>
                                                <td className={overdue ? cls.overdueDate : cls.dateCell}>
                                                    {loan.due_date || "—"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>

                            {totalPages > 1 && (
                                <div className={cls.pagination}>
                                    <div className={cls.paginationInfo}>
                                        Jami <strong>{loansCount}</strong> ta · {loanPage}/{totalPages} sahifa
                                    </div>
                                    <div className={cls.paginationBtns}>
                                        <button
                                            className={cls.pageBtn}
                                            disabled={loanPage === 1}
                                            onClick={() => setLoanPage(p => p - 1)}
                                        >‹</button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (loanPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (loanPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = loanPage - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={`${cls.pageBtn} ${loanPage === pageNum ? cls.pageBtnActive : ""}`}
                                                    onClick={() => setLoanPage(pageNum)}
                                                >{pageNum}</button>
                                            );
                                        })}
                                        <button
                                            className={cls.pageBtn}
                                            disabled={loanPage === totalPages}
                                            onClick={() => setLoanPage(p => p + 1)}
                                        >›</button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* ── Modal: Edit type ── */}
            <Modal activeModal={editModal} setActiveModal={setEditModal}>
                <form className={cls.form} onSubmit={editForm.handleSubmit(onEditType)}>
                    <h2>Harajat turini tahrirlash</h2>
                    <InputForm title="Nomi" register={editForm.register} name="name" type="text" required clazzLabel={cls.inputNoMargin} />
                    {!editChangeable && (
                        <InputForm title="Narxi" register={editForm.register} name="cost" type="number" required clazzLabel={cls.inputNoMargin} />
                    )}
                    <label className={cls.checkboxLabel}>
                        <input type="checkbox" className={cls.checkboxInput} {...editForm.register("changeable")} />
                        <span className={cls.checkboxText}>O'zgaruvchan</span>
                    </label>
                    {submitting ? <DefaultLoaderSmall /> : <button className="input-submit" type="submit">Saqlash</button>}
                </form>
            </Modal>

            {/* ── Modal: Pay log ── */}
            <Modal activeModal={payModal} setActiveModal={setPayModal}>
                <form className={cls.form} onSubmit={payForm.handleSubmit(onPay)}>
                    <h2>{payItem?.overhead_type_name} — To'lash</h2>
                    <InputForm title="Sana" register={payForm.register} name="date" type="date" required />
                    <PaymentTypeSelect register={payForm.register} name="payment_type_id" />
                    {paySubmitting ? <DefaultLoaderSmall /> : <button className="input-submit" type="submit">Tasdiqlash</button>}
                </form>
            </Modal>

            {/* ── Modals: Transactions ── */}
            <Modal activeModal={txAddModal} setActiveModal={setTxAddModal}>
                <form className={cls.form} onSubmit={txAddForm.handleSubmit(onAddTx)}>
                    <h2>Tranzaksiya qo'shish</h2>
                    <InputForm title="Ism" register={txAddForm.register} name="person_name" type="text" required />
                    <InputForm title="Familiya" register={txAddForm.register} name="person_surname" type="text" required />
                    <InputForm title="Telefon" register={txAddForm.register} name="person_phone" type="text" required />
                    <InputForm title="Miqdor" register={txAddForm.register} name="amount" type="number" required />
                    <InputForm title="Sana" register={txAddForm.register} name="date" type="date" required />
                    <InputForm title="Sabab" register={txAddForm.register} name="reason" type="text" required />
                    <label className="input-label">
                        <span className="name-field">Yo'nalish</span>
                        <select className="input-fields" {...txAddForm.register("is_give", { required: true })}>
                            <option value="">Tanlang</option>
                            <option value="true">Berildi</option>
                            <option value="false">Qabul qilindi</option>
                        </select>
                    </label>
                    <PaymentTypeSelect register={txAddForm.register} name="payment_type_id" />
                    {txSubmitting ? <DefaultLoaderSmall /> : <button className="input-submit" type="submit">Tasdiqlash</button>}
                </form>
            </Modal>

            <Modal activeModal={txEditModal} setActiveModal={setTxEditModal}>
                <form className={cls.form} onSubmit={txEditForm.handleSubmit(onEditTx)}>
                    <h2>Tranzaksiyani tahrirlash</h2>
                    <InputForm title="Miqdor" register={txEditForm.register} name="amount" type="number" required />
                    <InputForm title="Sabab" register={txEditForm.register} name="reason" type="text" required />
                    <PaymentTypeSelect register={txEditForm.register} name="payment_type_id" />
                    {txSubmitting ? <DefaultLoaderSmall /> : <button className="input-submit" type="submit">Saqlash</button>}
                </form>
            </Modal>

            <Modal activeModal={txDeleteModal} setActiveModal={setTxDeleteModal}>
                <Confirm text="O'chirishni tasdiqlaysizmi?" setActive={setTxDeleteModal}
                    getConfirm={r => { if (r === "yes") confirmDeleteTx(); }} />
            </Modal>

            {/* ── Modals: Loans ── */}
            <Modal activeModal={loanCreateModal} setActiveModal={setLoanCreateModal}>
                <form className={cls.form} onSubmit={loanCreateForm.handleSubmit(onCreateLoan)}>
                    <h2>Tranzaksiya yaratish</h2>

                    <div className={cls.formRow}>
                        <InputForm title="Ism" register={loanCreateForm.register} name="counterparty_name" type="text" required />
                        <InputForm title="Familiya" register={loanCreateForm.register} name="counterparty_surname" type="text" required />
                    </div>
                    <InputForm title="Telefon" register={loanCreateForm.register} name="counterparty_phone" type="text" required />

                    <div className={cls.formRow}>
                        <label className="input-label">
                            <span className="name-field">Yo'nalish</span>
                            <select className="input-fields" {...loanCreateForm.register("direction", { required: true })}>
                                <option value="">Tanlang</option>
                                <option value="out">↑ Berilgan</option>
                                <option value="in">↓ Olingan</option>
                            </select>
                        </label>

                        <PaymentTypeSelect register={loanCreateForm.register} name="payment_type_id" />
                    </div>

                    <InputForm title="Asosiy summa" register={loanCreateForm.register} name="principal_amount" type="number" required />

                    <div className={cls.formRow}>
                        <InputForm title="Berilgan sana" register={loanCreateForm.register} name="issued_date" type="date" required />
                        <InputForm title="Muddat" register={loanCreateForm.register} name="due_date" type="date" required />
                    </div>

                    <InputForm title="Sabab" register={loanCreateForm.register} name="reason" type="text" required />

                    {loanSubmitting ? <DefaultLoaderSmall /> : (
                        <div className={cls.modalActions}>
                            <button type="button" className={cls.btnSecondary} onClick={() => setLoanCreateModal(false)}>Bekor</button>
                            <button type="submit" className="input-submit">Tranzaksiya yaratish</button>
                        </div>
                    )}
                </form>
            </Modal>

            <Modal activeModal={loanRepayModal} setActiveModal={setLoanRepayModal}>
                <form className={cls.form} onSubmit={loanRepayForm.handleSubmit(onRepayLoan)}>
                    <h2>To'lov kiritish</h2>
                    <p className={cls.loanInfo}>
                        Qoldiq: <strong>{selectedLoan?.remaining_amount?.toLocaleString()} so'm</strong>
                    </p>
                    <InputForm title="Summa" register={loanRepayForm.register} name="amount" type="number" required />
                    <InputForm title="Sana" register={loanRepayForm.register} name="date" type="date" required />
                    <PaymentTypeSelect register={loanRepayForm.register} name="payment_type_id" />
                    {loanSubmitting ? <DefaultLoaderSmall /> : (
                        <div className={cls.modalActions}>
                            <button type="button" className={cls.btnSecondary} onClick={() => setLoanRepayModal(false)}>Bekor</button>
                            <button type="submit" className="input-submit">To'lash</button>
                        </div>
                    )}
                </form>
            </Modal>

            <Modal activeModal={loanEditModal} setActiveModal={setLoanEditModal}>
                <form className={cls.form} onSubmit={loanEditForm.handleSubmit(onEditLoan)}>
                    <h2>Tranzaksiyani tahrirlash</h2>
                    <InputForm title="Yangi muddat" register={loanEditForm.register} name="due_date" type="date" required />
                    <InputForm title="Sabab" register={loanEditForm.register} name="reason" type="text" />
                    <label className="input-label">
                        <span className="name-field">Izoh</span>
                        <textarea className="input-fields" {...loanEditForm.register("notes")} rows={3} />
                    </label>
                    {loanSubmitting ? <DefaultLoaderSmall /> : (
                        <div className={cls.modalActions}>
                            <button type="button" className={cls.btnSecondary} onClick={() => setLoanEditModal(false)}>Bekor</button>
                            <button type="submit" className="input-submit">Saqlash</button>
                        </div>
                    )}
                </form>
            </Modal>

            <Modal activeModal={loanCancelModal} setActiveModal={setLoanCancelModal}>
                <form className={cls.form} onSubmit={loanCancelForm.handleSubmit(onCancelLoan)}>
                    <h2>Tranzaksiyani bekor qilish</h2>
                    <label className="input-label">
                        <span className="name-field">Bekor qilish sababi (majburiy)</span>
                        <textarea className="input-fields" {...loanCancelForm.register("cancelled_reason", { required: true })} rows={3} />
                    </label>
                    {loanSubmitting ? <DefaultLoaderSmall /> : (
                        <div className={cls.modalActions}>
                            <button type="button" className={cls.btnSecondary} onClick={() => setLoanCancelModal(false)}>Bekor</button>
                            <button type="submit" className={cls.btnDanger}>Bekor qilish</button>
                        </div>
                    )}
                </form>
            </Modal>

        </div>
    );
};

export default PlatformHarajatTurlari;
