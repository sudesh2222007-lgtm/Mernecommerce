const Product = require("../models/Product");

// @desc    Get products belonging to the logged-in seller
// @route   GET /api/seller/products
// @access  Private/Seller
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(products);
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

    const product = new Product({
      user: req.user._id,
      name,
      price,
      mrp: mrp || 0,
      description,
      image: image || "/images/sample.jpg",
      brand: brand || "Generic",
      category,
      countInStock: countInStock ?? 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product — only if it belongs to the logged-in seller
// @route   PUT /api/seller/products/:id
// @access  Private/Seller
const updateMyProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You can only edit your own products" });
    }

    const { name, price, mrp, description, image, brand, category, countInStock } =
      req.body;

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.mrp = mrp ?? product.mrp;
    product.description = description ?? product.description;
    product.image = image ?? product.image;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.countInStock = countInStock ?? product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product — only if it belongs to the logged-in seller
// @route   DELETE /api/seller/products/:id
// @access  Private/Seller
const deleteMyProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You can only delete your own products" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a quick stats summary for the seller's dashboard
// @route   GET /api/seller/summary
// @access  Private/Seller
const getSellerSummary = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    const totalProducts = products.length;
    const outOfStock = products.filter((p) => p.countInStock === 0).length;
    const lowStock = products.filter(
      (p) => p.countInStock > 0 && p.countInStock <= 5
    ).length;

    res.json({
      totalProducts,
      outOfStock,
      lowStock,
      storeName: req.user.storeName || req.user.name,
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
