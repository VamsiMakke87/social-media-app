import React from 'react'
import { Navigate } from 'react-router-dom';

const AuthComponent = ({children}) => {

    const isAuthenticated= localStorage.getItem('userId');

    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }

  return children;
}

export default AuthComponent;