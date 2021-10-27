const socket = io();
const $formMessage = document.querySelector("#message-form");
const ul_messages = document.querySelector("#messages");
const $sendInput = document.querySelector("input");
// const $sendButton = document.querySelector("#btn-send");
const $sendButton = $formMessage.querySelector("button");

const $formButtonlocation = document.querySelector("#send-location");

const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar");

const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const messageTemplate = document.querySelector("#message-template").innerHTML;
const usersTemplate = document.querySelector("#sidebar-template").innerHTML;

/* socket.on("message", (data) => {
  console.log(data);
}); */

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
socket.on("roomData", ({ roomName, users }) => {
  console.log(users);
  console.log(roomName);

  const html = Mustache.render(usersTemplate, {
    users,
    roomName: roomName,
  });
  $sidebar.innerHTML = html;
});

socket.on("message", ({ message, user }, type) => {
  $sendButton.removeAttribute("disabled");
  $sendButton.style.backgroundColor = "#7C5CBF";

  $sendInput.focus();
  $sendInput.value = "";

  const html = Mustache.render(messageTemplate, {
    message: message,
    username: user.username,
    createdAt: moment(new Date(new Date().getTime())).format("hh:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
  // if (type === "sendMessage") add_child(data);
});

const autoScroll = () => {
  const $newMessage = $messages.lastElementChild;

  const newMessageStyle = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyle.marginBottom);
  const newMessageHeight = newMessageMargin + $messages.offsetHeight;

  // visibleHeight ,newMessageHeight; are fix values
  const visibleHeight = $messages.offsetHeight;

  const containerHeight = $messages.scrollHeight;

  const scrollOfsset = visibleHeight + $messages.scrollTop;
  console.log($messages.scrollTop, "$messages.scrollTop");
  if (containerHeight - newMessageHeight <= scrollOfsset)
    $messages.scrollTop = containerHeight;
  // console.log($messages.offsetHeight, "$messages.scrollHeight");
};
socket.on("messageLocation", (message) => {
  console.log(message);
  const html = Mustache.render(locationMessageTemplate, {
    url: message.url,
    username: message.username,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

const sendMessageEvent = (e) => {
  e.preventDefault();

  if (!$sendInput.value) return;

  $sendButton.setAttribute("disabled", "disabled");
  $sendButton.style.backgroundColor = "#7c5cbf94";

  socket.emit("sendMessage", $sendInput.value);
};
$formMessage.addEventListener("submit", sendMessageEvent);
$sendButton.addEventListener("click", sendMessageEvent);

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
  // $formButtonlocation.style.backgroundColor = "#ccc";

  navigator.geolocation.getCurrentPosition((position) => {
    const myLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    socket.emit("sendLocation", myLocation, (message) => {
      $formButtonlocation.removeAttribute("disabled");
      $formButtonlocation.style.backgroundColor = "#7c5cbf94";

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
