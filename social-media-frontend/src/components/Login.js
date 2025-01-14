import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../AppContext";
import { Navigate, useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const Login = () => {
  const { postReq, loadApp, setErrorMsg, setSuccessMsg } =
    useContext(AppContext);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [passwordFocus, setPasswordFocus] = useState("border-slate-400");
  const [passwordType, setPasswordType] = useState("password");

  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  const login = async () => {
    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      if (!error && email && password) {
        const res = await postReq("/api/auth/login", {
          email: email,
          password: password
        });

        if (res.ok) {
          const data = await res.json();
          if (data.isTfaOn) {
            navigate("/tfa", {
              state: {
                token: data.token,
                email: email
              },
            });
          } else {
            localStorage.setItem("token", data.token);
            setSuccessMsg("Login Successfull");
            await loadApp(data.token);
            navigate("/");
          }
        } else if (res.status === 403) {
          setErrorMsg(
            "Account not activated, please activate your account to login"
          );
          navigate("/activate");
        } else {
          setErrorMsg("Invalid Credentials");
        }
      } else {
        setErrorMsg("Please fill out the form correctly");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validateEmail = async () => {
    try {
      const email = emailRef.current.value;
      if (!email) {
        setError(true);
        // setErrorMsg("Email cannot be empty");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError(true);
        // setErrorMsg("Please enter a valid email format");
      } else {
        setError(false);
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
          {error && (
            <div className="text-red-700 text-sm">
              {"Please enter valid email address"}
            </div>
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
        <a
          href="/forgotPassword"
          className="underline text-xs text-blue-700 cursor-pointer"
        >
          Forgot Password?
        </a>
        <div
          onClick={login}
          className="w-full p-2 cursor-pointer mt-2 rounded justify-items-center border  text-center border-black hover:bg-black hover:text-white"
        >
          Login
        </div>
        <a
          onClick={signUp}
          className="text-center text-blue-700 block text-sm mt-1  cursor-pointer"
        >
          Create account
        </a>
        <a
          onClick={() => {
            navigate("/activate");
          }}
          className="text-center text-blue-700 block text-sm mt-1  cursor-pointer"
        >
          Activate account
        </a>
      </div>
    </div>
  );
};

export default Login;
