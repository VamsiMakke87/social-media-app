import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfile = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleBlur = (event) => {
    console.log("blur");
    if (!profileRef.current.contains(event.relatedTarget)) {
      setProfileMenuOpen(false);
    }
  };

  return (
    <>
      <div className="p-4 h-20 sticky top-0 bg-white flex items-center shadow-xl">
        <div className="w-1/5">
          <Link className="text-2xl font-extrabold" to="/">
            VamsiMakke
          </Link>
        </div>
        <div className="hidden md:flex items-center border-black rounded border-2 w-1/2 mr-4">
          <SearchIcon className=" border-black " />
          <input
            className="appearance-non w-full  rounded  py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
            type="text"
            placeholder="Enter Username"
          />
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
          <NotificationsIcon />
          {/* <Link to="/post">Posts</Link> */}

          <div
            tabIndex={0}
            ref={profileRef}
            onBlur={handleBlur}
            className="cursor-pointer"
            onClick={toggleProfile}
            className="relative"
          >
            <AccountCircleIcon className="cursor-pointer" />
            {profileMenuOpen && (
              <div className="absolute bg-white border rounded w-40 right-10 p-2 space-y-1 shadow-2xl">
                <div className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                  <Link to="/profile">Profile</Link>
                </div>
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/settings">Settings</Link>
                </div>
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/logout">Logout</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="md:hidden">
        {menuOpen && (
          <div className="items-center flex m-4 border-black rounded border-2 w-100 ">
            <SearchIcon />
            <input
              className="appearance-non w-full  rounded  py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
              type="text"
              placeholder="Enter Username"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
