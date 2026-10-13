# Threadbase — Live Chat with Socket.io (Starter)

The starter has an Express app with verifyToken and JWT login, and a React app with a ChatRoom component that is already wired to a useSocket hook. But socket.io and socket.io-client are not installed, the server has no socket setup, and useSocket is a placeholder. Your job is to make the chat live.

## Run both halves

```bash
# Terminal 1 - the Express + Socket.io server
cd server
cp .env.example .env
npm install
npm start

# Terminal 2 - the React app
cd client
cp .env.development.example .env.development
npm install
npm run dev
```

## Demo accounts
- `ada@threadbase.dev` / `password`
- `linus@threadbase.dev` / `password`

## Tasks
1. **Wrap the server and configure CORS (`server/server.js`)**: Install `socket.io`, create HTTP server with `createServer(app)`, attach Socket.io `new Server(httpServer, { cors: { origin: "http://localhost:5173", credentials: true } })`, use `httpServer.listen(...)`.
2. **Authenticate sockets with JWT (`server/server.js`)**: `io.use` middleware reading `socket.handshake.auth.token`, verify with `jwt.verify`, store decoded payload on `socket.data.user`.
3. **Rooms and broadcasting (`server/server.js`)**: `room:join` and `chat:message` handlers broadcasting to room with `io.to(roomId).emit("chat:message", message)`.
4. **The useSocket hook (`client/src/hooks/useSocket.js`)**: Install `socket.io-client`, connect with token in `auth`, emit `room:join`, listen for `chat:message`, clean up with `socket.off` and `socket.disconnect()`.
