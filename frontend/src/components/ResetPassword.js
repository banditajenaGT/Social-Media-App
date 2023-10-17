import React, { useEffect, useState } from 'react'
import "../css/resetPassword.css"
import { Typography, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import {  Link, useParams } from 'react-router-dom'
import { resetPassword } from '../Action/User'


const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [PasswordMatch, setPasswordMatch] = useState(true)

    const { loading, error, message } = useSelector(state => state.like)
    const params=useParams()

    const dispatch = useDispatch()
    const alert = useAlert()

    const resetPasswordHandler = async e => {
        e.preventDefault()

        if (newPassword !== confirmNewPassword) {
            setPasswordMatch(false)
            setTimeout(() => {
                setPasswordMatch(true)
            }, 2000)
        } else {
            dispatch(resetPassword(params.token,newPassword))
        }
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
    <div className='resetPassword'>
            <form className='resetPasswordForm' onSubmit={resetPasswordHandler}>
                <Typography variant='h3' style={{ padding: '1vmax' }}>
                    Social App
                </Typography>

                <input
                    type='password'
                    className='resetPasswordInput'
                    autoComplete='current-password'
                    placeholder='New Password'
                    value={newPassword}
                    onChange={e => {
                        setNewPassword(e.target.value)
                    }}
                    required
                />

                <input
                    type='password'
                    className='resetPasswordInput'
                    autoComplete='current-password'
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
                    Reset Password
                </Button>
                <Link to="/forgot/password"><Typography>Request another password</Typography></Link>
                <Link to="/"><Typography>Login</Typography></Link>
            </form>
        </div>
  )
}

export default ResetPassword
