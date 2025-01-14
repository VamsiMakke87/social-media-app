import React, { useContext, useEffect, useRef, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { formatDistanceToNow } from "date-fns";
import AppContext from "../AppContext";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useNavigate } from "react-router-dom";

const Replies = (props) => {
  const { getReq, postReq, putReq, delReq, loggedInUser } =
    useContext(AppContext);
  const [reply, setReply] = useState(props.reply);
  const [liked, setLiked] = useState(
    props.reply.likes.includes(loggedInUser._id)
  );
  const replyRef = useRef();
  const replyMenuRef = useRef();
  const [borderColor, setBorderColor] = useState();
  const [replyMenuOpen, setReplyMenuOpen] = useState(false);
  const [deleteReplyMenu, setDeleteReplyMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (props.targetId && props.targetId == reply._id) {
        replyRef.current.scrollIntoView({ behavior: "smooth" });
        setBorderColor("border-black border-5");
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const toggleLike = async () => {
    const res = await putReq(
      `/api/comment/reply/like/${reply._id}`,
      { userId: loggedInUser._id }
    );

    if (res.ok) {
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

  const toggleReplyMenuOpen = () => {
    setReplyMenuOpen(!replyMenuOpen);
    setDeleteReplyMenu(false);
  };

  const replyMenuBlur = (event) => {
    if (!replyMenuRef.current.contains(event.relatedTarget)) {
      setReplyMenuOpen(false);
      setDeleteReplyMenu(false);
    }
  };

  const deleteReply = async () => {
    const res = await delReq(
      `/api/comment/reply/${reply._id}`,
      {
        userId: loggedInUser._id,
      }
    );
    if (res.ok) {
      await props.loadReplies();
    }
  };

  return (
    <div
      ref={replyRef}
      className={`bg-gray-200  border p-2 ${borderColor} rounded`}
    >
      <div className="flex">
        <div
          className="flex space-x-1 items-center cursor-pointer"
          onClick={() => {
            navigate(`/user/profile/${reply.userId}`);
          }}
        >
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
        {reply.userId === loggedInUser._id && (
          <div className="ml-auto">
            <div
              className="relative"
              tabIndex={0}
              ref={replyMenuRef}
              onBlur={replyMenuBlur}
            >
              <div onClick={toggleReplyMenuOpen} className="cursor-pointer ">
                <MoreVertOutlinedIcon fontSize="small" />
              </div>
              {replyMenuOpen && (
                <div className="absolute p-2 text-sm justify-center border rounded bg-white shadow-md h-18 w-fit top-3 right-3">
                  {deleteReplyMenu ? (
                    <div>
                      <div>
                        Do&nbsp;you&nbsp;want&nbsp;to&nbsp;delete&nbsp;the&nbsp;comment?
                      </div>
                      <div className="flex">
                        <button
                          onClick={deleteReply}
                          className="border-black border m-1 p-2 w-1/2 hover:bg-black hover:text-white"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => {
                            setDeleteReplyMenu(false);
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
                        setDeleteReplyMenu(true);
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
        <div className="text-sm">{reply.description}</div>
        <div
          onClick={toggleLike}
          className="ml-auto flex cursor-pointer text-sm"
        >
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
