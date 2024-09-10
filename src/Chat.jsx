import React, { useEffect, useState } from "react";
import socket from "./socket";  // Ensure the correct path to your socket.js file
import MessageBubble from "./MessageBubble";
import './css/theme.css';  // Import the theme.css file


const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newChannel, setNewChannel] = useState("");
  const [channelName, setChannelName] = useState("lobby");
  const [channel, setChannel] = useState(null);

  useEffect(() => {

    if (channel) {
      channel.leave();
    }

    // Join the channel
    const newChannel = socket.channel(`testing_channel:${channelName}`, {});

    newChannel.join()
      .receive("ok", response => {
        console.log("Joined successfully", response);
      })
      .receive("error", response => {
        console.log("Unable to join", response);
      });

    newChannel.on("new_msg", payload => {
      setMessages(messages => [...messages, payload.message]);
    });

    setChannel(newChannel);

    // Cleanup on component unmount
    return () => {
      if (channel) {
        channel.leave();
      }
    };
  }, [channelName]);

  const sendMessage = () => {
    if (message.trim() !== "" && channel) {
      channel.push("new_msg", { message });
      setMessage("");
    }
  };

  const handleChannelChange = () => {
    if (newChannel.trim() !== "") {
      setChannelName(newChannel.trim());
      setNewChannel("");  // Clear the input field
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default Enter key behavior (e.g., form submission)
      sendMessage(); // Trigger the sendMessage function
    }
  };

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", background: "#2E3532" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <p>Connected to channel:</p>
        <b>{channelName}</b>
        <input
          type="text"
          value={newChannel}
          onChange={(e) => setNewChannel(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a new channel..."
          style={{ marginRight: "1rem" }}
        />
        <button style={{ height: "2rem" }} onClick={handleChannelChange}>Set channel</button>
      </div>
      <div style={{ maxHeight: "30dvh", flex: 1, overflowY: "hidden", background: "white" }}>
        {messages.slice().reverse().map((msg, index) => (
          <MessageBubble key={index} message={msg} isSentByUser={""}>{msg}</MessageBubble>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{ marginRight: "1rem" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );

};

export default ChatComponent;
