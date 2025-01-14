import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../AppContext";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [content, setContent] = useState("profile");
  const {
    loggedInUser,
    getReq,
    postReq,
    putReqFile,
    putReq,
    loadUser,
    setErrorMsg,
    setSuccessMsg,
  } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [editUsername, setEditUsername] = useState();
  const [toggleTFAState, setToggleTFAState] = useState(false);
  const usernameRef = useRef();
  const [profilePic, setProfilePic] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      setProfilePic(loggedInUser.profilePic);
      setToggleTFAState(loggedInUser.isTfaOn);
    }
  }, [loggedInUser]);

  const profileClickHandler = () => {
    setContent("profile");
  };

  const securityClickHandler = () => {
    setContent("changePassword");
  };

  const uploadFileClick = () => {
    document.getElementById("file-upload").click();
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);

      // Generate and set image preview URL
      const filePreview = URL.createObjectURL(uploadedFile);
      setProfilePic(filePreview);
    }
  };

  const cancelPicture = () => {
    setFile(null);
    setProfilePic(loggedInUser.profilePic);
  };

  const updateProfilePic = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("userId", loggedInUser._id);
      formData.append("file", file);
      const res = await putReqFile("/api/users/profilepic", formData);
      if (res.ok) {
        setFile(null);
        setSuccessMsg("Profile Picture updated successfully");
        await loadUser(loggedInUser._id);
      }
    }
  };

  const usernameExists = async (username) => {
    try {
      const res = await getReq(`/api/auth/exists?username=${username}`);
      if (res.ok) {
        const data = await res.json();
        return data.isExists;
      } else {
        throw new Error();
      }
    } catch (err) {
      setErrorMsg("Operation Unsuccessfull, please try again");
      return false;
    }
  };

  const updateUsername = async () => {
    const newUsername = usernameRef.current.value;

    if (newUsername && newUsername.length > 2) {
      try {
        // console.log(usernameExists(newUsername));
        if (!(await usernameExists(newUsername))) {
          const res = await putReq(`/api/users/${loggedInUser._id}`, {
            userId: loggedInUser._id,
            username: newUsername,
          });

          if (res.ok) {
            setEditUsername(false);
            setSuccessMsg("Username updated successfully");
            await loadUser(loggedInUser._id);
          }
        } else {
          setErrorMsg("Username already exists");
        }
      } catch (err) {
        console.log(err);
        setErrorMsg("Operation Unsuccessfull, Please try again");
      }
    } else {
      setErrorMsg("Username must be between 3 and 20 characters long.");
    }
  };

  const toggleTFA = async () => {
    try {
      const res = await putReq("/api/users/toggleTFA", {
        userId: loggedInUser._id,
        tfa: !toggleTFAState,
      });
      if (res.ok) {
        if (toggleTFAState) {
          setSuccessMsg("TFA turned off successfully");
        } else {
          setSuccessMsg("TFA turned on successfully");
        }
        setToggleTFAState(!toggleTFAState);
      } else {
        setErrorMsg("Operation Failed! Please try again.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendResetPasswordLink = async () => {
    try {
      const res = await postReq(`/api/mail/sendForgotPasswordLink`, {
        email: loggedInUser.email,
      });
      if (res.ok) {
        setSuccessMsg("Reset Password Mail Sent");
        navigate("/logout");
      } else {
        setErrorMsg("Error occured! Please try again");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    loggedInUser && (
      <div className="flex m-10 space-x-2">
        <div className="w-4/12 md:w-3/12 h-fit bg-white shadow-md rounded p-4">
          <a
            onClick={profileClickHandler}
            className="block bg-white p-1 rounded hover:bg-slate-100 cursor-pointer"
          >
            Profile
          </a>
          <a
            onClick={securityClickHandler}
            className="block bg-white p-1 rounded hover:bg-slate-100 cursor-pointer"
          >
            Security & Privacy
          </a>
        </div>
        <div className="bg-slate-200 border h-fit rounded p-2 w-8/12">
          {content === "profile" ? (
            <div className="justify-items-center">
              <img className="rounded-full h-32 w-32 " src={profilePic} />
              <input
                type="file"
                id="file-upload"
                accept=".jpg, .jpeg, .png"
                className="hidden"
                onChange={handleFileChange}
              />
              <a
                onClick={uploadFileClick}
                className="text-sm underline cursor-pointer"
              >
                Edit&nbsp;Profile&nbsp;Picture
              </a>
              {file && (
                <div className="flex space-x-2">
                  <div
                    onClick={updateProfilePic}
                    className="cursor-pointer p-1 px-4 border border-black rounded hover:bg-black hover:text-white"
                  >
                    Save
                  </div>
                  <div
                    onClick={cancelPicture}
                    className="cursor-pointer p-1 px-4 border border-black rounded hover:bg-black hover:text-white"
                  >
                    Cancel
                  </div>
                </div>
              )}
              <div className="flex space-x-1 items-center">
                {editUsername ? (
                  <div className="justify-items-center">
                    <input
                      ref={usernameRef}
                      type="text"
                      placeholder="Enter Username"
                      className="block"
                    />

                    <a
                      onClick={updateUsername}
                      className="text-xs cursor-pointer underline"
                    >
                      Save
                    </a>
                    <a
                      onClick={() => {
                        setEditUsername(false);
                      }}
                      className="text-xs ml-1 cursor-pointer underline"
                    >
                      Cancel
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="font-bold text-xl">
                      {loggedInUser.username}{" "}
                    </div>
                    <a
                      onClick={() => {
                        setEditUsername(true);
                      }}
                      className="text-xs cursor-pointer underline"
                    >
                      (Edit)
                    </a>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="p-2">
              <div className="flex border-b border-slate-600 pr-2 pb-2">
                <div>Two-Factor Authentication</div>
                <div className="ml-auto cursor-pointer" onClick={toggleTFA}>
                  {toggleTFAState ? (
                    <ToggleOnOutlinedIcon />
                  ) : (
                    <ToggleOffOutlinedIcon />
                  )}
                </div>
              </div>
              <div className="mt-2">
                <div>
                  Click{" "}
                  <a
                    onClick={sendResetPasswordLink}
                    className="text-blue-800 cursor-pointer underline"
                  >
                    here
                  </a>{" "}
                  to send reset password link
                </div>
                <div className="text-sm">
                  You will be logged out of your account
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default Settings;
