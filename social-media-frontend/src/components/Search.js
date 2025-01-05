import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../AppContext";

const Search = () => {
  const { username } = useParams();
  const { getReq } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const navigate= useNavigate();

  useEffect(() => {
    (async () => {
      await searchUsers();
    })();
  }, [username]);

  const searchUsers = async () => {
    const res = await getReq(
      `http://localhost:8800/api/users/search/?username=${username}`
    );
    if (res.ok) {
      console.log("here");
      const jsonData = await res.json();
      setUsers(jsonData);
    }else{
        setUsers([]);
    }
  };

  return (
    <div className="justify-items-center">
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
            <div key={user._id} onClick={()=>{navigate(`/user/profile/${user._id}`)}} className="flex md:w-6/12 w-10/12 h-24 items-center pl-2 bg-white m-2 cursor-pointer">
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
  );
};

export default Search;
