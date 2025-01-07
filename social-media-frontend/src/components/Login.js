import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../AppContext";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const { postReq, loadUser } = useContext(AppContext);
  const [message, setMessage] = useState();
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  if (localStorage.getItem("userId")) {
    return <Navigate to="/" replace />;
  }

  const login = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    setMessage();
    if (email && password) {
      const res = await postReq("http://localhost:8800/api/auth/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("token", data.token);
        loadUser(data.userId);
        navigate("/");
      } else {
        setMessage("Invalid Credentials");
      }
    } else {
      setMessage("Please enter email and password");
    }
  };

  const signUp = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-slate-100 h-screen flex items-center  justify-center">
      <div className="p-6 bg-white h-fit mt-10 border rounded shadow-xl md:w-4/12 w-10/12">
        <div className="text-6xl  font-bold p-4 text-center">Login</div>
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
        <a className="underline text-xs text-blue-700 cursor-pointer">
          Forgot Password?
        </a>
        <div
          onClick={login}
          className="w-full p-2 cursor-pointer mt-2 rounded justify-items-center border  text-center border-black hover:bg-black hover:text-white"
        >
          Login
        </div>
        <div className="mt-2 text-center text-red-700">{message}</div>
        <a
          onClick={signUp}
          className="text-center text-blue-700 block text-sm  cursor-pointer"
        >
          Create account
        </a>
      </div>
    </div>
  );
};

export default Login;
