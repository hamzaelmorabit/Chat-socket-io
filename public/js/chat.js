const socket = io();

const btn_target = document.querySelector(".btn-test");
const pargraph = document.querySelector("p");

const btn_target_handler = () => {
  socket.emit("getcount");
};

socket.on("updatecount", (count) => {
  console.log(`Count has been updated ${count}`);
});

btn_target.addEventListener("click", btn_target_handler);
