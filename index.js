const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const { addUsers, removeuser, getuser, getuserinRoom } = require("./entity");

const app = express();
const server = http.createServer(app);

//end point

app.get("/", function (req, res) {
  res.send("Hello healtether ");
});
app.use(cors());

const io = socketio(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
//socket

io.on("connect", (socket) => {
  console.log("user connected");

  socket.on("join", ({ name, room }, callBack) => {
    console.log(name, room);
    const { user, error } = addUsers({ id: socket.id, name: name, room: room });
    console.log(user);
    if (error) {
      callBack(error);
      return;
    }
    socket.join(user.room);
    socket.emit("message", { user: "admin", text: `welcome ${user.name} ` });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined` });
    io.to(user.room).emit("activeUsers", getuserinRoom(user.room));
  });

  socket.on("sendmsg", (message, callBack) => {
    const user = getuser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: user.name,
        text: message,
      });
    }
    callBack();
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
    const user = removeuser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left`,
      });
      io.to(user.room).emit("activeUsers", getuserinRoom(user.room));
    }
  });
});

// run server

server.listen(8000, () => console.log("server started on 8000"));
