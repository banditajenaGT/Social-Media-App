import React, { useEffect, useState } from 'react'
import "../css/newPost.css"
import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"
import { createNewPost } from '../Action/Post'
import { useAlert } from 'react-alert'
import { loadUser } from '../Action/User'
import { useNavigate } from 'react-router-dom'


const NewPost = () => {

    const [image, setImage] = useState(null)
    const [caption, setCaption] = useState('')
    const {loading,error,message}=useSelector((state)=>state.like)
    const { text: loginMessage } = useSelector(state => state.user)

    const dispatch=useDispatch()
    const navigate=useNavigate()
    const alert=useAlert()

    const handleImageChange=(e)=>{
        const file=e.target.files[0]

        const Reader=new FileReader()
        if(e.target.files[0]){
            Reader.readAsDataURL(file);
          }

        Reader.onload=()=>{
            if(Reader.readyState===2){
                // console.log(Reader.result)
                setImage(Reader.result)
            }
        }
    }
    const submitHandler=async(e)=>{
        e.preventDefault()
        await dispatch(createNewPost(caption,image))
        dispatch(loadUser())
    }

    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch({type:"clearErrors"})
        }
        if(message){
            alert.success(message)
            dispatch({type:"clearMessage"})
            navigate('/account',{replace:true})
        }
        if (loginMessage) {
            alert.success(loginMessage)
            dispatch({ type: "clearMessage" })
          }
    },[dispatch,error,message,alert,navigate,loginMessage])

    return (
        <div className="newPost">
            <form className="newPostForm" onSubmit={submitHandler}>
                <Typography variant="h3">New Post</Typography>

                {image && <img src={image} alt='post'/>}
                <input type="file" accept='image/*' onChange={handleImageChange} />
                <input
                    type="text"
                    placeholder='Write a caption...'
                    value={caption}
                    onChange={(e) => { setCaption(e.target.value) }}
                />
                <Button type='submit' disabled={loading}>Post</Button>
            </form>
        </div>
    )
}

export default NewPost
