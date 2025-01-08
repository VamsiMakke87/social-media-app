import React, { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import Notification from "./Notification";

const Notifications = () => {
  const { loggedInUser, getReq, putReq } = useContext(AppContext);
  const [notifications, setNotifications] = useState();

  useEffect(() => {
    if (loggedInUser) {
      (async () => {
        await loadNotifications();
      })();
    }
  }, [loggedInUser]);

  const loadNotifications = async () => {
    const res = await getReq(
      `http://localhost:8800/api/users/notifications/${loggedInUser._id}`
    );

    if (res.ok) {
      const jsonData = await res.json();
      setNotifications(jsonData);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen overflow-auto justify-items-center">
      {notifications ? (
        notifications.map((notification) => (
          <Notification notification={notification} key={notification._id} />
        ))
      ) : (
        <div>Loading....</div>
      )}
    </div>
  );
};

export default Notifications;
