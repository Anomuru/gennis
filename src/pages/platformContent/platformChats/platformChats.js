import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchChatReports } from 'slices/chatsSlice';
import cls from './platformChats.module.sass';

const PlatformChats = () => {
    const dispatch = useDispatch();
    const { locationId } = useParams();
    const { reports, fetchReportsStatus } = useSelector(state => state.chatsSlice);

    useEffect(() => {
        dispatch(fetchChatReports(locationId));
    }, [dispatch, locationId]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const parseAiText = (text) => {
        if (!text) return null;
        return text
            .split('\n')
            .filter(line => line.trim())
            .map((line, i) => {
                const boldReplaced = line.replace(/\*\*(.*?)\*\*/g, '<em>$1</em>');
                return <p key={i} dangerouslySetInnerHTML={{ __html: boldReplaced }} />;
            });
    };

    if (fetchReportsStatus === 'loading') {
        return (
            <div className={cls.chatsContainer}>
                <div className={cls.chatsContainer__loading}>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '1rem' }} />
                    Yuklanmoqda...
                </div>
            </div>
        );
    }

    return (
        <div className={cls.chatsContainer}>
            <div className={cls.chatsContainer__header}>
                <h2>
                    <i className="fas fa-comments" style={{ marginRight: '1rem', color: '#05C4FF' }} />
                    Chat hisobotlari
                </h2>
                {reports?.length > 0 && (
                    <span className={cls.count}>{reports.length} ta guruh</span>
                )}
            </div>

            <div className={cls.chatsContainer__grid}>
                {reports?.map(report => (
                    <div key={report.id} className={cls.reportCard}>

                        {/* HEAD */}
                        <div className={cls.reportCard__head}>
                            <span className={cls.groupName}>{report.group?.name}</span>
                            <span className={cls.date}>{formatDate(report.report_date)}</span>
                        </div>

                        {/* STATS */}
                        <div className={cls.reportCard__stats}>
                            <div className={cls.stat}>
                                <span className={cls.stat__value}>{report.stats?.total_messages ?? 0}</span>
                                <span className={cls.stat__label}>Jami xabar</span>
                            </div>
                            <div className={cls.stat}>
                                <span className={cls.stat__value}>{report.stats?.active_members ?? 0}</span>
                                <span className={cls.stat__label}>Faol a'zo</span>
                            </div>
                            <div className={cls.stat}>
                                <span className={cls.stat__value}>{report.total_members_today ?? 0}</span>
                                <span className={cls.stat__label}>Bugungi a'zo</span>
                            </div>
                        </div>

                        {/* TOP MEMBERS */}
                        {report.top_members?.length > 0 && (
                            <div className={cls.reportCard__members}>
                                <div className={cls.membersTitle}>
                                    <i className="fas fa-users" style={{ marginRight: '0.5rem' }} />
                                    Faol a'zolar
                                </div>
                                <div className={cls.membersList}>
                                    {report.top_members.map(member => (
                                        <div key={member.rank} className={cls.member}>
                                            <span className={cls.member__rank}>#{member.rank}</span>
                                            <span className={cls.member__name}>{member.display_name}</span>
                                            <span className={cls.member__count}>{member.message_count} ta</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AI ANALYSIS */}
                        <div className={cls.reportCard__ai}>
                            <div className={cls.aiTitle}>
                                <i className="fas fa-robot" />
                                AI tahlil
                            </div>
                            {report.ai_analysis ? (
                                <div className={cls.aiText}>
                                    {parseAiText(report.ai_analysis)}
                                </div>
                            ) : (
                                <div className={cls.noAi}>Tahlil mavjud emas</div>
                            )}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlatformChats;

