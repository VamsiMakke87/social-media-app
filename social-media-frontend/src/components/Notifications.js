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
      `/api/users/notifications/${loggedInUser._id}`
    );

    if (res.ok) {
      const jsonData = await res.json();
      setNotifications(jsonData);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen overflow-auto justify-items-center">
      {notifications ? (
        notifications.length > 0 ? (
          notifications.map((notification) => (
            <Notification notification={notification} key={notification._id} />
          ))
        ) : (
          <div>No new notifications</div>
        )
      ) : (
        <div>Loading....</div>
      )}
    </div>
  );
};

export default Notifications;
