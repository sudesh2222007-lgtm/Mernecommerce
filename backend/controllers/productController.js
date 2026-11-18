const mongoose = require("mongoose");
const Product = require("../models/Product");
const autoSeed = require("../utils/autoSeed");

const fallbackProducts = (autoSeed.sampleProducts || []).map((p, idx) => ({
  _id: `norra_sample_${idx + 1}`,
  ...p,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const getFallbackCatalog = (category, keyword, page, pageSize) => {
  let list = [...(global.sellerProducts || []), ...fallbackProducts];
  if (category && category !== "All") {
    list = list.filter((p) => p.category && p.category.toLowerCase() === category.toLowerCase());
  }
  if (keyword) {
    const k = keyword.toLowerCase();
    list = list.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(k)) ||
        (p.brand && p.brand.toLowerCase().includes(k)) ||
        (p.category && p.category.toLowerCase().includes(k))
    );
  }
  const total = list.length;
  const paginated = list.slice((page - 1) * pageSize, page * pageSize);
  return {
    products: paginated,
    page,
    pages: Math.ceil(total / pageSize) || 1,
    total,
  };
};

const getProducts = async (req, res) => {
  const pageSize = Math.min(Number(req.query.limit) || 24, 50);
  const page = Math.max(Number(req.query.page) || 1, 1);

  try {
    // If MongoDB is not yet connected, return resilient sample catalog immediately
    if (mongoose.connection.readyState !== 1) {
      const fallback = getFallbackCatalog(req.query.category, req.query.keyword, page, pageSize);
      res.set("Cache-Control", "public, max-age=30, s-maxage=60, stale-while-revalidate=300");
      return res.json(fallback);
    }

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i",
          },
        }
      : {};

    const category =
      req.query.category && req.query.category !== "All"
        ? { category: req.query.category }
        : {};

    const filter = { ...keyword, ...category };

    // Parallel execution with lean querying and omitting heavy review subdocuments
    const [totalFiltered, rawProducts] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .select("-reviews")
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const products = rawProducts.map((p) => {
      if (!p.image || String(p.image).includes("1539533018447")) {
        return {
          ...p,
          image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80",
        };
      }
      return p;
    });

    // Enable high-speed Edge & Browser caching for default catalog views
    if (!req.query.keyword) {
      res.set("Cache-Control", "public, max-age=30, s-maxage=60, stale-while-revalidate=300");
    }

    res.json({
      products,
      page,
      pages: Math.ceil(totalFiltered / pageSize) || 1,
      total: totalFiltered,
    });
  } catch (error) {
    console.warn("⚠️ Database query error, returning fallback catalog:", error.message);
    const fallback = getFallbackCatalog(req.query.category, req.query.keyword, page, pageSize);
    res.json(fallback);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.findById(req.params.id).lean();
        if (product) {
          if (!product.image || String(product.image).includes("1539533018447")) {
            product.image = "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80";
          }
          res.set("Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=600");
          return res.json(product);
        }
      } catch (e) {}
    }
    const allFallback = [...(global.sellerProducts || []), ...fallbackProducts];
    const sample = allFallback.find((p) => String(p._id) === String(req.params.id));
    if (sample) {
      res.set("Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=600");
      return res.json(sample);
    }
    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    const allFallback = [...(global.sellerProducts || []), ...fallbackProducts];
    const sample = allFallback.find((p) => String(p._id) === String(req.params.id));
    if (sample) return res.json(sample);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, mrp, description, image, brand, category, countInStock } =
      req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        const product = new Product({
          user: req.user._id,
          name: name || "Sample name",
          price: Number(price) || 0,
          mrp: Number(mrp) || 0,
          description: description || "Sample description",
          image: image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
          brand: brand || "Norra Atelier",
          category: category || "Accessories",
          countInStock: countInStock !== undefined ? Number(countInStock) : 10,
        });

        const createdProduct = await product.save();
        return res.status(201).json(createdProduct);
      } catch (dbErr) {
        console.warn("MongoDB createProduct error:", dbErr.message);
      }
    }

    const fallbackProduct = {
      _id: "prod_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      user: req.user._id,
      name: name || "Sample name",
      price: Number(price) || 0,
      mrp: Number(mrp) || 0,
      description: description || "Sample description",
      image: image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      brand: brand || "Norra Atelier",
      category: category || "Accessories",
      countInStock: countInStock !== undefined ? Number(countInStock) : 10,
      rating: 5,
      numReviews: 0,
      createdAt: new Date().toISOString(),
    };

    global.sellerProducts = global.sellerProducts || [];
    global.sellerProducts.unshift(fallbackProduct);
    res.status(201).json(fallbackProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, mrp, description, image, brand, category, countInStock } =
      req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.findById(req.params.id);
        if (product) {
          product.name = name ?? product.name;
          product.price = price !== undefined ? Number(price) : product.price;
          product.mrp = mrp !== undefined ? Number(mrp) : product.mrp;
          product.description = description ?? product.description;
          product.image = image ?? product.image;
          product.brand = brand ?? product.brand;
          product.category = category ?? product.category;
          product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;

          const updatedProduct = await product.save();
          return res.json(updatedProduct);
        }
      } catch (e) {}
    }

    const mem = (global.sellerProducts || []).find((p) => String(p._id) === String(req.params.id));
    if (mem) {
      mem.name = name ?? mem.name;
      mem.price = price !== undefined ? Number(price) : mem.price;
      mem.mrp = mrp !== undefined ? Number(mrp) : mem.mrp;
      mem.description = description ?? mem.description;
      mem.image = image ?? mem.image;
      mem.brand = brand ?? mem.brand;
      mem.category = category ?? mem.category;
      mem.countInStock = countInStock !== undefined ? Number(countInStock) : mem.countInStock;
      return res.json(mem);
    }

    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.findById(req.params.id);
        if (product) {
          await product.deleteOne();
          return res.json({ message: "Product removed" });
        }
      } catch (e) {}
    }

    const idx = (global.sellerProducts || []).findIndex(
      (p) => String(p._id) === String(req.params.id)
    );
    if (idx !== -1) {
      global.sellerProducts.splice(idx, 1);
      return res.json({ message: "Product removed" });
    }

    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
