const Order = require("../models/Order");
const Product = require("../models/Product");

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

    // Look up each product server-side so the seller, price and stock are
    // always trustworthy (never taken as-is from the client).
    const resolvedItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        if (product.countInStock < item.qty) {
          throw new Error(`Not enough stock for ${product.name}`);
        }
        return {
          name: product.name,
          qty: item.qty,
          image: product.image,
          price: product.price,
          product: product._id,
          seller: product.user,
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

    // Decrement stock for each purchased item
    await Promise.all(
      resolvedItems.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { countInStock: -item.qty },
        })
      )
    );

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only the owner or an admin can view the order
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
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
