const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let onlineUsers = 0;

io.on("connection", (socket) => {

  onlineUsers++;
  io.emit("online count", onlineUsers);

  console.log("User connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("typing", (name) => {
    socket.broadcast.emit("typing", name);
  });

  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing");
  });

  socket.on("seen all", () => {
    socket.broadcast.emit("messages seen");
  });

  socket.on("disconnect", () => {
    onlineUsers--;
    io.emit("online count", onlineUsers);
  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});