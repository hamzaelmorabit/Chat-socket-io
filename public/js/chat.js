const socket = io();

/* socket.on("message", (data) => {
  console.log(data);
}); */

socket.on("defuse_message", (data) => {
  add_child(data);
});

const btn_send = document.querySelector("#form");
const ul_messages = document.getElementById("messages");
const input_send = document.querySelector("#input");

btn_send.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!input_send.value) return;

  socket.emit("sendMessage", input_send.value);
});

let player = true;
const add_child = (message) => {
  const node = document.createElement("LI");
  const textnode = document.createTextNode(message);
  node.appendChild(textnode);
  player ? (node.style.textAlign = "left") : (node.style.textAlign = "right");
  player = !player;
  ul_messages.appendChild(node);
  input_send.value = "";
};
/* const btn_target = document.querySelector(".btn-test");

const btn_target_handler = () => {
  socket.emit("getcount");
};

socket.on("updatecount", (count) => {
  console.log(`Count has been updated ${count}`);
});

btn_target.addEventListener("click", btn_target_handler); */
