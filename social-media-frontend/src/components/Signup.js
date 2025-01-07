import React, { useContext, useRef, useState } from "react";
import AppContext from "../AppContext";
import { Navigate, useNavigate } from "react-router-dom";

const Signup = () => {
  const { postReq, setLoggedInUser, setToken } = useContext(AppContext);
  const [message, setMessage] = useState();
  const navigate = useNavigate();
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  if (localStorage.getItem("userId")) {
    return <Navigate to="/" replace />;
  }

  const signUp = async () => {
    const email = emailRef.current.value;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const confPassword = confirmPasswordRef.current.value;
    setMessage();
    if (username && email && password && confPassword) {
      const res = await postReq("http://localhost:8800/api/auth/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      if (res.ok) {
        const data = await res.json();
        setLoggedInUser(data.user);
        setToken(data.token);
        navigate("/");
      } else {
        setMessage("Invalid Credentials");
      }
    } else {
      setMessage("Please enter all details");
    }
  };

  const login = () => {
    navigate("/login");
  };

  return (
    <div className="bg-slate-100 h-screen flex items-center  justify-center">
      <div className="p-6 bg-white h-fit mt-10 border rounded shadow-xl md:w-4/12 w-10/12">
        <div className="text-6xl  font-bold p-4 text-center">Signup</div>
        <div className="space-y-1">
          <div>Username:</div>
          <input
            type="text"
            ref={usernameRef}
            className="outline outline-slate-300 focus:outline-black rounded h-10 p-2 w-full"
          />
        </div>
        <div className="space-y-1">
          <div>Email:</div>
          <input
            type="email"
            ref={emailRef}
            className="outline outline-slate-300 focus:outline-black rounded h-10 p-2 w-full"
          />
        </div>
        <div className="space-y-1 mt-3">
          <div>Password:</div>
          <input
            type="password"
            ref={passwordRef}
            className="outline outline-slate-300 focus:outline-black rounded h-10 p-2 w-full"
          />
        </div>
        <div className="space-y-1 mt-3">
          <div>Confirm Password:</div>
          <input
            type="password"
            ref={confirmPasswordRef}
            className="outline outline-slate-300 focus:outline-black rounded h-10 p-2 w-full"
          />
        </div>
        <a className="underline text-xs text-blue-700 cursor-pointer">
          Forgot Password?
        </a>
        <div
          onClick={signUp}
          className="w-full p-2 cursor-pointer mt-2 rounded justify-items-center border  text-center border-black hover:bg-black hover:text-white"
        >
          Sign Up
        </div>
        <div className="mt-2 text-center text-red-700">{message}</div>
        <div
          onClick={login}
          className="text-center block text-sm  cursor-pointer"
        >
          Have an account? <a className="text-blue-700">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
