import React, { useEffect, useState } from 'react'
import '../css/updateProfile.css'
import { Typography, Button, Avatar } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"
import { loadUser, updateProfile } from '../Action/User'
import { useAlert } from 'react-alert'
import Loader from './Loader'

const UpdateProfile = () => {
    const { user, error, loading } = useSelector((state) => state.user)
    const { loading: updateLoading, error: updateError, message } = useSelector((state) => state.like)

    const [avatar, setAvatar] = useState(user.avatar.url)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)

    const dispatch = useDispatch()
    const alert = useAlert()


    const submitHandler = async (e) => {
        e.preventDefault()
        await dispatch(updateProfile(avatar, name, email))
        dispatch(loadUser())
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        const Reader = new FileReader()
        if (e.target.files[0]) {
            Reader.readAsDataURL(file);
        }

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                // console.log(Reader.result)
                setAvatar(Reader.result)
            }
        }
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch({ type: "clearErrors" })
        }
        if (updateError) {
            alert.error(updateError)
            dispatch({ type: "clearErrors" })
        }
        if (message) {
            alert.success(message)
            dispatch({ type: "clearMessage" })
        }

        // eslint-disable-next-line
    }, [alert, error, message, updateError, dispatch])

    return (
        loading ? <Loader /> : (
            <div className='updateProfile'>
                <form className="updateProfileForm" onSubmit={submitHandler}>
                    <Typography variant='h3' style={{ padding: '1vmax' }}>
                        Social App
                    </Typography>

                    <Avatar
                        src={avatar}
                        alt='User'
                        sx={{ height: "10vmax", width: "10vmax" }} />

                    <input type="file" accept='image/*' onChange={handleImageChange} />

                    <input
                        type="text"
                        className='updateProfileInput'
                        autoComplete='name'
                        name='name'
                        placeholder="Name"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        required />

                    <input
                        type="email"
                        className='updateProfileInput'
                        autoComplete='email'
                        name='email'
                        placeholder="Email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        required />

                    <Button type='submit' disabled={updateLoading}>Update</Button>

                </form>
            </div>
        )

    )
}

export default UpdateProfile
