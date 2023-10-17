import React, { useEffect, useState } from 'react'
import "../css/post.css"
import { Avatar, Typography, Dialog, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { MoreVert, Favorite, FavoriteBorder, ChatBubbleOutline, DeleteOutline, Send } from "@mui/icons-material"
import { useDispatch, useSelector } from "react-redux"
import { commentPost, deletePost, likePost, updatePost } from '../Action/Post'
import { getFollowingPosts, getMyPosts, getUserPosts, loadUser } from '../Action/User'
import CommentCard from './CommentCard'
import User from './User'


const Post = ({
  postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  isDelete = false,
  isAccount = false
}) => {

  const [liked, setLiked] = useState(false)
  const [likesUser, setLikesUser] = useState(false)
  const [commentValue, setCommentValue] = useState('')
  const [commentToggle, setCommentToggle] = useState(false)
  const [captionValue, setCaptionValue] = useState(caption)
  const [captionToggle, setCaptionToggle] = useState(false)
  const [shareToggle, setShareToggle] = useState(false)

  const [whatsapp, setWhatsapp] = useState('')
  const [facebook, setFacebook] = useState('')
  const [twitter, setTwitter] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [pinterest, setPinterest] = useState('')

  const { user: me } = useSelector(state => state.user)
  const { user } = useSelector(state => state.userProfile)
  const dispatch = useDispatch()


  // https://api.whatsapp.com/send?text=[post-title] [post-url]
  // https://www.facebook.com/sharer.php?u=[post-url]
  // https://twitter.com/share?url=[post-url]&text=[post-title]&via=[via]&hashtags=[hashtags]
  // https://www.linkedin.com/shareArticle?url=[post-url]&title=[post-title]
  // https://pinterest.com/pin/create/bookmarklet/?media=[post-img]&url=[post-url]&is_video=[is_video]&description=   [post-title]

  useEffect(() => {
    likes.forEach(item => {
      if (item._id === me._id) {
        setLiked(true)
      }
    })
    setWhatsapp(`https://api.whatsapp.com/send?text=${caption} ${postImage}`)
    setFacebook(`https://www.facebook.com/sharer.php?u=${postImage}`)
    setTwitter(`https://twitter.com/share?url=${postImage}&text=${caption}`)
    setLinkedin(`https://www.linkedin.com/shareArticle?url=[post-url]&title=${caption}`)
    setPinterest(`https://pinterest.com/pin/create/bookmarklet/?media=${postImage}&url=${postImage}&description=${caption}`)

  }, [likes, me._id, caption, postImage])

  const handleLike = async (e) => {
    e.preventDefault()
    setLiked(!liked)
    await dispatch(likePost(postId))

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

  const addCommentHandler = async (e) => {
    e.preventDefault()
    await dispatch(commentPost(postId, commentValue))

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

  const updateCaptionHandler = async (e) => {
    e.preventDefault()
    await dispatch(updatePost(captionValue, postId))
    dispatch(getMyPosts())
  }

  const deletePostHandler = async (e) => {
    e.preventDefault()
    await dispatch(deletePost(postId))
    dispatch(getMyPosts())
    dispatch(loadUser())
  }

  return (
    <div className='post'>

      <div className="postHeader">
        {isAccount === "Me" ? (<Button onClick={() => { setCaptionToggle(!captionToggle) }}> <MoreVert /> </Button>) : null}
      </div>

      <div className='divCenter'>
        <Link to={`/user/${ownerId}`}>
          <Avatar src={ownerImage} alt='User' sx={{ height: "3vmax", width: "3vmax" }} />
        </Link>
        <Typography fontWeight={700} style={{ margin: "0 1vmax" }}>{ownerName}</Typography>
      </div>

      <img src={postImage} alt="Post" />

      <div className="postReaction">
        <button className='item' onClick={handleLike}>{liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}</button>
        <button className='item' onClick={() => { setCommentToggle(!commentToggle) }}><ChatBubbleOutline /></button>
        <button className='item' onClick={() => { setShareToggle(!shareToggle) }}><Send /></button>
        {isDelete ? <button className='item' onClick={deletePostHandler}><DeleteOutline /></button> : null}
        {shareToggle ? (
          <div className="container" >
            <a href={whatsapp} >
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href={facebook} >
              <i className="fab fa-facebook"></i>
            </a>
            <a href={twitter} >
              <i className="fab fa-twitter"></i>
            </a>
            <a href={linkedin}>
              <i className="fab fa-linkedin"></i>
            </a>
            <a href={pinterest}>
              <i className="fab fa-pinterest"></i>
            </a>
          </div>
        ) : null}
      </div>

      <button className='btndecoration' onClick={()=>{setLikesUser(!likesUser)}}>
        <Typography>{likes.length} {likes.length === 1 ? "like" : "likes"} </Typography>
      </button>

      <div className="postDetails">
        <Link to={`/user/${ownerId}`}>
          <Typography fontWeight={700}>{ownerName}</Typography>
        </Link>
        <Typography fontWeight={300} color="rgba(0,0,0,0.6)" style={{ alignSelf: "center", margin: "0 0.5vmax" }}>{caption}</Typography>
      </div>

      <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
        <div className="dialogueBox">
          <Typography variant="h4">Liked By</Typography>

          {likes.map((like) => (
            <User
              key={like._id}
              userId={like._id}
              name={like.name}
              avatar={like.avatar.url}
            />
          ))}

        </div>
      </Dialog>

      <Dialog open={commentToggle} onClose={() => { setCommentToggle(!commentToggle) }}>
        <div className="dialogueBox">
          <Typography variant='h4'>Comments</Typography>
          <form className='commentForm' onSubmit={addCommentHandler}>
            <input
              type="text"
              value={commentValue}
              onChange={(e) => { setCommentValue(e.target.value) }}
              placeholder='Add a comment'
              required />
            <Button type="submit" variant="contained">Add</Button>
          </form>
          {
            comments.length > 0 ? (comments.map((item) => (
              <CommentCard
                key={item._id}
                userId={item.user._id}
                name={item.user.name}
                avatar={item.user.avatar.url}
                comment={item.comment}
                commentId={item._id}
                postId={postId}
                isAccount={isAccount}
              />
            ))) : (<Typography>No comments yet</Typography>)
          }
        </div>
      </Dialog>




      <Dialog open={captionToggle} onClose={() => { setCaptionToggle(!captionToggle) }}>
        <div className="dialogueBox">
          <Typography variant='h4'>Update Caption</Typography>
          <form className='commentForm' onSubmit={updateCaptionHandler}>
            <input
              type="text"
              value={captionValue}
              onChange={(e) => { setCaptionValue(e.target.value) }}
              placeholder='Caption'
              required />
            <Button type="submit" variant="contained">Update</Button>
          </form>
        </div>
      </Dialog>
    </div>
  )
}

export default Post
