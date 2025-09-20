import { createServer } from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";

const ROOM = "group";
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("joinRoom", async (userName) => {
    console.log(`User ${userName} joined the room`);
    await socket.join(ROOM);
    socket.to(ROOM).emit("roomNotice", userName);
  });

  socket.on("chatMessage", (msg) => {
    socket.to(ROOM).emit("chatMessage", msg);
  });

  socket.on("typing", (userName) => {
    socket.to(ROOM).emit("typing", userName);
  });

  socket.on("stopTyping", (userName) => {
    socket.to(ROOM).emit("stopTyping", userName);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
