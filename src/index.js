const express = require("express");
const port = process.env.PORT || 3000;
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const { generateLocation } = require("./utils/generateLocation");

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

  socket.emit("message", "Welcome!");

  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("sendMessage", (message) => {
    io.emit("message", message, "sendMessage");
  });

  socket.on("sendLocation", (data, callback) => {
    io.emit(
      "messageLocation",
      generateLocation(
        `https://google.com/maps?q=${data.latitude},${data.longitude}`
      )
    );
    callback("Ok!");
  });

  socket.on("disconnect", (socket) => {
    io.emit("message", "A user has left!");
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
