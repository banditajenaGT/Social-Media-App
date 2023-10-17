import axios from "axios"

export const likePost = (postId) => async (dispatch) => {
    try {
        dispatch({
            type: "likeRequest"
        })
        const { data } = await axios.get(`/api/v1/post/${postId}`, {
            withCredentials: true
        })
        dispatch({
            type: "likeSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "likeFailure",
            payload: error.response.data.message
        })
    }
}
export const commentPost = (postId, comment) => async (dispatch) => {
    try {
        dispatch({
            type: "commentRequest"
        })
        const { data } = await axios.post(`/api/v1/post/comment/${postId}`, {
            comment
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        dispatch({
            type: "commentSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "commentFailure",
            payload: error.response.data.message
        })
    }
}

export const editCommentPost = (postId, commentId,comment) => async (dispatch) => {
    try {
        dispatch({
            type: "editCommentRequest"
        })
        const { data } = await axios.put(`/api/v1/post/comment/${postId}`, {
            commentId, comment
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        dispatch({
            type: "editCommentSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "editCommentFailure",
            payload: error.response.data.message
        })
    }
}
export const deleteCommentPost = (postId, commentId) => async (dispatch) => {
    try {
        dispatch({
            type:"deleteCommentRequest"
        })
        const { data } = await axios.post(`/api/v1/post/comment/delete/${postId}`,{
            commentId
        },{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials:true
        })
        dispatch({
            type: "deleteCommentSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "deleteCommentFailure",
            payload: error.response.data.message
        })
    }
}
export const createNewPost = (caption,image) => async (dispatch) => {
    try {
        dispatch({
            type:"newPostRequest"
        })
        const { data } = await axios.post(`/api/v1/post/upload`,{
            caption,image
        },{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials:true
        })
        dispatch({
            type: "newPostSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "newPostFailure",
            payload: error.response.data.message
        })
    }
}

export const updatePost = (caption,id) => async (dispatch) => {
    try {
        dispatch({
            type:"updateCaptionRequest"
        })
        const { data } = await axios.put(`/api/v1/post/${id}`,{
            caption
        },{
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials:true
        })
        dispatch({
            type: "updateCaptionSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "updateCaptionFailure",
            payload: error.response.data.message
        })
    }
}

export const deletePost = (id) => async (dispatch) => {
    try {
        dispatch({
            type:"deletePostRequest"
        })
        const { data } = await axios.delete(`/api/v1/post/${id}`,{
            withCredentials:true
        }) 
        dispatch({
            type: "deletePostSuccess",
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: "deletePostFailure",
            payload: error.response.data.message
        })
    }
}
