import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useToken } from '../../TokenContext/TokenProvider';

function PrivateRoute() {
 
  const user = useToken();

  return (
     user ? <Outlet/> : <Navigate to="/"/>
  )
}

export default PrivateRoute
