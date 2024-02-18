const users = [];
const addUsers = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!name || !room) {
    return { error: "name and Room is Required" };
  }

  if (users.length) {
    const existinguser = users.find(
      (value) => value.name === name && value.room === room
    );
    if (existinguser) {
      return { error: "User already exist" };
    }
  }
  const user = { id, name, room };
  users.push(user);
  return { user };
};

const removeuser = (id) => {
  const findinx = users.findIndex((value) => value.id == id);
  if (findinx >= 0) {
    return users.splice(findinx, 1)[0];
  }
};
const getuser = (id) => {
  return users.find((value) => value.id == id);
};
const getuserinRoom = (room) => {
  return users.filter((value) => value.room == room);
};
module.exports = {
  addUsers,
  removeuser,
  getuser,
  getuserinRoom,
};
