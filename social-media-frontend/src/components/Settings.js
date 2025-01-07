import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../AppContext";

const Settings = () => {
  const [content, setContent] = useState("profile");
  const { loggedInUser, putReqFile, putReq, loadUser } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [editUsername, setEditUsername] = useState();
  const usernameRef = useRef();
  const [profilePic, setProfilePic] = useState();

  useEffect(() => {
    if (loggedInUser) {
      setProfilePic(loggedInUser.profilePic);
    }
  }, [loggedInUser]);

  const profileClickHandler = () => {
    setContent("profile");
  };

  const changePasswordClickHandler = () => {
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
      const res = await putReqFile(
        "http://localhost:8800/api/users/profilepic",
        formData
      );
      if (res.ok) {
        setFile(null);
        await loadUser(loggedInUser._id);
      }
    }
  };

  const updateUsername = async () => {
    const newUsername = usernameRef.current.value;

    if (newUsername) {
      try {
        const res = await putReq(
          `http://localhost:8800/api/users/${loggedInUser._id}`,
          {
            userId: loggedInUser._id,
            username: newUsername,
          }
        );

        if (res.ok) {
          setEditUsername(false);
          await loadUser(loggedInUser._id);
        }
      } catch (err) {
        console.log(err);
      }
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
            onClick={changePasswordClickHandler}
            className="block bg-white p-1 rounded hover:bg-slate-100 cursor-pointer"
          >
            Change Password
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
            <>Change Password</>
          )}
        </div>
      </div>
    )
  );
};

export default Settings;
