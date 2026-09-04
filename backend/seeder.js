const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

dotenv.config({ path: path.resolve(__dirname, ".env") });

if (!process.env.MONGO_URI) {
  console.error(
    "\n❌ MONGO_URI is not set. Make sure backend/.env exists and contains MONGO_URI.\n"
  );
  process.exit(1);
}

connectDB();

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

// All prices are in INR. `mrp` (Maximum Retail Price) is shown struck-through
// on the storefront whenever it is higher than `price`, with an auto-computed % off badge.
const sampleProducts = [
  // ---------------- Electronics ----------------
  {
    name: "Aria Wireless Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description:
      "Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cushions for all-day comfort.",
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
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description:
      "Track heart rate, sleep and workouts, and stay connected with call and message alerts — up to 10 days of battery on a single charge.",
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
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    description:
      "Rugged IPX7 waterproof Bluetooth speaker with 360° sound and 20-hour playtime — made for the beach, trail, or backyard.",
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
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
    description:
      "24MP mirrorless camera with interchangeable lens mount, 4K video, and in-body stabilization for sharp shots handheld.",
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
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    description:
      "14-inch thin-and-light laptop with a crisp full-HD display, all-day battery, and enough power for work, study, and streaming.",
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
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    description:
      "6.5-inch AMOLED display, triple rear camera, and all-day battery in a sleek glass-and-metal body.",
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
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    description:
      "Compact true wireless earbuds with active noise cancellation, touch controls, and a 24-hour case battery.",
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
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
    description:
      "Ergonomic RGB gaming mouse with an 12,800 DPI optical sensor and 6 programmable buttons.",
    category: "Electronics",
    brand: "GearUp",
    price: 999,
    mrp: 1499,
    countInStock: 45,
    rating: 4.1,
    numReviews: 97,
  },

  // ---------------- Footwear ----------------
  {
    name: "Velocity Running Shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description:
      "Lightweight knit running shoes with responsive cushioning and breathable mesh — built for daily training and long-distance comfort.",
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
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
    description:
      "Classic low-top canvas sneakers with a durable rubber sole — an everyday staple that pairs with anything.",
    category: "Footwear",
    brand: "UrbanStep",
    price: 1499,
    mrp: 1999,
    countInStock: 55,
    rating: 4.0,
    numReviews: 183,
  },
  {
    name: "Oxford Formal Leather Shoes",
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80",
    description:
      "Genuine leather oxford shoes with a cushioned footbed — sharp enough for the office, comfortable enough for the whole day.",
    category: "Footwear",
    brand: "Oxford & Co.",
    price: 3299,
    mrp: 4499,
    countInStock: 20,
    rating: 4.5,
    numReviews: 64,
  },

  // ---------------- Fashion ----------------
  {
    name: "Essential Cotton T-Shirt",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    description:
      "100% combed cotton crew-neck t-shirt with a relaxed fit — soft, breathable, and pre-shrunk for lasting shape.",
    category: "Fashion",
    brand: "Basics Co.",
    price: 499,
    mrp: 899,
    countInStock: 100,
    rating: 4.3,
    numReviews: 512,
  },
  {
    name: "Rugged Denim Jacket",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    description:
      "Classic washed-denim jacket with a sturdy button placket and chest pockets — a wardrobe staple for every season.",
    category: "Fashion",
    brand: "UrbanStep",
    price: 1999,
    mrp: 2999,
    countInStock: 35,
    rating: 4.4,
    numReviews: 142,
  },
  {
    name: "Belle Structured Handbag",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    description:
      "Vegan-leather structured handbag with a spacious interior, adjustable strap, and gold-tone hardware.",
    category: "Fashion",
    brand: "Belle",
    price: 1599,
    mrp: 2499,
    countInStock: 28,
    rating: 4.3,
    numReviews: 96,
  },

  // ---------------- Accessories ----------------
  {
    name: "Voyage Travel Backpack",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    description:
      "Water-resistant 25L backpack with a padded 15-inch laptop sleeve, hidden anti-theft pocket, and a USB charging port.",
    category: "Accessories",
    brand: "UrbanCarry",
    price: 1299,
    mrp: 1999,
    countInStock: 60,
    rating: 4.3,
    numReviews: 231,
  },
  {
    name: "Horizon Polarized Sunglasses",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    description:
      "UV400 polarized lenses in a lightweight titanium frame — glare-free clarity for driving, sports, or everyday wear.",
    category: "Accessories",
    brand: "SunLine",
    price: 899,
    mrp: 1499,
    countInStock: 33,
    rating: 4.1,
    numReviews: 88,
  },
  {
    name: "Fold Leather Wallet",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    description:
      "Full-grain leather bifold wallet with RFID-blocking card slots and a slim profile that ages beautifully with use.",
    category: "Accessories",
    brand: "UrbanCarry",
    price: 699,
    mrp: 1199,
    countInStock: 70,
    rating: 4.0,
    numReviews: 155,
  },
  {
    name: "Chrono Analog Wrist Watch",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    description:
      "Stainless-steel analog watch with a sapphire-coated crystal face and genuine leather strap — timeless and water resistant.",
    category: "Accessories",
    brand: "Chrono",
    price: 2999,
    mrp: 4999,
    countInStock: 22,
    rating: 4.6,
    numReviews: 118,
  },

  // ---------------- Home & Kitchen ----------------
  {
    name: "Brew Master Coffee Maker",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    description:
      "12-cup programmable drip coffee maker with a keep-warm plate and reusable filter — barista-quality coffee at home.",
    category: "Home & Kitchen",
    brand: "BrewMaster",
    price: 2499,
    mrp: 3499,
    countInStock: 18,
    rating: 4.4,
    numReviews: 73,
  },
  {
    name: "Whirl 3-Speed Blender",
    image:
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80",
    description:
      "750W countertop blender with a shatterproof jar and 3-speed control — perfect for smoothies, chutneys, and batters.",
    category: "Home & Kitchen",
    brand: "Whirl",
    price: 1799,
    mrp: 2499,
    countInStock: 26,
    rating: 4.2,
    numReviews: 61,
  },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create(users);
    const [adminUser, , sellerTech, sellerFashion] = createdUsers;

    // Distribute the catalog across sellers so a single cart/order can
    // realistically contain items from multiple different sellers —
    // exactly the scenario the Seller Dashboard is built to handle.
    const sellerForCategory = (category) => {
      if (category === "Electronics") return sellerTech._id;
      if (["Footwear", "Fashion", "Accessories"].includes(category))
        return sellerFashion._id;
      return adminUser._id; // Home & Kitchen stays with the store admin
    };

    const products = sampleProducts.map((product) => {
      return { ...product, user: sellerForCategory(product.category) };
    });

    await Product.insertMany(products);

    console.log(`✅ Data Imported Successfully! (${products.length} products, ${users.length} users)`);
    console.log("\nDemo accounts:");
    console.log("  Admin   -> admin@example.com / 123456");
    console.log("  Buyer   -> john@example.com / 123456");
    console.log("  Seller  -> seller1@example.com / 123456  (TechNest Store — Electronics)");
    console.log("  Seller  -> seller2@example.com / 123456  (Urban Threads — Footwear/Fashion/Accessories)\n");
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("🗑️  Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
