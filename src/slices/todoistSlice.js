import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { useHttp, ParamUrl } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";

export const fetchTasks = createAsyncThunk(
    "todoistSlice/fetchTasks",
    ({ status, creator, executor, reviewer, created_at, deadline, deadline_after, deadline_before, tags, category }) => {
        const { request } = useHttp()
        return request(`${BackUrl}missions/?${ParamUrl({
            status,
            creator,
            executor,
            reviewer,
            created_at,
            deadline,
            deadline_after,
            deadline_before,
            tags,
            category
        })}`, "GET", null, headers())
    }
)

export const fetchTaskProfile = createAsyncThunk(
    "todoistSlice/fetchTaskProfile",
    ({ id }) => {
        const { request } = useHttp()
        return request(`${BackUrl}missions/${id}/`, "GET", null, headers())
    }
)

export const fetchTaskTags = createAsyncThunk(
    "todoistSlice/fetchTaskTags",
    () => {
        const { request } = useHttp()
        return request(`${BackUrl}tags/`, "GET", null, headers())
    }
)

export const fetchTaskNotifications = createAsyncThunk(
    "todoistSlice/fetchTaskNotifications",
    ({ role, user_id }) => {
        const { request } = useHttp()
        return request(`${BackUrl}notifications/?role=${role}&user_id=${user_id}`, "GET", null, headers())
    }
)


const initialState = {
    tasks: [],
    taskProfile: {},
    tags: [],
    tagLoading: false,
    taskLoading: false,
    profileLoading: false,
    error: null,
    recurringTypes: [
        { id: "daily", name: "Daily", number: 1, disabled: true },
        { id: "weekly", name: "Weekly", number: 7, disabled: true },
        { id: "monthly", name: "Monthly", number: 30, disabled: true },
        { id: "custom", name: "Custom", number: 1, disabled: false },
    ],
    statusList: [
        { id: "not_started", name: "Not Started" },
        { id: "in_progress", name: "In Progress" },
        { id: "blocked", name: "Blocked" },
        { id: "completed", name: "Completed" },
        { id: "approved", name: "Approved" },
        { id: "declined", name: "Declined" },
        { id: "recheck", name: "Re-check" },
    ],
    categoryList: [
        { id: "academic", name: "Academic" },
        { id: "admin", name: "Admin" },
        { id: "student", name: "Student-related" },
        { id: "report", name: "Report" },
        { id: "meeting", name: "Meeting/Event" },
        { id: "marketing", name: "Marketing" },
        { id: "maintenance", name: "Maintenance" },
        { id: "finance", name: "Finance" },
    ],
    notifications: [],
    notificationLoading: false
}

const todoistSlice = createSlice({
    name: "todoistSlice",
    initialState,
    reducers: {
        taskLoading: (state) => {
            state.taskLoading = true
        },
        taskProfileLoading: (state, action) => {
            state.profileLoading = action.payload
        },
        taskTagsLoading: (state) => {
            state.tagLoading = true
        },
        notificationLoading: (state) => {
            state.notificationLoading = true
        },
        taskLoadingStop: (state) => {
            state.taskLoading = false
        },
        taskProfileLoadingStop: (state) => {
            state.profileLoading = false
        },
        taskTagsLoadingStop: (state) => {
            state.tagLoading = false
        },
        notificationLoadingStop: (state) => {
            state.notificationLoading = false
        },
        addTask: (state, action) => {
            state.tasks = [
                {
                    children: action.payload,
                    ...action.payload[0]
                },
                ...state.tasks
            ]
            state.taskLoading = false
        },
        editTask: (state, action) => {
            state.tasks = [
                action.payload,
                ...state.tasks.filter(item => item.id !== action.payload.id)
            ]
            state.taskLoading = false
        },
        editMultiTask: (state, action) => {
            state.tasks =
                state.tasks.map(item => {
                    if (item.id === action.payload.parent) {
                        return {
                            ...item.children.filter(it => it.id !== action.payload.id)[0],
                            children: [
                                ...item.children.filter(it => it.id !== action.payload.id),
                                action.payload
                            ]
                        }
                    } else return item
                })
            state.taskLoading = false
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(item => item.id !== action.payload)
            state.taskLoading = false
        },
        deleteMultiTask: (state, action) => {
            state.tasks =
                state.tasks.map(item => {
                    if (item.id === action.payload.parent) {
                        return {
                            ...item.children.filter(it => it.id !== action.payload.id)[0],
                            children: item.children.filter(it => it.id !== action.payload.id)
                        }
                    } else return item
                })
            state.taskLoading = false
        },
        addTag: (state, action) => {
            state.tags = [action.payload, ...state.tags]
            state.tagLoading = false
        },
        editTag: (state, action) => {
            state.tags = [
                action.payload,
                ...state.tags.filter(item => item.id !== action.payload.id)
            ]
            state.tagLoading = false
        },
        deleteTag: (state, action) => {
            state.tags = state.tags.filter(item => item.id !== action.payload)
            state.tagLoading = false
        },
        addSubTasks: (state, action) => {
            state.tasks = state.tasks.map(item => {
                if (item.id === action.payload.mission) {
                    return {
                        ...item,
                        subtasks: [...item.subtasks, action.payload]
                    }
                } else return item
            })
            state.profileLoading = false
        },
        deleteSubTasks: (state, action) => {
            state.tasks = state.tasks.map(item => {
                if (item.id === action.payload.mission) {
                    return {
                        ...item,
                        subtasks: item.subtasks.filter(sub => sub.id !== action.payload.subtask)
                    }
                } else return item
            })
            state.profileLoading = false
        },
        editSubTasks: (state, action) => {
            state.tasks = state.tasks.map(item => {
                if (item.id === action.payload.mission) {
                    return {
                        ...item,
                        subtasks: item.subtasks.map(sub => sub.id === action.payload.id ? action.payload : sub)
                    }
                } else return item
            })
            state.profileLoading = false
        },
        addAttachments: (state, action) => {
            state.tasks = state.tasks.map(item => {
                if (item.id === action.payload.mission) {
                    return {
                        ...item,
                        attachments: [...item.attachments, action.payload]
                    }
                } else return item
            })
            state.profileLoading = false
        },
        deleteAttachments: (state, action) => {
            state.tasks = state.tasks.map(item => {
                if (item.id === action.payload.mission) {
                    return {
                        ...item,
                        attachments: item.attachments.filter(sub => sub.id !== action.payload.attachment)
                    }
                } else return item
            })
            state.profileLoading = false
        },
        editAttachments: (state, action) => {
            state.tasks = state.tasks.map(item => {
                if (item.id === action.payload.mission) {
                    return {
                        ...item,
                        attachments: item.attachments.map(sub => sub.id === action.payload.id ? action.payload : sub)
                    }
                } else return item
            })
            state.profileLoading = false
        },
        addComments: (state, action) => {
            state.tasks = state.tasks.map(item => {
                if (item.id === action.payload.mission) {
                    return {
                        ...item,
                        comments: [...item.comments, action.payload]
                    }
                } else return item
            })
            state.profileLoading = false
        },
        deleteComments: (state, action) => {
            state.tasks = state.tasks.map(item => {
                if (item.id === action.payload.mission) {
                    return {
                        ...item,
                        comments: item.comments.filter(sub => sub.id !== action.payload.comment)
                    }
                } else return item
            })
            state.profileLoading = false
        },
        editComments: (state, action) => {
            state.tasks = state.tasks.map(item => {
                if (item.id === action.payload.mission) {
                    return {
                        ...item,
                        comments: item.comments.map(sub => sub.id === action.payload.id ? action.payload : sub)
                    }
                } else return item
            })
            state.profileLoading = false
        },
        addProofs: (state, action) => {
            state.tasks = state.tasks.map(item => {
                if (item.id === action.payload.mission) {
                    return {
                        ...item,
                        proofs: [...item.proofs, action.payload]
                    }
                } else return item
            })
            state.profileLoading = false
        },
        deleteProofs: (state, action) => {
            state.tasks = state.tasks.map(item => {
                if (item.id === action.payload.mission) {
                    return {
                        ...item,
                        proofs: item.proofs.filter(sub => sub.id !== action.payload.proof)
                    }
                } else return item
            })
            state.profileLoading = false
        },
        editProofs: (state, action) => {
            state.tasks = state.tasks.map(item => {
                if (item.id === action.payload.mission) {
                    return {
                        ...item,
                        proofs: item.proofs.map(sub => sub.id === action.payload.id ? action.payload : sub)
                    }
                } else return item
            })
            state.profileLoading = false
        },
        editNotification: (state, action) => {
            state.notifications = state.notifications.map(item => item.id === action.payload.id ? action.payload : item)
            state.notificationLoading = false
        }
    },
    extraReducers: builder =>
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.taskLoading = true
                state.error = null
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.taskLoading = false
                state.tasks = action.payload
                state.error = null
            })
            .addCase(fetchTasks.rejected, (state) => {
                state.taskLoading = false
                state.error = "Xatolik yuz berdi"
            })
            .addCase(fetchTaskTags.pending, (state) => {
                state.tagLoading = true
                state.error = null
            })
            .addCase(fetchTaskTags.fulfilled, (state, action) => {
                state.tagLoading = false
                state.tags = action.payload
                state.error = null
            })
            .addCase(fetchTaskTags.rejected, (state) => {
                state.tagLoading = false
                state.error = "Xatolik yuz berdi"
            })
            .addCase(fetchTaskNotifications.pending, (state) => {
                state.notificationLoading = true
                state.error = null
            })
            .addCase(fetchTaskNotifications.fulfilled, (state, action) => {
                state.notificationLoading = false
                state.notifications = action.payload
                state.error = null
            })
            .addCase(fetchTaskNotifications.rejected, (state) => {
                state.notificationLoading = false
                state.error = "Xatolik yuz berdi"
            })
})


export default todoistSlice.reducer
export const {
    taskLoading,
    taskLoadingStop,
    taskProfileLoading,
    notificationLoading,
    taskProfileLoadingStop,
    taskTagsLoading,
    taskTagsLoadingStop,
    notificationLoadingStop,
    addTask,
    editTask,
    editMultiTask,
    deleteTask,
    deleteMultiTask,
    addTag,
    editTag,
    deleteTag,
    addSubTasks,
    deleteSubTasks,
    editSubTasks,
    addAttachments,
    deleteAttachments,
    editAttachments,
    addComments,
    deleteComments,
    editComments,
    addProofs,
    deleteProofs,
    editProofs,
    editNotification
} = todoistSlice.actions

