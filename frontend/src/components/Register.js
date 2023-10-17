import React, { useEffect, useState } from 'react'
import '../css/register.css'
import { Typography, Button, Avatar } from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import {  registerUser } from '../Action/User'
import { useAlert } from 'react-alert'

const Register = () => {

    const [avatar, setAvatar] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const dispatch = useDispatch()
    const alert = useAlert()

    const { error, loading } = useSelector((state) => state.user)

    const submitHandler = async (e) => {
        e.preventDefault()
        await dispatch(registerUser(avatar, name, email, password))
        alert.success("Registered Successfully")
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

        // eslint-disable-next-line
    }, [alert, error, dispatch])

    return (
        <div className='register'>
            <form className="registerForm" onSubmit={submitHandler}>
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
                    className='registerInput'
                    placeholder="Name"
                    autoComplete='name'
                    name='name'
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                    required />

                <input
                    type="email"
                    className='registerInput'
                    autoComplete='email'
                    name='email'
                    placeholder="Email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                    required />

                <input
                    type="password"
                    className='registerInput'
                    autoComplete='new-password'
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                    required />

                <Button type='submit' disabled={loading}>Register</Button>
                <Link to="/">
                    <Typography>Existing User</Typography>
                </Link>
            </form>
        </div>
    )
}

export default Register
