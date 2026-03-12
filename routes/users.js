var express = require('express');
var router = express.Router();

const User = require('../schemas/users');
const Role = require('../schemas/roles');

// ===== USER ENDPOINTS =====

// Create User
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Users (non-deleted)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).populate('role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get User by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Soft Delete User
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enable User
router.post('/users/enable', async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOne({ email, username, isDeleted: false });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = true;
    await user.save();
    res.json({ message: 'User enabled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Disable User
router.post('/users/disable', async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOne({ email, username, isDeleted: false });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = false;
    await user.save();
    res.json({ message: 'User disabled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== ROLE ENDPOINTS =====

// Create Role
router.post('/roles', async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Roles (non-deleted)
router.get('/roles', async (req, res) => {
  try {
    const roles = await Role.find({ isDeleted: false });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Role by ID
router.get('/roles/:id', async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Soft Delete Role
router.put('/roles/:id', async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Users by Role ID
router.get('/roles/:id/users', async (req, res) => {
  try {
    const users = await User.find({ 
      role: req.params.id, 
      isDeleted: false 
    }).populate('role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
