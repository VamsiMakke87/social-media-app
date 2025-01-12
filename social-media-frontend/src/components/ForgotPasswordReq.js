import React, { useContext, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AppContext from "../AppContext";

const ForgotPasswordReq = () => {
  const [buttonText, setButtonText] = useState("Send Reset Password Link");
  const { getReq, putReq, setErrorMsg, setSuccessMsg } = useContext(AppContext);
  const navigate = useNavigate();
  const emailRef = useRef();
  const [error, setError] = useState(null);

  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  const validateEmail = async () => {
    try {
      const email = emailRef.current.value;
      if (!email) {
        setError("Email cannot be empty");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email format");
      } else {
        setError(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendForgotPasswordLink = async () => {
    try {
      const email = emailRef.current.value;
      if (!email || error) {
        setErrorMsg("Please enter correct details");
      } else {
        setButtonText("Sending...");
        const res = await getReq(`/api/mail/sendForgotPasswordLink?email=${email}`);
        if (res.ok) {
          setSuccessMsg("Reset Password Mail Sent");
          navigate("/login");
        } else if (res.status === 404) {
          setErrorMsg("User Not Found, Please enter correct email address");
        } else if (res.status === 400) {
          setErrorMsg("Account not activated, Please activate your account");
          navigate("/activate");
        } else {
          setErrorMsg("Error occured! Please try again");
        }
        setButtonText("Send Activation Link");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-slate-100 h-screen flex items-center  justify-center">
      <div className="p-6 bg-white h-fit mt-10 border rounded shadow-xl md:w-4/12 w-10/12">
        {/* <div className="text-6xl  font-bold p-4 text-center">Forgot Password</div> */}
        <div className="mt-2">
          <div>Email:</div>
          {error && <div className="text-red-700 text-sm">{error}</div>}
          <input
            type="email"
            ref={emailRef}
            onChange={validateEmail}
            className="outline-none hover:border-black focus:border-black border border-2 border-slate-400 rounded h-10 p-2 w-full"
          />
        </div>
        <div
          onClick={sendForgotPasswordLink}
          className="w-full p-2 cursor-pointer mt-3 rounded justify-items-center border  text-center border-black hover:bg-black hover:text-white"
        >
          {buttonText}
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

export default ForgotPasswordReq;
