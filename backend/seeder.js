const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dns = require('dns');
dns.setServers(['8.8.8.8']);

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
const categoryImages = {
  'Mobiles': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    'https://images.unsplash.com/photo-1592890288564-76628a30a657?w=600&q=80',
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&q=80',
    'https://images.unsplash.com/photo-1556656793-062ff9878253?w=600&q=80',
    'https://images.unsplash.com/photo-1533228100845-08145b01de14?w=600&q=80',
    'https://images.unsplash.com/photo-1551817958-c115383e9c2e?w=600&q=80',
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80',
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80'
  ],
  'Laptops': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80',
    'https://images.unsplash.com/photo-1464863979621-258859e62245?w=600&q=80',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80'
  ],
  'Audio': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
    'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=600&q=80',
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&q=80',
    'https://images.unsplash.com/photo-1572536147743-399081e7428e?w=600&q=80',
    'https://images.unsplash.com/photo-1520170350707-b2da59970118?w=600&q=80'
  ],
  'Cameras': [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=600&q=80',
    'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=600&q=80',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=600&q=80',
    'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=600&q=80',
    'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?w=600&q=80',
    'https://images.unsplash.com/photo-1471341971476-3d8c119ca924?w=600&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=600&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80'
  ],
  'Tablets': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&q=80',
    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
    'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=600&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
    'https://images.unsplash.com/photo-1527698266440-12104a498b76?w=600&q=80',
    'https://images.unsplash.com/photo-1542744095-2ad4870f608e?w=600&q=80',
    'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=600&q=80',
    'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=600&q=80',
    'https://images.unsplash.com/photo-1587614382346-4ec70a388b28?w=600&q=80'
  ],
  'Accessories': [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
    'https://images.unsplash.com/photo-1541140532154-b024d715b909?w=600&q=80',
    'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=600&q=80',
    'https://images.unsplash.com/photo-1555617766-c94804975da3?w=600&q=80',
    'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600&q=80',
    'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80',
    'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&q=80',
    'https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=600&q=80',
    'https://images.unsplash.com/photo-1563770660941-20978e870e9b?w=600&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'
  ]
};

const products = [];
categories.forEach(category => {
  for (let i = 0; i < 10; i++) {
    const brand = brands[category][i % 5];
    products.push({
      name: `${brand} Premium ${category} X${i + 1}`,
      brand: brand,
      price: Math.floor(Math.random() * 50000) + 1000,
      category: category,
      description: `Experience the pinnacle of technology with this premium ${category.toLowerCase()} from ${brand}. Features incredible performance, sleek design, and advanced capabilities tailored for both professionals and everyday users.`,
      stock: Math.floor(Math.random() * 50) + 5,
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      numReviews: Math.floor(Math.random() * 1000) + 10,
      featured: i < 2,
      discount: Math.floor(Math.random() * 20),
      images: [categoryImages[category][i]]
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
