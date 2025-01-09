import React, { useContext, useEffect } from "react";
import AppContext from "../AppContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { setLoggedInUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    setLoggedInUser(null);
    navigate("/login");
  }, []);

  return <></>;
};

export default Logout;
