import React, { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { useParams } from "react-router-dom";
import Post from "./Post";

const Profile = () => {
  const { userId } = useParams();
  const { loggedInUser, getReq, putReq } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState();
  const [followText, setFollowText] = useState(false);

  useEffect(() => {
    (async () => {
      await loadUser();
      await loadPosts();
    })();
  }, []);

  const loadUser = async () => {
    try {
      const res = await getReq(`http://localhost:8800/api/users/${userId}`);
      if (res.ok) {
        const jsonData = await res.json();
        setUser(jsonData);
        setFollowText(jsonData.followers.includes(loggedInUser._id));
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const loadPosts = async () => {
    const res = await getReq(`http://localhost:8800/api/posts/feed/${userId}`);
    if (res.ok) {
      const postsData = await res.json();
      setPosts(postsData);
    }
  };

  const toggleFollow = async () => {
    if (followText) {
      await unFollowUser();
    } else {
      await followUser();
    }

    setFollowText(!followText);
  };

  const followUser = async () => {
    const res = putReq(`http://localhost:8800/api/users/follow/${user._id}`, {
      userId: loggedInUser._id,
    });

    if (res.ok) {
      await loadUser();
    }
  };

  const unFollowUser = async () => {
    const res = putReq(`http://localhost:8800/api/users/unfollow/${user._id}`, {
      userId: loggedInUser._id,
    });

    if (res.ok) {
      console.log("unfollow");
      await loadUser();
    }
  };

  return (
    <div className="bg-slate-50 p-5 justify-items-center">
      {user && (
        <div className="rounded p-6 h-84 w-10/12 border justify-items-center  md:w-6/12 bg-white m-2 shadow-md justify-items-start resize-none">
          <img
            className="h-30 w-30 m-3 rounded-full"
            src={user.profilePic}
            alt="Profile"
          />
          <div className="font-bold">{user.username}</div>
          <div className="flex space-x-16">
            <div className="justify-items-center">
              <div>{user.followers.length}</div>
              <div className="font-bold">Followers</div>
            </div>
            <div className="justify-items-center">
              <div>{user.following.length}</div>
              <div className="font-bold">Following</div>
            </div>
          </div>
          {loggedInUser._id === user._id ? (
            <div className="border p-2 mt-1 px-8 rounded-md border-black hover:bg-black hover:text-white cursor-pointer">
              Edit Profile
            </div>
          ) : (
            <div
              onClick={toggleFollow}
              className="border p-2 mt-1 px-8 rounded-md border-black  cursor-pointer"
            >
              {followText ? <>Unfollow</> : <>Follow</>}
            </div>
          )}
        </div>
      )}

      {posts ? (
        posts.map((post) => (
          <Post key={post._id} post={post} loadPosts={loadPosts} />
        ))
      ) : (
        <p>Loading.....</p>
      )}
    </div>
  );
};

export default Profile;
