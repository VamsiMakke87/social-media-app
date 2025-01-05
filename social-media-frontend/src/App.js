import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Post from "./components/Post";
import Home from "./components/Home";
import AppContext from "./AppContext";
import Search from "./components/Search";

const App = () => {
  const [posts, setPosts] = useState([]);
  const loggedInUser = {
    _id: "6776afb7d5fe2e0fce835871",
    username: "lamine yamal",
    password: "$2b$10$s0RYuRrUP7BXFUZJEohHMukl6V3UUzYM4unroidREN.TSdTwYSs2u",
    email: "lamine@gmail.com",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt92iwgce7yEQvq4mLCrHcSek06HcfTvEzYA&s",
    coverPic: "",
    followers: ["6776afcbd5fe2e0fce835873"],
    following: ["6776afcbd5fe2e0fce835873", "67777ca998a9d0edf061b794"],
    isAdmin: false,
    createdAt: "2025-01-02T15:24:39.943Z",
    updatedAt: "2025-01-03T12:00:33.554Z",
    __v: 0,
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
      value={{ posts, setPosts, getReq, postReq,postReqFile, putReq, delReq, loggedInUser }}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user/profile/:userId" element={<Profile />} />
          <Route path="/post" element={<Post />} />
          <Route path="/search/:username" element={<Search />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
