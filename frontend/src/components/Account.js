import React, { useEffect, useState } from 'react'
import "../css/account.css"
import { useDispatch, useSelector } from "react-redux"
import { getMyPosts, logoutUser, deleteProfile } from '../Action/User'
import Loader from "./Loader"
import Post from './Post'
import { Avatar, Button, Dialog, Typography } from '@mui/material'
import { useAlert } from "react-alert"
import { Link } from 'react-router-dom'
import User from './User'


const Account = () => {
  const { loading, error, posts } = useSelector((state) => state.myPosts)
  const { error: likeError, message, loading: deleteLoading } = useSelector((state) => state.like)
  const { user, loading: userLoading, text: logoutMessage } = useSelector(state => state.user)

  const [followersToggle, setFollowersToggle] = useState(false)
  const [followingToggle, setFollowingToggle] = useState(false)

  const dispatch = useDispatch()
  const alert = useAlert()

  const logoutHandler = async (e) => {
    e.preventDefault()
    await dispatch(logoutUser())

  }

  const deleteProfileHandler = async () => {
    await dispatch(deleteProfile())
    dispatch(logoutUser())
  }

  useEffect(() => {
    dispatch(getMyPosts())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch({ type: "clearErrors" })
    }

    if (likeError) {
      alert.error(likeError)
      dispatch({ type: "clearErrors" })
    }

    if (message) {
      alert.success(message)
      dispatch({ type: "clearMessage" })
    }
    
    if (logoutMessage) {
      alert.success(logoutMessage)
      dispatch({ type: "clearMessage" })
    }

    // eslint-disable-next-line
  }, [alert, error, message, likeError, dispatch, logoutMessage])


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
              isAccount="Me"
              isDelete={true}
            />))) : (<Typography valiant="h6">No posts are available</Typography>)
        }
      </div>
      <div className="accountright">

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

        <Button variant="contained" onClick={logoutHandler}>Logout</Button>
        <Link to="/update/profile" >Update Profile</Link>
        <Link to="/update/password">Change Password</Link>
        <Button
          variant="text"
          style={{ color: "red", margin: "2vmax" }}
          onClick={deleteProfileHandler}
          disabled={deleteLoading}>Delete My Profile</Button>

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

export default Account
