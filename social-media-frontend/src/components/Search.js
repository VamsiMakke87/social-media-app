import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../AppContext";
import SearchIcon from "@mui/icons-material/Search";

const Search = () => {
  const { username } = useParams(); // Destructure username from the URL params
  const [usernameState, setUsernameState] = useState(username); // Use the value to initialize the state

  const { getReq } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef();

  useEffect(() => {
    if (usernameState) {
      (async () => {
        await searchUsers();
      })();
    }
  }, [usernameState]);

  const searchUsers = async () => {
    const res = await getReq(`/api/users/search/?username=${usernameState}`);
    if (res.ok) {
      const jsonData = await res.json();
      setUsers(jsonData);
    } else {
      setUsers([]);
    }
  };

  const searchUser = async () => {
    const value = searchRef.current.value;
    if (value) {
      setUsernameState(value);
      navigate(`/search/${value}`);
    }
  };

  return (
    <>
      <div className="md:hidden items-center sticky top-0 flex m-4 border-black rounded border-2 w-100 ">
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
      <div className="justify-items-center">
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                navigate(`/user/profile/${user._id}`);
              }}
              className="flex md:w-6/12 w-10/12 h-24 items-center hover:bg-slate-200 hover:rounded-md pl-2 bg-white m-2 cursor-pointer"
            >
              <img
                src={user.profilePic}
                alt={user.username}
                className="rounded-full h-20 w-20"
              />
              <h2 className="font-bold m-2">{user.username}</h2>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Search;
