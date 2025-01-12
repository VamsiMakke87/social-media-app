import React, { useContext, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AppContext from "../AppContext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const ForgotPassword = () => {
  const { token } = useParams();
  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordType, setPasswordType] = useState("password");
  const [passwordFocus, setPasswordFocus] = useState("border-slate-400");
  const [confirmPasswordFocus, setConfirmPasswordFocus] =
    useState("border-slate-400");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const { setErrorMsg, setSuccessMsg, putReq } = useContext(AppContext);

  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

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

  const updatePassword = async () => {
    try {
      const password = passwordRef.current.value;
      const confirmPassword = confirmPasswordRef.current.value;
      if (
        Object.keys(error).length === 0 &&
        password &&
        confirmPassword &&
        password === confirmPassword
      ) {
        const res = await putReq("/api/auth/forgotPassword", {
          token: token,
          password: password,
        });

        if (res.ok) {
          setSuccessMsg("Password updated successfully");
        } else if (res.status === 404) {
          setErrorMsg("User not found, please try again");
        } else {
          setErrorMsg("Error occured! Please try again");
        }
        navigate("/login");
      } else {
        setErrorMsg("Please fill form correctly");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-slate-100 h-screen flex items-center  justify-center">
      <div className="p-6 bg-white h-fit mt-10 border rounded shadow-xl md:w-4/12 w-10/12">
        <div className="mt-1">
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
                setPasswordFocus("border-slate-400");
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
        <div className="mt-1">
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
                setConfirmPasswordFocus("border-slate-400");
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
        <div
          onClick={updatePassword}
          className="w-full p-2 cursor-pointer mt-3 rounded justify-items-center border  text-center border-black hover:bg-black hover:text-white"
        >
          Reset Password
        </div>
        <div
          onClick={() => {
            navigate("/login");
          }}
          className="text-center block text-sm mt-1  cursor-pointer"
        >
          <a className="text-blue-700">Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
