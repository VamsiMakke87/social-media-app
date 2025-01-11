import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../AppContext";

const Activate = () => {
  const { token } = useParams();
  const { getReq, putReq, setErrorMsg, setSuccessMsg } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (token) {
        const res = await putReq("/api/auth/activate", { token: token });
        if (res.ok) {
          setSuccessMsg("Account activated successfully");
        } else if (res.status === 404) {
          setErrorMsg("Email Not Found");
        } else if (res.status === 400) {
          const data = await res.json();
          setErrorMsg(data.message);
        } else {
        //   console.log(res);
          setErrorMsg("Error occured! Please try again");
        }
        navigate("/login");
      }
    })();
  }, [token]);

  return <div>Activate</div>;
};

export default Activate;
