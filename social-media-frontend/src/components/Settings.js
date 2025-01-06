import React, { useContext, useState } from "react";
import AppContext from "../AppContext";

const Settings = () => {
  const [content, setContent] = useState("profile");
  const { loggedInUser, putReqFile, loadUser } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [profilePic, setProfilePic] = useState(loggedInUser.profilePic);

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
      const res = await putReqFile("http://localhost:8800/api/users/profilepic",
      formData);
      if(res.ok){
        setFile(null);
        await loadUser(loggedInUser._id);
      }
    }
  };

  return (
    <div className="flex m-10 space-x-2">
      <div className="w-4/12 md:w-3/12 bg-white shadow-md rounded p-4">
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
      <div className="bg-slate-200 border rounded p-2 w-8/12">
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
              Change Profile Picture
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
          </div>
        ) : (
          <>Change Password</>
        )}
      </div>
    </div>
  );
};

export default Settings;
