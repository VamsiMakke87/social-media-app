import React, { useContext, useEffect } from "react";
import AppContext from "../AppContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { setLoggedInUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setLoggedInUser();
    navigate("/login");
  }, []);

  return <></>;
};

export default Logout;
