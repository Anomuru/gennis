import React, { useEffect, useState, useCallback, useRef } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import Input from 'components/platform/platformUI/input';
import Button from 'components/platform/platformUI/button';
import Modal from 'components/platform/platformUI/modal';
import { onDelDebtors, onDelLeads, onChangeProgress } from 'slices/taskManagerSlice';
import { onCallStart, onCallProgressing, onCallEnd } from 'slices/taskManagerModalSlice';
import { setMessage } from 'slices/messageSlice';
import { BackUrl, BackUrlForDoc, headers } from 'constants/global';
import { useHttp } from 'hooks/http.hook';
import socketService from 'services/socketService';

import cls from './taskManagerModal.module.sass';
import DefaultLoader from 'components/loader/defaultLoader/DefaultLoader';

// ============================================================================
// КОНСТАНТЫ
// ============================================================================

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || BackUrlForDoc;

const CALL_TYPES = {
    LEADS: 'leads',
    DEBTORS: 'debtors',
    NEW_STUDENTS: 'new_students',
};

const CALL_TYPE_CONFIG = {
    [CALL_TYPES.LEADS]: {
        label: 'Lead',
        apiUrl: 'task_leads',
        updateUrl: (audioId) => `task_leads/task_leads_update/${audioId}`,
        audioIdField: 'lead_info_id',
        deleteIdField: 'lead_id',
    },
    [CALL_TYPES.DEBTORS]: {
        label: 'Qarzdor',
        apiUrl: 'task_debts',
        updateUrl: () => 'task_debts/call_to_debts',
        audioIdField: 'audio_record_id',
        deleteIdField: 'student_id',
    },
    [CALL_TYPES.NEW_STUDENTS]: {
        label: "Yangi o'quvchi",
        apiUrl: 'task_new_students',
        updateUrl: () => 'task_new_students/call_to_new_students',
        audioIdField: 'audio_record_id',
        deleteIdField: 'student_id',
    },
};

const CALL_STATE = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'error',
};

const STORAGE_KEYS = {
    CALL_ID: 'callId',
    CATEGORY_TYPE: 'categoryType',
    SELECTED_PERSON: 'selectedPerson',
    CALL_STATUS: 'callStatus',
    CALL_STATE: 'callState',
    SHOW_STATUS: 'showStatus',
    AUDIO_ID: 'audioId',
};

// ============================================================================
// УТИЛИТЫ ДЛЯ LOCALSTORAGE
// ============================================================================

const callStorage = {
    saveCallState: ({ callId, type, person, status, state, audioId }) => {
        if (callId) localStorage.setItem(STORAGE_KEYS.CALL_ID, callId);
        if (type) localStorage.setItem(STORAGE_KEYS.CATEGORY_TYPE, type);
        if (person) localStorage.setItem(STORAGE_KEYS.SELECTED_PERSON, JSON.stringify(person));
        if (status) localStorage.setItem(STORAGE_KEYS.CALL_STATUS, status);
        if (state) localStorage.setItem(STORAGE_KEYS.CALL_STATE, state);
        if (audioId) localStorage.setItem(STORAGE_KEYS.AUDIO_ID, audioId);
    },

    loadCallState: () => {
        const callId = localStorage.getItem(STORAGE_KEYS.CALL_ID);
        const type = localStorage.getItem(STORAGE_KEYS.CATEGORY_TYPE);
        const personStr = localStorage.getItem(STORAGE_KEYS.SELECTED_PERSON);
        const status = localStorage.getItem(STORAGE_KEYS.CALL_STATUS);
        const state = localStorage.getItem(STORAGE_KEYS.CALL_STATE);
        const showStatus = localStorage.getItem(STORAGE_KEYS.SHOW_STATUS);
        const audioId = localStorage.getItem(STORAGE_KEYS.AUDIO_ID);

        return {
            callId,
            type,
            person: personStr ? JSON.parse(personStr) : null,
            status,
            state,
            showStatus: showStatus ? Number(showStatus) : 0,
            audioId,
        };
    },

    clearCallState: () => {
        Object.values(STORAGE_KEYS).forEach((key) => {
            localStorage.removeItem(key);
        });
    },

    incrementShowStatus: () => {
        const current = Number(localStorage.getItem(STORAGE_KEYS.SHOW_STATUS) || 0);
        // Не увеличиваем больше 5 (защита от бесконечного роста)
        if (current < 5) {
            localStorage.setItem(STORAGE_KEYS.SHOW_STATUS, String(current + 1));
        }
    },

    resetShowStatus: () => {
        localStorage.setItem(STORAGE_KEYS.SHOW_STATUS, '0');
    },

    moveToAudioState: (audioId) => {
        localStorage.removeItem(STORAGE_KEYS.CALL_ID);
        localStorage.setItem(STORAGE_KEYS.AUDIO_ID, audioId);
        localStorage.setItem(STORAGE_KEYS.CALL_STATUS, 'success');
        localStorage.setItem(STORAGE_KEYS.CALL_STATE, 'success');
        // ✅ ИСПРАВЛЕНО: используем callStorage.resetShowStatus() вместо this.resetShowStatus()
        callStorage.resetShowStatus();
    },

    setErrorState: () => {
        localStorage.removeItem(STORAGE_KEYS.CALL_ID);
        localStorage.setItem(STORAGE_KEYS.CALL_STATUS, 'success');
        localStorage.setItem(STORAGE_KEYS.CALL_STATE, 'error');
        localStorage.setItem(STORAGE_KEYS.SHOW_STATUS, '1');
    },
};

// ============================================================================
// HOOK ДЛЯ ОТПРАВКИ РЕЗУЛЬТАТА
// ============================================================================

const useSubmitCallResult = () => {
    const dispatch = useDispatch();

    const submitCallResult = useCallback(
        async (request, type, audioId, person, comment, date) => {
            const config = CALL_TYPE_CONFIG[type];
            const url = config.updateUrl(audioId);

            const payload =
                type === CALL_TYPES.LEADS
                    ? { comment, date }
                    : {
                        [type === CALL_TYPES.DEBTORS ? 'excuse_id' : 'id']: audioId,
                        phone: person.phone,
                        comment,
                        date,
                    };

            try {

                const response = await request(url, 'POST', JSON.stringify(payload));


                callStorage.clearCallState();

                // Удаление из списка
                if (type === CALL_TYPES.LEADS) {
                    dispatch(onDelLeads({ id: response[config.deleteIdField] }));
                } else {
                    dispatch(onDelDebtors({ id: response[config.deleteIdField], type }));
                }

                // Обновление прогресса
                dispatch(
                    onChangeProgress({
                        progress: response.task_statistics,
                        allProgress: response.task_daily_statistics,
                    })
                );

                // Уведомление
                dispatch(
                    setMessage({
                        msg: response.message,
                        type: 'success',
                        active: true,
                    })
                );

                dispatch(onCallEnd());

                // ✅ ВЫХОД ИЗ КОМНАТЫ И DISCONNECT
                const user = JSON.parse(localStorage.getItem('selectedPerson') || '{}');
                if (user?.id) {
                    socketService.leaveUserRoom(user.id);
                }
                socketService.disconnect();

                return { success: true };
            } catch (error) {
                return { success: false, error };
            }
        },
        [dispatch]
    );

    return { submitCallResult };
};

// ============================================================================
// ГЛАВНЫЙ КОМПОНЕНТ
// ============================================================================

export const TaskManagerModal = () => {
    const dispatch = useDispatch();
    const { request } = useHttp();

    const { isOpen, isActive, person, audioId, callId, status, state, type, msg, callLoading } = useSelector(
        (state) => state.taskManagerModalSlice
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [date, setDate] = useState('');

    // ✅ НОВОЕ: Флаг для отслеживания восстановления состояния
    const stateRestoredRef = useRef(false);
    // ✅ НОВОЕ: Ref для отслеживания текущего userId в сокете
    const currentUserIdRef = useRef(null);

    const { submitCallResult } = useSubmitCallResult();

    // ============================================================================
    // 🔥 ВОССТАНОВЛЕНИЕ СОСТОЯНИЯ (выполняется один раз)
    // ============================================================================

    useEffect(() => {
        // ✅ ИСПРАВЛЕНО: Выполняется только один раз при монтировании
        if (stateRestoredRef.current) return;

        const savedState = callStorage.loadCallState();

        if (!savedState.callId && !savedState.audioId) return;

        // ✅ Отмечаем, что состояние восстановлено
        stateRestoredRef.current = true;

        // ✅ Инкрементируем только при восстановлении
        callStorage.incrementShowStatus();

        const props = {
            person: savedState.person,
            callStatus: savedState.status,
            callState: savedState.state,
            type: savedState.type,
            audioId: savedState.audioId
        };

        if (savedState.state && savedState.state !== 'error') {
            if (savedState.callId) {
                dispatch(onCallStart({ ...props, callId: savedState.callId }));
            } else if (savedState.audioId) {
                dispatch(onCallProgressing({ ...props, audioId: savedState.audioId }));
            }
        } else if (savedState.showStatus >= 3) {
            dispatch(onCallStart(props));
        } else {
            callStorage.clearCallState();
        }
    }, []); // ✅ Пустой массив зависимостей - выполнится один раз

    // ============================================================================
    // 🔥 SOCKET LOGIC
    // ============================================================================

    useEffect(() => {
        const savedState = callStorage.loadCallState();

        const activeCallId = callId || savedState.callId;
        const activeAudioId = audioId || savedState.audioId;

        // ❗ callId и audioId не могут быть одновременно
        if (activeCallId && activeAudioId) {
            return;
        }

        // ✅ Если есть audioId (но НЕТ callId) → НЕ подключаемся к сокету
        if (activeAudioId && !activeCallId) {
            return;
        }

        // ✅ Если есть callId → подключаемся к сокету
        if (activeCallId) {
            const user = JSON.parse(localStorage.getItem('selectedPerson') || '{}');
            const userId = user?.id;

            if (!userId) {
                return;
            }

            // ✅ ИСПРАВЛЕНО: Отключаем старый сокет перед новым подключением
            if (currentUserIdRef.current && currentUserIdRef.current !== userId) {
                socketService.leaveUserRoom(currentUserIdRef.current);
                socketService.disconnect();
            }

            currentUserIdRef.current = userId;

            // Подключаемся к сокету если не подключены
            if (!socketService.isConnected()) {
                socketService.connect(SOCKET_URL);
            }

            // Присоединяемся к комнате пользователя
            socketService.joinUserRoom(userId);

            // Обработчик событий call_status
            const handleCallStatus = (data) => {
                const {
                    callid,
                    status: callStatus,
                    elapsed,
                    duration,
                    call_status,
                    info,
                    error,
                    message,
                    student_id,
                    result,
                    attempt_count
                } = data;

                let normalized;

                switch (callStatus) {
                    case 'monitoring_started':
                    case 'validating':
                    case 'preparing':
                    case 'initiating':
                        normalized = {
                            state: 'PENDING',
                            result: {
                                success: false,
                                callId: callid,
                                studentId: student_id,
                                message: message || 'Call initiated',
                            },
                        };
                        break;

                    case 'calling':
                    case 'in_progress':
                        normalized = {
                            loadingStatus: "inLive",
                            state: 'PENDING',
                            result: {
                                success: false,
                                callId: callid,
                                studentId: student_id,
                                elapsed,
                                message: message || `Call in progress... ${elapsed}s`
                            },
                        };
                        break;

                    case 'processing':
                        normalized = {
                            loadingStatus: "recording",
                            state: 'PENDING',
                            result: {
                                success: false,
                                callId: callid,
                                studentId: student_id,
                                elapsed,
                                message: message || 'Processing...'
                            },
                        };
                        break;

                    case 'completed': {
                        const isSuccess =
                            call_status === 'success' ||
                            call_status === 'ANSWERED' ||
                            call_status === 'answered';

                        const config = CALL_TYPE_CONFIG[type || savedState.type];
                        const extractedAudioId =
                            result?.[config?.audioIdField] ||
                            result?.id ||
                            result?.audio_id ||
                            info?.id ||
                            info?.audio_id;

                        normalized = {
                            loadingStatus: "success",
                            state: 'SUCCESS',
                            result: {
                                audioId: extractedAudioId,
                                success: isSuccess,
                                callId: callid,
                                studentId: student_id,
                                duration,
                                call_status,
                                info,
                                message: message || (isSuccess ? 'Call succeeded' : 'Call failed'),
                                ...(config && extractedAudioId ? { [config.audioIdField]: extractedAudioId } : {}),
                                attempts: result?.attempts || (isSuccess ? 1 : 2),
                            },
                        };

                        // ✅ Если успешно → сохраняем audioId и убираем callId
                        if (isSuccess && extractedAudioId) {
                            callStorage.moveToAudioState(extractedAudioId);
                        } else {
                            callStorage.setErrorState();
                        }

                        // ✅ ИСПРАВЛЕНО: Отключаемся после завершения
                        socketService.leaveUserRoom(userId);
                        socketService.disconnect();
                        currentUserIdRef.current = null;
                        break;
                    }

                    case 'failed':
                    case 'error':
                    case 'timeout':
                    case 'unanswered':
                        normalized = {
                            loadingStatus: "error",
                            state: 'SUCCESS',
                            result: {
                                success: false,
                                callId: callid,
                                studentId: student_id,
                                error: error || message || 'Call failed',
                                attempts: attempt_count,
                            },
                        };

                        callStorage.setErrorState();
                        socketService.leaveUserRoom(userId);
                        socketService.disconnect();
                        currentUserIdRef.current = null;
                        break;

                    default:
                        return;
                }

                // Обновляем Redux
                if (normalized.state === 'PENDING') {
                    dispatch(
                        onCallProgressing({
                            person: person || savedState.person,
                            type: type || savedState.type,
                            audioId: null,
                            callId: normalized.result.callId,
                            callStatus: 'loading',
                            callState: 'loading',
                            msg: normalized.result.message
                        })
                    );
                } else if (normalized.state === 'SUCCESS') {
                    if (normalized.result.success) {
                        dispatch(
                            onCallProgressing({
                                audioId: normalized.result.audioId,
                                person: person || savedState.person,
                                callStatus: 'success',
                                callState: 'success',
                                msg: normalized.result.message,
                                callId: null,
                                type: type || savedState.type,
                            })
                        );
                    } else {
                        dispatch(
                            onCallProgressing({
                                person: person || savedState.person,
                                type: type || savedState.type,
                                audioId: null,
                                callId: null,
                                callStatus: 'success',
                                callState: 'error',
                                msg: normalized.result.error,
                            })
                        );

                        if (normalized.result.attempts === 2) {
                            const personData = person || savedState.person;
                            const callType = type || savedState.type;

                            if (callType === CALL_TYPES.LEADS) {
                                dispatch(onDelLeads({ id: personData.id }));
                            } else {
                                dispatch(onDelDebtors({ id: personData.id, type: callType }));
                            }
                        }
                    }
                }
            };

            if (typeof socketService.onCallStatus !== 'function') {
                console.error('❌ socketService.onCallStatus is not a function!', socketService);
                return;
            }

            // Подписываемся на события
            socketService.onCallStatus(handleCallStatus);

            // ✅ ИСПРАВЛЕНО: Включен cleanup
            return () => {
                socketService.offCallStatus();
                if (currentUserIdRef.current) {
                    socketService.leaveUserRoom(currentUserIdRef.current);
                }
                // Не отключаем сокет здесь полностью, т.к. может быть активный звонок
                // Отключение происходит в handleCallStatus при завершении/ошибке
            };
        }

    }, [callId, audioId, dispatch, person, type]);

    // ... остальной код остается без изменений

    // ============================================================================
    // ВОССТАНОВЛЕНИЕ СОСТОЯНИЯ
    // ============================================================================

    useEffect(() => {
        const savedState = callStorage.loadCallState();


        if (!savedState.callId && !savedState.audioId) return;

        callStorage.incrementShowStatus();

        const props = {
            person: savedState.person,
            callStatus: savedState.status,
            callState: savedState.state,
            type: savedState.type,
            audioId: savedState.audioId
        };

        if (savedState.state && savedState.state !== 'error') {
            if (savedState.callId) {
                dispatch(onCallStart({ ...props, callId: savedState.callId }));
            } else if (savedState.audioId) {
                dispatch(onCallProgressing({ ...props, audioId: savedState.audioId }));
            }
        } else if (savedState.showStatus >= 3) {
            dispatch(onCallStart(props));
        } else {
            callStorage.clearCallState();
        }
    }, [dispatch]);

    // Синхронизация модального окна
    useEffect(() => {
        setIsModalOpen(isOpen || state === 'error');
    }, [isOpen, state]);

    // Обработчик отправки формы
    const handleSubmit = useCallback(async () => {
        const result = await submitCallResult(
            (url, method, body) => request(`${BackUrl}${url}`, method, body, headers()),
            type,
            audioId,
            person,
            comment,
            date
        );

        if (result.success) {
            setIsModalOpen(false);
            setComment('');
            setDate('');
        }
    }, [request, type, audioId, person, comment, date, submitCallResult]);

    const typeLabel = type ? CALL_TYPE_CONFIG[type]?.label : '';

    return (
        <>
            <div className={classNames(cls.modal, { [cls.active]: true })}>
                <i
                    onClick={() => isActive && setIsModalOpen(true)}
                    className={classNames('fa-solid fa-headset', cls.modal__icon, {
                        [cls.active]: status === 'loading',
                        [cls.pass]: status === 'success',
                    })}
                />
            </div>

            <Modal activeModal={isModalOpen} setActiveModal={setIsModalOpen} extraClass={cls.audioModal}>
                {person && (
                    <div className={cls.audioModal__header}>
                        <h1>{typeLabel}</h1>
                        <h1>
                            {person.fullName} <span>({person.phone})</span>
                        </h1>
                    </div>
                )}

                <div className={cls.audioModal__loader}>
                    {
                        callLoading
                            ? <DefaultLoader />
                            : <CallStatusLoader msg={msg} status={status} state={state} />
                    }
                </div>

                {status === 'success' && state !== 'error' && (
                    <>
                        <Input required title="Koment" placeholder="Koment" value={comment} onChange={setComment} />
                        <Input required type="date" title="Kun" value={date} onChange={setDate} />
                        <Button onClickBtn={handleSubmit}>Kiritish</Button>
                    </>
                )}
            </Modal>
        </>
    );
};

// ============================================================================
// КОМПОНЕНТ ЗАГРУЗЧИКА
// ============================================================================

const CallStatusLoader = ({ status, state, msg }) => {
    const [showCheckmark, setShowCheckmark] = useState(false);

    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => setShowCheckmark(true), 100);
            return () => clearTimeout(timer);
        }
        setShowCheckmark(false);
    }, [status]);

    const isError = state === 'error';
    const statusText =
        msg ? msg
            : status === 'loading'
                ? 'Calling in progress...'
                : status === 'success'
                    ? isError
                        ? 'Call rejected'
                        : 'Call succeeded'
                    : 'Call connecting...';

    return (
        <div className={cls.container}>
            <div className={cls.loaderWrapper}>
                <span className={classNames(cls.parent, { [cls.fadeOut]: status === 'success' })}>
                    <span className={cls.loader} />
                </span>

                <svg
                    className={`${cls.checkmark} ${showCheckmark ? cls.show : ''}`}
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {isError ? (
                        <path
                            style={{ stroke: '#e53935' }}
                            className={cls.checkmarkPath}
                            d="M 30 30 L 70 70 M 70 30 L 30 70"
                        />
                    ) : (
                        <path className={cls.checkmarkPath} d="M 25 52 L 42 68 L 75 32" />
                    )}
                </svg>
            </div>

            <p style={isError ? { color: '#e53935' } : null} className={cls.statusText}>
                {statusText}
            </p>
        </div>
    );
};