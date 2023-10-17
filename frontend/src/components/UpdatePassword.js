import React, { useEffect, useState } from 'react'
import '../css/updatePassword.css'
import { Typography, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { updatePassword } from '../Action/User'
import { Link } from 'react-router-dom'

const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [PasswordMatch, setPasswordMatch] = useState(true)

    const { loading, error, message } = useSelector(state => state.like)

    const dispatch = useDispatch()
    const alert = useAlert()

    const updatePasswordHandler = async e => {
        e.preventDefault()

        if (newPassword !== confirmNewPassword) {
            setPasswordMatch(false)
            setTimeout(() => {
                setPasswordMatch(true)
            }, 2000)
        } else {
            dispatch(updatePassword(oldPassword, newPassword))
        }
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch({ type: 'clearErrors' })
        }
        if (message) {
            alert.success(message)
            dispatch({ type: 'clearMessage' })
        }
    }, [dispatch, error, message, alert])

    return (
        <div className='updatePassword'>
            <form className='updatePasswordForm' onSubmit={updatePasswordHandler}>
                <Typography variant='h3' style={{ padding: '1vmax' }}>
                    Social App
                </Typography>

                <input
                    type='password'
                    className='updatePasswordInput'
                    autoComplete='current-password'
                    placeholder='Old Password'
                    value={oldPassword}
                    onChange={e => {
                        setOldPassword(e.target.value)
                    }}
                    required
                />

                <input
                    type='password'
                    className='updatePasswordInput'
                    autoComplete='new-password'
                    placeholder='New Password'
                    value={newPassword}
                    onChange={e => {
                        setNewPassword(e.target.value)
                    }}
                    required
                />

                <input
                    type='password'
                    className='updatePasswordInput'
                    autoComplete='new-password'
                    placeholder='Confirm New Password'
                    value={confirmNewPassword}
                    onChange={e => {
                        setConfirmNewPassword(e.target.value)
                    }}
                    required
                />
                <div className='matchPassword'>
                    {PasswordMatch ? null : (
                        <Typography className=' animation'>
                            Confirm password is not matching
                        </Typography>
                    )}
                </div>

                <Button type='submit' disabled={loading}>
                    Update Password
                </Button>
                <Link to="/forgot/password"><Typography>Forgot Password</Typography></Link>
            </form>
        </div>
    )
}

export default UpdatePassword
