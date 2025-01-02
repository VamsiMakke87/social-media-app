import React, { useContext, useEffect } from "react";
import Post from "./Post";
import AppContext from "../AppContext";

const Home = () => {
  const { posts, setPosts } = useContext(AppContext);
  useEffect(() => {
    setPosts(posts1);
    console.log(posts);
  }, []);
  const posts1 = [
    {
      comments: [],
      _id: "676ea40492cf59623be9da2c",
      userId: "676e901b1bed623ed0b87cd6",
      description: "Wassup ma boisss",
      likes: [],
      createdAt: "2024-12-27T12:56:36.261Z",
      updatedAt: "2024-12-27T12:56:36.261Z",
      __v: 0,
    },
    {
      _id: "676ea2a30dad984ba10197b8",
      userId: "676e93804f9a0770ce6e4c91",
      description: "Wassup",
      likes: [],
      createdAt: "2024-12-27T12:50:43.870Z",
      updatedAt: "2024-12-27T17:04:38.321Z",
      __v: 0,
      comments: [
        "676ed6278bdfce5258aeaf3c",
        "676edbd5e42311f2282465ab",
        "676edbdae42311f2282465af",
        "676edd86e4bf7df58481f029",
        "676eddaed91709db303d79f5",
        "676eddccf27e8a712061c0fc",
        "676ede2653b7469637fe8def",
      ],
    },
    {
      comments: [],
      _id: "676ea369840c80a9c746d15e",
      userId: "676e93804f9a0770ce6e4c91",
      description: "Wassup ma bois",
      likes: [],
      createdAt: "2024-12-27T12:54:01.716Z",
      updatedAt: "2024-12-27T12:54:01.716Z",
      __v: 0,
    },
  ];

  return (
    <div className=" m-5 justify-items-center">
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
};

export default Home;
