const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const sampleProducts = [
  {
    name: 'Aura Studio Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    brand: 'Aura',
    category: 'Electronics',
    description: 'Immersive noise cancelling spatial sound audio with ultra lightweight ergonomic leather cushions and 40-hour battery life.',
    rating: 4.9,
    numReviews: 24,
    price: 249.99,
    countInStock: 15,
    featured: true,
  },
  {
    name: 'Luminary Ultra Smart Watch Series X',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    brand: 'Luminary',
    category: 'Electronics',
    description: 'AMOLED Retina curved display, real-time heart rate, blood oxygen monitor, GPS tracking, and titanium casing.',
    rating: 4.8,
    numReviews: 18,
    price: 329.00,
    countInStock: 8,
    featured: true,
  },
  {
    name: 'Minimalist Artisan Leather Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    brand: 'Vogue Craft',
    category: 'Fashion',
    description: 'Handcrafted full-grain Italian leather roll-top backpack featuring laptop compartment and weather resistance.',
    rating: 4.7,
    numReviews: 12,
    price: 189.50,
    countInStock: 20,
    featured: true,
  },
  {
    name: 'ProShot 4K Cinema Lens Vlog Camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    brand: 'OpticPro',
    category: 'Electronics',
    description: 'Compact mirrorless 4K camera with interchangeable optical lenses, flip-out touchscreen, and studio mic bundle.',
    rating: 4.9,
    numReviews: 31,
    price: 899.00,
    countInStock: 5,
    featured: true,
  },
  {
    name: 'Urban Streetwear Oversized Hoodie',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    brand: 'Vogue Craft',
    category: 'Fashion',
    description: 'Heavyweight organic cotton fleece blend with drop shoulders, kangaroo pocket, and premium embroidered logo.',
    rating: 4.6,
    numReviews: 45,
    price: 75.00,
    countInStock: 30,
    featured: false,
  },
  {
    name: 'Nordic Wood Ceramic Coffee Maker Set',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebe02f2a6e8?auto=format&fit=crop&w=800&q=80',
    brand: 'HomeHaven',
    category: 'Home & Living',
    description: 'Pour-over precision coffee dripper set crafted with matte white ceramic and natural oak wood stand.',
    rating: 4.8,
    numReviews: 15,
    price: 64.99,
    countInStock: 22,
    featured: false,
  },
  {
    name: 'Mechanical RGB Mechanical Gaming Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    brand: 'Aura',
    category: 'Electronics',
    description: 'Tactile hot-swappable mechanical switches, custom PBT keycaps, per-key RGB backlighting, and aluminum chassis.',
    rating: 4.7,
    numReviews: 29,
    price: 139.99,
    countInStock: 12,
    featured: false,
  },
  {
    name: 'Modern Ergonomic Office Chair',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=800&q=80',
    brand: 'HomeHaven',
    category: 'Home & Living',
    description: 'Breathable 3D mesh lumbar support ergonomic desk chair with 4D adjustable armrests and smooth recline.',
    rating: 4.9,
    numReviews: 40,
    price: 299.00,
    countInStock: 7,
    featured: false,
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_db');
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Cleared old database collections.');

    // Seed Admin and Demo User
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpassword123',
      isAdmin: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });

    const demoUser = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'userpassword123',
      isAdmin: false,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });

    console.log('Created Users:');
    console.log('  Admin Account: admin@example.com / adminpassword123');
    console.log('  Customer Account: user@example.com / userpassword123');

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${createdProducts.length} products!`);

    // Create a demo order
    await Order.create({
      user: demoUser._id,
      orderItems: [
        {
          name: createdProducts[0].name,
          qty: 1,
          image: createdProducts[0].image,
          price: createdProducts[0].price,
          product: createdProducts[0]._id,
        },
      ],
      shippingAddress: {
        address: '123 Tech Street',
        city: 'Silicon City',
        postalCode: '10001',
        country: 'United States',
      },
      paymentMethod: 'Credit Card / UPI',
      taxPrice: 25.0,
      shippingPrice: 0.0,
      totalPrice: createdProducts[0].price + 25.0,
      isPaid: true,
      paidAt: Date.now(),
      status: 'Shipped',
    });

    console.log('Created demo order.');
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
