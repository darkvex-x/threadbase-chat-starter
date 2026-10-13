import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

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

const PORT = process.env.PORT ?? 3001;

// Starter uses app.listen
app.listen(PORT, () => {
  console.log(`\n✅ Threadbase server running on http://localhost:${PORT}`);
});
