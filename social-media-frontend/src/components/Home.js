import React, { useContext, useEffect, useRef, useState } from "react";
import Post from "./Post";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import AppContext from "../AppContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const {
    posts,
    setPosts,
    loggedInUser,
    token,
    getReq,
    postReq,
    postReqFile,
    putReq,
    delReq,
  } = useContext(AppContext);
  const postRef = useRef();
  const [file, setFile] = useState();
  const [preview, setPreview] = useState(null); // For storing image preview
  const [posting, setPosting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (loggedInUser) await loadPosts();
    })();
  }, [loggedInUser]);

  const loadPosts = async () => {
    const res = await getReq(
      `/api/posts/feed/all/${loggedInUser._id}`
    );
    if (res.ok) {
      const postsData = await res.json();
      setPosts(postsData);
    }
  };

  const postContent = async () => {
    const description = postRef.current.value;
    if (description || file) {
      postRef.current.value = "";
      const formData = new FormData();
      formData.append("userId", loggedInUser._id);
      formData.append("description", description);
      if (file) formData.append("file", file);
      setPosting(true);
      setPreview(null);
      const res = await postReqFile(
        "/api/posts",
        formData
      );
      if (res.ok) await loadPosts();
      setPosting(false);
    }
  };

  const handleClick = () => {
    document.getElementById("file-upload").click();
  };

  const removePhoto = () => {
    setFile(null);
    setPreview(null);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);

      // Generate and set image preview URL
      const filePreview = URL.createObjectURL(uploadedFile);
      setPreview(filePreview);
    }
  };

  return (
    <>
      {loggedInUser ? (
        <div className="bg-slate-200  overflow-auto min-h-screen justify-items-center">
          <div className="rounded p-5 h-60 w-10/12 border md:w-6/12 bg-white m-2 shadow-md justify-items-start resize-none">
            <div className="w-full h-5/6">
              <textarea
                ref={postRef}
                type="text"
                placeholder="Say Something..."
                className="w-full h-full px-4 py-2 border rounded-lg focus:outline-none resize-none"
              />
            </div>
            <div className="w-full flex justify-items-center">
              <div className="cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  accept=".jpg, .jpeg, .png"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <a onClick={handleClick}>
                  <AddPhotoAlternateOutlinedIcon />
                </a>
              </div>

              <div
                onClick={postContent}
                className="ml-auto bg-black cursor-pointer text-white mt-1 rounded-lg p-2 px-6"
              >
                Post
              </div>
            </div>
          </div>
          {preview && (
            <div className="rounded p-5 h-fit justify-items-center w-10/12 border md:w-6/12 bg-white m-2 shadow-md justify-items-start resize-none">
              <div className="mt-2 left-24">
                <img
                  src={preview}
                  alt="Image preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
              <a onClick={removePhoto} className="underline cursor-pointer">
                Remove photo
              </a>
            </div>
          )}
          {posting && <p>Posting...</p>}
          {posts ? (
            posts.map((post) => (
              <Post key={post._id} post={post} loadPosts={loadPosts} />
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : (
        <div className=" text-center">Loading...</div>
      )}
    </>
  );
};

export default Home;
