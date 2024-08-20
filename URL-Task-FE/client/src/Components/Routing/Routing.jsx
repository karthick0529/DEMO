import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Register from '../Register/Register';
import Dashboard from '../Dashboard/Dashboard';
import RegisterCheck from '../RegisterCheck/RegisterCheck';
import Login from '../Login/Login';
import PasswordReset from '../PasswordReset/PasswordReset';
import PassTokenVerify from '../PassTokenVerify/PassTokenVerify';
import NewPassword from '../NewPassword/NewPassword';
import PrivateRoute from './PrivateRoute'
import AddUrl from '../AddUrl/AddUrl';
import GetUrl from '../GetUrl/GetUrl';
import Logout from '../Logout/Logout';
import Redirect from '../Redirect/Redirect';

function Routing() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />}/>  {/* //CHART//URL COUNT//TOTAK CLICK COUNT//URL CREATED PER DAY FOR PAST MONTH// */}
        <Route path='/register' element={<Register/>}/> {/* //FORM--> firstname, lastname, email, password --> register auth to email */}
        <Route path='/verify-register-token/:registerToken' element={<RegisterCheck/>}/> {/* // VERIFY registerToken --> Login message */}
        <Route path='/login' element={<Login/>}/> {/* //Login form --> email, password. check for active status --> set token in header */}
        <Route path='/password-reset' element={<PasswordReset/>}/> {/* // Password reset form --> email auth passtoken */}
        <Route path='/verify-password-token/:passResetToken' element={<PassTokenVerify/>}/> {/* //VERIFY passResetToken redirect to new password */}
        <Route path='/password-reset/:passResetToken' element={<NewPassword/>}/> {/* //FORM --> newPassword, re-enter newPassword --> Login msg */}
        <Route path='/:shortURL' element={<Redirect/>}/>
        <Route element={<PrivateRoute />}>
          <Route path='/addUrl' element={<AddUrl/>}/> {/* //FORM longURl past */}
          <Route path='/getUrl' element={<GetUrl/>}/> {/* // TABEL longURL, <Link>shortURL</Link>, clickCount, Action --> delete, copy */}
          <Route path='/logout' element={<Logout/>}/>
        </Route> 
      </Routes>
    </>
  )
}

export default Routing
