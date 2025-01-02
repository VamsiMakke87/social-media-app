import React, { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FaRegComment } from "react-icons/fa";
import Comments from "./Comment";
import Comment from "./Comment";

const Post = (props) => {
  const [liked, setLiked] = useState(false);
  const [commentClicked, setCommentClicked] = useState(false);
  const [post, setPost] = useState(props.post);

  const toggleLike = () => {
    if (!liked) {
      setPost((prev) => ({
        ...prev,
        likes: [...prev.likes, 123],
      }));
    } else {
      setPost((prev) => ({
        ...prev, // Spread the previous state
        likes: prev.likes.filter((like) => like !== 123), // Update the likes array by adding 1
      }));
    }
    setLiked(!liked);
    
  };

  const toggleComment = () => {
    setCommentClicked(!commentClicked);
  };

  return (
    <div className=" rounded p-5 w-10/12 md:w-6/12 shadow-md">
      <div className="flex items-center">
        <img
          className="rounded-full mr-1 h-10 w-10"
          src="https://cdn.britannica.com/34/212134-050-A7289400/Lionel-Messi-2018.jpg"
        />
        <a className="font-semibold">{post.userId}</a>
      </div>
      <div className="my-2">{props.post.description}</div>
      <div className="my-2 justify-items-center">
      {
        props.post.image && 
        <img
          className="w-fit max-h-96 rounded "
          src={props.post.image}
          alt="Post content"
        />
      }
      </div>
      <div className="justify-center flex">
        <div className="w-1/3 flex cursor-pointer" onClick={toggleLike}>
          <a >
            {liked ? (
              <FavoriteIcon className="text-red-700" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </a>
          <div>{post.likes.length}</div>
        </div>
        <div  onClick={toggleComment}className="w-1/3 flex cursor-pointer">
          <a>
            <FaRegComment className="h-6 w-5 " />
          </a>
          <div className="pl-1">{post.comments.length}</div>
        </div>
      </div>
      {commentClicked && <div className="mt-1 p-2 rounded bg-gray-200"> 
        <Comment />
        </div>}
    </div>
  );
};

export default Post;
