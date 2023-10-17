import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Login from './components/Login';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadUser } from './Action/User';
import Home from './components/Home';
import Account from './components/Account';
import NewPost from './components/NewPost';
import Register from './components/Register';
import UpdateProfile from './components/UpdateProfile';
import UpdatePassword from './components/UpdatePassword';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UserProfile from './components/UserProfile';
import Search from './components/Search';
import NotFound from './components/NotFound';

function App() {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loadUser())
    // eslint-disable-next-line
  }, [dispatch])

  const { isAuthenticated } = useSelector((state) => state.user)

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path='/' element={isAuthenticated ? <Home /> : <Login />} />
        <Route path='/account' element={isAuthenticated ? <Account /> : <Login />} />
        <Route path='/newpost' element={isAuthenticated ? <NewPost /> : <Login />} />
        <Route path='/register' element={isAuthenticated ? <Account /> : <Register />} />
        <Route path='/update/profile' element={isAuthenticated ? <UpdateProfile /> : <Login />} />
        <Route path='/update/password' element={isAuthenticated ? <UpdatePassword /> : <Login />} />
        <Route path='/forgot/password' element={<ForgotPassword />} />
        <Route path='/password/reset/:token' element={<ResetPassword />} />
        <Route path='/user/:id' element={isAuthenticated ? <UserProfile /> : <Login />} />
        <Route path='/search' element={isAuthenticated ? <Search /> : <Login />} />
        <Route path='*' element={ <NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;