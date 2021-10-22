const socket = io();
const $formMessage = document.querySelector("#form");
const ul_messages = document.querySelector("#messages");
const $sendInput = document.querySelector("#input");
const $sendButton = document.querySelector("#btn-send");
const $formButtonlocation = document.querySelector("#btn-location");

const $messages_ = document.querySelector("#messages_");

const locationTemplate = document.querySelector("#location-template").innerHTML;

const messageTemplate = document.querySelector("#message-template").innerHTML;
/* socket.on("message", (data) => {
  console.log(data);
}); */

socket.on("message", (data, type) => {
  // console.log(data, "=> message");

  $sendButton.removeAttribute("disabled");
  $sendButton.style.backgroundColor = "black";
  $sendInput.focus();
  $sendInput.value = "";

  const html = Mustache.render(messageTemplate, {
    message: data,
  });
  $messages_.insertAdjacentHTML("beforeend", html);

  // if (type === "sendMessage") add_child(data);
});

socket.on("messageLocation", ({ url, createdAt }) => {
  console.log(url);

  const html = Mustache.render(locationTemplate, {
    url,
    createdAt: moment(createdAt).format("hh:mm a"),
  });
  $messages_.insertAdjacentHTML("beforeend", html);
});

$formMessage.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!$sendInput.value) return;

  $sendButton.setAttribute("disabled", "disabled");
  $sendButton.style.backgroundColor = "#ccc";

  socket.emit("sendMessage", $sendInput.value);
});

let player = true;
const add_child = (message) => {
  const node = document.createElement("LI");
  const textnode = document.createTextNode(message);
  node.appendChild(textnode);
  // player ? (node.style.textAlign = "left") : (node.style.textAlign = "right");
  // player = !player;
  ul_messages.appendChild(node);
};

const sendLocation = (ev) => {
  ev.preventDefault();
  if (!navigator.geolocation) return alert("Geolocation not supported");

  $formButtonlocation.setAttribute("disabled", "disabled");
  $formButtonlocation.style.backgroundColor = "#ccc";

  navigator.geolocation.getCurrentPosition((position) => {
    const myLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    socket.emit("sendLocation", myLocation, (message) => {
      $formButtonlocation.removeAttribute("disabled");
      $formButtonlocation.style.backgroundColor = "black";

      console.log(`location shared ${message}`);
    });
  });
};

$formButtonlocation.addEventListener("click", (e) => sendLocation(e));

/* const btn_target = document.querySelector(".btn-test");

const btn_target_handler = () => {
  socket.emit("getcount");
};

socket.on("updatecount", (count) => {
  console.log(`Count has been updated ${count}`);
});

btn_target.addEventListener("click", btn_target_handler); */
