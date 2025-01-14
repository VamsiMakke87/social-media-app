import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppContext from "../AppContext";

const TFA = () => {
  const location = useLocation();
  const [token, setToken] = useState();
  const [otp, setOTP] = useState();
  const [timer, setTimer] = useState(0);
  const [resendEnable, setResendEnable] = useState(true);
  const optRef = useRef();
  const navigate = useNavigate();
  const { postReq, setErrorMsg, setSuccessMsg, loadApp } =
    useContext(AppContext);

  if (localStorage.getItem("token")) {
    navigate("/");
  }

  useEffect(() => {
    if (location.state) {
      setToken(location.state.token);
      setSuccessMsg("Please click resend OTP to request for an OTP");
    }
  }, []);

  useEffect(() => {
    const lastSentTime = localStorage.getItem("otpLastSentTime");
    if (lastSentTime) {
      const elapsedTime = Math.floor((Date.now() - lastSentTime) / 1000);
      if (elapsedTime < 30) {
        setTimer(30 - elapsedTime);
        setResendEnable(false);
      } else {
        setResendEnable(true);
      }
    } else {
      setResendEnable(true);
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setResendEnable(true);
    }
  }, [timer]);

  function generateOTP(length = 6) {
    const digits = "0123456789";
    let oneTimePassword = "";

    for (let i = 0; i < length; i++) {
      oneTimePassword += digits[Math.floor(Math.random() * digits.length)];
    }

    setOTP(oneTimePassword);
    return oneTimePassword;
  }

  const sendOtpLink = async () => {
    try {
      if (!setResendEnable) return;
      const genOtp = generateOTP();
      localStorage.setItem("otpLastSentTime", Date.now());
      setTimer(30);
      setResendEnable(false);

      const res = await postReq("/api/mail/sendOTP", {
        email: location.state.email,
        otp: genOtp,
      });
      if (res.ok) {
        setSuccessMsg("OTP Sent");
      } else {
        setErrorMsg("Error occured! Please try again");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const verifyOTP = async () => {
    try {
      const otpVal = optRef.current.value;
      if (otpVal && otp === otpVal) {
        localStorage.removeItem("otpLastSentTime");
        localStorage.setItem("token", token);
        setSuccessMsg("Login Successfull");
        await loadApp(token);
        navigate("/");
      } else {
        setErrorMsg("Invalid OTP");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-slate-100 h-screen flex items-center  justify-center">
      <div className="p-6 bg-white h-fit mt-10 border rounded shadow-xl md:w-4/12 w-10/12">
        <div className="mt-2">
          <div>Enter OTP:</div>
          <input
            type="number"
            ref={optRef}
            className="outline-none hover:border-black focus:border-black border border-2 border-slate-400 rounded h-10 p-2 w-full"
          />
        </div>
        <div
          onClick={verifyOTP}
          className="w-full p-2 cursor-pointer mt-3 rounded justify-items-center border  text-center border-black hover:bg-black hover:text-white"
        >
          Verify
        </div>
        <div className="text-center block text-sm mt-1">
          {resendEnable ? (
            <a onClick={sendOtpLink} className={`text-blue-700 cursor-pointer`}>
              Resend OTP
            </a>
          ) : (
            <a>Resend OTP {timer}s</a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TFA;
