import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import AppContext from "../AppContext";
import { io, WebSocket } from "socket.io-client";

const Navbar = () => {
  const { loggedInUser, putReq } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notification, setNotification] = useState(
    loggedInUser.hasUnreadNotifications
  );
  const profileRef = useRef();
  const searchRef = useRef();
  const navigate = useNavigate();
  const socketURL = process.env.REACT_APP_SOCKET_URL;


  useEffect(() => {
    const socket = io(socketURL, {
      query: { userId: loggedInUser._id },
    });

    socket.on("new_notification", (data) => {
      setNotification(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [loggedInUser._id]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfile = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleBlur = (event) => {
    if (!profileRef.current.contains(event.relatedTarget)) {
      setProfileMenuOpen(false);
    }
  };

  const notificationClick = async () => {
    try {
      if (notification) {
        const res = await putReq(
          "/api/users/readNotifications"
        );
      }
      setNotification(false);
      navigate("/notifications");
    } catch (err) {
      console.log(err);
    }
  };

  const searchUser = async () => {
    const username = searchRef.current.value;
    if (username) {
      navigate(`/search/${username}`);
    }
  };

  return (
    <>
      {loggedInUser && (
        <>
          <div className="p-4 h-20 sticky top-0 bg-white flex items-center shadow-xl z-50">
            <div className="w-1/5">
              <Link className="text-2xl font-extrabold" to="/">
                VamsiMakke
              </Link>
            </div>
            <div className="hidden md:flex items-center border-black rounded border-2 w-1/2 mr-4">
              <SearchIcon className=" ml-1" />
              <input
                className="appearance-none w-full  rounded  py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
                type="text"
                ref={searchRef}
                placeholder="Enter Username"
              />
              <div
                onClick={searchUser}
                className="bg-black h text-white  h-full p-2 px-4 cursor-pointer"
              >
                Search
              </div>
            </div>

            <div className=" flex ml-auto space-x-6">
              <div
                className="md:hidden cursor-pointer ml-auto"
                onClick={toggleMenu}
              >
                {menuOpen ? <CloseIcon /> : <SearchIcon />}
              </div>
              <Link to="/home">
                <HomeIcon />
              </Link>
              <div>
                <div onClick={notificationClick} className="cursor-pointer">
                  <NotificationsIcon />
                </div>
                {notification && (
                  <div className="text-red-700 rounded-full right-16 top-8 text-xs h-2 w-2 bg-red-700 absolute"></div>
                )}
              </div>
              {/* <Link to="/post">Posts</Link> */}

              <div
                tabIndex={0}
                ref={profileRef}
                onBlur={handleBlur}
                className="cursor-pointer"
                onClick={toggleProfile}
                className="relative "
              >
                <img
                  src={loggedInUser.profilePic}
                  className="cursor-pointer h-6 w-6 rounded-full"
                />
                {profileMenuOpen && (
                  <div className="absolute bg-white border rounded w-40 right-2 p-2 space-y-1 shadow-2xl">
                    <Link to={`user/profile/${loggedInUser._id}`}>
                      <div className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                        Profile
                      </div>
                    </Link>
                    <Link to="/settings">
                      <div className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                        Settings
                      </div>
                    </Link>
                    <Link to="/logout">
                      <div className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                        Logout
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            {menuOpen && (
              <div className="items-center sticky top-0 flex m-4 border-black rounded border-2 w-100 ">
                <SearchIcon className="ml-1" />
                <input
                  className="appearance-non w-full  rounded  py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  ref={searchRef}
                  placeholder="Enter Username"
                />
                <div
                  onClick={searchUser}
                  className="bg-black h text-white  h-full p-2 px-4 cursor-pointer"
                >
                  Search
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
