import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Post from "./components/Post";
import Home from "./components/Home";
import AppContext from "./AppContext";

const App = () => {
  const [posts, setPosts] = useState([]);
  const loggedInUser = {
    "_id": "6776afcbd5fe2e0fce835873",
    "username": "leo",
    "password": "$2b$10$gKaTauDNHLrR2fckPxQYf.yoHdBOshRTYg/dbT2XCKUAN0/bs/vbO",
    "email": "leo@gmail.com",
    "profilePic": "data:image/jpeg;base64,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",
    "coverPic": "",
    "followers": [
        "6776afb7d5fe2e0fce835871"
    ],
    "following": [],
    "isAdmin": false,
    "createdAt": "2025-01-02T15:24:59.129Z",
    "updatedAt": "2025-01-03T10:19:07.182Z",
    "__v": 0
};

  const getReq = async (url) => {
    try {
      const res = await fetch(url);
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
        },
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
    <AppContext.Provider
      value={{ posts, setPosts, getReq, postReq, putReq, delReq, loggedInUser }}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post" element={<Post />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
