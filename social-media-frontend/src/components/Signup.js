import React, { useContext, useRef, useState } from "react";
import AppContext from "../AppContext";
import { Navigate, useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const Signup = () => {
  const { getReq, postReq, setLoggedInUser, setToken } = useContext(AppContext);
  const [error, setError] = useState({});
  const [message, setMessage] = useState();
  const [passwordType, setPasswordType] = useState("password");
  const [passwordFocus, setPasswordFocus] = useState("");
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState("");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const navigate = useNavigate();
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  const validateUsername = async () => {
    try {
      const username = usernameRef.current.value;
      if (!username) {
        setError((prev) => ({ ...prev, username: "Username cannot be empty" }));
      } else if (username.length < 3 || username.length > 20) {
        setError((prev) => ({
          ...prev,
          username: "Username must be between 3 and 20 characters long.",
        }));
      } else if (!/^[a-zA-Z0-9]{3,15}$/.test(username)) {
        setError((prev) => ({
          ...prev,
          username: "Username must be alphanumeric characters only",
        }));
      } else {
        const res = await getReq(`/api/auth/exists?username=${username}`);
        if (res.ok) {
          const data = await res.json();
          if (data.isExists)
            setError((prev) => ({
              ...prev,
              username: "Username already exists",
            }));
          else
            setError((prev) => {
              const { username, ...rest } = prev;
              return rest;
            });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validateEmail = async () => {
    try {
      const email = emailRef.current.value;
      if (!email) {
        setError((prev) => ({ ...prev, email: "Email cannot be empty" }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError((prev) => ({
          ...prev,
          email: "Please enter a valid email format",
        }));
      } else {
        const res = await getReq(`/api/auth/exists?email=${email}`);
        if (res.ok) {
          const data = await res.json();
          if (data.isExists)
            setError((prev) => ({ ...prev, email: "Email already exists" }));
          else
            setError((prev) => {
              const { email, ...rest } = prev;
              return rest;
            });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validatePassword = async () => {
    try {
      const password = passwordRef.current.value;
      if (!password) {
        setError((prev) => ({ ...prev, password: "Password cannot be empty" }));
      } else if (password.length < 8) {
        setError((prev) => ({
          ...prev,
          password: "Password must be of length 8",
        }));
      } else if (!/[A-Z]/.test(password)) {
        setError((prev) => ({
          ...prev,
          password: "Password must contain atleast one Uppercase character",
        }));
      } else if (!/[a-z]/.test(password)) {
        setError((prev) => ({
          ...prev,
          password: "Password must contain atleast one Lowercase character",
        }));
      } else if (!/\d/.test(password)) {
        setError((prev) => ({
          ...prev,
          password: "Password must contain atleast one number",
        }));
      } else if (!/[@#!$%^&*]/.test(password)) {
        setError((prev) => ({
          ...prev,
          password:
            "Password must contain atleast one Special character(!@#$%^&*)",
        }));
      } else {
        setError((prev) => {
          const { password, ...rest } = prev;
          return rest;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validateConfirmPassword = () => {
    const confirmPassword = confirmPasswordRef.current.value;
    const password = passwordRef.current.value;
    if (!confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Confirm Password cannot be empty",
      }));
    } else if (!password || confirmPassword !== password) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Password and Confirm Password does not match",
      }));
    } else {
      setError((prev) => {
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
    }
  };

  const signUp = async () => {
    if (Object.keys(error).length == 0) {
      const res = await postReq("/api/auth/signup", {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      if (res.ok) {
        alert("Profile created successfully");
        navigate("/login");
      } else {
        setMessage("Invalid Credentials");
      }
    } else {
      console.log(error);
      setMessage("Please fill the form correctly");
    }
  };

  const login = () => {
    navigate("/login");
  };

  return (
    <div className="bg-slate-100 h-screen flex items-center  justify-center">
      <div className="p-6 bg-white h-fit mt-10 border rounded shadow-xl md:w-4/12 w-10/12">
        <div className="text-6xl  font-bold p-4 text-center">Signup</div>
        <div>
          <div>Username:</div>
          {error.username && (
            <div className="text-red-700 text-sm">{error.username}</div>
          )}
          <input
            type="text"
            ref={usernameRef}
            onChange={validateUsername}
            className="outline-none hover:border-black focus:border-black border border-2 border-slate-300 rounded h-10 p-2 w-full"
          />
        </div>
        <div className="mt-2">
          <div>Email:</div>
          {error.email && (
            <div className="text-red-700 text-sm">{error.email}</div>
          )}
          <input
            type="email"
            ref={emailRef}
            onChange={validateEmail}
            className="outline-none hover:border-black focus:border-black border border-2 border-slate-400 rounded h-10 p-2 w-full"
          />
        </div>
        <div className="mt-2">
          <div>Password:</div>
          {error.password && (
            <div className="text-red-700 text-sm">{error.password}</div>
          )}
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
                setPasswordFocus("border-slate-300");
              }}
              onChange={validatePassword}
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
        <div className="mt-2">
          <div>Confirm&nbsp;Password:</div>
          {error.confirmPassword && (
            <div className="text-red-700 text-sm">{error.confirmPassword}</div>
          )}
          <div
            className={`flex items-center px-2 w-full hover:border-black ${confirmPasswordFocus} border border-2 rounded `}
          >
            <input
              type={confirmPasswordType}
              ref={confirmPasswordRef}
              onFocus={() => {
                setConfirmPasswordFocus("border-black");
              }}
              onBlur={() => {
                setConfirmPasswordFocus("border-slate-300");
              }}
              onChange={validateConfirmPassword}
              className=" outline-none  rounded h-10 w-full"
            />
            {confirmPasswordType === "password" ? (
              <div
                onClick={() => {
                  setConfirmPasswordType("text");
                }}
                className="cursor-pointer"
              >
                <VisibilityOutlinedIcon />
              </div>
            ) : (
              <div
                onClick={() => {
                  setConfirmPasswordType("password");
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
