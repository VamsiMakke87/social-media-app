import React, { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FaRegComment } from "react-icons/fa";

const Comment = (props) => {
  const [liked, setLiked] = useState(false);
  const [replyClicked, setReplyClicked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const toggleReply = () => {
    setReplyClicked(!replyClicked);
  };

  return (
    <div className="mt-1 p-2 rounded border bg-gray-100">
      <div className="flex space-x-1">
        <img
          className="h-6 w-6 rounded-full"
          src={props.comment.profilePic}
        />
        <div className="font-semibold">{props.comment.username}</div>
      </div>
      <div className="flex">
        <div className="text-sm">{props.comment.description}</div>
        <div className="ml-auto flex">
          <div className="flex mr-2">
            <a className="cursor-pointer" onClick={toggleLike}>
              {liked ? (
                <FavoriteIcon className="text-red-700" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </a>
            <div className="cursor-context-menu">
              {props.comment.likes.length}
            </div>
          </div>
        </div>
        <div className="flex">
          <a className="cursor-pointer" onClick={toggleReply}>
            <FaRegComment className="h-6 w-5" />
          </a>
          <div className="pl-1 cursor-context-menu">
            {props.comment.replies.length}
          </div>
        </div>
      </div>
      {replyClicked && <div className="bg-gray-200 p-2 rounded">reply</div>}
    </div>
  );
};

export default Comment;
