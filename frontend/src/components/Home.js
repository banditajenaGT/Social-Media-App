import React, { useEffect } from 'react'
import "../css/home.css"
import User from "./User"
import Post from './Post'
import { useDispatch, useSelector } from "react-redux"
import { getFollowingPosts, getAllUsers } from '../Action/User'
import Loader from './Loader'
import { Typography } from '@mui/material'
import {useAlert} from "react-alert"


const Home = () => {

  const { loading, posts, error } = useSelector(state => state.postOfFollowing)
  const { users, loading: loadingUser } = useSelector(state => state.allUsers)
  const {error:likeError,message}=useSelector((state)=>state.like)
  const { text: loginMessage } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const alert=useAlert()

  useEffect(() => {
    dispatch(getFollowingPosts())
    dispatch(getAllUsers())

    // eslint-disable-next-line
  }, [dispatch])

  useEffect(()=>{
    if(error){
      alert.error(error)
      dispatch({type:"clearErrors"})
    }

    if(likeError){
      alert.error(likeError)
      dispatch({type:"clearErrors"})
    }

    if(message){
      alert.success(message)
      dispatch({type:"clearMessage"}) 
    }

    if (loginMessage) {
      alert.success(loginMessage)
      dispatch({ type: "clearMessage" })
    }
    
    // eslint-disable-next-line
  },[alert,error,message,likeError,dispatch,loginMessage])

  return (
    loading === true || loadingUser === true ? <Loader /> : (
      <div className='home'>
        <div className="homeleft">
          {posts && posts.length > 0 ? posts.map((post) => (<Post
            key={post._id}
            postImage={post.image.url}
            postId={post._id}
            caption={post.caption}
            likes={post.likes}
            comments={post.comments}
            ownerImage={post.owner.avatar.url}
            ownerName={post.owner.name}
            ownerId={post.owner._id}
            isAccount="MyFollowing"
          />)) : (<Typography valiant="h6">No posts are available</Typography>)
          }
        </div>
        <div className="homeright">
          {
            users && users.length > 0 ? users.map((user) =>
            (
              <User
                key={user._id}
                userId={user._id}
                name={user.name}
                avatar={user.avatar.url}
              />
            )
            ) : (<Typography>No Users Yet</Typography>)
          }
        </div>
      </div>
    )

  )
}

export default Home
