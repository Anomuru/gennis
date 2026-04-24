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

    useEffect(() => {
        fetchTypes();
        dispatch(fetchDataToChange(locationId));
    }, [locationId]);

    useEffect(() => { fetchLogs(); }, [locationId, logMonth, logYear, statusFilter]);
    useEffect(() => { fetchTxs(); }, [locationId, txMonth, txYear, dirFilter]);
    useEffect(() => { if (showDeleted) fetchDeletedTypes(); }, [locationId, showDeleted]);
    useEffect(() => { if (showDeletedTx) fetchDeletedTxs(); }, [locationId, txMonth, txYear, showDeletedTx]);

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

    if (loading) return <DefaultLoader />;

    return (
        <div className={cls.page}>

            <div className={cls.header}>
                <div className={cls.tabs}>
                    {[
                        { key: "types", label: "Harajat turlari" },
                        { key: "logs", label: "Oylik xarajatlar" },
                        { key: "tx", label: "Filial tranzaksiyalari" },
                    ].map(t => (
                        <button key={t.key}
                            className={`${cls.tabSwitch} ${activeTab === t.key ? cls.tabSwitchActive : ""}`}
                            onClick={() => setActiveTab(t.key)}
                        >{t.label}</button>
                    ))}
                </div>
                <div className={cls.headerBtns}>
                    {activeTab === "types" && (
                        <>
                            <Button onClickBtn={() => { addForm.reset({ name: "", cost: "", changeable: false }); setAddModal(true); }}>Qo'shish</Button>
                            <Button onClickBtn={() => setShowDeleted(prev => !prev)}>
                                {showDeleted ? "Faollar" : "O'chirilgan"}
                            </Button>
                        </>
                    )}
                    {activeTab === "tx" && (
                        <>
                            <Button onClickBtn={openAddTx}>Qo'shish</Button>
                            <Button onClickBtn={() => setShowDeletedTx(prev => !prev)}>
                                {showDeletedTx ? "Faollar" : "O'chirilgan"}
                            </Button>
                        </>
                    )}
                    <Button onClickBtn={() => navigate(-1)}>Orqaga</Button>
                </div>
            </div>

            {/* ── Tab: Types ── */}
            {activeTab === "types" && (
                deletedLoading ? <DefaultLoaderSmall /> : (
                <Table>
                    <thead>
                        <tr><th>#</th><th>Nomi</th><th>Narxi</th><th>Turi</th>{!showDeleted && <th></th>}</tr>
                    </thead>
                    <tbody>
                        {(showDeleted ? deletedTypes : types).length === 0 ? (
                            <tr><td colSpan={showDeleted ? 4 : 5} className={cls.empty}>Ma'lumot yo'q</td></tr>
                        ) : (showDeleted ? deletedTypes : types).map((item, i) => (
                            <tr key={item.id} className={showDeleted ? cls.rowDeleted : ""}>
                                <td>{i + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.cost != null ? item.cost.toLocaleString() : "—"}</td>
                                <td>
                                    <span className={item.changeable ? cls.tagVariable : cls.tagFixed}>
                                        {item.changeable ? "O'zgaruvchan" : "Doimiy"}
                                    </span>
                                </td>
                                {!showDeleted && (
                                    <td className={cls.actions}>
                                        <i className={`fas fa-pen ${cls.editBtn}`} onClick={() => openEditType(item)} />
                                        <i className={`fas fa-times ${cls.deleteBtn}`} onClick={() => openDeleteType(item.id)} />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
                )
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

            {/* ── Tab: Transactions ── */}
            {activeTab === "tx" && (
                <div className={cls.logsSection}>
                    <div className={cls.logsHeader}>
                        <MonthYearFilter month={txMonth} year={txYear} onMonth={setTxMonth} onYear={setTxYear} />
                    </div>
                    {txSummary && (
                        <div className={cls.summary}>
                            <div className={`${cls.summaryCard} ${cls.summaryUnpaid}`}><span>Berildi</span><strong>{txSummary.total_given?.toLocaleString() ?? 0}</strong></div>
                            <div className={`${cls.summaryCard} ${cls.summaryPaid}`}><span>Qabul qilindi</span><strong>{txSummary.total_received?.toLocaleString() ?? 0}</strong></div>
                            <div className={`${cls.summaryCard} ${txSummary.net < 0 ? cls.summaryUnpaid : cls.summaryPaid}`}><span>Saldo</span><strong>{txSummary.net?.toLocaleString() ?? 0}</strong></div>
                        </div>
                    )}
                    <div className={cls.statusTabs}>
                        {[["all", "Barchasi"], ["give", "Berildi"], ["receive", "Qabul qilindi"]].map(([val, label]) => (
                            <button key={val} className={`${cls.tab} ${dirFilter === val ? cls.tabActive : ""}`} onClick={() => setDirFilter(val)}>{label}</button>
                        ))}
                    </div>
                    {(txLoading || deletedTxLoading) ? <DefaultLoaderSmall /> : (
                        <Table>
                            <thead><tr><th>#</th><th>Shaxs</th><th>Telefon</th><th>Miqdor</th><th>Yo'nalish</th><th>Sabab</th><th>To'lov turi</th><th>Sana</th>{!showDeletedTx && <th></th>}</tr></thead>
                            <tbody>
                                {(showDeletedTx ? deletedTxs : txs).length === 0 ? (
                                    <tr><td colSpan={showDeletedTx ? 8 : 9} className={cls.empty}>Ma'lumot yo'q</td></tr>
                                ) : (showDeletedTx ? deletedTxs : txs).map((tx, i) => (
                                    <tr key={tx.id} className={showDeletedTx ? cls.rowDeleted : ""}>
                                        <td>{i + 1}</td>
                                        <td>{tx.person ? `${tx.person.name} ${tx.person.surname}` : "—"}</td>
                                        <td>{tx.person?.phone ?? "—"}</td>
                                        <td>{tx.amount?.toLocaleString()}</td>
                                        <td><span className={tx.is_give ? cls.tagVariable : cls.tagFixed}>{tx.is_give ? "Berildi" : "Qabul qilindi"}</span></td>
                                        <td>{tx.reason}</td>
                                        <td>{tx.payment_type}</td>
                                        <td>{tx.date}</td>
                                        {!showDeletedTx && (
                                            <td className={cls.actions}>
                                                <i className={`fas fa-pen ${cls.editBtn}`} onClick={() => openEditTx(tx)} />
                                                <i className={`fas fa-times ${cls.deleteBtn}`} onClick={() => openDeleteTx(tx.id)} />
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            )}

            {/* ── Modals: Types ── */}
            <Modal activeModal={addModal} setActiveModal={setAddModal}>
                <form className={cls.form} onSubmit={addForm.handleSubmit(onAddType)}>
                    <h2>Yangi tur qo'shish</h2>
                    <InputForm title="Nomi" register={addForm.register} name="name" type="text" required />
                    <label className={cls.checkLabel}>
                        <input type="checkbox" {...addForm.register("changeable")} />
                        <span>O'zgaruvchan narx</span>
                    </label>
                    {!addChangeable && <InputForm title="Narxi" register={addForm.register} name="cost" type="number" required />}
                    {submitting ? <DefaultLoaderSmall /> : <button className="input-submit" type="submit">Tasdiqlash</button>}
                </form>
            </Modal>

            <Modal activeModal={editModal} setActiveModal={setEditModal}>
                <form className={cls.form} onSubmit={editForm.handleSubmit(onEditType)}>
                    <h2>Tahrirlash</h2>
                    <InputForm title="Nomi" register={editForm.register} name="name" type="text" required />
                    <label className={cls.checkLabel}>
                        <input type="checkbox" {...editForm.register("changeable")} />
                        <span>O'zgaruvchan narx</span>
                    </label>
                    {!editChangeable && <InputForm title="Narxi" register={editForm.register} name="cost" type="number" required />}
                    {submitting ? <DefaultLoaderSmall /> : <button className="input-submit" type="submit">Saqlash</button>}
                </form>
            </Modal>

            <Modal activeModal={deleteModal} setActiveModal={setDeleteModal}>
                <Confirm text="O'chirishni tasdiqlaysizmi?" setActive={setDeleteModal}
                    getConfirm={r => { if (r === "yes") confirmDeleteType(); }} />
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

        </div>
    );
};

export default PlatformHarajatTurlari;
