import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import AppContext from "../AppContext";

const Notification = (props) => {
  const { getReq } = useContext(AppContext);
  const [message, setMessage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    switch (props.notification.type) {
      case 0:
        setMessage("started following you");
        break;
      case 1:
        setMessage("liked your post");
        break;
      case 2:
        setMessage(
          `commented "${props.notification.description}" on your post`
        );
        break;
      case 3:
        setMessage(`liked your comment "${props.notification.description}"`);
        break;
      case 4:
        setMessage(
          `replied to your comment "${props.notification.description}"`
        );
        break;
      case 5:
        setMessage(`liked your comment "${props.notification.description}"`);
        break;
    }
  }, []);

  const handleNotificationClick = () => {
    switch (props.notification.type) {
      case 0:
        navigate(`/user/profile/${props.notification.fromUserId}`);
        break;
      case 1:
        openPost(props.notification.postId);
        break;
      case 2:
        openPost(props.notification.commentId);
        break;
      case 3:
        openPost(props.notification.commentId);
        break;
      case 4:
        openPost(props.notification.replyId, props.notification.commentId);
        break;
      case 5:
        openPost(props.notification.replyId, props.notification.commentId);
        break;
    }
  };

  const openPost = async (targetId, targetCommentId) => {
    const res = await getReq(
      `http://localhost:8800/api/posts/${props.notification.postId}`
    );
    if (res.ok) {
      const post = await res.json();
      navigate(`/post/${props.notification.postId}`, {
        state: { post, targetId: targetId, targetCommentId: targetCommentId },
      });
    }
  };

  return (
    <div
      onClick={handleNotificationClick}
      className="flex m-1 p-4 cursor-pointer hover:bg-slate-100 bg-white rounded shadow-md w-10/12 md:w-6/12"
    >
      <img
        className="h-10 w-10 rounded-full"
        src={props.notification.profilePic}
      />
      <div className=" ml-1 space-x-1">
        <span className="font-bold">{props.notification.username}</span>
        <span>{message}</span>
      </div>
      <div className="ml-auto font-light text-xs">
        {formatDistanceToNow(new Date(props.notification.createdAt), {
          addSuffix: true,
        })}
      </div>
    </div>
  );
};

export default Notification;
