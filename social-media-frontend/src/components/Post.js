import React, { useContext, useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { formatDistanceToNow } from "date-fns";
import { FaRegComment } from "react-icons/fa";
import Comment from "./Comment";
import AppContext from "../AppContext";

const Post = (props) => {
  const { loggedInUser, getReq, postReq, putReq, delReq } =
    useContext(AppContext);
  const [liked, setLiked] = useState(
    props.post.likes.includes(loggedInUser._id)
  );
  const [commentClicked, setCommentClicked] = useState(false);
  const [post, setPost] = useState(props.post);
  const [comments, setComments] = useState([]);

  const toggleLike = async () => {
    if (!liked) {
      setPost((prev) => ({
        ...prev,
        likes: [...prev.likes, loggedInUser._id],
      }));
    } else {
      setPost((prev) => ({
        ...prev, // Spread the previous state
        likes: prev.likes.filter((like) => like !== loggedInUser._id), // Update the likes array by adding 1
      }));
    }

    const like = await putReq(
      `http://localhost:8800/api/posts/like/${post._id}`,
      { userId: loggedInUser._id }
    );

    setLiked(!liked);
  };

  const toggleComment = async () => {
    if (!commentClicked) {
      const res = await getReq(
        `http://localhost:8800/api/comment/all/${post._id}`
      );
      const jsonData = await res.json();
      // console.log
      setComments(jsonData);
    }
    setCommentClicked(!commentClicked);
  };

  return (
    <div className=" rounded p-5 w-10/12 border md:w-6/12 bg-white m-2 shadow-md">
      <div className="flex items-center">
        <img className="rounded-full mr-1 h-10 w-10" src={post.profilePic} />
        <div>
          <a className="font-semibold">{post.username}</a>
          <div className="text-xs font-normal">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
        </div>
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
          <a className="cursor-pointer" onClick={toggleComment}>
            <FaRegComment className="h-6 w-5" />
          </a>
          <div className="pl-1 cursor-context-menu">{post.comments.length}</div>
        </div>
      </div>
      {commentClicked &&
        (comments.length > 0 ? (
          <div>
            {comments.map((comment, index) => (
              <Comment key={index} comment={comment} />
            ))}
          </div>
        ) : (
          <div className=" mt-1 p-2 border rounded bg-gray-100">
            No comments posted yet
          </div>
        ))}
    </div>
  );
};

export default Post;
