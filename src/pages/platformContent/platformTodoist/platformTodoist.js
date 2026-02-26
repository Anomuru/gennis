import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import classNames from "classnames"
import { useParams } from "react-router-dom"

import {
    addAttachments,
    addComments,
    addProofs,
    addSubTasks,
    addTag,
    addTask,
    deleteAttachments,
    deleteComments,
    deleteProofs,
    deleteSubTasks,
    deleteTag,
    deleteTask,
    editAttachments,
    editComments,
    editNotification,
    editProofs,
    editSubTasks,
    editTag,
    editTask,
    notificationLoading,
    notificationLoadingStop,
    taskLoading,
    taskLoadingStop,
    taskProfileLoading,
    taskProfileLoadingStop,
    taskTagsLoading,
    taskTagsLoadingStop,
    fetchTaskNotifications,
    fetchTasks,
    fetchTaskTags,
    editMultiTask,
    deleteMultiTask
} from "slices/todoistSlice"
import { useHttp } from "hooks/http.hook";
import { BackUrl, BackUrlForDoc, headers, headersImg } from "constants/global"
import { fetchTeachersByLocationWithoutPagination } from "slices/teachersSlice"
import { setMessage } from "slices/messageSlice"
import Button from "components/platform/platformUI/button"
import Select from "components/platform/platformUI/select"
import Modal from "components/platform/platformUI/modal"
import Input from "components/platform/platformUI/input"
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall"
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader"

import styles from "./platformTodoist.module.sass"
import { fetchEmployersDataWithoutPagination } from "slices/employeesSlice"
import { AnimatedMulti } from "components/platform/platformUI/animatedMulti/animatedMulti"
import TaskCard from "./taskCard/taskCard"
import ViewTaskModal from "./viewTaskModal/viewTaskModal"
import ChangeStatusModal from "./changeStatusModal/changeStatusModal"

const TASK_TYPES = [
    { id: "myTasks", name: "Menig vazifalarim" },
    { id: "givenTask", name: "Bergan vazifalarim" },
    { id: "viewTasks", name: "Tekshirish vazifalari" },
]

const NOTIFICATION_TYPES = [
    { id: "executor", name: "Menig vazifalarim" },
    { id: "creator", name: "Bergan vazifalarim" },
    { id: "reviewer", name: "Tekshirish vazifalari" },
]

// Константы (вынеси в отдельный файл или вверх компонента)
const STATUS_PERMISSIONS = {
    executor: {
        not_started: ["in_progress"],
        in_progress: ["blocked", "completed"],
        re_check: ["in_progress"],
        blocked: ["in_progress"],
    },
    reviewer: {
        completed: ["approved", "declined", "re_check"],
        declined: ["re_check"],
    },
};

const PlatformTodoist = () => {

    const formDataImg = new FormData()
    const dispatch = useDispatch()
    const { locationId } = useParams()
    const { request } = useHttp()
    const { register, handleSubmit, setValue } = useForm()


    const { id: userId, level } = useSelector(state => state.me)
    const { teachers } = useSelector(state => state.teachers)
    const { employees } = useSelector(state => state.employees)
    const {
        tasks,
        tags,
        tagLoading: tagsLoading,
        taskLoading: tasksLoading,
        profileLoading: tasksProfileLoading,
        statusList,
        categoryList,
        recurringTypes,
        notifications: notificationsList,
        notificationLoading: notificationsLoading
    } = useSelector(state => state.todoistSlice)

    // State management

    const [isFilter, setIsFilter] = useState(false)
    const [isTeachersSelect, setIsTeachersSelect] = useState(false)
    const [isEpmloyeesSelect, setIsEpmloyeesSelect] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [selectedCreate, setSelectedCreate] = useState()
    const [selectedDeadlineFrom, setSelectedDeadlineFrom] = useState()
    const [selectedDeadlineTo, setSelectedDeadlineTo] = useState()
    const [selectedTags, setSelectedTags] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("all")

    const [selectedMultiTask, setSelectedMultiTask] = useState(null)
    const [isRedirected, setIsRedirected] = useState(false)
    const [selectedRedirect, setSelectedRedirect] = useState(null)
    const [isHaveNot, setIsHaveNot] = useState(false)
    const [activePage, setActivePage] = useState("task")
    const [activeTaskType, setActiveTaskType] = useState("myTasks")
    const [activeNotificationType, setActiveNotificationType] = useState("executor")
    const [modalType, setModalType] = useState(null)
    const [onCreate, setOnCreate] = useState(false)
    const [nestedModalType, setNestedModalType] = useState(null)
    const [selectedTask, setSelectedTask] = useState(null)
    const [selectedTag, setSelectedTag] = useState(null)
    const [activeCollapsibles, setActiveCollapsibles] = useState(new Set())
    const [isRecurring, setIsRecurring] = useState(false)
    const [recurringType, setRecurringType] = useState()
    const [teachersList, setTeachersList] = useState([])
    const [tagsList, setTagsList] = useState([])

    // Form state
    const [formData, setFormData] = useState({})
    const [tagFormData, setTagFormData] = useState(null)
    const [nestedFormData, setNestedFormData] = useState({})

    useEffect(() => {
        if (locationId) {
            dispatch(fetchTaskTags())
            // dispatch(fetchTeachersData(locationId))
            dispatch(fetchEmployersDataWithoutPagination({ locationId, level }))
            dispatch(fetchTeachersByLocationWithoutPagination({ locationId }))
            // dispatch(fetchEmployersDataWithoutPagination({ branch: locationId, level: userLevel }))

        }
    }, [locationId])

    useEffect(() => {
        if (userId && activeTaskType) {
            if (activePage === "task") {
                setSelectedMultiTask(null)
                const props = {
                    location: locationId,
                    status: selectedStatus,
                    created_at: selectedCreate,
                    deadline_after: selectedDeadlineFrom,
                    deadline_before: selectedDeadlineTo,
                    category: selectedCategory,
                    tags: selectedTags.length === 0 ? null : selectedTags.map(item => item.value)
                }
                if (activeTaskType === "myTasks") {
                    dispatch(fetchTasks({ executor: userId, ...props }))
                } else if (activeTaskType === "givenTask") {
                    dispatch(fetchTasks({ creator_id: userId, ...props }))
                } else {
                    dispatch(fetchTasks({ reviewer: userId, ...props }))
                }
            } else {
                dispatch(fetchTaskNotifications({ role: activeNotificationType, user_id: userId }))
            }
        }
    }, [userId, activeTaskType, activePage, activeNotificationType, selectedCreate, selectedDeadlineFrom, selectedDeadlineTo, selectedStatus, selectedCategory, selectedTags])

    useEffect(() => {
        if (teachers && employees)
            setTeachersList([
                ...teachers.map(item => ({
                    id: item.user_id,
                    name: `${item.name} ${item.surname} (${item.subjects[0]})`
                })),
                ...employees.map(item => ({
                    id: item.id,
                    name: `${item.name} ${item.surname} (${item.job})`
                }))
            ])
    }, [teachers, employees])

    useEffect(() => {
        if (tags) {
            setTagsList(
                tags.map(item =>
                    ({ value: item.id, label: item.name })
                )
            )
        }
    }, [tags])

    // Функция фильтрации — используй внутри компонента
    function getAllowedStatuses(task, userId, statusList) {
        if (!task) return statusList;

        const isCreator = task.creator?.id === userId;
        const isReviewer = task.reviewer?.id === userId;
        const isExecutor = task.executor?.id === userId;

        if (isCreator) return statusList; // creator видит всё

        const allowed = isReviewer
            ? STATUS_PERMISSIONS.reviewer[task.status] ?? []
            : isExecutor
                ? STATUS_PERMISSIONS.executor[task.status] ?? []
                : [];

        return statusList.filter(item => allowed.includes(item.id));
    }


    // Modal handlers
    const openCreateTaskModal = () => {
        if (!onCreate) {
            setFormData({
                title: "",
                description: "",
                executor_ids: [],
                reviewer_id: userId,
                creator_id: userId,
                category: "admin",
                tags: [],
                status: "not_started",
                deadline_datetime: "",
                is_recurring: false,
                recurring_type: "daily",
                repeat_every: 1,
            })
        }
        setModalType("createTask")
        setOnCreate(true)
    }

    const openEditTaskModal = (task) => {
        setSelectedTask(task)
        setFormData({
            ...task,
            tags: task.tags && task.tags.map(item => ({ value: item.id, label: item.name }))
        })
        setModalType("editTask")
        setOnCreate(false)
    }

    const openChangeStatusModal = (task) => {
        setSelectedTask(task)
        setFormData({
            ...task,
            tags: task.tags && task.tags.map(item => ({ value: item.id, label: item.name }))
        })
        setModalType("changeStatus")
    }

    const openRedirectModal = (task) => {
        setSelectedRedirect(null)
        setSelectedTask(task)
        setIsRedirected(true)
    }

    const openViewTaskModal = (task) => {
        setSelectedTask(task)
        setModalType("viewTask")
        setActiveCollapsibles(new Set())
    }

    const openDeleteTaskModal = (task) => {
        setSelectedTask(task)
        setModalType("deleteTask")
    }

    const openCreateTagModal = () => {
        setTagFormData(null)
        setModalType("createTag")
    }

    const openEditTagModal = (tag) => {
        setSelectedTag(tag)
        setModalType("editTag")
        setTagFormData(tag.name)
    }

    const openDeleteTagModal = (tag) => {
        setSelectedTag(tag)
        setModalType("deleteTag")
    }

    // Nested CRUD handlers
    const openNestedModal = (type, item) => {
        setNestedFormData(item || {})
        setNestedModalType(type)
    }

    const onToggleRead = (id, isRead) => {

        dispatch(notificationLoading())

        request(`${BackUrl}notifications/${id}/`, "PATCH", JSON.stringify({ is_read: isRead }), headers())
            .then(res => {
                dispatch(editNotification(res))
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: isRead ? "O'qib chiqildi" : "Ortga qaytarildi"
                }))
                // NOTIFICATION_TYPES.map(item => {
                //     request(`${BackUrl}notifications/?role=${item.id}&user_id=${userId}`, "GET", null, headers())
                //         .then(res => {
                //             const filtered = res.filter(item => !item.is_read)
                //             if (filtered.length > 0) {
                //                 setIsHaveNot(true)
                //             } else {
                //                 if (isHaveNot) setIsHaveNot(false)
                //             }
                //         })
                // })
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(notificationLoadingStop())
            })
    }

    const onViewTask = (id) => {

        request(`${BackUrl}missions/${id}/`, "GET", null, headers())
            .then(res => {
                setSelectedTask(res)
                setModalType("viewTask")
                setActiveCollapsibles(new Set())
            })

    }

    useEffect(() => {
        // if (notificationsList.length > 0)
        if (userId) {
            // NOTIFICATION_TYPES.map(item => {
            request(`${BackUrl}notifications/?user_id=${userId}`, "GET", null, headers())
                .then(res => {
                    const filtered = res.filter(item => !item.is_read)
                    if (filtered.length > 0) {
                        setIsHaveNot(true)
                    }
                })
            // })
        }
    }, [userId])

    const onChangeRedirect = () => {

        const patch = {
            executor_ids: [+selectedRedirect]
        }

        dispatch(taskLoading())
        request(`${BackUrl}missions/${selectedTask.id}/`, "PATCH", JSON.stringify(patch), headers())
            .then(res => {
                request(`${BackUrl}missions/${res.id}/`, "GET", null, headers())
                    .then(res => {
                        if (selectedMultiTask && selectedMultiTask.children) {
                            dispatch(editMultiTask({
                                ...res,
                                parent: selectedMultiTask.id
                            }))
                            setSelectedMultiTask(() => {
                                return ({
                                    // ...prev,
                                    ...selectedMultiTask.children.filter(item => item.id !== res.id)[0],
                                    children: [
                                        ...selectedMultiTask.children.filter(item => item.id !== res.id),
                                        res
                                    ]
                                })
                            })
                        } else {
                            dispatch(editTask(res))
                        }
                        dispatch(setMessage({
                            status: true,
                            type: "success",
                            msg: "Vazifa yo'naltirildi"
                        }))
                        setModalType(null)
                        setIsRedirected(false)
                    })
                    .catch(err => {
                        dispatch(setMessage({
                            status: true,
                            type: "error",
                            msg: "Xatolik yuz berdi!"
                        }))
                        dispatch(taskLoadingStop())
                    })
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskLoadingStop())
            })
    }

    // Task CRUD operations
    const handleCreateTask = () => {

        let repeat = {}
        if (formData.recurring_type !== "custom") {
            repeat = {
                repeat_every: recurringTypes.filter(item => item.id === formData.recurring_type)[0]?.number
            }
        }

        const post = {
            ...formData,
            tags: formData.tags.map(item => item.value),
            executor_ids: !!formData.executor_ids.length ? formData.executor_ids.map(item => item.value) : [userId],
            // executor_ids: [Number(formData.executor_ids)],
            ...repeat,
            location_id: locationId
        }

        dispatch(taskLoading())
        request(`${BackUrl}missions/`, "POST", JSON.stringify(post), headers())
            .then(res => {
                // res.map(item => {
                //     request(`${BackUrl}missions/${item.id}/`, "GET", null, headers())
                //         .then(res => {
                dispatch(addTask(res))
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: "Vazifa yaratildi"
                }))
                setModalType(null)
                setActiveTaskType("givenTask")
                setIsTeachersSelect(false)
                setIsEpmloyeesSelect(false)
                //         })
                // })
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskLoadingStop())
            })
    }

    const handleEditTask = () => {

        const patch = {
            title: formData.title,
            description: formData.description,
            tags: formData.tags.map(item => item.value),
            category: formData.category,
            // ...formData,
            creator_id: formData.creator.id,
            // executor_ids: formData.executor_ids.map(item => item.value),
            // executor_ids: formData.executor_ids ? [Number(formData.executor_ids)] : [formData.executor.id],
            reviewer_id: typeof formData.reviewer_id === "object" ? formData.reviewer.id : formData.reviewer_id,
            // status: formData.status,
            deadline_datetime: formData.deadline_datetime,
            is_recurring: formData.is_recurring,
            recurring_type: formData.recurring_type,
            repeat_every: formData.repeat_every,
            // executor_ids: [formData.is_redirected ? formData.redirected_by.id : formData.executor.id]
        }

        dispatch(taskLoading())
        request(`${BackUrl}missions/${formData.id}/`, "PATCH", JSON.stringify(patch), headers())
            .then(res => {

                request(`${BackUrl}missions/${res.id}/`, "GET", null, headers())
                    .then(res => {
                        if (selectedMultiTask && selectedMultiTask.children) {
                            dispatch(editMultiTask({
                                ...res,
                                parent: selectedMultiTask.id
                            }))
                            setSelectedMultiTask(() => {
                                return ({
                                    // ...prev,
                                    ...selectedMultiTask.children.filter(item => item.id !== res.id)[0],
                                    children: [
                                        ...selectedMultiTask.children.filter(item => item.id !== res.id),
                                        res
                                    ]
                                })
                            })
                        } else {
                            dispatch(editTask(res))
                        }
                        dispatch(setMessage({
                            status: true,
                            type: "success",
                            msg: "Vazifa o`zgartirildi"
                        }))
                        setModalType(null)
                    })
                    .catch(err => {
                        dispatch(setMessage({
                            status: true,
                            type: "error",
                            msg: "Xatolik yuz berdi!"
                        }))
                        dispatch(taskLoadingStop())
                    })
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskLoadingStop())
            })
    }

    const handleDeleteTask = () => {
        dispatch(taskLoading())
        request(`${BackUrl}missions/${selectedTask.id}/`, "DELETE", null, headers())
            .then(res => {
                if (selectedMultiTask && selectedMultiTask.children) {
                    dispatch(deleteMultiTask({
                        id: selectedTask.id,
                        parent: selectedMultiTask.id
                    }))
                    setSelectedMultiTask(() => {
                        return ({
                            // ...prev,
                            ...selectedMultiTask.children.filter(item => item.id !== selectedTask.id)[0],
                            children: selectedMultiTask.children.filter(item => item.id !== selectedTask.id)
                        })
                    })
                } else {
                    dispatch(deleteTask(selectedTask.id))
                }
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: `${selectedTask.title} - Vazifasi o'chirildi`
                }))
                setModalType(null)
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskLoadingStop())
            })
    }

    const handleChangeStatus = () => {
        dispatch(taskLoading())
        request(`${BackUrl}missions/${formData.id}/`, "PATCH", JSON.stringify({
            status: formData.status,
            // executor_ids: [formData.is_redirected ? formData.redirected_by.id : formData.executor.id]
        }), headers())
            .then(res => {
                request(`${BackUrl}missions/${res.id}/`, "GET", null, headers())
                    .then(res => {
                        if (selectedMultiTask && selectedMultiTask.children) {
                            dispatch(editMultiTask({
                                ...res,
                                parent: selectedMultiTask.id
                            }))
                            setSelectedMultiTask(() => {
                                return ({
                                    // ...prev,
                                    ...selectedMultiTask.children.filter(item => item.id !== res.id)[0],
                                    children: [
                                        ...selectedMultiTask.children.filter(item => item.id !== res.id),
                                        res
                                    ]
                                })
                            })
                        } else {
                            dispatch(editTask(res))
                        }
                        dispatch(setMessage({
                            status: true,
                            type: "success",
                            msg: "Vazifani statusi o`zgartirildi"
                        }))
                        setModalType(null)
                    })
                    .catch(err => {
                        dispatch(setMessage({
                            status: true,
                            type: "error",
                            msg: "Xatolik yuz berdi!"
                        }))
                        dispatch(taskLoadingStop())
                    })
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskLoadingStop())
            })
    }

    // Tag CRUD operations
    const handleCreateTag = () => {
        dispatch(taskTagsLoading())
        request(`${BackUrl}tags/`, "POST", JSON.stringify({ name: tagFormData }), headers())
            .then(res => {
                dispatch(addTag(res))
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: "Teg yaratildi"
                }))
                setModalType(null)
                setTagFormData(null)
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Bu nomli teg bor yoki xatolik yuz berdi!"
                }))
                dispatch(taskTagsLoadingStop())
                setTagFormData(null)
            })
    }

    const handleEditTag = () => {
        dispatch(taskTagsLoading())
        request(`${BackUrl}tags/${selectedTag.id}/`, "PATCH", JSON.stringify({ name: tagFormData }), headers())
            .then(res => {
                dispatch(editTag(res))
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: `Tegni nomi "${res.name}"ga o'zgartirildi`
                }))
                setModalType(null)
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskTagsLoadingStop())
            })
    }

    const handleDeleteTag = () => {
        dispatch(taskTagsLoading())
        request(`${BackUrl}tags/${selectedTag.id}/`, "DELETE", null, headers())
            .then(res => {
                dispatch(deleteTag(selectedTag.id))
                dispatch(setMessage({
                    status: true,
                    type: "danger",
                    msg: `"${selectedTag.name}" - tegi o'chirildi`
                }))
                setModalType(null)
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskTagsLoadingStop())
            })
    }

    // Nested CRUD operations
    const handleCreateSubtask = () => {

        dispatch(taskProfileLoading("subtasks"))

        const post = {
            title: nestedFormData.title,
            order: nestedFormData.order,
            mission_id: selectedTask.id
        }

        request(`${BackUrl}subtasks/`, "POST", JSON.stringify(post), headers())
            .then(res => {
                dispatch(addSubTasks(res))
                setSelectedTask(prev => ({
                    ...prev,
                    subtasks: [...prev.subtasks, res]
                }))
                setNestedModalType(null)
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: "Sub-task qo'shildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })

    }

    const handleEditSubtask = () => {

        dispatch(taskProfileLoading("subtasks"))

        const patch = {
            title: nestedFormData.title,
            order: nestedFormData.order,
        }

        request(`${BackUrl}subtasks/${nestedFormData.id}/`, "PATCH", JSON.stringify(patch), headers())
            .then(res => {
                dispatch(editSubTasks(res))
                setSelectedTask({
                    ...selectedTask,
                    subtasks: selectedTask.subtasks.map((s) => (s.id === res.id ? res : s)),
                })
                setNestedModalType(null)
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: "Sub-task o'zgartirildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })

    }

    const handleDeleteSubtask = () => {

        dispatch(taskProfileLoading("subtasks"))

        request(`${BackUrl}subtasks/${nestedFormData.id}/`, "DELETE", null, headers())
            .then(res => {
                dispatch(deleteSubTasks({ mission_id: selectedTask.id, subtask: nestedFormData.id }))
                setSelectedTask({
                    ...selectedTask,
                    subtasks: selectedTask.subtasks.filter((s) => s.id !== nestedFormData.id),
                })
                setNestedModalType(null)
                dispatch(setMessage({
                    status: true,
                    type: "danger",
                    msg: "Sub-task o'chirildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })
    }

    const handleCompleteSubtask = (isDone, id) => {

        dispatch(taskProfileLoading("subtasks"))

        request(`${BackUrl}subtasks/${id}/`, "PATCH", JSON.stringify({ is_done: !isDone }), headers())
            .then(res => {
                dispatch(editSubTasks(res))
                setSelectedTask({
                    ...selectedTask,
                    subtasks: selectedTask.subtasks.map((s) => (s.id === res.id ? res : s)),
                })
                setNestedModalType(null)
                dispatch(setMessage({
                    status: true,
                    type: isDone ? "danger" : "success",
                    msg: isDone ? "Sub-task qaytarildi" : "Sub-task bajirildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })

    }

    const handleCreateAttachment = () => {

        dispatch(taskProfileLoading("attachments"))

        formDataImg.append("note", nestedFormData.note)
        if (nestedFormData.file && typeof nestedFormData.file === "object") {
            formDataImg.append("file", nestedFormData.file)
        }
        formDataImg.append("mission_id", selectedTask.id)

        request(`${BackUrl}attachments/`, "POST", formDataImg, headersImg())
            .then(res => {
                dispatch(addAttachments(res))
                setSelectedTask(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, res]
                }))
                setNestedModalType(null)
                formDataImg.delete("note")
                formDataImg.delete("file")
                formDataImg.delete("mission_id")
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: "Qo'shimcha qo'shildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })

    }

    const handleEditAttachment = () => {

        dispatch(taskProfileLoading("attachments"))

        formDataImg.append("note", nestedFormData.note)
        if (nestedFormData.file && typeof nestedFormData.file === "object") {
            formDataImg.append("file", nestedFormData.file)
        }

        request(`${BackUrl}attachments/${nestedFormData.id}/`, "PATCH", formDataImg, headersImg())
            .then(res => {
                dispatch(editAttachments(res))
                setSelectedTask({
                    ...selectedTask,
                    attachments: selectedTask.attachments.map((s) => (s.id === res.id ? res : s)),
                })
                setNestedModalType(null)
                formDataImg.delete("note")
                formDataImg.delete("file")
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: "Qo'shimcha o'zgartirildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })

    }

    const handleDeleteAttachment = () => {

        dispatch(taskProfileLoading("attachments"))

        request(`${BackUrl}attachments/${nestedFormData.id}/`, "DELETE", null, headers())
            .then(res => {
                dispatch(deleteAttachments({ mission_id: selectedTask.id, attachment: nestedFormData.id }))
                setSelectedTask({
                    ...selectedTask,
                    attachments: selectedTask.attachments.filter((s) => s.id !== nestedFormData.id),
                })
                setNestedModalType(null)
                dispatch(setMessage({
                    status: true,
                    type: "danger",
                    msg: "Qo'shimcha o'chirildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })

    }

    const handleCreateComment = () => {

        dispatch(taskProfileLoading("comments"))

        formDataImg.append("text", nestedFormData.text)
        formDataImg.append("user_id", userId)
        if (nestedFormData.comFile && typeof nestedFormData.comFile === "object") {
            formDataImg.append("attachment", nestedFormData.comFile)
        }
        formDataImg.append("mission_id", selectedTask.id)

        request(`${BackUrl}comment/`, "POST", formDataImg, headersImg())
            .then(res => {
                dispatch(addComments(res))
                setSelectedTask(prev => ({
                    ...prev,
                    comments: [...prev.comments, res]
                }))
                setNestedModalType(null)
                formDataImg.delete("text")
                formDataImg.delete("user_id")
                formDataImg.delete("attachment")
                formDataImg.delete("mission_id")
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: "Koment qo'shildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })


    }

    const handleEditComment = () => {

        dispatch(taskProfileLoading("comments"))

        formDataImg.append("text", nestedFormData.text)
        if (nestedFormData.comFile && typeof nestedFormData.comFile === "object") {
            formDataImg.append("attachment", nestedFormData.comFile)
        }

        request(`${BackUrl}comment/${nestedFormData.id}/`, "PATCH", formDataImg, headersImg())
            .then(res => {
                dispatch(editComments(res))
                setSelectedTask({
                    ...selectedTask,
                    comments: selectedTask.comments.map((s) => (s.id === res.id ? res : s)),
                })
                setNestedModalType(null)
                formDataImg.delete("text")
                formDataImg.delete("attachment")
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: "Koment o'zgartirildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })

    }

    const handleDeleteComment = () => {

        dispatch(taskProfileLoading("comments"))

        request(`${BackUrl}comment/${nestedFormData.id}/`, "DELETE", null, headers())
            .then(res => {
                dispatch(deleteComments({ mission_id: selectedTask.id, comment: nestedFormData.id }))
                setSelectedTask({
                    ...selectedTask,
                    comments: selectedTask.comments.filter((s) => s.id !== nestedFormData.id),
                })
                setNestedModalType(null)
                dispatch(setMessage({
                    status: true,
                    type: "danger",
                    msg: "Koment o'chirildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })
    }

    const handleCreateProof = () => {

        dispatch(taskProfileLoading("proofs"))

        formDataImg.append("comment", nestedFormData.comment)
        if (nestedFormData.proofFile && typeof nestedFormData.proofFile === "object") {
            formDataImg.append("file", nestedFormData.proofFile)
        }
        formDataImg.append("mission_id", selectedTask.id)

        request(`${BackUrl}proofs/`, "POST", formDataImg, headersImg())
            .then(res => {
                dispatch(addProofs(res))
                setSelectedTask(prev => ({
                    ...prev,
                    proofs: [...prev.proofs, res]
                }))
                setNestedModalType(null)
                formDataImg.delete("comment")
                formDataImg.delete("file")
                formDataImg.delete("mission_id")
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: "Proof qo'shildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })

    }

    const handleEditProof = () => {

        dispatch(taskProfileLoading("proofs"))

        formDataImg.append("comment", nestedFormData.comment)
        if (nestedFormData.proofFile && typeof nestedFormData.proofFile === "object") {
            formDataImg.append("file", nestedFormData.proofFile)
        }

        request(`${BackUrl}proofs/${nestedFormData.id}/`, "PATCH", formDataImg, headersImg())
            .then(res => {
                dispatch(editProofs(res))
                setSelectedTask({
                    ...selectedTask,
                    proofs: selectedTask.proofs.map((s) => (s.id === res.id ? res : s)),
                })
                setNestedModalType(null)
                formDataImg.delete("comment")
                formDataImg.delete("file")
                dispatch(setMessage({
                    status: true,
                    type: "success",
                    msg: "Proof o'zgartirildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })

    }

    const handleDeleteProof = () => {

        dispatch(taskProfileLoading("proofs"))

        request(`${BackUrl}proofs/${nestedFormData.id}/`, "DELETE", null, headers())
            .then(res => {
                dispatch(deleteProofs({ mission_id: selectedTask.id, proof: nestedFormData.id }))
                setSelectedTask({
                    ...selectedTask,
                    proofs: selectedTask.proofs.filter((s) => s.id !== nestedFormData.id),
                })
                setNestedModalType(null)
                dispatch(setMessage({
                    status: true,
                    type: "danger",
                    msg: "Proof o'chirildi"
                }))
            })
            .catch(err => {
                dispatch(setMessage({
                    status: true,
                    type: "error",
                    msg: "Xatolik yuz berdi!"
                }))
                dispatch(taskProfileLoadingStop())
            })

    }

    const toggleCollapsible = (section) => {
        const newSet = new Set(activeCollapsibles)
        if (newSet.has(section)) {
            newSet.delete(section)
        } else {
            newSet.add(section)
        }
        setActiveCollapsibles(newSet)
    }

    function compareByOrder(a, b) {
        return a.order - b.order;
    }

    function sortTasks(data) {
        if (!data) return []
        const colorOrder = {
            red: 0,
            yellow: 1,
            green: 2
        };

        return [...data].sort((a, b) => {
            // completed всегда в самый низ
            if (a.status === "completed" && b.status !== "completed") return 1;
            if (b.status === "completed" && a.status !== "completed") return -1;

            // если оба completed — сортировка по цветам не нужна
            if (a.status === "completed" && b.status === "completed") return 0;

            // сортировка по цветам
            const aVal = colorOrder[a.deadline_color] ?? 999;
            const bVal = colorOrder[b.deadline_color] ?? 999;

            return aVal - bVal;
        });
    }


    const getStatusColor = (status) => {
        switch (status) {
            case "not_started":
                return "#999999";        // серый — ещё не начато
            case "in_progress":
                return "#4A90E2";        // синий — в процессе
            case "blocked":
                return "#FF6B6B";        // красный — заблокировано
            case "completed":
                return "#51CF66";        // зелёный — выполнено
            case "approved":
                return "#845EF7";        // фиолетовый — одобрено
            case "declined":
                return "#D6336C";        // тёмно-розовый/красный — отклонено
            case "recheck":
                return "#F59F00";        // жёлтый — требует пересмотра
            default:
                return "#999999";        // fallback
        }
    };


    return (
        <>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Tasks</h1>
                    <div className={styles.headerActions}>
                        <button className={styles.btnPrimary} onClick={openCreateTaskModal}>
                            + New Task
                        </button>
                        <button className={styles.btnSecondary} onClick={openCreateTagModal}>
                            + New Tag
                        </button>
                    </div>
                </header>

                <div className={styles.content}>
                    {/* Tasks Section */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h1 className={styles.sectionTitle}>
                                <span
                                    onClick={() => setActivePage("task")}
                                    className={classNames(styles.sectionTitle__item, {
                                        [styles.active]: activePage === "task"
                                    })}
                                >
                                    Tasks
                                </span>
                                /
                                <span
                                    onClick={() => {
                                        setActivePage("notification")
                                        setIsHaveNot(false)
                                    }}
                                    className={classNames(styles.sectionTitle__item, {
                                        [styles.active]: activePage === "notification"
                                    })}
                                >
                                    Notifications
                                    {
                                        isHaveNot && (
                                            <div className={styles.dott} />
                                        )
                                    }
                                </span>
                            </h1>
                            <div className={styles.sectionHeader__filter}>
                                <Button
                                    type={"filter"}
                                    status={"filter"}
                                    onClickBtn={() => setIsFilter(true)}
                                    extraClass={styles.btnFilter}
                                >
                                    Filter
                                </Button>
                                <Select
                                    options={activePage === "task" ? TASK_TYPES : NOTIFICATION_TYPES}
                                    onChangeOption={activePage === "task" ? setActiveTaskType : setActiveNotificationType}
                                    defaultValue={activePage === "task" ? activeTaskType : activeNotificationType}
                                />
                            </div>
                        </div>
                        {
                            (selectedMultiTask && selectedMultiTask.children) && (
                                <div className={styles.multiTitle}>
                                    <h2
                                        className={styles.multiTitle__inner}
                                    >
                                        {selectedMultiTask.title}
                                        {" "}
                                        - Task Series
                                    </h2>
                                    <Button
                                        extraClass={styles.multiTitle__back}
                                        onClickBtn={() => setSelectedMultiTask(null)}
                                    >
                                        Orqaga
                                    </Button>
                                </div>
                            )
                        }
                        <div
                            className={classNames(styles.grid, {
                                [styles.loading]: tasksLoading || notificationsLoading,
                                [styles.level]: level > 2,
                                [styles.none]: (tasks?.length === 0 && activePage === "task") || (notificationsList?.length === 0 && activePage !== "task")
                            })}
                        >

                            {
                                activePage === "task"
                                    ? tasksLoading
                                        ? <DefaultLoader status={"none"} />
                                        : tasks?.length === 0
                                            ? <h1 className={styles.grid__title}>
                                                {
                                                    activeTaskType === "myTasks"
                                                        ? "Sizga vazifa berilmagan"
                                                        : activeTaskType === "givenTask"
                                                            ? "Siz vazifa bermagansiz"
                                                            : "Tekshirishingiz kerak bolgan vazifa yo'q"
                                                }
                                            </h1>
                                            : sortTasks(
                                                selectedMultiTask?.children ?? tasks
                                            ).map((task) => (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    activeTaskType={activeTaskType}
                                                    userId={userId}
                                                    level={level}
                                                    statusList={statusList}
                                                    onView={(t) =>
                                                        t.children?.length > 1
                                                            ? setSelectedMultiTask(t)
                                                            : openViewTaskModal(t)
                                                    }
                                                    onRedirect={openRedirectModal}
                                                    onEdit={openEditTaskModal}
                                                    onDelete={openDeleteTaskModal}
                                                    onChangeStatus={openChangeStatusModal}
                                                />
                                            ))
                                    : notificationsLoading
                                        ? <DefaultLoader status={"none"} />
                                        : notificationsList.length === 0
                                            ? <h1 className={styles.grid__title}>Sizga xechqanday xabar yo'q</h1>
                                            : notificationsList.map(item => (
                                                <NotificationCard
                                                    key={item.id}
                                                    data={item}
                                                    onToggleRead={onToggleRead}
                                                    onViewTask={onViewTask}
                                                />
                                            ))
                            }
                        </div>
                    </section>

                    {/* Tags Section */}
                    {
                        level < 2 && (
                            <section className={styles.section}>
                                <h1 className={styles.sectionTitle}>Tags</h1>
                                <div
                                    className={classNames(styles.tagsList, {
                                        [styles.loading]: tagsLoading
                                    })}
                                >
                                    {
                                        tagsLoading
                                            ? <DefaultLoader status={"none"} />
                                            : tags?.map((tag) => (
                                                <div key={tag.id} className={styles.tagItem}>
                                                    <span className={styles.tagName}>{tag.name}</span>
                                                    <div className={styles.tagActions}>
                                                        <button className={styles.btnSmallEdit}
                                                            onClick={() => openEditTagModal(tag)}>
                                                            Edit
                                                        </button>
                                                        <button className={styles.btnSmallDelete}
                                                            onClick={() => openDeleteTagModal(tag)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                    }
                                </div>
                            </section>
                        )
                    }
                </div>

                {/* Modals */}

                {/* Create/Edit Task Modal */}
                {
                    (modalType === "createTask" || modalType === "editTask") && (
                        <div
                            className={styles.modalBackdrop}
                        // onClick={() => setModalType(null)}
                        >
                            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                                <h2 className={styles.modalTitle}>{modalType === "createTask" ? "Create Task" : "Edit Task"}</h2>
                                <div className={styles.formGroup}>
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={formData.title || ""}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Task title"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea
                                        style={{ height: "150px" }}
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Task description"
                                        rows={3}
                                    />
                                </div>
                                {/*<div className={styles.formRow}>*/}
                                <div className={styles.formGroup}>
                                    <label>Tags</label>
                                    <AnimatedMulti
                                        extraClass={styles.formGroup__multiSelect}
                                        options={tagsList}
                                        onChange={(e) => setFormData({ ...formData, tags: e })}
                                        value={formData.tags}
                                        fontSize={15}
                                    />
                                </div>
                                {
                                    !(level === 4) && (
                                        // <div className={styles.formRow}>
                                        <>
                                            {
                                                modalType !== "editTask" && (
                                                    <div className={styles.formGroup}>
                                                        <label>Executor</label>
                                                        <AnimatedMulti
                                                            extraClass={styles.formGroup__multiSelect}
                                                            options={[
                                                                // {value: userId, label: "Me"},
                                                                ...teachersList
                                                                    .filter(item => item.id !== userId)
                                                                    .map(item => ({ value: item.id, label: item.name }))
                                                            ]}
                                                            onChange={(e) => setFormData({ ...formData, executor_ids: e })}
                                                            value={
                                                                formData.executor_ids ?? [{
                                                                    value: selectedTask.executor.id,
                                                                    label: selectedTask.executor.full_name
                                                                }]
                                                            }
                                                            fontSize={15}
                                                        />
                                                        {/*<select*/}
                                                        {/*    value={typeof formData.executor === "object" ? formData.executor.id : formData.executor_ids || "none"}*/}
                                                        {/*    onChange={(e) => setFormData({ ...formData, executor_ids: e.target.value })}*/}
                                                        {/*    required*/}
                                                        {/*>*/}
                                                        {/*    <option value={"none"}>Select Executor</option>*/}
                                                        {/*    {*/}
                                                        {/*        [...teachersList].map(item =>*/}
                                                        {/*            <option value={item.id}>{item.name}</option>*/}
                                                        {/*        )*/}
                                                        {/*    }*/}
                                                        {/*</select>*/}
                                                        <div className={styles.formGroup__btns}>
                                                            {
                                                                modalType === "createTask" && (
                                                                    <>
                                                                        <Button
                                                                            onClickBtn={() => {
                                                                                setIsTeachersSelect(!isTeachersSelect)
                                                                                setFormData({
                                                                                    ...formData,
                                                                                    executor_ids: isTeachersSelect
                                                                                        ? formData.executor_ids.filter(item =>
                                                                                            !teachers.map(t => t.user_id).includes(item.value)
                                                                                        )
                                                                                        : [
                                                                                            ...formData.executor_ids,
                                                                                            ...teachers.map(item => ({
                                                                                                value: item.id,
                                                                                                label: `${item.name} ${item.surname} (${item.subjects[0]})`
                                                                                            }))
                                                                                        ]
                                                                                })
                                                                            }}
                                                                            active={isTeachersSelect}
                                                                        >
                                                                            O'qituvchilar
                                                                        </Button>
                                                                        <Button
                                                                            onClickBtn={() => {
                                                                                setIsEpmloyeesSelect(!isEpmloyeesSelect)
                                                                                setFormData({
                                                                                    ...formData,
                                                                                    executor_ids: isEpmloyeesSelect
                                                                                        ? formData.executor_ids.filter(item =>
                                                                                            !employees.map(e => e.user_id).includes(item.value)
                                                                                        )
                                                                                        : [
                                                                                            ...formData.executor_ids,
                                                                                            ...employees.map(item => ({
                                                                                                value: item.id,
                                                                                                label: `${item.name} ${item.surname} (${item.job})`
                                                                                            }))
                                                                                        ]
                                                                                })
                                                                            }}
                                                                            active={isEpmloyeesSelect}
                                                                        >
                                                                            Ishchilar
                                                                        </Button>
                                                                        <Button
                                                                            onClickBtn={() => {
                                                                                setIsEpmloyeesSelect(false)
                                                                                setIsTeachersSelect(false)
                                                                                setFormData({
                                                                                    ...formData,
                                                                                    executor_ids: []
                                                                                })
                                                                            }}
                                                                        // active={}
                                                                        >
                                                                            Clear
                                                                        </Button>
                                                                    </>
                                                                )
                                                            }
                                                            {/* <Button></Button> */}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            <div className={styles.formGroup}>
                                                <label>Reviewer</label>
                                                <select
                                                    value={typeof formData.reviewer_id === "object" ? formData.reviewer.id : formData.reviewer_id || "none"}
                                                    onChange={(e) => setFormData({ ...formData, reviewer_id: e.target.value })}
                                                    required
                                                >
                                                    <option value={userId}>Me</option>
                                                    {
                                                        [...teachersList].map(item =>
                                                            <option value={item.id}>{item.name}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        </>
                                        // {/*</div>*/}
                                    )
                                }
                                <div className={styles.formGroup}>
                                    <label>Departmant</label>
                                    <select
                                        value={formData.category || "admin"}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        {
                                            categoryList.map(item =>
                                                <option value={item.id}>{item.name}</option>
                                            )
                                        }
                                    </select>
                                </div>
                                {/*</div>*/}
                                {/*<div className={styles.formRow}>*/}
                                {/*<div className={styles.formGroup}>*/}
                                {/*    <label>Status</label>*/}
                                {/*    <select*/}
                                {/*        value={formData.status || "not_started"}*/}
                                {/*        onChange={(e) => setFormData({...formData, status: e.target.value})}*/}
                                {/*        required*/}
                                {/*    >*/}
                                {/*        {*/}
                                {/*            statusList.map(item =>*/}
                                {/*                <option value={item.id}>{item.name}</option>*/}
                                {/*            )*/}
                                {/*        }*/}
                                {/*    </select>*/}
                                {/*</div>*/}
                                <div className={styles.formGroup}>
                                    <label>Deadline</label>
                                    <input
                                        type="date"
                                        value={formData.deadline_datetime || ""}
                                        onChange={(e) => setFormData({ ...formData, deadline_datetime: e.target.value })}
                                        required
                                    />
                                </div>
                                {/*</div>*/}
                                <div className={styles.formGroup}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.is_recurring || false}
                                            onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                                        />
                                        Recurring
                                    </label>
                                </div>
                                {formData.is_recurring && (
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Recurring Type</label>
                                            <select
                                                value={formData.recurring_type || "daily"}
                                                onChange={(e) => setFormData({ ...formData, recurring_type: e.target.value })}
                                            >
                                                {
                                                    recurringTypes.map(item =>
                                                        <option value={item.id}>{item.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Repeat Every</label>
                                            <input
                                                disabled={formData.recurring_type !== "custom"}
                                                type="number"
                                                min="1"
                                                value={formData.recurring_type !== "custom" ? recurringTypes.filter(item => item.id === formData.recurring_type)[0]?.number : formData.repeat_every}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    repeat_every: Number.parseInt(formData.recurring_type !== "custom" ? recurringTypes.filter(item => item.id === formData.recurring_type)[0]?.number : e.target.value)
                                                })}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className={styles.formActions}>
                                    <button className={styles.btnCancel} onClick={() => setModalType(null)}>
                                        Cancel
                                    </button>
                                    <button
                                        disabled={!formData.title || !formData.deadline_datetime}
                                        className={classNames(styles.btnPrimary, {
                                            [styles.disabled]: !formData.title || !formData.deadline_datetime
                                        })}
                                        onClick={modalType === "createTask" ? handleCreateTask : handleEditTask}
                                    >
                                        {modalType === "createTask" ? "Create" : "Update"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Delete Task Modal */}
                {
                    modalType === "deleteTask" && (
                        <div className={styles.modalBackdrop} onClick={() => setModalType(null)}>
                            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                                <h2 className={styles.modalTitle}>Delete Task</h2>
                                <p className={styles.confirmText}>
                                    Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
                                </p>
                                <div className={styles.formActions}>
                                    <button className={styles.btnCancel} onClick={() => setModalType(null)}>
                                        Cancel
                                    </button>
                                    <button className={styles.btnDanger} onClick={handleDeleteTask}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* View Task Modal */}
                {modalType === "viewTask" && selectedTask && (
                    <ViewTaskModal
                        selectedTask={selectedTask}
                        categoryList={categoryList}
                        statusList={statusList}
                        userId={userId}
                        BackUrlForDoc={BackUrlForDoc}
                        activeCollapsibles={activeCollapsibles}
                        toggleCollapsible={toggleCollapsible}
                        tasksProfileLoading={tasksProfileLoading}
                        onClose={() => setModalType(null)}
                        openNestedModal={openNestedModal}
                        handleCompleteSubtask={handleCompleteSubtask}
                        compareByOrder={compareByOrder}
                    />
                )}

                {/* Nested CRUD Modals */}
                {
                    nestedModalType && (
                        <div className={styles.modalBackdrop} onClick={() => setNestedModalType(null)}>
                            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                                {nestedModalType === "createSubtask" || nestedModalType === "editSubtask" ? (
                                    <>
                                        <h2 className={styles.modalTitle}>
                                            {nestedModalType === "createSubtask" ? "Create Subtask" : "Edit Subtask"}
                                        </h2>
                                        <div className={styles.formGroup}>
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                value={nestedFormData.title || ""}
                                                onChange={(e) => setNestedFormData({
                                                    ...nestedFormData,
                                                    title: e.target.value
                                                })}
                                                placeholder="Subtask title"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Order</label>
                                            <input
                                                type="number"
                                                value={nestedFormData.order || ""}
                                                onChange={(e) => setNestedFormData({
                                                    ...nestedFormData,
                                                    order: e.target.value
                                                })}
                                                placeholder="Subtask order"
                                            />
                                        </div>
                                        {
                                            tasksProfileLoading && tasksProfileLoading === "subtasks"
                                                ? <DefaultLoaderSmall />
                                                : <div className={styles.formActions}>
                                                    <button className={styles.btnCancel}
                                                        onClick={() => setNestedModalType(null)}>
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={!nestedFormData.order || !nestedFormData.title}
                                                        className={classNames(styles.btnPrimary, {
                                                            [styles.disabled]: !nestedFormData.order || !nestedFormData.title
                                                        })}
                                                        onClick={nestedModalType === "createSubtask" ? handleCreateSubtask : handleEditSubtask}
                                                    >
                                                        {nestedModalType === "createSubtask" ? "Create" : "Update"}
                                                    </button>
                                                </div>
                                        }
                                    </>
                                ) : nestedModalType === "deleteSubtask" ? (
                                    <>
                                        <h2 className={styles.modalTitle}>Delete Subtask</h2>
                                        <p className={styles.confirmText}>Are you sure?</p>
                                        {
                                            tasksProfileLoading && tasksProfileLoading === "subtasks"
                                                ? <DefaultLoaderSmall />
                                                : <div className={styles.formActions}>
                                                    <button className={styles.btnCancel}
                                                        onClick={() => setNestedModalType(null)}>
                                                        Cancel
                                                    </button>
                                                    <button className={styles.btnDanger} onClick={handleDeleteSubtask}>
                                                        Delete
                                                    </button>
                                                </div>
                                        }

                                    </>
                                ) : nestedModalType === "createAttachment" || nestedModalType === "editAttachment" ? (
                                    <>
                                        <h2 className={styles.modalTitle}>
                                            {nestedModalType === "createAttachment" ? "Create Attachment" : "Edit Attachment"}
                                        </h2>
                                        <div className={styles.formGroup}>
                                            <label>Note</label>
                                            <input
                                                type="text"
                                                value={nestedFormData.note || ""}
                                                onChange={(e) => setNestedFormData({
                                                    ...nestedFormData,
                                                    note: e.target.value
                                                })}
                                                placeholder="Note"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>File</label>
                                            <input
                                                type="file"
                                                onChange={(e) => setNestedFormData({
                                                    ...nestedFormData,
                                                    file: e.target.files[0]
                                                })}
                                                placeholder="Filename"
                                            />
                                        </div>
                                        {

                                            tasksProfileLoading && tasksProfileLoading === "attachments"
                                                ? <DefaultLoaderSmall />
                                                : <div className={styles.formActions}>
                                                    <button className={styles.btnCancel}
                                                        onClick={() => setNestedModalType(null)}>
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={!nestedFormData.note && !nestedFormData.file}
                                                        className={classNames(styles.btnPrimary, {
                                                            [styles.disabled]: !nestedFormData.note && !nestedFormData.file
                                                        })}
                                                        onClick={nestedModalType === "createAttachment" ? handleCreateAttachment : handleEditAttachment}
                                                    >
                                                        {nestedModalType === "createAttachment" ? "Create" : "Update"}
                                                    </button>
                                                </div>
                                        }

                                    </>
                                ) : nestedModalType === "deleteAttachment" ? (
                                    <>
                                        <h2 className={styles.modalTitle}>Delete Attachment</h2>
                                        <p className={styles.confirmText}>Are you sure?</p>
                                        {

                                            tasksProfileLoading && tasksProfileLoading === "attachments"
                                                ? <DefaultLoaderSmall />
                                                : <div className={styles.formActions}>
                                                    <button className={styles.btnCancel}
                                                        onClick={() => setNestedModalType(null)}>
                                                        Cancel
                                                    </button>
                                                    <button className={styles.btnDanger} onClick={handleDeleteAttachment}>
                                                        Delete
                                                    </button>
                                                </div>
                                        }

                                    </>
                                ) : nestedModalType === "createComment" || nestedModalType === "editComment" ? (
                                    <>
                                        <h2 className={styles.modalTitle}>
                                            {nestedModalType === "createComment" ? "Create Comment" : "Edit Comment"}
                                        </h2>
                                        <div className={styles.formGroup}>
                                            <label>Text</label>
                                            <textarea
                                                value={nestedFormData.text || ""}
                                                onChange={(e) => setNestedFormData({
                                                    ...nestedFormData,
                                                    text: e.target.value
                                                })}
                                                placeholder="Comment text"
                                                rows={3}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>File</label>
                                            <input
                                                type="file"
                                                onChange={(e) => setNestedFormData({
                                                    ...nestedFormData,
                                                    comFile: e.target.files[0]
                                                })}
                                                placeholder="Filename"
                                            />
                                        </div>
                                        {
                                            tasksProfileLoading && tasksProfileLoading === "comments"
                                                ? <DefaultLoaderSmall />
                                                : <div className={styles.formActions}>
                                                    <button className={styles.btnCancel}
                                                        onClick={() => setNestedModalType(null)}>
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={!nestedFormData.text && !nestedFormData.comFile}
                                                        className={classNames(styles.btnPrimary, {
                                                            [styles.disabled]: !nestedFormData.text && !nestedFormData.comFile
                                                        })}
                                                        onClick={nestedModalType === "createComment" ? handleCreateComment : handleEditComment}
                                                    >
                                                        {nestedModalType === "createComment" ? "Create" : "Update"}
                                                    </button>
                                                </div>
                                        }
                                    </>
                                ) : nestedModalType === "deleteComment" ? (
                                    <>
                                        <h2 className={styles.modalTitle}>Delete Comment</h2>
                                        <p className={styles.confirmText}>Are you sure?</p>
                                        {
                                            tasksProfileLoading && tasksProfileLoading === "comments"
                                                ? <DefaultLoaderSmall />
                                                : <div className={styles.formActions}>
                                                    <button className={styles.btnCancel}
                                                        onClick={() => setNestedModalType(null)}>
                                                        Cancel
                                                    </button>
                                                    <button className={styles.btnDanger} onClick={handleDeleteComment}>
                                                        Delete
                                                    </button>
                                                </div>
                                        }
                                    </>
                                ) : nestedModalType === "createProof" || nestedModalType === "editProof" ? (
                                    <>
                                        <h2 className={styles.modalTitle}>
                                            {nestedModalType === "createProof" ? "Create Proof" : "Edit Proof"}
                                        </h2>
                                        <div className={styles.formGroup}>
                                            <label>Comment</label>
                                            <textarea
                                                value={nestedFormData.comment || ""}
                                                onChange={(e) => setNestedFormData({
                                                    ...nestedFormData,
                                                    comment: e.target.value
                                                })}
                                                placeholder="Proof comment"
                                                rows={2}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>File</label>
                                            <input
                                                type="file"
                                                onChange={(e) => setNestedFormData({
                                                    ...nestedFormData,
                                                    proofFile: e.target.files[0]
                                                })}
                                                placeholder="Filename"
                                            />
                                        </div>
                                        {
                                            tasksProfileLoading && tasksProfileLoading === "proofs"
                                                ? <DefaultLoaderSmall />
                                                : <div className={styles.formActions}>
                                                    <button className={styles.btnCancel}
                                                        onClick={() => setNestedModalType(null)}>
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={!nestedFormData.comment && !nestedFormData.proofFile}
                                                        className={classNames(styles.btnPrimary, {
                                                            [styles.disabled]: !nestedFormData.comment && !nestedFormData.proofFile
                                                        })}
                                                        onClick={nestedModalType === "createProof" ? handleCreateProof : handleEditProof}
                                                    >
                                                        {nestedModalType === "createProof" ? "Create" : "Update"}
                                                    </button>
                                                </div>
                                        }
                                    </>
                                ) : nestedModalType === "deleteProof" ? (
                                    <>
                                        <h2 className={styles.modalTitle}>Delete Proof</h2>
                                        <p className={styles.confirmText}>Are you sure?</p>
                                        {
                                            tasksProfileLoading && tasksProfileLoading === "proofs"
                                                ? <DefaultLoaderSmall />
                                                : <div className={styles.formActions}>
                                                    <button className={styles.btnCancel}
                                                        onClick={() => setNestedModalType(null)}>
                                                        Cancel
                                                    </button>
                                                    <button className={styles.btnDanger} onClick={handleDeleteProof}>
                                                        Delete
                                                    </button>
                                                </div>
                                        }
                                    </>
                                ) : null}
                            </div>
                        </div>
                    )
                }

                {modalType === "changeStatus" && (
                    <ChangeStatusModal
                        selectedTask={selectedTask}
                        userId={userId}
                        statusList={statusList}
                        formData={formData}
                        setFormData={setFormData}
                        onClose={() => setModalType(null)}
                        onUpdate={handleChangeStatus}
                        getAllowedStatuses={getAllowedStatuses}
                    />
                )}

                {/* Create/Edit/Delete Tag Modals */}
                {
                    (modalType === "createTag" || modalType === "editTag") && (
                        <div className={styles.modalBackdrop} onClick={() => setModalType(null)}>
                            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                                <h2 className={styles.modalTitle}>{modalType === "createTag" ? "Create Tag" : "Edit Tag"}</h2>
                                <div className={styles.formGroup}>
                                    <label>Tag Name</label>
                                    <input
                                        type="text"
                                        value={tagFormData || ""}
                                        onChange={(e) => setTagFormData(e.target.value)}
                                        placeholder="Tag name"
                                    />
                                </div>
                                <div className={styles.formActions}>
                                    <button className={styles.btnCancel} onClick={() => setModalType(null)}>
                                        Cancel
                                    </button>
                                    <button
                                        disabled={!tagFormData}
                                        className={classNames(styles.btnPrimary, {
                                            [styles.disabled]: !tagFormData
                                        })}
                                        onClick={modalType === "createTag" ? handleCreateTag : handleEditTag}
                                    >
                                        {modalType === "createTag" ? "Create" : "Update"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    modalType === "deleteTag" && (
                        <div className={styles.modalBackdrop} onClick={() => setModalType(null)}>
                            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                                <h2 className={styles.modalTitle}>Delete Tag</h2>
                                <p className={styles.confirmText}>Are you sure you want to delete the tag
                                    "{selectedTag?.name}"?</p>
                                <div className={styles.formActions}>
                                    <button className={styles.btnCancel} onClick={() => setModalType(null)}>
                                        Cancel
                                    </button>
                                    <button className={styles.btnDanger} onClick={handleDeleteTag}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
            <Modal
                activeModal={isFilter}
                setActiveModal={setIsFilter}
                extraClass={styles.filter}
            >
                <h1>Filter</h1>
                <div className={styles.filter__container}>
                    <Select
                        title={"Status"}
                        clazzLabel={styles.mainInput}
                        options={[{ id: "all", name: "Hammasi" }, ...statusList]}
                        onChangeOption={setSelectedStatus}
                        value={selectedStatus}
                    />
                    {/* <Input
                        extraClassName={styles.mainInput}
                        title={"Created at"}
                        type={"date"}
                        onChange={(e) => setSelectedCreate(e.target.value)}
                    /> */}
                    <div className={styles.tags}>
                        <span className={styles.tags__title}>Tags</span>
                        <AnimatedMulti
                            extraClass={classNames(
                                styles.tags__select,
                                {
                                    [styles.active]: isFilter
                                })
                            }
                            title={"Tags"}
                            options={tagsList}
                            onChange={setSelectedTags}
                            value={selectedTags}
                            fontSize={15}
                        />
                    </div>
                    <Select
                        title={"Departmant"}
                        clazzLabel={classNames(styles.mainInput, styles.lastSelect)}
                        options={[{ id: "all", name: "Hammasi" }, ...categoryList]}
                        onChangeOption={setSelectedCategory}
                        value={selectedCategory}
                    />
                    {/* <Input title={"Deadline"} /> */}
                    <div className={styles.dualInput}>
                        <Input
                            extraClassName={styles.dualInput__inner}
                            title={"Deadline (form)"}
                            type={"date"}
                            onChange={setSelectedDeadlineFrom}
                            value={selectedDeadlineFrom}
                        />
                        <Input
                            extraClassName={styles.dualInput__inner}
                            title={"Deadline (to)"}
                            type={"date"}
                            onChange={setSelectedDeadlineTo}
                            value={selectedDeadlineTo}
                        />
                    </div>
                    <Button
                        extraClass={styles.clearBtn}
                        type={
                            selectedCreate || selectedDeadlineFrom || selectedDeadlineTo || selectedStatus !== "all" || selectedTags.length !== 0 || selectedCategory !== "all"
                                ? "danger"
                                : "disabled"
                        }
                        onClickBtn={() => {
                            setSelectedCreate(null)
                            setSelectedDeadlineFrom(null)
                            setSelectedDeadlineTo(null)
                            setSelectedStatus("all")
                            setSelectedTags([])
                            setSelectedCategory("all")
                        }}
                    >
                        Clear
                    </Button>
                </div>
            </Modal>
            <Modal
                setActiveModal={setIsRedirected}
                activeModal={isRedirected}
                extraClass={styles.redirect}
            >
                <h1>Redirect</h1>
                <Select
                    title={"Select redirect"}
                    options={
                        teachersList
                            .filter(item => item.id !== userId && item.id !== selectedTask?.executor?.id)
                    }
                    onChangeOption={setSelectedRedirect}
                    value={selectedRedirect}
                    defaultValue={selectedTask?.is_redirected ? selectedTask?.redirected_by?.id : null}
                />
                <Button
                    extraClass={styles.redirect__btn}
                    onClickBtn={onChangeRedirect}
                    disabled={!selectedRedirect || (selectedTask?.redirected_by?.id === +selectedRedirect)}
                    type={!selectedRedirect || (selectedTask?.redirected_by?.id === +selectedRedirect) ? "disabled" : ""}
                >
                    Enter
                </Button>
            </Modal>
        </>
    )
}

export function NotificationCard({ data, onToggleRead, onViewTask }) {
    const { id, message, role, mission, deadline_datetime, is_read, created_at } = data;

    const handleToggle = () => {

        onToggleRead(id, !is_read);
    };

    const handleView = () => {
        onViewTask(mission)
    }

    return (
        <div className={`${styles.card} ${is_read ? styles.read : ""}`}>
            <div className={styles.header}>
                {/* <span className={styles.role}>{role}</span> */}
                <span className={styles.date}>{created_at}</span>
            </div>

            <p className={styles.message}>{message}</p>

            <div className={styles.info}>
                {/* <span className={styles.mission_id}>Mission: {mission_id}</span> */}
                <span className={styles.deadline_datetime}>Deadline: {deadline_datetime}</span>
            </div>

            <div className={styles.card__btn}>
                <button
                    className={styles.viewBtn}
                    onClick={handleView}
                >
                    Vazifani korish
                </button>
                <button
                    className={styles.toggleBtn}
                    onClick={handleToggle}
                >
                    {is_read ? "O'qilmagan deb belgilash" : "O'qilgan deb belgilash"}
                </button>
            </div>
        </div>
    );
}

export default PlatformTodoist
