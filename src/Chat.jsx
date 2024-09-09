import React, { useEffect, useState } from "react";
import socket from "./socket";  // Ensure the correct path to your socket.js file

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [channelName, setChannelName] = useState("lobby");

  useEffect(() => {
    // Join the channel
    let channel = socket.channel(`testing_channel:${channelName}`, {});

    channel.join()
      .receive("ok", response => {
        console.log("Joined successfully", response);
      })
      .receive("error", response => {
        console.log("Unable to join", response);
      });

    // Handle incoming messages
    channel.on("new_msg", payload => {
      setMessages(messages => [...messages, payload.message]);
    });

    // Cleanup on component unmount
    return () => {
      channel.leave();
    };
  }, [channelName]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      let channel = socket.channels.find(ch => ch.topic === `testing_channel:${channelName}`);
      channel.push("new_msg", { message });
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default Enter key behavior (e.g., form submission)
      sendMessage(); // Trigger the sendMessage function
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: "red" }}>
      <div>Channel: <b>{channelName}</b></div>
      <div style={{ flex: 1, overflowY: "auto", background: "blue" }}>
        {messages.reverse().map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div >
  );
};

export default ChatComponent;
