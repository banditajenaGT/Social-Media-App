import React, { useEffect, useState } from 'react'
import "../css/forgotPassword.css"
import { Typography, Button } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"
import { useAlert } from 'react-alert'
import { forgotPassword } from '../Action/User'

const ForgotPassword = () => {
    const { message,loading,error} = useSelector((state) => state.like)
    const [email, setEmail] = useState('')

    const dispatch = useDispatch()
    const alert = useAlert()

    const forgotPasswordHandler = async (e) => {
        e.preventDefault()
        dispatch(forgotPassword(email))
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch({ type: "clearErrors" })
        }
        if (message) {
            alert.success(message)
            dispatch({ type: "clearMessage" })
        }
        // eslint-disable-next-line
    }, [alert, error, dispatch,message])

    return (
        <div className="forgotPassword">
            <form className='forgotPasswordForm' onSubmit={forgotPasswordHandler}>
                <Typography variant='h3' style={{ padding: '1vmax' }}>
                    Social App
                </Typography>

                <input
                    type="email"
                    autoComplete='username'
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }} />

                <Button type='submit' disabled={loading}>Send Token</Button>
            </form>
        </div>
    )
}

export default ForgotPassword
