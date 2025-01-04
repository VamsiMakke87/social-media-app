import React, { useContext, useEffect, useRef, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { formatDistanceToNow } from "date-fns";
import { FaRegComment } from "react-icons/fa";
import Comment from "./Comment";
import AppContext from "../AppContext";
import SendIcon from "@mui/icons-material/Send";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

const Post = (props) => {
  const { loggedInUser, getReq, postReq, putReq, delReq } =
    useContext(AppContext);
  const commentRef = useRef();
  const [liked, setLiked] = useState(
    props.post.likes.includes(loggedInUser._id)
  );
  const [commentCursor, setCommentCursor] = useState("cursor-pointer");
  const [commentClicked, setCommentClicked] = useState(false);
  const [post, setPost] = useState(props.post);
  const [comments, setComments] = useState([]);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const postMenuRef = useRef();
  const [deletePostMenu, setDeletePostMenu] = useState(false);

  const toggleLike = async () => {
    const res = await putReq(
      `http://localhost:8800/api/posts/like/${post._id}`,
      { userId: loggedInUser._id }
    );

    if (res.ok) {
      if (!liked) {
        setPost((prev) => ({
          ...prev,
          likes: [...prev.likes, loggedInUser._id],
        }));
      } else {
        setPost((prev) => ({
          ...prev,
          likes: prev.likes.filter((like) => like !== loggedInUser._id),
        }));
      }

      setLiked(!liked);
    }
  };

  const loadComments = async () => {
    const res = await getReq(
      `http://localhost:8800/api/comment/all/${post._id}`
    );
    if (res.ok) {
      const jsonData = await res.json();
      setComments(jsonData);
      setPost((prev) => ({
        ...prev,
        comments: jsonData,
      }));
      console.log(comments, ",", post.comments);
    }
  };

  const toggleComment = async () => {
    if (!commentClicked) {
      await loadComments();
    }
    setCommentClicked(!commentClicked);
  };

  const addComment = async () => {
    const comment = commentRef.current.value;
    if (comment) {
      const data = {
        userId: loggedInUser._id,
        postId: post._id,
        description: comment,
      };
      setCommentCursor("cursor-wait");
      const res = await postReq("http://localhost:8800/api/comment/", data);
      if (res.ok) await loadComments();
      setCommentCursor("cursor-pointer");
    }
    commentRef.current.value = "";
    setCommentClicked(true);
  };

  const toggleMenuOpen = () => {
    setPostMenuOpen(!postMenuOpen);
  };

  const postMenuBlur = (event) => {
    if (!postMenuRef.current.contains(event.relatedTarget)) {
      setPostMenuOpen(false);
      setDeletePostMenu(false);
    }
  };

  const toggleDeletePostMenu = () => {
    setDeletePostMenu(true);
  };

  const deletePost = async () => {
    const res = await delReq(`http://localhost:8800/api/posts/${post._id}`, {
      userId: loggedInUser._id,
    });
    if (res.ok) {
      await props.loadPosts();
    }
  };

  return (
    <div className=" rounded p-5 w-10/12 border md:w-6/12 bg-white m-2 shadow-md">
      <div className="flex items-center">
        <img className="rounded-full mr-1 h-11 w-11" src={post.profilePic} />
        <div>
          <a className="font-semibold">{post.username}</a>
          <div className="text-xs font-normal">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
        </div>
        {post.userId === loggedInUser._id && (
          <div className="ml-auto ">
            <div
              className="relative"
              tabIndex={0}
              ref={postMenuRef}
              onBlur={postMenuBlur}
            >
              <div onClick={toggleMenuOpen} className="cursor-pointer ">
                <MoreVertOutlinedIcon  />
              </div>
              {postMenuOpen && (
                <div className="absolute p-2 text-sm justify-center border rounded bg-white shadow-md h-18 w-fit top-3 right-3">
                  {deletePostMenu ? (
                    <div>
                      <div>
                        Do&nbsp;you&nbsp;want&nbsp;to&nbsp;delete&nbsp;the&nbsp;post?
                      </div>
                      <div className="flex">
                        <button onClick={deletePost} className="border-black border m-1 p-2 w-1/2 hover:bg-black hover:text-white">Yes</button>
                        <button onClick={()=>{setDeletePostMenu(false)}} className="border border-black m-1 p-2 w-1/2 hover:bg-black hover:text-white">No</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="p-2 hover:bg-gray-100 flex justify-items-center cursor-pointer rounded">
                        Edit
                      </div>
                      <div
                        onClick={toggleDeletePostMenu}
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="my-2">{post.description}</div>
      <div className="my-2 justify-items-center">
        {post.image && (
          <img
            className="w-fit max-h-96 rounded"
            src={props.post.image}
            alt="Post content"
          />
        )}
      </div>
      <div className="justify-center flex">
        <div className="w-1/3 flex ">
          <a className="cursor-pointer" onClick={toggleLike}>
            {liked ? (
              <FavoriteIcon className="text-red-700" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </a>
          <div className="cursor-context-menu">{post.likes.length}</div>
        </div>
        <div className="w-1/3 flex">
          <a className={commentCursor} onClick={toggleComment}>
            <FaRegComment className="h-6 w-5" />
          </a>
          <div className="pl-1 cursor-context-menu">{post.comments.length}</div>
        </div>
      </div>
      {commentClicked &&
        (comments.length > 0 ? (
          <div>
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                setCommentClicked={setCommentClicked}
              />
            ))}
          </div>
        ) : (
          <div className=" mt-1 p-2 border rounded bg-gray-100">
            No comments posted yet
          </div>
        ))}
      <div className="mt-2 flex">
        <input
          type="text"
          ref={commentRef}
          className="h-fit w-11/12 outline-none"
          placeholder="Add a comment"
        />
        <a className="cursor-pointer ml-auto" onClick={addComment}>
          <SendIcon />
        </a>
      </div>
    </div>
  );
};

export default Post;
