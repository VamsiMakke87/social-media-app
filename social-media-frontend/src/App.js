import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Post from "./components/Post";
import Home from "./components/Home";
import AppContext from "./AppContext";
import Search from "./components/Search";
import Settings from "./components/Settings";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Logout from "./components/Logout";
import AuthComponent from "./components/AuthComponent";
import Notifications from "./components/Notifications";
import { jwtDecode } from "jwt-decode";
import ErrorPage from "./components/ErrorPage";
import Activate from "./components/Activate";
import ForgotPassword from "./components/ForgotPassword";
import ForgotPasswordReq from "./components/ForgotPasswordReq";

const App = () => {
  const [posts, setPosts] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const backendURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        await loadApp(token);
      })();
    }
  }, []);

  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
        setSuccessMsg("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMsg,successMsg]);

  const loadApp = async (token) => {
    const decode = jwtDecode(token);
    const userId = decode.id;
    await loadUser(userId);
  };

  const loadUser = async (userId) => {
    const res = await getReq(`/api/users/${userId}`);

    if (res.ok) {
      const jsonData = await res.json();
      setLoggedInUser(jsonData);
    }
  };

  const getReq = async (url) => {
    try {
      const res = await fetch(`${backendURL}${url}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res;
    } catch (err) {
      console.log(err);
      return { message: "Could not process request. Please try again" };
    }
  };

  const postReq = async (url, data) => {
    try {
      const res = await fetch(`${backendURL}${url}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res;
    } catch (err) {
      return { message: "Could not process request. Please try again" };
    }
  };

  const postReqFile = async (url, data) => {
    try {
      const res = await fetch(`${backendURL}${url}`, {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res;
    } catch (err) {
      return { message: "Could not process request. Please try again" };
    }
  };

  const putReq = async (url, data) => {
    try {
      const res = await fetch(`${backendURL}${url}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res;
    } catch (err) {
      return { message: "Could not process request. Please try again" };
    }
  };

  const putReqFile = async (url, data) => {
    try {
      const res = await fetch(`${backendURL}${url}`, {
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res;
    } catch (err) {
      return { message: "Could not process request. Please try again" };
    }
  };

  const delReq = async (url, data) => {
    try {
      const res = await fetch(`${backendURL}${url}`, {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res;
    } catch (err) {
      return { message: "Could not process request. Please try again" };
    }
  };

  return (
    <>
      {
        <AppContext.Provider
          value={{
            posts,
            setPosts,
            getReq,
            postReq,
            postReqFile,
            putReq,
            putReqFile,
            delReq,
            loggedInUser,
            setLoggedInUser,
            loadUser,
            loadApp,
            setErrorMsg,
            setSuccessMsg
          }}
        >
          <Router>
            {loggedInUser && <Navbar />}
            {errorMsg && (
              <div className="fixed left-0 w-full bg-red-500 text-white text-center py-2 z-40">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="fixed left-0 w-full bg-green-500 text-white text-center py-2 z-40">
                {successMsg}
              </div>
            )}
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/activate" element={<Activate />} />
              <Route path="/activate/:token" element={<Activate />} />
              <Route path="/forgotpassword/" element={<ForgotPasswordReq />} />
              <Route path="/forgotpassword/:token" element={<ForgotPassword />} />
              <Route
                path="/"
                element={
                  <AuthComponent>
                    <Home />
                  </AuthComponent>
                }
              />
              <Route
                path="/home"
                element={
                  <AuthComponent>
                    <Home />
                  </AuthComponent>
                }
              />
              <Route
                path="/user/profile/:userId"
                element={
                  <AuthComponent>
                    <Profile />
                  </AuthComponent>
                }
              />
              <Route
                path="/post/:id"
                element={
                  <AuthComponent>
                    <Post />
                  </AuthComponent>
                }
              />
              <Route
                path="/search/:username"
                element={
                  <AuthComponent>
                    <Search />
                  </AuthComponent>
                }
              />
              <Route
                path="/search"
                element={
                  <AuthComponent>
                    <Search />
                  </AuthComponent>
                }
              />
              <Route
                path="/settings"
                element={
                  <AuthComponent>
                    <Settings />
                  </AuthComponent>
                }
              />
              <Route
                path="/notifications"
                element={
                  <AuthComponent>
                    <Notifications />
                  </AuthComponent>
                }
              />
              <Route path="/logout" element={<Logout />} />
              <Route path="/*" element={<ErrorPage />} />
            </Routes>
          </Router>
        </AppContext.Provider>
      }
    </>
  );
};

export default App;
