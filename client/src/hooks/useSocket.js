import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../auth/AuthContext.jsx";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

export default function useSocket(roomId) {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    // Task 4: create the socket with the token in auth
    const socket = io(SOCKET_URL, {
      auth: { token },
    });
    socketRef.current = socket;

    // Emit room:join
    socket.emit("room:join", roomId);

    // Listen for chat:message (appending to messages state)
    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("chat:message", handleMessage);

    // Cleanup: socket.off("chat:message", handler) and socket.disconnect()
    return () => {
      socket.off("chat:message", handleMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, roomId]);

  // Return { messages, sendMessage } where sendMessage emits chat:message
  const sendMessage = useCallback(
    (text) => {
      if (socketRef.current) {
        socketRef.current.emit("chat:message", { roomId, text });
      }
    },
    [roomId]
  );

  return { messages, sendMessage };
}
