const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const autoSeed = require("../utils/autoSeed");

global.fallbackOrders = global.fallbackOrders || [];

const fallbackProducts = (autoSeed.sampleProducts || []).map((p, idx) => ({
  _id: `norra_sample_${idx + 1}`,
  ...p,
}));

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      taxPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const resolvedItems = await Promise.all(
      orderItems.map(async (item) => {
        let product = null;
        if (mongoose.connection.readyState === 1) {
          try {
            product = await Product.findById(item.product);
          } catch (e) {}
        }
        if (!product) {
          product = fallbackProducts.find(
            (p) => String(p._id) === String(item.product)
          );
        }
        if (!product) {
          // Resilient fallback: allow client-supplied name/price if product catalog was dynamic
          return {
            name: item.name || "Luxury Atelier Item",
            qty: Number(item.qty) || 1,
            image: item.image || "/images/sample.jpg",
            price: Number(item.price) || 0,
            product: item.product,
            seller: null,
          };
        }
        return {
          name: product.name,
          qty: Number(item.qty) || 1,
          image: product.image,
          price: product.price,
          product: product._id,
          seller: product.user || null,
        };
      })
    );

    const itemsPrice = resolvedItems.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );
    const finalShippingPrice = shippingPrice ?? 0;
    const finalTaxPrice = taxPrice ?? 0;
    const totalPrice = itemsPrice + finalShippingPrice + finalTaxPrice;

    if (mongoose.connection.readyState === 1) {
      const order = new Order({
        user: req.user._id,
        orderItems: resolvedItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice: finalShippingPrice,
        taxPrice: finalTaxPrice,
        totalPrice,
      });

      await Promise.all(
        resolvedItems.map(async (item) => {
          try {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { countInStock: -item.qty },
            });
          } catch (e) {}
        })
      );

      const createdOrder = await order.save();
      return res.status(201).json(createdOrder);
    }

    // Fallback in-memory order for offline preview
    const fallbackOrder = {
      _id: "ord_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      user: req.user._id,
      orderItems: resolvedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice: finalShippingPrice,
      taxPrice: finalTaxPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false,
      createdAt: new Date().toISOString(),
    };

    global.fallbackOrders = global.fallbackOrders || [];
    global.fallbackOrders.push(fallbackOrder);
    res.status(201).json(fallbackOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({ user: req.user._id }).sort({
        createdAt: -1,
      });
      return res.json(orders);
    }
    const memOrders = (global.fallbackOrders || []).filter(
      (o) => String(o.user) === String(req.user._id)
    );
    res.json(memOrders);
  } catch (error) {
    const memOrders = (global.fallbackOrders || []).filter(
      (o) => String(o.user) === String(req.user._id)
    );
    res.json(memOrders);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
      );

      if (order) {
        if (
          order.user._id.toString() !== req.user._id.toString() &&
          !req.user.isAdmin
        ) {
          return res.status(403).json({ message: "Not authorized" });
        }
        return res.json(order);
      }
    }

    const fallback = (global.fallbackOrders || []).find(
      (o) => String(o._id) === String(req.params.id)
    );
    if (fallback) {
      return res.json(fallback);
    }

    res.status(404).json({ message: "Order not found" });
  } catch (error) {
    const fallback = (global.fallbackOrders || []).find(
      (o) => String(o._id) === String(req.params.id)
    );
    if (fallback) return res.json(fallback);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name").sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders containing items sold by the logged-in seller
//          (each order is trimmed down to only that seller's own line items)
// @route   GET /api/orders/seller
// @access  Private/Seller
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "orderItems.seller": req.user._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const scoped = orders.map((order) => {
      const myItems = order.orderItems.filter(
        (item) => item.seller.toString() === req.user._id.toString()
      );
      return {
        _id: order._id,
        user: order.user,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
        orderItems: myItems,
        myItemsTotal: myItems.reduce((sum, i) => sum + i.price * i.qty, 0),
      };
    });

    res.json(scoped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a single order item as delivered (seller can only mark
//          their own items; admin can mark any item)
// @route   PUT /api/orders/:id/items/:itemId/deliver
// @access  Private/Seller
const updateOrderItemDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.orderItems.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: "Order item not found" });
    }

    if (
      item.seller.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this item" });
    }

    item.isDelivered = true;
    item.deliveredAt = Date.now();

    // If every item in the order is now delivered, mark the whole order
    // delivered too (kept for backward compatibility / the customer's view).
    if (order.orderItems.every((i) => i.isDelivered)) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getSellerOrders,
  updateOrderItemDelivered,
};
