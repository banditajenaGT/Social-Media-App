import React, { useState } from 'react'
import "../css/header.css"
import { Link} from "react-router-dom";
import {Home,HomeOutlined,Search,SearchOutlined,AddBox,AddBoxOutlined,AccountCircle,AccountCircleOutlined} from '@mui/icons-material';

const Header = () => {
  const [tab,setTab]=useState(window.location.pathname)
  return (
    <div className='header'>
      <Link to="/" onClick={()=>{setTab('/')}}>{tab==='/'?<Home style={{color:"black"}}/>:<HomeOutlined/>}</Link>
      <Link to="/search" onClick={()=>{setTab('/search')}}>{tab==='/search'?<Search style={{color:"black"}}/>:<SearchOutlined/>}</Link>
      <Link to="/newpost" onClick={()=>{setTab('/newpost')}}>{tab==='/newpost'?<AddBox style={{color:"black"}}/>:<AddBoxOutlined/>}</Link>
      <Link to="/account" onClick={()=>{setTab('/account')}}>{tab==='/account'?<AccountCircle style={{color:"black"}}/>:<AccountCircleOutlined/>}</Link>
    </div>
  )
}

export default Header
