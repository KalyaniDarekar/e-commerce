const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const User = require('./models/User');

const categories = ['Mobiles', 'Laptops', 'Accessories', 'Tablets', 'Audio', 'Cameras'];
const brands = {
  'Mobiles': ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'],
  'Laptops': ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus'],
  'Accessories': ['Logitech', 'Anker', 'Belkin', 'Spigen', 'Razer'],
  'Tablets': ['Apple', 'Samsung', 'Lenovo', 'Microsoft', 'Amazon'],
  'Audio': ['Sony', 'Bose', 'Sennheiser', 'Apple', 'JBL'],
  'Cameras': ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic']
};
const baseImages = {
  'Mobiles': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
  'Laptops': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1572569433602-66b40264440b?w=600&q=80',
  'Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
  'Audio': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80',
  'Cameras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80'
};

const products = [];
categories.forEach(category => {
  for (let i = 1; i <= 10; i++) {
    const brand = brands[category][i % 5];
    products.push({
      name: `${brand} Premium ${category} X${i}`,
      brand: brand,
      price: Math.floor(Math.random() * 50000) + 1000,
      category: category,
      description: `Experience the pinnacle of technology with this premium ${category.toLowerCase()} from ${brand}. Features incredible performance, sleek design, and advanced capabilities tailored for both professionals and everyday users.`,
      stock: Math.floor(Math.random() * 50) + 5,
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      numReviews: Math.floor(Math.random() * 1000) + 10,
      featured: i <= 2, // First two of each category are featured
      discount: Math.floor(Math.random() * 20),
      images: [baseImages[category]]
    });
  }
});

const adminUser = {
  name: 'Admin User',
  email: 'admin@electrostore.com',
  password: 'admin123',
  role: 'admin',
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany({ role: 'admin' });

    // Seed admin
    await User.create(adminUser);
    console.log('Admin user created: admin@electrostore.com / admin123');

    // Seed products
    await Product.insertMany(products);
    console.log(`${products.length} products seeded`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
