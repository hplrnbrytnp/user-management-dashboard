const service = require('../services/users.service');

exports.getUsers = async (_, res) => {
  res.json(await service.getAllUsers());
};

exports.getUser = async (req, res) => {
  const user = await service.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};