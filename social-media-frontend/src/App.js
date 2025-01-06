import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Post from "./components/Post";
import Home from "./components/Home";
import AppContext from "./AppContext";
import Search from "./components/Search";
import Settings from "./components/Settings";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

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

  const loadUser = async (userId) => {
    const res = await getReq(`http://localhost:8800/api/users/${userId}`);

    if (res.ok) {
      const jsonData = await res.json();
      setLoggedInUser(jsonData);
    }
  };

  useEffect(() => {
    (async () => {
      await loadUser("6776afb7d5fe2e0fce835871");
    })();
  }, []);

  return (
    <>
      {loggedInUser && (
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
            loadUser,
          }}
        >
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/user/profile/:userId" element={<Profile />} />
              <Route path="/post" element={<Post />} />
              <Route path="/search/:username" element={<Search />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Router>
        </AppContext.Provider>
      )}
    </>
  );
};

export default App;
