import React, { useState,useEffect } from 'react'
import "../css/search.css"
import { Typography, Button } from '@mui/material'
import { useDispatch, useSelector } from "react-redux"
import { getAllUsers } from '../Action/User'
import User from './User'

const Search = () => {
    const [name, setName] = useState("")
    const { users, loading } = useSelector(state => state.allUsers)
    const dispatch = useDispatch()

    const submitHandler = async (e) => {
        e.preventDefault()
        dispatch(getAllUsers(name))
    }

    useEffect(()=>{
        dispatch(getAllUsers())
    },[dispatch])

    return (
        <div className='search'>
            <form className="searchForm" onSubmit={submitHandler}>
                <Typography variant='h3' style={{ padding: '1vmax' }}>
                    Social App
                </Typography>

                <input
                    type="text"
                    className='searchInput'
                    placeholder="Name"
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                    required />
                <Button type='submit' disabled={loading}>Search</Button>
                <div className="searchResults">
                    {users && users.length > 0 ? users.map((user) => (
                        <User
                            key={user._id}
                            userId={user._id}
                            name={user.name}
                            avatar={user.avatar.url}
                        />
                    )) : <Typography>No Users Found</Typography>}
                </div>
            </form>
        </div>
    )
}

export default Search
