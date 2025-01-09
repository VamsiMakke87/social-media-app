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

const App = () => {
  const [posts, setPosts] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const backendURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        const decode = jwtDecode(token);
        const userId = decode.id;
        await loadUser(userId);
      })();
    }
  }, []);

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
          }}
        >
          <Router>
            {loggedInUser && <Navbar />}
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
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
                path="/settings"
                element={
                  <AuthComponent>
                    <Settings />
                  </AuthComponent>
                }
              />
              <Route
                path="/Notifications"
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
