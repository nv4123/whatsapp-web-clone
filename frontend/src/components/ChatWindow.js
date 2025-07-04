import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const socket = io("http://localhost:5000");

const ChatWindow = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const chatUserId = localStorage.getItem("current_chat");
    if (!chatUserId) return;

    const users = JSON.parse(localStorage.getItem("chat_users")) || [];
    const u = users.find((x) => x._id === chatUserId);
    setChatUser(u);
    console.log("Fetching messages for:", user._id, chatUserId);

    axios
      .get(`http://localhost:5000/api/message/${user._id}/${chatUserId}`)
      .then((res) => {
        setMessages(res.data);
      });

    socket.emit("user-connected", user._id);

    socket.on("receive-message", (data) => {
      if (data.senderId === chatUserId && data.receiverId === user._id) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [user._id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    const msg = {
      senderId: user._id,
      receiverId: chatUser._id,
      message: text,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send-message", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
    setShowEmoji(false);
  };

  const handleTyping = () => {
    setTyping(true);
    setTimeout(() => setTyping(false), 1500);
  };

  if (!chatUser) {
    return <div className="chat-window">Select a user to start chatting</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img src={chatUser.avatar} alt="avatar" className="avatar" />
        <div>
          <div>{chatUser.name || chatUser.phone}</div>
          <div className="status-text">{typing ? "Typing..." : "Online"}</div>
        </div>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${
              msg.senderId === user._id ? "sent" : "received"
            }`}
          >
            {msg.message}
            <div className="tick">
              {msg.senderId === user._id && (
                <span>✅{/* Future: Double ✅, Blue ✅ */}</span>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="chat-footer">
        <button onClick={() => setShowEmoji(!showEmoji)}>😄</button>
        <input
          placeholder="Type a message"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>

        {showEmoji && (
          <div className="emoji-picker">
            <Picker
              data={data}
              onEmojiSelect={(emoji) => setText(text + emoji.native)}
              theme="light"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
