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
  // --- Admin Flagship Atelier Collection (demo_admin) ---
  {
    name: "Norra Royal Tourbillon Timepiece",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    description: "Handcrafted 18k rose gold automatic chronometer with sapphire crystal back and hand-stitched alligator strap.",
    category: "Accessories",
    brand: "Norra Atelier",
    price: 18999,
    mrp: 24999,
    countInStock: 8,
    rating: 4.9,
    numReviews: 84,
    user: "demo_admin",
  },
  {
    name: "Aura Sculpted Gold Pendant",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    description: "Solid 14k gold geometric pendant featuring an ethically sourced brilliant-cut centerpiece gemstone.",
    category: "Accessories",
    brand: "Norra Atelier",
    price: 8499,
    mrp: 11999,
    countInStock: 15,
    rating: 4.8,
    numReviews: 112,
    user: "demo_admin",
  },
  {
    name: "Maison Calfskin Weekender Bag",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    description: "Full-grain Italian calfskin duffle with brass hardware, reinforced protective feet, and detachable travel shoulder strap.",
    category: "Accessories",
    brand: "Norra Atelier",
    price: 12499,
    mrp: 16999,
    countInStock: 12,
    rating: 4.9,
    numReviews: 95,
    user: "demo_admin",
  },
  {
    name: "Santal Noir Eau de Parfum",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    description: "A seductive extrait de parfum with smoky Australian sandalwood, cracked black pepper, cardamom, and amber resin.",
    category: "Accessories",
    brand: "Norra Atelier",
    price: 4999,
    mrp: 6999,
    countInStock: 28,
    rating: 4.7,
    numReviews: 163,
    user: "demo_admin",
  },
  {
    name: "Cashmere Wool Tailored Overcoat",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80",
    description: "Double-faced Mongolian cashmere blend coat with horn buttons and unstructured soft shoulder tailoring.",
    category: "Fashion",
    brand: "Norra Atelier",
    price: 15999,
    mrp: 21999,
    countInStock: 6,
    rating: 4.9,
    numReviews: 42,
    user: "demo_admin",
  },
  {
    name: "Hand-Hammered Titanium Sunglasses",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    description: "Featherlight Japanese beta-titanium frames with polarized anti-reflective Zeiss nylon lenses.",
    category: "Accessories",
    brand: "Norra Atelier",
    price: 6999,
    mrp: 9499,
    countInStock: 18,
    rating: 4.8,
    numReviews: 78,
    user: "demo_admin",
  },

  // --- TechNest Store (demo_seller1 - Priya Sharma) ---
  {
    name: "Aria Wireless ANC Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cushions.",
    category: "Electronics",
    brand: "SoundMax",
    price: 2499,
    mrp: 3999,
    countInStock: 25,
    rating: 4.5,
    numReviews: 128,
    user: "demo_seller1",
  },
  {
    name: "Pulse Horizon Smart Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Continuous biometric tracking, sapphire glass touch display, and waterproof construction up to 50 meters.",
    category: "Electronics",
    brand: "TimeTech",
    price: 3499,
    mrp: 5999,
    countInStock: 15,
    rating: 4.7,
    numReviews: 342,
    user: "demo_seller1",
  },
  {
    name: "Boom Acoustic Portable Speaker",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    description: "Rugged IPX7 waterproof Bluetooth speaker with 360-degree cylindrical soundstage and 20-hour battery life.",
    category: "Electronics",
    brand: "SoundMax",
    price: 1799,
    mrp: 2799,
    countInStock: 50,
    rating: 4.4,
    numReviews: 219,
    user: "demo_seller1",
  },
  {
    name: "Lumina Frame Mirrorless Camera",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
    description: "24.2MP full-frame mirrorless camera with 4K60p video, 5-axis sensor shift stabilization, and OLED viewfinder.",
    category: "Electronics",
    brand: "Lumina",
    price: 42999,
    mrp: 49999,
    countInStock: 8,
    rating: 4.8,
    numReviews: 76,
    user: "demo_seller1",
  },
  {
    name: "Nimbus Pro 14 Studio Laptop",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    description: "14-inch OLED studio laptop powered by next-gen silicon, 32GB unified RAM, and 18-hour battery longevity.",
    category: "Electronics",
    brand: "Nimbus",
    price: 54999,
    mrp: 64999,
    countInStock: 12,
    rating: 4.6,
    numReviews: 154,
    user: "demo_seller1",
  },
  {
    name: "Orbit 5G Flagship Smartphone",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    description: "6.7-inch 120Hz AMOLED display, triple computational Leica lens system, and ultra-fast warp charging.",
    category: "Electronics",
    brand: "Orbit",
    price: 16999,
    mrp: 19999,
    countInStock: 30,
    rating: 4.3,
    numReviews: 401,
    user: "demo_seller1",
  },
  {
    name: "Buds Air Spatial Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    description: "Ultra-compact earbuds featuring dynamic head tracking spatial audio, transparent ambient mode, and Qi wireless charging.",
    category: "Electronics",
    brand: "SoundMax",
    price: 1499,
    mrp: 2499,
    countInStock: 60,
    rating: 4.2,
    numReviews: 288,
    user: "demo_seller1",
  },

  // --- Urban Threads (demo_seller2 - Rahul Verma) ---
  {
    name: "Velocity Ultra Running Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Engineered mesh running shoes with nitrogen-infused midsole foam for maximum energy return on asphalt.",
    category: "Footwear",
    brand: "RunFast",
    price: 2199,
    mrp: 2999,
    countInStock: 40,
    rating: 4.2,
    numReviews: 267,
    user: "demo_seller2",
  },
  {
    name: "Monochrome Low-Top Leather Sneakers",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    description: "Minimalist Italian nappa leather sneakers with stitched Margom rubber cupsoles and calfskin lining.",
    category: "Footwear",
    brand: "UrbanStep",
    price: 3499,
    mrp: 4999,
    countInStock: 35,
    rating: 4.6,
    numReviews: 194,
    user: "demo_seller2",
  },
  {
    name: "Heritage Chelsea Suede Boots",
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80",
    description: "Water-repellent English suede Chelsea boots with Goodyear welted construction and crepe rubber soles.",
    category: "Footwear",
    brand: "UrbanStep",
    price: 4999,
    mrp: 6999,
    countInStock: 20,
    rating: 4.7,
    numReviews: 143,
    user: "demo_seller2",
  },
  {
    name: "Heavyweight Supima Cotton Tee",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    description: "240 GSM organic Supima cotton t-shirt with a structured drape, double-stitched hem, and velvety handfeel.",
    category: "Fashion",
    brand: "Basics Co.",
    price: 799,
    mrp: 1299,
    countInStock: 85,
    rating: 4.5,
    numReviews: 320,
    user: "demo_seller2",
  },
  {
    name: "Relaxed French Terry Hoodie",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    description: "Heavyweight 450 GSM French terry cotton hoodie with double-lined hood and zero-drawstring minimalist design.",
    category: "Fashion",
    brand: "Urban Threads",
    price: 2499,
    mrp: 3499,
    countInStock: 45,
    rating: 4.6,
    numReviews: 188,
    user: "demo_seller2",
  },
  {
    name: "Artisanal Woven Silk Scarf",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
    description: "Hand-rolled twill mulberry silk scarf featuring an archival geometric motif rendered with natural vegetable dyes.",
    category: "Accessories",
    brand: "Urban Threads",
    price: 1899,
    mrp: 2699,
    countInStock: 30,
    rating: 4.8,
    numReviews: 94,
    user: "demo_seller2",
  },
  {
    name: "Voyage Tech Commuter Backpack",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    description: "Cordura ballistic nylon commuter pack with magnetic Fidlock buckles, anti-theft zipper, and fleece-lined laptop sleeve.",
    category: "Accessories",
    brand: "UrbanCarry",
    price: 1999,
    mrp: 2999,
    countInStock: 50,
    rating: 4.4,
    numReviews: 215,
    user: "demo_seller2",
  },
];

let seeded = false;
let seedPromise = null;

const autoSeedIfEmpty = async () => {
  if (seeded) return;
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    try {
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        console.log("🌱 Database is empty! Auto-seeding initial products and demo accounts...");
        let createdUsers = await User.find();
        if (createdUsers.length === 0) {
          createdUsers = await User.create(users);
        }
        const adminUser = createdUsers.find((u) => u.isAdmin) || createdUsers[0];
        const seller1 = createdUsers.find((u) => u.email === "seller1@example.com") || adminUser;
        const seller2 = createdUsers.find((u) => u.email === "seller2@example.com") || adminUser;

        const userMap = {
          demo_admin: adminUser._id,
          demo_seller1: seller1._id,
          demo_seller2: seller2._id,
        };

        const products = sampleProducts.map((p) => ({
          ...p,
          user: userMap[p.user] || adminUser._id,
        }));
        await Product.insertMany(products);
        console.log(`✅ Auto-seeding completed: ${products.length} products inserted.`);
      }
      seeded = true;
    } catch (err) {
      console.error("⚠️ Auto-seeding skipped or failed:", err.message);
    } finally {
      seedPromise = null;
    }
  })();

  return seedPromise;
};

autoSeedIfEmpty.sampleProducts = sampleProducts;
module.exports = autoSeedIfEmpty;
