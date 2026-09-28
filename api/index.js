const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../backend/config/db');
const authRoutes = require('../backend/routes/authRoutes');
const productRoutes = require('../backend/routes/productRoutes');
const orderRoutes = require('../backend/routes/orderRoutes');
const { notFound, errorHandler } = require('../backend/middleware/errorHandler');

dotenv.config();
connectDB();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());


app.get('/api', (req, res) => {
  res.json({
    status: 'Active',
    message: 'MERN Stack E-Commerce API is running on Vercel Serverless...',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
