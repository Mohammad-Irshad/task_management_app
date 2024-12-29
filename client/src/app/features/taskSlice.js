import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const addTask = createAsyncThunk('task/addTask', async (taskData, {rejectWithValue}) => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
        return rejectWithValue('No token found');
    }
    try{
        const response = await axios.post(`https://task-management-appserver.vercel.app/tasks`, taskData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data
    }catch(error){
        return rejectWithValue(error.response ? error.response.data : error.message)
    }
})

export const getAllTasks = createAsyncThunk('task/getAllTasks', async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
        return rejectWithValue('No token found');
    }
    try{
        const response = await axios.get(`https://task-management-appserver.vercel.app/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data
    }catch(error){
        return error
    }
})

export const deleteTask = createAsyncThunk('task/deleteTask', async (taskId) => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
        return rejectWithValue('No token found');
    }
    try{
        const response = await axios.delete(`https://task-management-appserver.vercel.app/tasks/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data
    }catch(error){
        return error
    }
})

export const editTask = createAsyncThunk('task/editTask', async ({taskId, updatedData}, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
        return rejectWithValue('No token found');
    }
    try{
        const response = await axios.put(`https://task-management-appserver.vercel.app/tasks/${taskId}`, updatedData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data
    }catch(error){
        console.error("Error updating task:", error)
        return rejectWithValue(error.response ? error.response.data : error.message)
    }
})


export const getTasksByPage = createAsyncThunk('task/getTasksByPage', async ({page, limit}) => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
        return rejectWithValue('No token found');
    }
    try{
        const response = await axios.get(`https://task-management-appserver.vercel.app/tasks/page?page=${page}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        console.log("Task by page : ", response.data)
        return response.data
    }catch(error){
        return error
    }
})



export const taskSlice = createSlice({
    name : "tasks",
    initialState : {
        allTasks : [],
        tasksByPage : [],
        totalPages : 0,
        status : 'idle',
        error : false
    },
    reducers : {

    },
    extraReducers : (builder) => {
        builder
        .addCase(addTask.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(addTask.fulfilled, (state, action) => {
            state.status = 'success'
            state.allTasks.push(action.payload.addedTask)
        })
        .addCase(addTask.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.payload.error
        })
        .addCase(getAllTasks.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(getAllTasks.fulfilled, (state, action) => {
            state.status = 'success'
            state.allTasks = action.payload.tasks
        })
        .addCase(getAllTasks.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.payload.error
        })
        .addCase(deleteTask.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(deleteTask.fulfilled, (state, action) => {
            state.status = 'success'
            state.allTasks = state.allTasks.filter((task) => task._id != action.payload.deletedTask._id)
        })
        .addCase(deleteTask.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.payload.error
        })
        .addCase(editTask.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(editTask.fulfilled, (state, action) => {
            state.status = 'success'
            const taskIndex = state.allTasks.findIndex((task) => task._id === action.payload.updatedTask._id)
            console.log('Task Index:', taskIndex)
            if (taskIndex >= 0) {
                state.allTasks[taskIndex] = action.payload.updatedTask
            } else {
                console.log('Task not found for update')
            }
        })
        .addCase(editTask.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.payload.error
        })
        .addCase(getTasksByPage.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(getTasksByPage.fulfilled, (state, action) => {
            state.status = 'success'
            state.tasksByPage = action.payload.taskPages.tasks
            state.totalPages = action.payload.taskPages.totalPages
        })
        .addCase(getTasksByPage.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.payload.error
        })
    }    

})


export default taskSlice.reducer
