import React, { useContext, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { formatDistanceToNow } from "date-fns";
import AppContext from "../AppContext";

const Replies = (props) => {
  const { getReq, postReq, putReq, delReq, loggedInUser } =
    useContext(AppContext);
    const [reply,setReply]= useState(props.reply);
  const [liked, setLiked] = useState(
    props.reply.likes.includes(loggedInUser._id)
  );

  const toggleLike = async () => {
    const res=await putReq(`http://localhost:8800/api/comment/reply/like/${reply._id}`,{userId: loggedInUser._id});

    if(res.ok){
      if (!liked) {
        setReply((prev) => ({
          ...prev,
          likes: [...prev.likes, loggedInUser._id],
        }));
      } else {
        setReply((prev) => ({
          ...prev,
          likes: prev.likes.filter((like) => like !== loggedInUser._id),
        }));
      }
      setLiked(!liked);
    }
  };

  return (
    <div className="bg-gray-200 border p-2 rounded">
      <div className="flex space-x-1 items-center">
        <img className="rounded-full h-9 w-9" src={reply.profilePic} />
        <div>
          <div className="text-sm font-semibold">{reply.username}</div>
          <div className="text-xs font-normal">
            {formatDistanceToNow(new Date(reply.createdAt), {
              addSuffix: true,
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="text-sm">{reply.description}</div>
        <div onClick={toggleLike} className="ml-auto flex cursor-pointer text-sm">
          {liked ? (
            <FavoriteIcon fontSize="small" className="text-red-700" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
          <div>{reply.likes.length}</div>
        </div>
      </div>
    </div>
  );
};

export default Replies;
