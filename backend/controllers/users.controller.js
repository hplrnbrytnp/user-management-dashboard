const service = require('../services/users.service');

exports.getUsers = async (req, res) => {
  const users = await service.getAllUsers();
  res.json(users);
};

exports.getUser = async (req, res) => {
  const user = await service.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};

exports.createUser = async (req, res) => {
  const { name, username, email } = req.body;

  if (!name || !username || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await service.createUser({ name, username, email });
  res.status(201).json(user);
};

exports.updateUser = async (req, res) => {
  const user = await service.updateUser(req.params.id, req.body);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const deleted = await service.deleteUser(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(204).end();
};