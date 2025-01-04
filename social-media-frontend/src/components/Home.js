import React, { useContext, useEffect } from "react";
import Post from "./Post";
import AppContext from "../AppContext";

const Home = () => {
  const { posts, setPosts, loggedInUser, getReq, postReq, putReq, delReq } =
    useContext(AppContext);
  useEffect(() => {
    const loadFeed = async () => {
      await loadPosts();
    };
    loadFeed();
  }, []);

  const loadPosts = async () => {
    const res = await getReq(
      `http://localhost:8800/api/posts/feed/all/${loggedInUser._id}`
    );
    if (res.ok) {
      const postsData = await res.json();
      setPosts(postsData);
    }
  };

  
  return (
    <div className=" m-5 justify-items-center">
      {posts.map((post) => (
        <Post key={post._id} post={post} loadPosts={loadPosts} />
      ))}
    </div>
  );
};

export default Home;
