const users = [];

const removeUser = (id) => {
  const indexUserDeleted = users.findIndex((user) => user.id === id);

  if (indexUserDeleted === -1) {
    return {
      error: "User not exist",
    };
  }
  return users.splice(indexUserDeleted, 1)[0];
};

const addUser = ({ id, room, username }) => {
  room = room.trim().toLowerCase();
  username = username.trim().toLowerCase();

  if (!room || !username) {
    return {
      error: "The username and room are required",
    };
  }
  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );
  if (existingUser) {
    return {
      error: "It already exist",
    };
  }
  const user = { id, room, username };
  users.push(user);
  return { user };
};
/* 
addUser({
  id: 21,
  username: "hamza",
  room: "room1  ",
});
addUser({
  id: 221,
  username: "hamza",
  room: "room12  ",
});
addUser({
  id: 213,
  username: "hamza2",
  room: "room1  ",
});
addUser({
  id: 2,
  username: "2",
  room: "my  ",
});
console.log(users);
const user2 = removeUser(2);
console.log(users);
console.log("\n");
*/
const getUser = (id) => users.find((user) => user.id === id);
// console.log(getUser(1));
// console.log("\n");

const getUsersRoom = (room) => users.filter((user) => user.room === room);
// console.log(getUsersRoom("room1"));
// console.log(users);

module.exports = { getUsersRoom, getUser, removeUser, addUser };
