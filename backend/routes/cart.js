const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

// @route GET /api/cart
router.get('/', protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  res.json(cart || { items: [] });
});

// @route POST /api/cart (Add item)
router.post('/', protect, async (req, res) => {
  const { product, name, image, price, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex((i) => i.product.toString() === product);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity || 1;
  } else {
    cart.items.push({ product, name, image, price, quantity: quantity || 1 });
  }

  await cart.save();
  res.json(cart);
});

// @route PUT /api/cart/:productId (Update quantity)
router.put('/:productId', protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) return res.status(404).json({ message: 'Item not found in cart' });

  item.quantity = req.body.quantity;
  if (item.quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  }

  await cart.save();
  res.json(cart);
});

// @route DELETE /api/cart/:productId
router.delete('/:productId', protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
});

// @route DELETE /api/cart (Clear cart)
router.delete('/', protect, async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
