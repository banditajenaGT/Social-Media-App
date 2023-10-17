import { createReducer } from "@reduxjs/toolkit"

const initialState = {
    isAuthenticated:false
}
export const userReducer = createReducer(initialState, {
    loginRequest: (state) => {
        state.loading = true
    },
    loginSuccess: (state, action) => {
        state.loading = false
        state.user = action.payload
        state.text = action.message
        state.isAuthenticated=true
    },
    loginFailure: (state, action) => {
        state.loading = false
        state.error = action.payload 
        state.isAuthenticated=false
    },

    registerRequest: (state) => {
        state.loading = true
    },
    registerSuccess: (state, action) => {
        state.loading = false
        state.user = action.payload
        state.text = action.message
        state.isAuthenticated=true
    },
    registerFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated=false
    },

    loadUserRequest: (state) => {
        state.loading = true
    },
    loadUserSuccess: (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated=true
    },
    loadUserFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated=false
    },

    logoutUserRequest: (state) => {
        state.loading = true
    },
    logoutUserSuccess: (state, action) => {
        state.loading = false
        state.user = null 
        state.text=action.message
        state.isAuthenticated=false
    },
    logoutUserFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated=true
    },
    
    clearErrors:(state)=>{
        state.error=null
    },
    
    clearMessage:(state)=>{
        state.text=null
    }
})

export const postOfFollowingReducer=createReducer({},{
    postOfFollowingRequest:(state)=>{
        state.loading=true
    },
    postOfFollowingSuccess:(state,action)=>{
        state.loading=false
        state.posts=action.payload
    },
    postOfFollowingFailure:(state,action)=>{
        state.loading=false
        state.error=action.payload
    },
    clearErrors:(state)=>{
        state.error=null
    }
})

export const allUsersReducer=createReducer({},{
   allUsersRequest:(state)=>{
        state.loading=true
    },
   allUsersSuccess:(state,action)=>{
        state.loading=false
        state.users=action.payload
    },
   allUsersFailure:(state,action)=>{
        state.loading=false
        state.error=action.payload
    },
    clearErrors:(state)=>{
        state.error=null
    }
})

export const myPostsReducer=createReducer({},{
    myPostsRequest:(state)=>{
        state.loading=true
    },
    myPostsSuccess:(state,action)=>{
        state.loading=false
        state.posts=action.payload
    },
    myPostsFailure:(state,action)=>{
        state.loading=false
        state.error=action.payload
    },
    clearErrors:(state)=>{
        state.error=null
    },
})