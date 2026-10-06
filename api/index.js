const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../backend/config/db');
const authRoutes = require('../backend/routes/authRoutes');
const productRoutes = require('../backend/routes/productRoutes');
const orderRoutes = require('../backend/routes/orderRoutes');
const { notFound, errorHandler } = require('../backend/middleware/errorHandler');

dotenv.config({ path: '../backend/.env' });

let isConnected = false;
const ensureDB = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('MongoDB serverless connection error:', err.message);
    }
  }
};

const app = express();
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  await ensureDB();
  next();
});

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
