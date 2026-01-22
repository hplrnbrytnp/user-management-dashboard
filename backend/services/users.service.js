const { readUsers, writeUsers } = require('../utils/fileHandler');
const { v4: uuidv4 } = require('uuid');

async function getAllUsers() {
  return await readUsers();
}

async function getUserById(id) {
  const users = await readUsers();
  return users.find(u => u.id === id);
}

async function createUser(data) {
  const users = await readUsers();

  const newUser = {
    id: uuidv4(),
    name: data.name,
    username: data.username,
    email: data.email
  };

  users.push(newUser);
  await writeUsers(users);

  return newUser;
}

async function updateUser(id, data) {
    const users = await readUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
  
    const { id: _, ...safeData } = data;
  
    users[index] = {
      ...users[index],
      ...safeData
    };
  
    await writeUsers(users);
    return users[index];
  }
  
  async function deleteUser(id) {
    const users = await readUsers();
    const updated = users.filter(u => u.id !== id);
  
    if (updated.length === users.length) return false;
  
    await writeUsers(updated);
    return true;
  }

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
