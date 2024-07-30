import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoute({ user }) {
    console.log("Private Route", user);
    return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute