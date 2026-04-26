const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// @route GET /api/products
router.get('/', async (req, res) => {
  const { category, search, sort, minPrice, maxPrice, rating } = req.query;
  const query = {};

  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (rating) query.rating = { $gte: Number(rating) };

  let sortOption = {};
  if (sort === 'price_asc') sortOption = { price: 1 };
  else if (sort === 'price_desc') sortOption = { price: -1 };
  else if (sort === 'rating') sortOption = { rating: -1 };
  else sortOption = { createdAt: -1 };

  const products = await Product.find(query).sort(sortOption);
  res.json(products);
});

// @route GET /api/products/featured
router.get('/featured', async (req, res) => {
  const products = await Product.find({ featured: true }).limit(8);
  res.json(products);
});

// @route GET /api/products/:id
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// @route POST /api/products (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// @route PUT /api/products/:id (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// @route DELETE /api/products/:id (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

// @route POST /api/products/:id/review (User)
router.post('/:id/review', protect, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });

  product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

module.exports = router;
