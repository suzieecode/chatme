import React, { useState, useEffect } from "react";
import "../App.css";
import { auth } from "../firebase";
import { socket } from "../socket";
import Navbar from "../components/Navbar"; // ✅ IMPORTANT

function Chat() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ===== Get logged-in user =====
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        socket.emit("register_user", user.email);
        fetchUsers(user.email);
      }
    });
  }, []);

  // ===== Listen for realtime messages =====
  useEffect(() => {
    const handleReceive = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, []);

  // ===== Fetch users =====
  const fetchUsers = async (email) => {
    const res = await fetch("http://localhost:5005/users");
    const data = await res.json();
    setUsers(data.filter((u) => u.email !== email));
  };

  // ===== Fetch old messages =====
  const fetchMessages = async (otherUser) => {
    const res = await fetch(
      `http://localhost:5005/messages?senderEmail=${currentUser.email}&receiverEmail=${otherUser.email}`
    );
    const data = await res.json();
    setMessages(data);
  };

  // ===== Send message =====
  const sendMessage = () => {
    if (!message || !selectedUser) return;

    socket.emit("send_message", {
      senderEmail: currentUser.email,
      receiverEmail: selectedUser.email,
      text: message,
    });

    setMessage("");
  };

  return (
    <>
      {/* ✅ Navbar on top */}
      <Navbar />

      {/* ✅ Push content below navbar */}
      <div className="app" style={{ marginTop: "80px" }}>
        <div className="sidebar">
          <div className="brand">💬 ChatMe</div>

          {users.map((u) => (
            <div
              key={u._id}
              className="user"
              onClick={() => {
                setSelectedUser(u);
                fetchMessages(u);
              }}
            >
              <img src={u.photo} alt="" width="48" height="48" />
              <span>{u.name}</span>
            </div>
          ))}
        </div>

        <div className="chat">
          {selectedUser ? (
            <>
              <div className="chat-header">
                Chat with {selectedUser.name}
              </div>

              <div className="messages">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`message ${
                      m.senderEmail === currentUser.email
                        ? "sent"
                        : "received"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <div className="input-area">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="chat-header">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;