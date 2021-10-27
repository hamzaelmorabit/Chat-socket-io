const express = require("express");
const port = process.env.PORT || 3000;
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const { generateLocation } = require("./utils/generateLocation");

const { addUser, removeUser, getUser, getUsersRoom } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirecotryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirecotryPath)); //url localhos:3000/about.html

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../public//about.html"));
});

let count = 0;
io.on("connection", (socket) => {
  console.log("now in connection with web socket");

  // socket.emit("message", "Welcome!");

  // socket.broadcast.emit("message", "A new user has joined!");

  socket.on("join", ({ room, username }, callback) => {
    const { error, user } = addUser({ id: socket.id, room, username });

    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      roomName: user.room,
      users: getUsersRoom(user.room),
    });
    // let users = getUsersRoom(user.room).map((el) =>
    //   el.id !== user.id ? { ...user, username: "me" } : el
    // );

    // socket.emit("roomData", {
    //   roomName: user.room,
    //   users,
    // });

    socket.emit("message", {
      user: { username: "Admin" },
      message: `Welcome ${username}`,
    });

    // console.log(getUser(socket.id));
    socket.broadcast.to(user.room).emit("message", {
      user,
      message: `${username} has joined the our room "${room}"`,
    });

    callback();
    // console.log(message.room);
    // console.log(message);
  });

  socket.on("sendMessage", (message) => {
    console.log(socket.io);
    const user = getUser(socket.id);
    console.log(getUser(socket.id));
    const props = { user, message };
    console.log(props);
    if (user)
      return io.to(user.room).emit("message", { user, message }, "sendMessage");
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    if (!user) return callback(user);
    io.to(user.room).emit(
      "messageLocation",
      generateLocation(
        user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );

    // io.to(user.room).emit(
    //   "messageLocation",

    //   generateLocation(
    //     user.username,
    //     `https://google.com/maps?q=${data.latitude},${data.longitude}`
    //   )
    // );
    callback("Ok!");
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log(user, "left");
    if (user) {
      console.log(user, "left");

      io.to(user.room).emit("message", {
        user,
        message: `${user.username} has left`,
      });
      // let users = getUsersRoom(user.room).map((el) =>
      //   el.id === user.id ? { ...user, username: "me" } : el
      // );

      // socket.to(user.room).emit("roomData", {
      //   roomName: user.room,
      //   users,
      // });
      io.to(user.room).emit("roomData", {
        roomName: user.room,
        users: getUsersRoom(user.room),
      });
      return;
    }
  });

  /*   socket.emit("message", "Welcome"); */

  /*  socket.on("getcount", () => {
    count++;
    io.emit("updatecount", count); //socket.on   sending for one user   socket.on("getcount", () => {
    // console.log("New web socket io" + count);
  }); */
});

server.listen(port, () => {
  console.log(`server is up in port ${port}`);
});
