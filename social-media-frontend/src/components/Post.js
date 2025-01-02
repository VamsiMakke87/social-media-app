import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { FaRegComment } from "react-icons/fa";

const Post = (props) => {
  return (
    <div className=" rounded p-5 h-auto w-11/12 shadow-md">
      <div>{props.post.description}</div>
      <div className="space-x-6">
        <FavoriteBorderIcon />
        <FaRegComment />
      </div>
    </div>
  );
};

export default Post;
