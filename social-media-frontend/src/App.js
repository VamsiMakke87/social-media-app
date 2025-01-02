import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Post from "./components/Post";
import Home from "./components/Home";
import AppContext from "./AppContext";

const App = () => {

  const [posts,setPosts] = useState([]);

  return (
    <AppContext.Provider value={{posts,setPosts}}>
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
