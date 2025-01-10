import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../AppContext";
import { Navigate, useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const Login = () => {
  const { postReq, loadApp } = useContext(AppContext);
  const [message, setMessage] = useState();
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [passwordFocus, setPasswordFocus] = useState("border-slate-400");
  const [passwordType, setPasswordType] = useState("password");

  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  const login = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    setMessage();
    if (email && password) {
      const res = await postReq("/api/auth/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        await loadApp(data.token);
        navigate("/");
      } else {
        setMessage("Invalid Credentials");
      }
    } else {
      setMessage("Please enter email and password");
    }
  };

  const validateEmail = async () => {
    try {
      const email = emailRef.current.value;
      if (!email) {
        setMessage("Email cannot be empty");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMessage("Please enter a valid email format");
      } else {
        setMessage("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const signUp = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-slate-100 h-screen flex items-center  justify-center">
      <div className="p-6 bg-white h-fit mt-10 border rounded shadow-xl md:w-4/12 w-10/12">
        <div className="text-6xl  font-bold p-4 text-center">Login</div>
        <div className="mt-2">
          <div>Email:</div>
          <input
            type="email"
            ref={emailRef}
            onChange={validateEmail}
            className="outline-none hover:border-black focus:border-black border border-2 border-slate-400 rounded h-10 p-2 w-full"
          />
        </div>
        <div className="mt-2">
          <div>Password:</div>
          <div
            className={`flex items-center px-2 w-full hover:border-black ${passwordFocus} border border-2 rounded `}
          >
            <input
              type={passwordType}
              ref={passwordRef}
              onFocus={() => {
                setPasswordFocus("border-black");
              }}
              onBlur={() => {
                setPasswordFocus("border-slate-400");
              }}
              className=" outline-none  rounded h-10 w-full"
            />
            {passwordType === "password" ? (
              <div
                onClick={() => {
                  setPasswordType("text");
                }}
                className="cursor-pointer"
              >
                <VisibilityOutlinedIcon />
              </div>
            ) : (
              <div
                onClick={() => {
                  setPasswordType("password");
                }}
                className="cursor-pointer"
              >
                <VisibilityOffOutlinedIcon />
              </div>
            )}
          </div>
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
