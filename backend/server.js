const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Fix DNS resolution for MongoDB Atlas on Windows
dns.setServers(['8.8.8.8']);

// Connect to MongoDB
connectDB();

const app = express();

// --------------- Middleware ---------------
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://electro-store-e-commerce-app.vercel.app'
];

if (process.env.FRONTEND_URL) {
  const cleanUrl = process.env.FRONTEND_URL.replace(/\/$/, "");
  if (!allowedOrigins.includes(cleanUrl)) {
    allowedOrigins.push(cleanUrl);
  }
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------- Routes ---------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// --------------- Health Check ---------------
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// --------------- Serve Frontend ---------------
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// Catch-all: serve React app for any non-API route (supports client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// --------------- Error Handler ---------------
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`🌐 Click the link above to open ElectroStore in your browser!`);
});
