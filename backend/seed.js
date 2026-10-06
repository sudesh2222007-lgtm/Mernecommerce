const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const sampleProducts = [
  {
    name: 'Voyage Travel Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Accessories',
    description: 'Durable water-resistant canvas and full-grain leather laptop backpack designed for daily travel and commutes.',
    rating: 4.2,
    numReviews: 19,
    price: 24.99,
    countInStock: 15,
    featured: true,
  },
  {
    name: 'Horizon Polarized Sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Accessories',
    description: 'Classic matte black frame with UV400 polarized anti-glare lenses.',
    rating: 4.5,
    numReviews: 8,
    price: 34.50,
    countInStock: 25,
    featured: true,
  },
  {
    name: 'Frame Mirrorless Camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Electronics',
    description: 'Full-frame mirrorless digital camera with 4K video capabilities and 24.2MP sensor.',
    rating: 4.8,
    numReviews: 41,
    price: 549.00,
    countInStock: 8,
    featured: true,
  },
  {
    name: 'Boom Portable Speaker',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Electronics',
    description: 'IPX7 waterproof portable Bluetooth speaker with deep bass acoustic sound.',
    rating: 4.4,
    numReviews: 22,
    price: 79.99,
    countInStock: 30,
    featured: false,
  },
  {
    name: 'Fold Leather Wallet',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Accessories',
    description: 'Genuine slim bifold leather wallet with RFID blocking layer.',
    rating: 4.3,
    numReviews: 15,
    price: 29.99,
    countInStock: 20,
    featured: false,
  },
  {
    name: 'Noise Canceling Studio Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Electronics',
    description: 'Active noise-canceling wireless over-ear headphones with 30-hour battery power.',
    rating: 4.9,
    numReviews: 34,
    price: 199.99,
    countInStock: 12,
    featured: true,
  },
  {
    name: 'Nike Flyknit Speed Running Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    brand: 'Nike',
    category: 'Footwear',
    description: 'Lightweight breathable knitted mesh running shoes with responsive cushioning.',
    rating: 4.7,
    numReviews: 28,
    price: 129.99,
    countInStock: 18,
    featured: true,
  },
  {
    name: 'Minimalist White Smartwatch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Electronics',
    description: 'Sleek white silicone smart wrist watch with heart rate and activity tracking.',
    rating: 4.6,
    numReviews: 17,
    price: 149.00,
    countInStock: 14,
    featured: false,
  },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_db');

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdAdmin = await User.create({
      name: 'Bhagya Admin',
      email: 'admin@example.com',
      password: 'adminpassword123',
      isAdmin: true,
    });

    await User.create({
      name: 'Bhagya User',
      email: 'customer@example.com',
      password: 'customerpassword123',
      isAdmin: false,
    });

    const sampleProductsWithAdmin = sampleProducts.map((p) => ({
      ...p,
      user: createdAdmin._id,
    }));

    await Product.insertMany(sampleProductsWithAdmin);

    console.log('✅ Data Seeded into MongoDB Compass with Norra products!');
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
