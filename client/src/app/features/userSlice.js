import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'


export const signUpUser = createAsyncThunk('user/signup', async (signUpData, {rejectWithValue}) => {
    try{
        const response = await axios.post(`https://task-management-appserver.vercel.app/auth/signup`, signUpData)
        return response.data
    }catch(err){
        return rejectWithValue(err.response?.data || { message: "Something went wrong" })
    }    
})

export const loginUser = createAsyncThunk('user/login', async (loginData, { rejectWithValue }) => {
    try{
        const response = await axios.post(`https://task-management-appserver.vercel.app/auth/login`, loginData)
        return response.data
    }catch(err){
        return rejectWithValue(err.response?.data || { message: "Something went wrong" })
    }
    
})


export const userSlice = createSlice({
    name : "user",
    initialState : {
        logedInUser : {
            name : '',
            email : '', 
            _id : ''
        },        
        status : 'idle',
        error : false, 
    },      
    
    reducers : {

    },
    extraReducers : (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.status = 'success'
            localStorage.setItem("accessToken", action.payload.accessToken)
            state.logedInUser = action.payload.user

        })
        .addCase(loginUser.rejected, (state, action) => {
            state.status = 'error'

        })
        .addCase(signUpUser.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(signUpUser.fulfilled, (state, action) => {
            state.status = 'success'

        })
        .addCase(signUpUser.rejected, (state, action) => {
            state.status = 'error'

        })
    }

})



export default userSlice.reducer