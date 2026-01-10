import React, { useEffect, useState } from 'react';
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import Input from "components/platform/platformUI/input";
import Button from "components/platform/platformUI/button";
import Modal from "components/platform/platformUI/modal";
import { callStart, onChangeProgress, onDelDebtors, onDelLeads } from "slices/taskManagerSlice";
import { BackUrl, headers } from "constants/global";
import { useHttp } from "hooks/http.hook";

import cls from "./taskManagerModal.module.sass";
import { onCallEnd, onCallProgressing, onCallStart } from "slices/taskManagerModalSlice";
import { setMessage } from "slices/messageSlice";
import { createPortal } from "react-dom";

export const TaskManagerModal = () => {

    const {
        isOpen,
        isActive,
        person,
        audioId,
        callId,
        status,
        state,
        type
    } = useSelector(state => state.taskManagerModalSlice)


    const lastCallId = localStorage.getItem("callId")
    const lastCategoryType = localStorage.getItem("categoryType")
    const lastSelectedPerson = localStorage.getItem("selectedPerson")
    const lastCallStatus = localStorage.getItem("callStatus")
    const lastCallState = localStorage.getItem("callState")
    const lastShowStatus = localStorage.getItem("showStatus")
    const lastAudioId = localStorage.getItem("audioId")


    const { request } = useHttp()
    const dispatch = useDispatch()


    const [isCall, setIsCall] = useState(false)

    const [audioCom, setAudioCom] = useState(null)
    const [audioDate, setAudioDate] = useState(null)

    useEffect(() => {
        if (lastShowStatus)
            localStorage.setItem("showStatus", Number(lastShowStatus) + 1)
    }, [])

    useEffect(() => {
        console.log(lastCallId, lastCategoryType, lastSelectedPerson, lastCallStatus, lastCallState, lastShowStatus, lastAudioId)

        if (lastCallState && lastCallState !== "error") {
            console.log(true)
            let props = {
                person: JSON.parse(lastSelectedPerson),
                callStatus: lastCallStatus,
                callState: lastCallState,
                type: lastCategoryType
            };
            if (lastCallId) {
                dispatch(onCallStart({
                    ...props,
                    callId: lastCallId,
                }))
            } else {
                dispatch(onCallProgressing({
                    ...props,
                    audioId: lastAudioId,
                }))
            }
        } else {
            console.log(lastShowStatus, "lastShowStatus");

            if (lastShowStatus && Number(lastShowStatus) >= 3) {
                dispatch(onCallStart({
                    person: JSON.parse(lastSelectedPerson),
                    callStatus: lastCallStatus,
                    callState: lastCallState,
                    type: lastCategoryType,
                }))
            } else {
                console.log(false)
                localStorage.removeItem("callId")
                localStorage.removeItem("categoryType")
                localStorage.removeItem("selectedPerson")
                localStorage.removeItem("callStatus")
                localStorage.removeItem("callState")
                localStorage.removeItem("showStatus")
                localStorage.removeItem("audioId")
            }
        }
    }, [lastCallId, lastCallStatus, lastCallState, lastCategoryType, lastSelectedPerson, lastShowStatus])

    console.log(type, "type")

    useEffect(() => {
        setIsCall(isOpen)
    }, [isOpen])

    useEffect(() => {
        if (state === "error") {
            setIsCall(true)
        }
    }, [state])

    useEffect(() => {
        if (!callId) return;

        let isActive = true;
        let timeoutId = null;

        setIsCall(true);

        const poll = async () => {
            if (!isActive && status === "loading") return;

            try {
                let url;
                if (type === "leads") {
                    url = "task_leads"
                } else if (type === "debtors") {
                    url = "task_debts"
                } else {
                    url = "task_new_students"
                }

                const response = await request(
                    `${BackUrl}${url}/call-status/${callId}`,
                    "GET",
                    null,
                    headers()
                );

                // setSelectedAudioId(prev => ({ ...prev, state: response?.state }))

                // ❗ проверка состояния
                if (response?.state === "SUCCESS") {
                    if (response.result.success) {
                        let result;
                        if (type === "leads") {
                            result = {
                                audioId: response.result.lead_info_id,
                            }
                        } else {
                            result = {
                                audioId: response.result.audio_record_id,
                            }
                        }
                        localStorage.removeItem("callId")
                        localStorage.setItem("audioId", result.audioId)
                        // localStorage.setItem("categoryType", activeCategory)
                        // localStorage.setItem("selectedPerson", JSON.stringify(person))
                        localStorage.setItem("callStatus", "success")
                        localStorage.setItem("callState", "success")
                        dispatch(onCallProgressing({
                            ...result,
                            person,
                            callStatus: "success",
                            callState: "success",
                            callId: null,
                            type
                        }))
                    } else {
                        dispatch(onCallProgressing({
                            person,
                            type,
                            audioId: null,
                            callId: null,
                            callStatus: "success",
                            callState: "error"
                        }))
                        localStorage.removeItem("callId")
                        localStorage.setItem("callStatus", "success")
                        localStorage.setItem("callState", "error")
                        localStorage.setItem("showStatus", 1)
                        if (response.result.attempts === 2) {
                            if (type === "leads") {
                                dispatch(onDelLeads({ id: person.id }))
                            } else {
                                dispatch(onDelDebtors({ id: person.id, type }))
                            }
                        }
                    }
                    // setIsCall(false);
                    // setSelectedAudioId(prev => ({ ...prev, state: response?.state, lead_id: response?.result?.lead_info_id }))
                    isActive = false; // останавливаем polling
                    return;
                }

                // продолжаем polling
                timeoutId = setTimeout(poll, 5000);

            } catch (error) {
                console.error(error);
                timeoutId = setTimeout(poll, 5000);
            }
        };

        poll();

        return () => {
            isActive = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [callId]);


    const onSubmit = () => {

        let post;
        let postURL;
        if (type === "leads") {
            postURL = `task_leads/task_leads_update/${audioId}`
            post = {
                comment: audioCom,
                date: audioDate,
            }
        } else if (type === "debtors") {
            postURL = "task_debts/call_to_debts"
            post = {
                excuse_id: audioId,
                phone: person.phone,
                comment: audioCom,
                date: audioDate,
            }
        } else {
            postURL = "task_new_students/call_to_new_students"
            post = {
                id: audioId,
                phone: person.phone,
                comment: audioCom,
                date: audioDate,
            }
        }

        request(`${BackUrl}${postURL}`, "POST", JSON.stringify(post), headers())
            .then(res => {
                localStorage.removeItem("callId")
                localStorage.removeItem("categoryType")
                localStorage.removeItem("selectedPerson")
                localStorage.removeItem("callStatus")
                localStorage.removeItem("callState")
                localStorage.removeItem("showStatus")
                localStorage.removeItem("audioId")
                if (type === "leads") {
                    dispatch(onDelLeads({ id: res?.lead_id }))
                } else {
                    dispatch(onDelDebtors({ id: res.student_id, type }))
                }
                dispatch(onChangeProgress({
                    progress: res.task_statistics,
                    allProgress: res.task_daily_statistics
                }))
                dispatch(setMessage({
                    msg: res.message,
                    type: "success",
                    active: true
                }))
                setIsCall(false)
                dispatch(onCallEnd())
            })
            .catch(err => console.log(err))

    }


    return (
        <div
            className={classNames(cls.modal, {
                [cls.active]: true
            })}
        >
            <i
                onClick={() => isActive ? setIsCall(true) : null}
                className={classNames(
                    "fa-solid fa-headset",
                    cls.modal__icon,
                    {
                        [cls.active]: status === "loading",
                        [cls.pass]: status === "success"
                    }
                )}
            />
            <Modal
                activeModal={isCall}
                setActiveModal={setIsCall}
                extraClass={cls.audioModal}
            >
                {
                    person && (
                        <div className={cls.audioModal__header}>
                            <h1>{type === "leads" ? "Lead" : type === "debtors" ? "Qarzdor" : "Yangi o'quvchi"}</h1>
                            <h1>
                                {person.fullName}
                                {" "}
                                <span>({person.phone})</span>
                            </h1>
                        </div>
                    )
                }
                <div className={cls.audioModal__loader}>
                    <CallStatusLoader
                        status={status}
                        state={state}
                    />
                </div>
                {
                    (status === "success" && state !== "error") && (
                        <>
                            <Input
                                title={"Koment"}
                                placeholder={"Koment"}
                                onChange={setAudioCom}
                            />
                            <Input
                                type={"date"}
                                title={"Kun"}
                                onChange={setAudioDate}
                            />
                            <Button onClickBtn={onSubmit}>Kiritish</Button>
                        </>
                    )
                }
            </Modal>
        </div>
    );
}

const CallStatusLoader = ({ status, state }) => {
    const [showCheckmark, setShowCheckmark] = useState(false)

    useEffect(() => {
        if (status === "success") {
            setTimeout(() => setShowCheckmark(true), 100)
        } else {
            setShowCheckmark(false)
        }
    }, [status])

    return (
        <div className={cls.container}>
            <div className={cls.loaderWrapper}>
                <span
                    className={classNames(cls.parent, {
                        [cls.fadeOut]: status === "success"
                    })}
                >
                    <span className={cls.loader} />
                </span>

                {
                    state === "error"
                        ? <svg
                            className={`${cls.checkmark} ${showCheckmark ? cls.show : ""}`}
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                style={{ stroke: "#e53935" }}
                                className={cls.checkmarkPath}
                                d="M 30 30 L 70 70 M 70 30 L 30 70"
                            />
                        </svg>
                        : <svg
                            className={`${cls.checkmark} ${showCheckmark ? cls.show : ""}`}
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path className={cls.checkmarkPath} d="M 25 52 L 42 68 L 75 32" />
                        </svg>
                }


            </div>

            <p
                style={state === "error" ? { color: "#e53935" } : null}
                className={cls.statusText}
            >
                {
                    status === "loading"
                        ? "Calling in progress..."
                        : status === "success"
                            ? state === "error"
                                ? "Call rejected"
                                : "Call successed"
                            : "Call connecting..."
                }
            </p>
        </div>
    )
}
