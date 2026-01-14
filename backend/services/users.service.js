const { readUsers, writeUsers } = require('../utils/fileHandler');

async function getAllUsers() {
  return await readUsers();
}

async function getUserById(id) {
  const users = await readUsers();
  return users.find(u => u.id === id);
}

async function createUser(user) {
  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
  return user;
}

async function updateUser(id, data) {
  const users = await readUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...data };
  await writeUsers(users);
  return users[index];
}

async function deleteUser(id) {
  const users = await readUsers();
  const filtered = users.filter(u => u.id !== id);
  await writeUsers(filtered);
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
