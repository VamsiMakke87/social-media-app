import React, { useContext, useEffect, useRef, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FaRegComment } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import Replies from "./Replies";
import AppContext from "../AppContext";
import SendIcon from "@mui/icons-material/Send";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useNavigate } from "react-router-dom";

const Comment = (props) => {
  const { getReq, postReq, putReq, delReq, loggedInUser } =
    useContext(AppContext);
  const replyRef = useRef();
  const [comment, setComment] = useState(props.comment);
  const [liked, setLiked] = useState(
    props.comment.likes.includes(loggedInUser._id)
  );
  const [replies, setReplies] = useState([]);
  const [replyClicked, setReplyClicked] = useState(false);
  const commentMenuRef = useRef();
  const [commentMenuOpen, setCommentMenuOpen] = useState(false);
  const [deleteCommentMenu, setDeleteCommentMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      (async () => {
        await loadReplies();
      })();
    }
  }, [loggedInUser]);

  const toggleLike = async () => {
    const res = await putReq(
      `http://localhost:8800/api/comment/like/${comment._id}`,
      { userId: loggedInUser._id }
    );

    if (res.ok) {
      if (!liked) {
        setComment((prev) => ({
          ...prev,
          likes: [...prev.likes, loggedInUser._id],
        }));
      } else {
        setComment((prev) => ({
          ...prev,
          likes: prev.likes.filter((like) => like !== loggedInUser._id),
        }));
      }
      setLiked(!liked);
    }
  };

  const toggleReply = async () => {
    if (!replyClicked) await loadReplies();
    setReplyClicked(!replyClicked);
  };

  const loadReplies = async () => {
    const res = await getReq(
      `http://localhost:8800/api/comment/reply/all/${comment._id}`
    );

    if (res.ok) {
      const jsonData = await res.json();
      setReplies(jsonData);
      setComment((prev) => ({
        ...prev,
        replies: jsonData,
      }));
    }
  };

  const addReply = async () => {
    const reply = replyRef.current.value;
    if (reply) {
      replyRef.current.value = "";
      const data = {
        userId: loggedInUser._id,
        commentId: comment._id,
        description: reply,
      };

      const res = await postReq(
        "http://localhost:8800/api/comment/reply",
        data
      );
      if (res.ok) await loadReplies();
    }
    setReplyClicked(true);
  };

  const toggleCommentMenuOpen = () => {
    setCommentMenuOpen(!commentMenuOpen);
    setDeleteCommentMenu(false);
  };

  const commentMenuBlur = (event) => {
    if (!commentMenuRef.current.contains(event.relatedTarget)) {
      setCommentMenuOpen(false);
      setDeleteCommentMenu(false);
    }
  };

  const deleteComment = async () => {
    const res = await delReq(
      `http://localhost:8800/api/comment/${comment._id}`,
      {
        userId: loggedInUser._id,
      }
    );
    if (res.ok) {
      await props.loadComments();
    }
  };
  return (
    <div className="mt-1 p-2 rounded border  bg-gray-100">
      <div className="flex">
        <div
          className="flex  space-x-1 items-center cursor-pointer"
          onClick={() => {
            navigate(`/user/profile/${comment.userId}`);
          }}
        >
          <img className="h-10 w-10 rounded-full" src={comment.profilePic} />
          <div>
            <div className="text-sm font-semibold">{comment.username}</div>
            <div className="text-xs font-normal">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
        {comment.userId === loggedInUser._id && (
          <div className="ml-auto">
            <div
              className="relative"
              tabIndex={0}
              ref={commentMenuRef}
              onBlur={commentMenuBlur}
            >
              <div onClick={toggleCommentMenuOpen} className="cursor-pointer ">
                <MoreVertOutlinedIcon />
              </div>
              {commentMenuOpen && (
                <div className="absolute p-2 text-sm justify-center border rounded bg-white shadow-md h-18 w-fit top-3 right-3">
                  {deleteCommentMenu ? (
                    <div>
                      <div>
                        Do&nbsp;you&nbsp;want&nbsp;to&nbsp;delete&nbsp;the&nbsp;comment?
                      </div>
                      <div className="flex">
                        <button
                          onClick={deleteComment}
                          className="border-black border m-1 p-2 w-1/2 hover:bg-black hover:text-white"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => {
                            setDeleteCommentMenu(false);
                          }}
                          className="border border-black m-1 p-2 w-1/2 hover:bg-black hover:text-white"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setDeleteCommentMenu(true);
                      }}
                      className="p-2 h-fit pr-8 hover:bg-gray-100 cursor-pointer rounded"
                    >
                      Delete
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center">
        <div className="text-sm">{comment.description}</div>
        <div className="ml-auto flex items-center">
          <div className="flex mr-2 items-center">
            <div className="cursor-pointer" onClick={toggleLike}>
              {liked ? (
                <FavoriteIcon fontSize="small" className=" text-red-700" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </div>
            <div className="cursor-context-menu text-sm">
              {comment.likes.length}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <a className="cursor-pointer" onClick={toggleReply}>
            <FaRegComment className="h-4 w-4" />
          </a>
          <div className="ml-0.5 text-sm">{comment.replies.length}</div>
        </div>
      </div>
      {replyClicked &&
        (replies.length > 0 ? (
          <div>
            {replies.map((reply) => (
              <Replies
                key={reply._id}
                reply={reply}
                loadReplies={loadReplies}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-200 border p-2 rounded">
            No replies posted
          </div>
        ))}
      {replyClicked && (
        <div className="mt-2 flex">
          <input
            type="text"
            ref={replyRef}
            className="h-fit w-11/12 outline-none bg-transparent"
            placeholder="Add reply"
          />
          <a className="cursor-pointer ml-auto" onClick={addReply}>
            <SendIcon fontSize="small" />
          </a>
        </div>
      )}
    </div>
  );
};

export default Comment;
