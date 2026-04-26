const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// @route GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const orders = await Order.find();
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);

  res.json({ totalUsers, totalProducts, totalOrders, totalRevenue });
});

// @route GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @route PUT /api/admin/users/:id/role
router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = req.body.role;
  await user.save();
  res.json({ message: 'User role updated', user });
});

module.exports = router;
