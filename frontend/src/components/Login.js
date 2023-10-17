import React, { useEffect, useState } from 'react'
import "../css/login.css"
import { Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from '../Action/User'
import { useAlert } from 'react-alert'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { error, text: loginMessage, loading } = useSelector((state) => state.user)
  const { message } = useSelector((state) => state.like)

  const dispatch = useDispatch()
  const alert = useAlert()

  const loginHandler = async (e) => {
    e.preventDefault()
    await dispatch(loginUser(email, password))
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
    console.log(loginMessage)
    if (loginMessage) {
      console.log('login')
      alert.success(loginMessage)
      dispatch({ type: "clearMessage" })
    }

    // eslint-disable-next-line
  }, [alert, error, dispatch, message, loginMessage])

  return (
    <div className="login">
      <form className='loginForm' onSubmit={loginHandler}>
        <Typography variant='h3' style={{ padding: '1vmax' }}>
          Social App
        </Typography>

        <input
          type="email"
          placeholder="Email"
          autoComplete='email'
          name='email'
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value) }} />

        <input
          type="password"
          autoComplete='current-password'
          placeholder="Password"
          required
          value={password}
          onChange={(e) => { setPassword(e.target.value) }} />

        <Button type='submit' disabled={loading}>Login</Button>
        <Link to="/register">
          <Typography>New User</Typography>
        </Link>
        <Link to="/forgot/password">
          <Typography>Forgot Password</Typography>
        </Link>
      </form>
    </div>
  )
}

export default Login