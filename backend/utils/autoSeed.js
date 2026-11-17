const User = require("../models/User");
const Product = require("../models/Product");

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "123456",
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "123456",
    isAdmin: false,
  },
  {
    name: "Priya Sharma",
    email: "seller1@example.com",
    password: "123456",
    isSeller: true,
    storeName: "TechNest Store",
  },
  {
    name: "Rahul Verma",
    email: "seller2@example.com",
    password: "123456",
    isSeller: true,
    storeName: "Urban Threads",
  },
];

const sampleProducts = [
  {
    name: "Aria Wireless Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cushions for all-day comfort.",
    category: "Electronics",
    brand: "SoundMax",
    price: 2499,
    mrp: 3999,
    countInStock: 25,
    rating: 4.5,
    numReviews: 128,
  },
  {
    name: "Pulse Smart Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Track heart rate, sleep and workouts, and stay connected with call and message alerts — up to 10 days of battery on a single charge.",
    category: "Electronics",
    brand: "TimeTech",
    price: 3499,
    mrp: 5999,
    countInStock: 15,
    rating: 4.7,
    numReviews: 342,
  },
  {
    name: "Boom Portable Speaker",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    description: "Rugged IPX7 waterproof Bluetooth speaker with 360° sound and 20-hour playtime — made for the beach, trail, or backyard.",
    category: "Electronics",
    brand: "SoundMax",
    price: 1799,
    mrp: 2799,
    countInStock: 50,
    rating: 4.4,
    numReviews: 219,
  },
  {
    name: "Frame Mirrorless Camera",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
    description: "24MP mirrorless camera with interchangeable lens mount, 4K video, and in-body stabilization for sharp shots handheld.",
    category: "Electronics",
    brand: "Lumina",
    price: 42999,
    mrp: 49999,
    countInStock: 8,
    rating: 4.8,
    numReviews: 76,
  },
  {
    name: "Nimbus 14 Laptop",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    description: "14-inch thin-and-light laptop with a crisp full-HD display, all-day battery, and enough power for work, study, and streaming.",
    category: "Electronics",
    brand: "Nimbus",
    price: 54999,
    mrp: 64999,
    countInStock: 12,
    rating: 4.6,
    numReviews: 154,
  },
  {
    name: "Orbit Smartphone",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    description: "6.5-inch AMOLED display, triple rear camera, and all-day battery in a sleek glass-and-metal body.",
    category: "Electronics",
    brand: "Orbit",
    price: 16999,
    mrp: 19999,
    countInStock: 30,
    rating: 4.3,
    numReviews: 401,
  },
  {
    name: "Buds Air True Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    description: "Compact true wireless earbuds with active noise cancellation, touch controls, and a 24-hour case battery.",
    category: "Electronics",
    brand: "SoundMax",
    price: 1499,
    mrp: 2499,
    countInStock: 60,
    rating: 4.2,
    numReviews: 288,
  },
  {
    name: "Strike Gaming Mouse",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
    description: "Ergonomic RGB gaming mouse with an 12,800 DPI optical sensor and 6 programmable buttons.",
    category: "Electronics",
    brand: "GearUp",
    price: 999,
    mrp: 1499,
    countInStock: 45,
    rating: 4.1,
    numReviews: 97,
  },
  {
    name: "Velocity Running Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Lightweight knit running shoes with responsive cushioning and breathable mesh — built for daily training and long-distance comfort.",
    category: "Footwear",
    brand: "RunFast",
    price: 2199,
    mrp: 2999,
    countInStock: 40,
    rating: 4.2,
    numReviews: 267,
  },
  {
    name: "Street Canvas Sneakers",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
    description: "Classic low-top canvas sneakers with a durable rubber sole — an everyday staple that pairs with anything.",
    category: "Footwear",
    brand: "UrbanStep",
    price: 1499,
    mrp: 1999,
    countInStock: 55,
    rating: 4.0,
    numReviews: 183,
  },
  {
    name: "Essential Cotton T-Shirt",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    description: "100% combed cotton crew-neck t-shirt with a relaxed fit — soft, breathable, and pre-shrunk for lasting shape.",
    category: "Fashion",
    brand: "Basics Co.",
    price: 499,
    mrp: 899,
    countInStock: 100,
    rating: 4.3,
    numReviews: 512,
  },
  {
    name: "Voyage Travel Backpack",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    description: "Water-resistant 25L backpack with a padded 15-inch laptop sleeve, hidden anti-theft pocket, and a USB charging port.",
    category: "Accessories",
    brand: "UrbanCarry",
    price: 1299,
    mrp: 1999,
    countInStock: 60,
    rating: 4.3,
    numReviews: 231,
  }
];

let seeded = false;

const autoSeedIfEmpty = async () => {
  if (seeded) return;
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("🌱 Database is empty! Auto-seeding initial products and demo accounts...");
      let createdUsers = await User.find();
      if (createdUsers.length === 0) {
        createdUsers = await User.create(users);
      }
      const adminUser = createdUsers.find((u) => u.isAdmin) || createdUsers[0];
      const products = sampleProducts.map((p) => ({
        ...p,
        user: adminUser._id,
      }));
      await Product.insertMany(products);
      console.log(`✅ Auto-seeding completed: ${products.length} products inserted.`);
    }
    seeded = true;
  } catch (err) {
    console.error("⚠️ Auto-seeding skipped or failed:", err.message);
  }
};

module.exports = autoSeedIfEmpty;
