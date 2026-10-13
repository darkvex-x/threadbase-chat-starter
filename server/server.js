import "dotenv/config";
import http from "node:http";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Demo users
const USERS = [
  { userId: 1, name: "Ada", email: "ada@threadbase.dev", password: "password" },
  { userId: 2, name: "Linus", email: "linus@threadbase.dev", password: "password" },
];

// JWT middleware for HTTP routes
function verifyToken(req, res, next) {
  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-change-me");
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// POST /auth/login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  const found = USERS.find((u) => u.email === email && u.password === password);
  if (!found) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = jwt.sign(
    { userId: found.userId, name: found.name },
    process.env.JWT_SECRET || "dev-secret-change-me",
    { expiresIn: "1h" }
  );
  res.json({
    accessToken,
    user: { userId: found.userId, name: found.name },
  });
});

// Task 1: Create an HTTP server and attach Socket.io with its own CORS
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Task 2: Authenticate sockets with JWT middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-change-me");
    socket.data.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid or expired token"));
  }
});

// Task 3: Rooms and broadcasting
io.on("connection", (socket) => {
  console.log(`[Socket] User connected: ${socket.data.user?.name} (${socket.id})`);

  socket.on("room:join", (roomId) => {
    socket.join(roomId);
    console.log(`[Socket] ${socket.data.user?.name} joined room: ${roomId}`);
  });

  socket.on("chat:message", ({ roomId, text }) => {
    if (!text || !roomId) return;

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      text,
      user: socket.data.user,
      timestamp: new Date().toISOString(),
    };

    io.to(roomId).emit("chat:message", message);
    console.log(`[Socket] Message in ${roomId} from ${socket.data.user?.name}: ${text}`);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket] User disconnected: ${socket.data.user?.name} (${socket.id})`);
  });
});

const PORT = process.env.PORT ?? 3001;

// Task 1: replace app.listen with httpServer.listen
httpServer.listen(PORT, () => {
  console.log(`\n✅ Threadbase server running on http://localhost:${PORT}`);
});
