import React, { useState, useEffect } from 'react';
import styles from './application.module.scss';
import {BackUrl, headers} from "../../../constants/global";
import {useHttp} from "../../../hooks/http.hook";
import {useParams} from "react-router-dom";

 const ApplicationSystem = () => {
    const [activeTab, setActiveTab] = useState('requests');
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filterBranch, setFilterBranch] = useState('');
    const [filterUser, setFilterUser] = useState('');
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const {locationId} = useParams();
    const userId = localStorage.getItem('user_id');
    const {request} = useHttp()
     console.log(userId, "userId")
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        deadline: '',
        branch_id: Number(locationId),
        user_id: Number(userId),
        comment: ''
    });

    // API base URL

    // Mock data for demo
     let API_URL = BackUrl

    useEffect(() => {
        request(`${API_URL}admin-requests/?branch=${locationId}` , "GET" , null , headers())
            .then(res => {
                console.log(res)
                setRequests(res)
            })
    }, []);


    //
    const createRequest = async () => {
        request(`${API_URL}admin-requests/` , "POST" , JSON.stringify(formData) , headers())
            .then(res => {
                setRequests([...requests , res])
                setShowCreateModal(false);
                resetForm();
            })
    };
    //
    const addComment = async (requestId) => {
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`${API_URL}request-comments/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    request: requestId,
                    user_id: Number(userId), // current user id
                    text: newComment
                })
            });
            const data = await response.json();

            // For demo
            // const comment = {
            //     id: Date.now(),
            //     user_name: "Current User",
            //     text: newComment,
            //     created_at: new Date().toISOString(),
            //     request: requestId,
            //     user: 2
            // };

            const updatedRequests = requests.map(req => {
                if (req.id === requestId) {
                    return {
                        ...req,
                        comments: [...req.comments, data]
                    };
                }
                return req;
            });

            setRequests(updatedRequests);
            if (selectedRequest?.id === requestId) {
                setSelectedRequest({
                    ...selectedRequest,
                    comments: [...selectedRequest.comments, data]
                });
            }
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    //
    const deleteRequest = async (id) => {
        if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;

        try {
            await fetch(`${API_URL}admin-requests/${id}/`, {
                method: 'DELETE'
            });

            setRequests(requests.filter(req => req.id !== id));
            if (selectedRequest?.id === id) {
                setSelectedRequest(null);
            }
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            deadline: '',
            branch: '',
            user: '',
            comment: ''
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) return styles.expired;
        if (daysLeft <= 3) return styles.urgent;
        if (daysLeft <= 7) return styles.soon;
        return styles.normal;
    };

    return (
        <div className={styles.applicationSystem}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>
                        <i className="fa-solid fa-notes-medical"></i>
                        Talablar Tizimi
                    </h1>
                    <p className={styles.subtitle}>
                        Talablarni yarating, kuzating va boshqaring
                    </p>
                </div>
                <button
                    className={styles.createBtn}
                    onClick={() => setShowCreateModal(true)}
                >
                    <span>+</span>
                    Yangi talab
                </button>
            </div>

            <div className={styles.controls}>
                {/*<div className={styles.filters}>*/}
                {/*    <div className={styles.filterGroup}>*/}
                {/*        <label>Filial</label>*/}
                {/*        <select*/}
                {/*            value={filterBranch}*/}
                {/*            onChange={(e) => setFilterBranch(e.target.value)}*/}
                {/*        >*/}
                {/*            <option value="">Barcha filiallar</option>*/}
                {/*            <option value="1">Toshkent Filiali</option>*/}
                {/*            <option value="2">Samarqand Filiali</option>*/}
                {/*        </select>*/}
                {/*    </div>*/}
                {/*    <div className={styles.filterGroup}>*/}
                {/*        <label>Foydalanuvchi</label>*/}
                {/*        <select*/}
                {/*            value={filterUser}*/}
                {/*            onChange={(e) => setFilterUser(e.target.value)}*/}
                {/*        >*/}
                {/*            <option value="">Barcha foydalanuvchilar</option>*/}
                {/*            <option value="5">Ali Valiyev</option>*/}
                {/*            <option value="3">Bobur Karimov</option>*/}
                {/*        </select>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{requests.length}</div>
                        <div className={styles.statLabel}>Jami talablar</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>
                            {requests.filter(r => new Date(r.deadline) <= new Date()).length}
                        </div>
                        <div className={styles.statLabel}>Muddati o'tgan</div>
                    </div>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.requestsList}>
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Yuklanmoqda...</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>📭</div>
                            <p>Talablar topilmadi</p>
                        </div>
                    ) : (
                        requests.map(request => (
                            <div
                                key={request.id}
                                className={`${styles.requestCard} ${selectedRequest?.id === request.id ? styles.active : ''}`}
                                onClick={() => setSelectedRequest(request)}
                            >
                                <div className={styles.requestHeader}>
                                    <h3>{request.name}</h3>
                                    <span className={`${styles.deadline} ${getStatusColor(request.deadline)}`}>
                                        {formatDate(request.deadline)}
                                    </span>
                                </div>
                                <p className={styles.requestDesc}>{request.description}</p>
                                <div className={styles.requestMeta}>
                                    <span className={styles.branch}>
                                        🏢 {request.branch_name}
                                    </span>
                                    <span className={styles.user}>
                                        👤 {request.user_name}
                                    </span>
                                    <span className={styles.comments}>
                                        💬 {request?.comments?.length}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedRequest && (
                    <div className={styles.requestDetails}>
                        <div className={styles.detailsHeader}>
                            <h2>{selectedRequest.name}</h2>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => deleteRequest(selectedRequest.id)}
                            >
                                🗑️ O'chirish
                            </button>
                        </div>

                        <div className={styles.detailsBody}>
                            <div className={styles.detailSection}>
                                <label>Tavsif</label>
                                <p>{selectedRequest.description}</p>
                            </div>

                            <div className={styles.detailSection}>
                                <label>Asosiy komment</label>
                                <p>{selectedRequest.comment || "Komment yo'q"}</p>
                            </div>

                            <div className={styles.detailRow}>
                                <div className={styles.detailSection}>
                                    <label>Muddat</label>
                                    <p className={getStatusColor(selectedRequest.deadline)}>
                                        {formatDate(selectedRequest.deadline)}
                                    </p>
                                </div>
                                <div className={styles.detailSection}>
                                    <label>Yaratilgan</label>
                                    <p>{formatDate(selectedRequest.created_at)}</p>
                                </div>
                            </div>

                            <div className={styles.detailRow}>
                                <div className={styles.detailSection}>
                                    <label>Filial</label>
                                    <p>{selectedRequest.branch_name}</p>
                                </div>
                                <div className={styles.detailSection}>
                                    <label>Yaratuvchi</label>
                                    <p>{selectedRequest.user_name}</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.commentsSection}>
                            <h3>Izohlar ({selectedRequest.comments.length})</h3>
                            <div className={styles.commentsList}>
                                {selectedRequest.comments.map(comment => (
                                    <div key={comment.id} className={styles.comment}>
                                        <div className={styles.commentHeader}>
                                            <strong>{comment.user_name}</strong>
                                            <span className={styles.commentDate}>
                                                {formatDate(comment.created_at)}
                                            </span>
                                        </div>
                                        <p className={styles.commentText}>{comment.text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.addComment}>
                                <textarea
                                    placeholder="Izoh qo'shish..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows={3}
                                />
                                <button
                                    onClick={() => addComment(selectedRequest.id)}
                                    disabled={!newComment.trim()}
                                >
                                    Yuborish
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <div className={styles.modal} onClick={() => setShowCreateModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Yangi talab yaratish</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowCreateModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Nomi *</label>
                                <input
                                    type="text"
                                    placeholder="Masalan: Yangi printer"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Tavsif *</label>
                                <textarea
                                    placeholder="Talab haqida batafsil ma'lumot..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    rows={4}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Muddat *</label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                    />
                                </div>

                                {/*<div className={styles.formGroup}>*/}
                                {/*    <label>Filial *</label>*/}
                                {/*    <select*/}
                                {/*        value={formData.branch}*/}
                                {/*        onChange={(e) => setFormData({...formData, branch: e.target.value})}*/}
                                {/*    >*/}
                                {/*        <option value="">Tanlang</option>*/}
                                {/*        <option value="1">Toshkent Filiali</option>*/}
                                {/*        <option value="2">Samarqand Filiali</option>*/}
                                {/*    </select>*/}
                                {/*</div>*/}
                            </div>

                            {/*<div className={styles.formGroup}>*/}
                            {/*    <label>Foydalanuvchi *</label>*/}
                            {/*    <select*/}
                            {/*        value={formData.user}*/}
                            {/*        onChange={(e) => setFormData({...formData, user: e.target.value})}*/}
                            {/*    >*/}
                            {/*        <option value="">Tanlang</option>*/}
                            {/*        <option value="5">Ali Valiyev</option>*/}
                            {/*        <option value="3">Bobur Karimov</option>*/}
                            {/*    </select>*/}
                            {/*</div>*/}

                            <div className={styles.formGroup}>
                                <label>Komment</label>
                                <textarea
                                    placeholder="Ixtiyoriy komment..."
                                    value={formData.comment}
                                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetForm();
                                }}
                            >
                                Bekor qilish
                            </button>
                            <button
                                className={styles.submitBtn}
                                onClick={createRequest}
                                disabled={!formData.name || !formData.description || !formData.deadline }
                            >
                                Yaratish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ApplicationSystem