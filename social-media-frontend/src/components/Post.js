import React, { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FaRegComment } from "react-icons/fa";

const Post = (props) => {
  const [liked, setLiked] = useState(false);
  const [post, setPost] = useState(props.post);

  const toggleLike = () => {
      if(!liked){
          setPost((prev) => ({
              ...prev,
              likes: [...prev.likes, 123],
            }));
        }else{
            setPost((prev) => ({
                ...prev, // Spread the previous state
                likes: prev.likes.filter((like)=> like!== 123) // Update the likes array by adding 1
            }));
        }
        setLiked(!liked);
  };

  return (
    <div className=" rounded p-5 h-auto w-10/12 md:w-6/12 shadow-md">
      <div className="flex items-center">
        <img
          className="rounded-full mr-1 h-10 w-10"
          src="https://cdn.britannica.com/34/212134-050-A7289400/Lionel-Messi-2018.jpg"
        />
        {post.userId}
      </div>
      <div className="my-2">{props.post.description}</div>
      <div className="justify-center flex">
        <div className="w-1/3 flex ">
          <a className="cursor-pointer" onClick={toggleLike}>
            {liked ? (
              <FavoriteIcon className="text-red-700" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </a>
          <div>{post.likes.length}</div>
        </div>
        <div className="w-1/3 flex ">
          <FaRegComment className="h-6 w-5 " />
          <div className="pl-1">{post.comments.length}</div>
        </div>
      </div>
    </div>
  );
};

export default Post;
