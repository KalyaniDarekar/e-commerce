const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// @route POST /api/orders (Create order)
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    // Clear cart after order
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route GET /api/orders/myorders (User's orders)
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/orders (Admin - all orders)
router.get('/', protect, adminOnly, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// @route PUT /api/orders/:id/status (Admin - update order status)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = req.body.status;
  if (req.body.status === 'Delivered') order.deliveredAt = Date.now();
  await order.save();
  res.json(order);
});

module.exports = router;
