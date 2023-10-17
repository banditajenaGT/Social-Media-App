import React from 'react'
import "../css/commentCard.css"
import { Button, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCommentPost } from '../Action/Post'
import { getFollowingPosts, getMyPosts, getUserPosts } from '../Action/User'

const CommentCard = ({ userId, name, avatar, comment, commentId, postId, isAccount }) => {

    const { user: me } = useSelector(state => state.user)
    const { user } = useSelector(state => state.userProfile)
    const dispatch = useDispatch()

    const deleteCommentHandler = async (e) => {
        e.preventDefault()
        await dispatch(deleteCommentPost(postId, commentId))

        if (isAccount === "Me") {
            dispatch(getMyPosts())
        }
        else if (isAccount === "MyFollowing") {
            dispatch(getFollowingPosts())
        }
        else if (isAccount === "User") {
            dispatch(getUserPosts(user._id))
        }
    }

    return (
        <div className='commentUser'>
            <Link to={`/user/${userId}`}>
                <img src={avatar} alt={name} />
                <Typography style={{ minWidth: "6vmax", margin: "0 1vmax" }}>{name}</Typography>
            </Link>
            <Typography style={{ margin: "0 1vmax 0 0" }}>{comment}</Typography>
            {isAccount === "Me" ? (
                <Button onClick={deleteCommentHandler}><Delete /></Button>
            ) : userId === me._id ? (
                <Button onClick={deleteCommentHandler}><Delete /></Button>
            ) : null}

        </div>
    )
}

export default CommentCard
