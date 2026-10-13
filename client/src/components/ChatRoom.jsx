import { useState } from "react";
import useSocket from "../hooks/useSocket.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function ChatRoom({ roomId = "general" }) {
  const { messages, sendMessage } = useSocket(roomId);
  const { user } = useAuth();
  const [text, setText] = useState("");

  function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  }

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h3>Live Thread Chat</h3>
        <span className="room-badge">Room: {roomId}</span>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet. Say hello!</p>
        ) : (
          messages.map((m) => {
            const isMine = m.user?.userId === user?.userId;
            return (
              <div key={m.id} className={`message ${isMine ? "mine" : "theirs"}`}>
                <div className="message-header">
                  <span className="author">{m.user?.name || "Anonymous"}</span>
                  <span className="time">
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="message-text">{m.text}</p>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className="chat-input-form">
        <input
          id="chat-message-input"
          type="text"
          placeholder={user ? "Type a message..." : "Log in to chat"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!user}
        />
        <button id="chat-send-btn" type="submit" disabled={!user || !text.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
