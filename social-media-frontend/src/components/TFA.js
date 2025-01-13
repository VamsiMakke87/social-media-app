import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AppContext from "../AppContext";

const TFA = () => {
  const location = useLocation();
  const [token, setToken] = useState();
  const [otp, setOTP] = useState();
  const [timer, setTimer] = useState(30);
  const [resendEnable, setResendEnable] = useState(false);
  const optRef = useRef();
  const { postReq, setErrorMsg, setSuccessMsg } = useContext(AppContext);

  useEffect(() => {
    if (location.state) {
      setToken(location.state.token);
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
    let otp = "";

    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }

    return otp;
  }

  const sendOtpLink = async () => {
    
  };

  const verifyOTP = () => {};

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
        <div className="text-center block text-sm mt-1  cursor-pointer">
          {resendEnable ? (
            <a onClick={sendOtpLink} className={`text-blue-700`}>
              Resend OTP
            </a>
          ) : (
            <>
              <a className={`text-blue-700 line-through`}>
                Resend OTP
              </a>
              <a className="text-blue-700 p-1">{timer}s</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TFA;
