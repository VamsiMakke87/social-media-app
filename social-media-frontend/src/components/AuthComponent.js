import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AppContext from "../AppContext";

const AuthComponent = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
   const {setErrorMsg} = useContext(AppContext);
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime > decoded.exp;
    } catch (err) {
      console.log(err);
      return true;
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else {
    if (isTokenExpired(isAuthenticated)) {
      setErrorMsg('Session Expired, Please login again');
      return <Navigate to="/logout" replace />;
    }
  }

  return children;
};

export default AuthComponent;
