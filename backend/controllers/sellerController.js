const mongoose = require("mongoose");
const Product = require("../models/Product");

global.sellerProducts = global.sellerProducts || [];

// @desc    Get products belonging to the logged-in seller
// @route   GET /api/seller/products
// @access  Private/Seller
const getMyProducts = async (req, res) => {
  try {
    let products = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const query = req.user.isAdmin ? {} : { user: req.user._id };
        products = await Product.find(query).sort({
          createdAt: -1,
        }).lean();
      } catch (e) {
        console.warn("MongoDB getMyProducts error:", e.message);
        products = [];
      }
    }

    const memProducts = (global.sellerProducts || []).filter((p) =>
      req.user.isAdmin ? true : String(p.user) === String(req.user._id)
    );

    res.json([...products, ...memProducts]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product owned by the logged-in seller
// @route   POST /api/seller/products
// @access  Private/Seller
const createMyProduct = async (req, res) => {
  try {
    const { name, price, mrp, description, image, brand, category, countInStock } =
      req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({
        message: "name, price, description and category are required",
      });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const product = new Product({
          user: req.user._id,
          name,
          price: Number(price),
          mrp: Number(mrp) || 0,
          description,
          image: image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
          brand: brand || "Generic",
          category,
          countInStock: countInStock !== undefined ? Number(countInStock) : 0,
        });

        const createdProduct = await product.save();
        return res.status(201).json(createdProduct);
      } catch (dbErr) {
        console.warn("MongoDB createMyProduct save error:", dbErr.message);
      }
    }

    const newProduct = {
      _id: "prod_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      user: req.user._id,
      name,
      price: Number(price),
      mrp: Number(mrp) || Number(price),
      description,
      image: image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      brand: brand || "Norra Atelier",
      category,
      countInStock: countInStock !== undefined ? Number(countInStock) : 10,
      createdAt: new Date().toISOString(),
    };

    global.sellerProducts = global.sellerProducts || [];
    global.sellerProducts.unshift(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product — only if it belongs to the logged-in seller
// @route   PUT /api/seller/products/:id
// @access  Private/Seller
const updateMyProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.findById(req.params.id);

        if (product) {
          const isOwner = product.user && String(product.user) === String(req.user._id);
          if (!isOwner && !req.user.isAdmin) {
            return res
              .status(403)
              .json({ message: "You can only edit your own products" });
          }

          const { name, price, mrp, description, image, brand, category, countInStock } =
            req.body;

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
      const isOwner = mem.user && String(mem.user) === String(req.user._id);
      if (!isOwner && !req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "You can only edit your own products" });
      }

      const { name, price, mrp, description, image, brand, category, countInStock } =
        req.body;

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
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product — only if it belongs to the logged-in seller
// @route   DELETE /api/seller/products/:id
// @access  Private/Seller
const deleteMyProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const product = await Product.findById(req.params.id);

        if (product) {
          const isOwner = product.user && String(product.user) === String(req.user._id);
          if (!isOwner && !req.user.isAdmin) {
            return res
              .status(403)
              .json({ message: "You can only delete your own products" });
          }

          await product.deleteOne();
          return res.json({ message: "Product removed" });
        }
      } catch (e) {}
    }

    const idx = (global.sellerProducts || []).findIndex(
      (p) => String(p._id) === String(req.params.id)
    );
    if (idx !== -1) {
      const mem = global.sellerProducts[idx];
      const isOwner = mem.user && String(mem.user) === String(req.user._id);
      if (!isOwner && !req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "You can only delete your own products" });
      }
      global.sellerProducts.splice(idx, 1);
      return res.json({ message: "Product removed" });
    }

    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a quick stats summary for the seller's dashboard
// @route   GET /api/seller/summary
// @access  Private/Seller
const getSellerSummary = async (req, res) => {
  try {
    let products = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const query = req.user.isAdmin ? {} : { user: req.user._id };
        products = await Product.find(query).lean();
      } catch (e) {
        products = [];
      }
    }

    const memProducts = (global.sellerProducts || []).filter((p) =>
      req.user.isAdmin ? true : String(p.user) === String(req.user._id)
    );
    const combined = [...products, ...memProducts];

    const totalProducts = combined.length;
    const outOfStock = combined.filter((p) => Number(p.countInStock) === 0).length;
    const lowStock = combined.filter(
      (p) => Number(p.countInStock) > 0 && Number(p.countInStock) <= 5
    ).length;

    res.json({
      totalProducts,
      outOfStock,
      lowStock,
      storeName: req.user.storeName || req.user.name || "Norra Atelier",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyProducts,
  createMyProduct,
  updateMyProduct,
  deleteMyProduct,
  getSellerSummary,
};
