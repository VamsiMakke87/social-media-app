import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthComponent = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded || !decoded.exp) {
        console.log('here');
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
      alert("Your session has expired. Please log in again.");
      return <Navigate to="/logout" replace />;
    }
  }

  return children;
};

export default AuthComponent;
