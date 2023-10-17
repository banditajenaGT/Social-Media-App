import React, { useEffect, useState } from 'react'
import "../css/account.css"
import { useDispatch, useSelector } from "react-redux"
import { followUser, getUserPosts, getUserProfile, loadUser } from '../Action/User'
import Loader from "./Loader"
import Post from './Post'
import { Avatar, Button, Dialog, Typography } from '@mui/material'
import { useAlert } from "react-alert"
import { useParams } from 'react-router-dom'
import User from './User'


const UserProfile = () => {
    const { loading, error, posts } = useSelector((state) => state.userPosts)
    const { error: followError, message, loading: followLoading } = useSelector((state) => state.like)
    const { user, loading: userLoading, error: userError } = useSelector(state => state.userProfile)
    const { user: me } = useSelector(state => state.user)

    const [followersToggle, setFollowersToggle] = useState(false)
    const [followingToggle, setFollowingToggle] = useState(false)
    const [following, setFollowing] = useState(false)
    const [myProfile, setMyProfile] = useState(false)

    const dispatch = useDispatch()
    const alert = useAlert()
    const params = useParams()

    const followHandler = async (e) => {
        e.preventDefault()

        setFollowing(!following)
        await dispatch(followUser(params.id))

        dispatch(getUserProfile(params.id))
        dispatch(loadUser())
    }

    useEffect(() => {
        dispatch(getUserPosts(params.id))
        dispatch(getUserProfile(params.id))

        // eslint-disable-next-line
    }, [dispatch, params.id])

    useEffect(() => {

        if (me._id === params.id) {
            setMyProfile(true)
        }

        if (user) {
            user.followers.forEach(item => {
                if (item._id === me._id) {
                    setFollowing(true)
                } else {
                    setFollowing(false)
                }
            })
        }

        // eslint-disable-next-line
    }, [me._id, params.id, user])

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch({ type: "clearErrors" })
        }
        if (followError) {
            alert.error(followError)
            dispatch({ type: "clearErrors" })
        }
        if (userError) {
            alert.error(userError)
            dispatch({ type: "clearErrors" })
        }
        if (message) {
            alert.success(message)
            dispatch({ type: "clearMessage" })
        }

        // eslint-disable-next-line
    }, [alert, error, message, followError, userError, dispatch])


    return loading === true || userLoading === true ? (<Loader />) : (
        <div className='account'>
            <div className="accountleft">
                {
                    posts && posts.length > 0 ? (posts.map((post) => (
                        <Post
                            key={post._id}
                            postImage={post.image.url}
                            postId={post._id}
                            caption={post.caption}
                            likes={post.likes}
                            comments={post.comments}
                            ownerImage={post.owner.avatar.url}
                            ownerName={post.owner.name}
                            ownerId={post.owner._id}
                            isAccount="User"
                        />))) : (<Typography valiant="h6">User has no Posts</Typography>)
                }
            </div>
            <div className="accountright">
                {
                    user && (
                        <>
                            <Avatar src={user.avatar.url} sx={{ height: "8vmax", width: "8vmax" }} />
                            <Typography variant='h6'>{user.name}</Typography>

                            <div className='accountrightdivlining'>

                                <div>
                                    <Typography style={{ margin: "0.5vmax 0" }}>Posts</Typography>
                                    <Typography>{user.posts.length}</Typography>
                                </div>

                                <div>
                                    <button onClick={() => { setFollowersToggle(!followersToggle) }}>
                                        <Typography>Followers</Typography>
                                    </button>
                                    <Typography>{user.followers.length}</Typography>
                                </div>

                                <div>
                                    <button onClick={() => { setFollowingToggle(!followingToggle) }}>
                                        <Typography>Following</Typography>
                                    </button>
                                    <Typography>{user.followings.length}</Typography>
                                </div>

                            </div>
                        </>
                    )
                }

                {myProfile ? null : <Button variant="contained" style={{ backgroundColor: following ? "red" : "blue" }} onClick={followHandler} disabled={followLoading}>{
                    following ? "Unfollow" : "Follow"
                }</Button>}

                <Dialog open={followersToggle} onClose={() => { setFollowersToggle(!followersToggle) }}>
                    <div className="dialogueBox">
                        <Typography variant='h4'>Followers</Typography>
                        {
                            user && user.followers.length > 0 ? (user.followers.map((follower) => (
                                <User
                                    key={follower._id}
                                    userId={follower._id}
                                    name={follower.name}
                                    avatar={follower.avatar.url}
                                />
                            ))) : (<Typography style={{ margin: "3vmax 0" }}>No Followers yet</Typography>)
                        }
                    </div>
                </Dialog>
                <Dialog open={followingToggle} onClose={() => { setFollowingToggle(!followingToggle) }}>
                    <div className="dialogueBox">
                        <Typography variant='h4'>Following</Typography>

                        {
                            user && user.followings.length > 0 ? (user.followings.map((following) => (
                                <User
                                    key={following._id}
                                    userId={following._id}
                                    name={following.name}
                                    avatar={following.avatar.url}
                                />
                            ))) : (<Typography style={{ margin: "3vmax 0" }}>No following yet</Typography>)
                        }
                    </div>
                </Dialog>
            </div>
        </div>
    )
}
export default UserProfile
