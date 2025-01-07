import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:8800");

const Demo = () => {
  const [message, setMessage] = useState(""); // Ensure default state is a string
  const msgRef = useRef();

  useEffect(() => {
    // Listen for messages from the server
    socket.on("recieve_msg", (data) => {
      setMessage(data);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("recieve_msg"); // Remove the listener
    };
  }, []);

  const sendMsg = () => {
    const msg = msgRef.current.value;
    if (msg) {
      // Send the message to the server
      socket.emit("send_msg", msg);
      msgRef.current.value = ""; // Clear input field
    }
  };

  return (
    <div className="mt-40">
      <input ref={msgRef} type="text" placeholder="Enter your message" />
      <button onClick={sendMsg}>Submit</button>
      <div>
        <strong>Server Response:</strong> {message}
      </div>
    </div>
  );
};

export default Demo;
