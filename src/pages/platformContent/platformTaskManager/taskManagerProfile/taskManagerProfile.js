import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";

import {useHttp} from "hooks/http.hook";
import {fetchUserDataWithHistory} from "slices/taskManagerSlice";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";

import styles from "./taskManagerProfile.module.sass";
import {BackUrl, BackUrlForDoc, headers} from "constants/global";

const TaskManagerProfile = () => {
    const dispatch = useDispatch();
    const {storyId, storyType} = useParams();
    const {request} = useHttp()

    const {profile, profileStatus} = useSelector(state => state.taskManager);

    useEffect(() => {
        if (storyId) {
            switch (storyType) {
                case "debtors":
                    dispatch(fetchUserDataWithHistory({url: `task_debts/debts_records/${storyId}`}))
                    break
                case "newStudents":
                    dispatch(fetchUserDataWithHistory({url: `task_new_students/new_students_records/${storyId}/`}))
                    break
                default:
                    dispatch(fetchUserDataWithHistory({url: `task_leads/lead_records/${storyId}/`}))
            }
        }
    }, [storyId, storyType]);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.rightColumn}>
                    {profileStatus === "loading" ? (
                        <DefaultLoader/>
                    ) : (
                        <div className={styles.commentsContainer}>
                            {
                                profile?.comments
                                    ?.map(comment => (
                                        <CommentCard
                                            comment={comment}
                                        />
                                    ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CommentCard = ({comment}) => {
    const audioRef = useRef(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [progress, setProgress] = useState(0)
    const [isMoreInfo, setIsMoreInfo] = useState(null)

    const records = comment?.records || comment?.audios_list || []

    const getAudioSrc = (record) =>
        record?.audio_url ? BackUrlForDoc + record.audio_url : null

    const playByIndex = (index) => {
        const audio = audioRef.current
        const record = records[index]
        if (!audio || !record) return

        const src = getAudioSrc(record)
        if (!src) return

        if (currentIndex === index) {
            if (audio.paused) {
                audio.play()
                setIsPlaying(true)
            } else {
                audio.pause()
                setIsPlaying(false)
            }
            return
        }

        audio.src = src
        audio.play()

        setCurrentIndex(index)
        setIsPlaying(true)
    }

    const playNext = () => {
        if (currentIndex === null) return
        if (currentIndex < records.length - 1) {
            playByIndex(currentIndex + 1)
        }
    }

    const playPrev = () => {
        if (currentIndex > 0) {
            playByIndex(currentIndex - 1)
        }
    }

    const onTimeUpdate = () => {
        const audio = audioRef.current
        if (!audio) return

        setCurrentTime(audio.currentTime)
        setProgress((audio.currentTime / audio.duration) * 100 || 0)
    }

    const onSeek = (e) => {
        const audio = audioRef.current
        if (!audio) return

        const value = Number(e.target.value)
        audio.currentTime = (audio.duration * value) / 100
        setProgress(value)
    }

    const onEnded = () => {
        // если есть следующий трек — playNext сам всё сделает
        if (currentIndex !== null && currentIndex < records.length - 1) {
            playNext()
            return
        }

        // если это был последний (или единственный) — сбрасываем
        setIsPlaying(false)
        setCurrentIndex(null)
        setProgress(0)
        setCurrentTime(0)

        if (audioRef.current) {
            audioRef.current.currentTime = 0
        }
    }


    const formatTime = (time = 0) => {
        const min = Math.floor(time / 60)
        const sec = Math.floor(time % 60)
        return `${min}:${sec < 10 ? "0" : ""}${sec}`
    }

    return (
        <div className={styles.column}>
            {/* HEADER */}
            <div className={styles.commentCard}>
                <div className={styles.commentHeader}>
                    <strong>
                        Telefon qilingan: {comment.added_date} / {comment.to_date}
                    </strong>

                    {
                        comment?.audio_url && (
                            <div className={styles.icons}>
                                <div className={styles.icons__options}>
                                    <i
                                        className={classNames(
                                            `fa-solid fa-${isPlaying ? "pause" : "play"}`,
                                            styles.icons__audio
                                        )}
                                        onClick={() =>
                                            playByIndex(records.length - 1)
                                        }
                                    />
                                </div>

                                <i
                                    className={classNames(
                                        `fa-solid fa-chevron-${
                                            comment.id === isMoreInfo ? "up" : "down"
                                        }`,
                                        styles.icons__audio
                                    )}
                                    onClick={() =>
                                        setIsMoreInfo(prev =>
                                            prev === comment.id ? null : comment.id
                                        )
                                    }
                                />
                            </div>
                        )
                    }
                </div>

                <div className={styles.commentText}>
                    Comment: {comment.comment || ""}
                </div>
            </div>

            {/* AUDIO LIST */}
            {
                comment?.audio_url && (
                    <div
                        className={classNames(styles.column__list, {
                            [styles.active]: comment.id === isMoreInfo
                        })}
                    >
                        <div className={styles.wrapper}>
                            {records.map((record, index) => record?.audio_url && (
                                <div key={record.id} className={styles.wrapper__item}>
                                    <h2 className={styles.audioTitle}>
                                        {record.start_time}
                                    </h2>

                                    <div className={styles.audio}>
                                        <p className={styles.audio__subTitle}>
                                            {currentIndex === index
                                                ? formatTime(currentTime)
                                                : "0:00"}
                                            {" / "}
                                            {formatTime(Number(record.duration))}
                                        </p>

                                        <div className={styles.controls}>
                                            {
                                                records.length !== 1 && (
                                                    <i
                                                        className={classNames(
                                                            "fa-solid fa-backward-step",
                                                            styles.wrapper__audio
                                                        )}
                                                        onClick={playPrev}
                                                    />
                                                )
                                            }


                                            <i
                                                className={classNames(
                                                    `fa-solid fa-${
                                                        isPlaying &&
                                                        currentIndex === index
                                                            ? "pause"
                                                            : "play"
                                                    }`,
                                                    styles.wrapper__audio
                                                )}
                                                onClick={() => playByIndex(index)}
                                            />

                                            {
                                                records.length !== 1 && (
                                                    <i
                                                        className={classNames(
                                                            "fa-solid fa-forward-step",
                                                            styles.wrapper__audio
                                                        )}
                                                        onClick={playNext}
                                                    />
                                                )
                                            }


                                        </div>
                                    </div>

                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={
                                            currentIndex === index ? progress : 0
                                        }
                                        onChange={onSeek}
                                    />

                                </div>
                            ))}
                        </div>
                    </div>
                )
            }


            <audio
                ref={audioRef}
                onTimeUpdate={onTimeUpdate}
                onEnded={onEnded}
            />
        </div>
    )
}


export default TaskManagerProfile;
