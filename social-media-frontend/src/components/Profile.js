import React, { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { useNavigate, useParams } from "react-router-dom";
import Post from "./Post";

const Profile = () => {
  const { userId } = useParams();
  const { loggedInUser, getReq, putReq } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState();
  const [followText, setFollowText] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      (async () => {
        await loadUser();
        await loadPosts();
      })();
    }
  }, [userId, loggedInUser]);

  const loadUser = async () => {
    try {
      const res = await getReq(`http://localhost:8800/api/users/${userId}`);
      if (res.ok) {
        const jsonData = await res.json();
        setUser(jsonData);
        setFollowText(jsonData.followers.includes(loggedInUser._id));
        // console.log(user.profilePic);
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

  const editProfile = () => {
    navigate("/settings");
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
    const res = await putReq(
      `http://localhost:8800/api/users/follow/${user._id}`,
      {
        userId: loggedInUser._id,
      }
    );

    if (res.ok) {
      setUser((prev) => ({
        ...prev,
        followers: [...prev.followers, loggedInUser._id],
      }));
    }
  };

  const unFollowUser = async () => {
    const res = await putReq(
      `http://localhost:8800/api/users/unfollow/${user._id}`,
      {
        userId: loggedInUser._id,
      }
    );

    if (res.ok) {
      setUser((prev) => ({
        ...prev,
        followers: prev.followers.filter(
          (follow) => follow != loggedInUser._id
        ),
      }));
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen p-5 justify-items-center">
      {user && (
        <div
          key={user.userId}
          className="rounded p-6 h-84 w-10/12 border justify-items-center  md:w-6/12 bg-white m-2 shadow-md justify-items-start"
        >
          <img
            className="h-40 w-40 m-3 rounded-full"
            src={user.profilePic}
            alt="Profile"
          />
          <div className="font-bold text-xl">{user.username}</div>
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
            <div
              onClick={editProfile}
              className="border p-2 mt-1 px-8 rounded-md border-black hover:bg-black hover:text-white cursor-pointer"
            >
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
