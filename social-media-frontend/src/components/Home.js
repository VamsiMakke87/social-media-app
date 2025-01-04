import React, { use, useContext, useEffect, useRef } from "react";
import Post from "./Post";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import AppContext from "../AppContext";

const Home = () => {
  const { posts, setPosts, loggedInUser, getReq, postReq, putReq, delReq } =
    useContext(AppContext);
  const postRef = useRef();

  useEffect(() => {
    (async () => {
      await loadPosts();
    })();
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

  const postContent = async () => {
    const description = postRef.current.value;
    if (description) {
      postRef.current.value = "";
      const res = await postReq("http://localhost:8800/api/posts", {
        userId: loggedInUser._id,
        description,
      });
      if (res.ok) await loadPosts();
    }
  };

  return (
    <div className=" bg-slate-50  justify-items-center">
      <div className=" rounded p-5 h-60 w-10/12 border md:w-6/12 bg-white m-2 shadow-md justify-items-start resize-none">
        <div className=" w-full h-5/6">
          <textarea
            ref={postRef}
            type="text"
            placeholder="Say Something..."
            className="w-full h-full px-4 py-2 border rounded-lg focus:outline-none resize-none"
          />
        </div>
        <div className="w-full flex justify-items-center">
          <div className="cursor-pointer">
            <AddPhotoAlternateOutlinedIcon />
          </div>
          <div
            onClick={postContent}
            className="ml-auto bg-black cursor-pointer text-white mt-1 rounded-lg p-2 px-6"
          >
            Post
          </div>
        </div>
      </div>
      {posts.map((post) => (
        <Post key={post._id} post={post} loadPosts={loadPosts} />
      ))}
    </div>
  );
};

export default Home;
