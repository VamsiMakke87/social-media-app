import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Post from "./components/Post";
import Home from "./components/Home";
import AppContext from "./AppContext";
import Search from "./components/Search";
import Settings from "./components/Settings";
import Demo from "./components/Demo";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Logout from "./components/Logout";
import AuthComponent from "./components/AuthComponent";

const App = () => {
  const [posts, setPosts] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [token, setToken] = useState();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      (async () => {
        console.log(userId);
        await loadUser(userId);
      })();
    }
  }, []);

  const loadUser = async (userId) => {
    const res = await getReq(`http://localhost:8800/api/users/${userId}`);

    if (res.ok) {
      const jsonData = await res.json();
      setLoggedInUser(jsonData);
    }
  };

  const getReq = async (url) => {
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return res;
    } catch (err) {
      return { message: "Could not process request. Please try again" };
    }
  };

  const postReqFile = async (url, data) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: data,
      });

      return res;
    } catch (err) {
      return { message: "Could not process request. Please try again" };
    }
  };

  const putReq = async (url, data) => {
    try {
      const res = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return res;
    } catch (err) {
      return { message: "Could not process request. Please try again" };
    }
  };

  const putReqFile = async (url, data) => {
    try {
      const res = await fetch(url, {
        method: "PUT",
        body: data,
      });

      return res;
    } catch (err) {
      return { message: "Could not process request. Please try again" };
    }
  };

  const delReq = async (url, data) => {
    try {
      const res = await fetch(url, {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
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
            setToken,
            loadUser,
          }}
        >
          <Router>
              {loggedInUser && <Navbar />}
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<AuthComponent><Home /></AuthComponent>} />
              <Route path="/home" element={<AuthComponent><Home /></AuthComponent>} />
              <Route path="/user/profile/:userId" element={<AuthComponent><Profile /></AuthComponent>} />
              <Route path="/post" element={<AuthComponent><Post /></AuthComponent>} />
              <Route path="/search/:username" element={<AuthComponent><Search /></AuthComponent>} />
              <Route path="/settings" element={<AuthComponent><Settings /></AuthComponent>} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </Router>
        </AppContext.Provider>
      }
    </>
  );
};

export default App;
