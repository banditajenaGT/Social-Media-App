import axios from "axios"

export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: "loginRequest" })
        const { data } = await axios.post("/api/v1/login", { email, password }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        dispatch({
            type: "loginSuccess",
            payload: data.user,
            message: data.message
        })
    } catch (error) {
        dispatch({
            type: "loginFailure",
            payload: error.response.data.message
        })
    }
}

export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: "loadUserRequest" })
        const { data } = await axios.get("/api/v1/myprofile", {
            withCredentials: true
        })
        dispatch({
            type: "loadUserSuccess",
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: "loadUserFailure",
            payload: error.response.data.message
        })
    }
}

export const getFollowingPosts = () => async (dispatch) => {

    try {
        dispatch({
            type: "postOfFollowingRequest"
        })
        const { data } = await axios.get("/api/v1/posts", {
            withCredentials: true
        })
        dispatch({
            type: "postOfFollowingSuccess",
            payload: data.posts
        })
    } catch (error) {
        dispatch({
            type: "postOfFollowingFailure",
            payload: error.response.data.message
        })
    }
}

export const getAllUsers = (name = "") => async (dispatch) => {
    try {
        dispatch({
            type: "allUsersRequest"
        })
        const { data } = await axios.get(`/api/v1/users?name=${name}`, {
            withCredentials: true
        })
        dispatch({
            type: "allUsersSuccess",
            payload: data.users
        })
    } catch (error) {
        dispatch({
            type: "allUsersFailure",
            payload: error.response.data.message
        })
    }
}


export const getMyPosts = () => async (dispatch) => {

    try {
        dispatch({
            type: "myPostsRequest"
        })
        const { data } = await axios.get("/api/v1/myprofile/posts", {
            withCredentials: true
        })
        dispatch({
            type: "myPostsSuccess",
            payload: data.posts
        })
    } catch (error) {
        dispatch({
            type: "myPostsFailure",
            payload: error.response.data.message
        })
    }
}

export const logoutUser = () => async (dispatch) => {
    try {
        dispatch({ type: "logoutUserRequest" })
        const { data } = await axios.get("/api/v1/logout", {
            withCredentials: true
        })
        dispatch({
            type: "logoutUserSuccess",
            payload: data.user,
            message: data.message
        })
    } catch (error) {
        dispatch({
            type: "logoutUserFailure",
            payload: error.response.data.message
        })
    }
}

export const registerUser = (avatar, name, email, password) => async (dispatch) => {
    try {
        dispatch({ type: "registerRequest" })
        const { data } = await axios.post("/api/v1/register", {
            avatar, name, email, password
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        dispatch({
            type: "registerSuccess",
            payload: data.user,
            message: data.message
        })
    } catch (error) {
        dispatch({
            type: "registerFailure",
            payload: error.response.data.message
        })
    }
}

export const updateProfile = (avatar, name, email) => async (dispatch) => {
    try {
        dispatch({ type: "updateProfileRequest" })
        const { data } = await axios.put("/api/v1/update/profile", {
            avatar, name, email
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        dispatch({
            type: "updateProfileSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "updateProfileFailure",
            payload: error.response.data.message
        })
    }
}

export const updatePassword = (oldPassword, newPassword) => async (dispatch) => {
    try {
        dispatch({ type: "updatePasswordRequest" })
        const { data } = await axios.put("/api/v1/update/password", {
            oldPassword, newPassword
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        dispatch({
            type: "updatePasswordSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "updatePasswordFailure",
            payload: error.response.data.message
        })
    }
}

export const deleteProfile = () => async (dispatch) => {
    try {
        dispatch({ type: "deleteProfileRequest" })
        const { data } = await axios.delete("/api/v1/delete/profile", {
            withCredentials: true
        })
        dispatch({
            type: "deleteProfileSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "deleteProfileFailure",
            payload: error.response.data.message
        })
    }
}

export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: "forgotPasswordRequest" })
        const { data } = await axios.post("/api/v1/forgot/password", {
            email
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        dispatch({
            type: "forgotPasswordSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "forgotPasswordFailure",
            payload: error.response.data.message
        })
    }
}

export const resetPassword = (token, password) => async (dispatch) => {
    try {
        dispatch({ type: "resetPasswordRequest" })
        const { data } = await axios.put(`/api/v1/password/reset/${token}`, {
            password
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        dispatch({
            type: "resetPasswordSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "resetPasswordFailure",
            payload: error.response.data.message
        })
    }
}

export const getUserPosts = (userId) => async (dispatch) => {

    try {
        dispatch({
            type: "userPostsRequest"
        })
        const { data } = await axios.get(`/api/v1/userPosts/${userId}`, {
            withCredentials: true
        })
        dispatch({
            type: "userPostsSuccess",
            payload: data.posts
        })
    } catch (error) {
        dispatch({
            type: "userPostsFailure",
            payload: error.response.data.message
        })
    }
}

export const getUserProfile = (userId) => async (dispatch) => {

    try {
        dispatch({
            type: "userProfileRequest"
        })
        const { data } = await axios.get(`/api/v1/user/${userId}`, {
            withCredentials: true
        })
        dispatch({
            type: "userProfileSuccess",
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: "userProfileFailure",
            payload: error.response.data.message
        })
    }
}

export const followUser = (userId) => async (dispatch) => {

    try {
        dispatch({
            type: "followUserRequest"
        })
        const { data } = await axios.get(`/api/v1/follow/${userId}`, {
            withCredentials: true
        })
        dispatch({
            type: "followUserSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "followUserFailure",
            payload: error.response.data.message
        })
    }
}