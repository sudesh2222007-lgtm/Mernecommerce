const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const autoSeed = require("../utils/autoSeed");

const defaultSampleOrders = [
  {
    _id: "ord_sample_101",
    user: { _id: "demo_john", name: "John Doe", email: "john@example.com" },
    buyerName: "John Doe",
    buyerEmail: "john@example.com",
    buyerMobile: "+91 98765 43210",
    orderItems: [
      {
        _id: "item_101_1",
        name: "Norra Royal Tourbillon Timepiece",
        qty: 1,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
        price: 18999,
        product: "norra_sample_1",
        seller: "demo_admin",
        isDelivered: false,
      },
      {
        _id: "item_101_2",
        name: "Aria Wireless ANC Headphones",
        qty: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        price: 2499,
        product: "norra_sample_9",
        seller: "demo_seller1",
        isDelivered: true,
      },
    ],
    shippingAddress: {
      address: "14 Rue du Faubourg Saint-Honoré",
      city: "Paris",
      postalCode: "75008",
      country: "France",
      mobile: "+91 98765 43210",
    },
    paymentMethod: "Credit Card (Stripe)",
    itemsPrice: 21498,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 21498,
    isPaid: true,
    paidAt: new Date(Date.now() - 86400000).toISOString(),
    isDelivered: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "ord_sample_102",
    user: { _id: "demo_sarah", name: "Sarah Jenkins", email: "sarah.j@example.com" },
    buyerName: "Sarah Jenkins",
    buyerEmail: "sarah.j@example.com",
    buyerMobile: "+91 98111 22334",
    orderItems: [
      {
        _id: "item_102_1",
        name: "Aura Sculpted Gold Pendant",
        qty: 1,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        price: 8499,
        product: "norra_sample_2",
        seller: "demo_admin",
        isDelivered: false,
      },
      {
        _id: "item_102_2",
        name: "Pulse Horizon Smart Watch",
        qty: 1,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        price: 3499,
        product: "norra_sample_10",
        seller: "demo_seller1",
        isDelivered: false,
      },
    ],
    shippingAddress: {
      address: "450 5th Avenue, Suite 1200",
      city: "New York",
      postalCode: "10018",
      country: "United States",
      mobile: "+91 98111 22334",
    },
    paymentMethod: "Apple Pay",
    itemsPrice: 11998,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 11998,
    isPaid: true,
    paidAt: new Date(Date.now() - 172800000).toISOString(),
    isDelivered: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    _id: "ord_sample_103",
    user: { _id: "demo_david", name: "David Miller", email: "david.m@example.com" },
    buyerName: "David Miller",
    buyerEmail: "david.m@example.com",
    buyerMobile: "+91 98222 33445",
    orderItems: [
      {
        _id: "item_103_1",
        name: "Lumina Frame Mirrorless Camera",
        qty: 1,
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
        price: 42999,
        product: "norra_sample_12",
        seller: "demo_seller1",
        isDelivered: true,
      },
    ],
    shippingAddress: {
      address: "221B Baker Street",
      city: "London",
      postalCode: "NW1 6XE",
      country: "United Kingdom",
      mobile: "+91 98222 33445",
    },
    paymentMethod: "Credit Card (Visa)",
    itemsPrice: 42999,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 42999,
    isPaid: true,
    paidAt: new Date(Date.now() - 259200000).toISOString(),
    isDelivered: true,
    deliveredAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

global.fallbackOrders =
  global.fallbackOrders && global.fallbackOrders.length > 0
    ? global.fallbackOrders
    : defaultSampleOrders;

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

    const mobile =
      (shippingAddress && shippingAddress.mobile) || req.body.mobile || "+91 98765 43210";

    const fullShippingAddress = {
      address: shippingAddress?.address || "",
      city: shippingAddress?.city || "",
      postalCode: shippingAddress?.postalCode || "",
      country: shippingAddress?.country || "",
      mobile,
    };

    if (mongoose.connection.readyState === 1) {
      const order = new Order({
        user: req.user._id,
        orderItems: resolvedItems,
        shippingAddress: fullShippingAddress,
        buyerMobile: mobile,
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
      buyerName: req.user.name || "Customer",
      buyerEmail: req.user.email || "",
      buyerMobile: mobile,
      orderItems: resolvedItems,
      shippingAddress: fullShippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice: finalShippingPrice,
      taxPrice: finalTaxPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false,
      createdAt: new Date().toISOString(),
    };

    global.fallbackOrders =
      global.fallbackOrders && global.fallbackOrders.length > 0
        ? global.fallbackOrders
        : [...defaultSampleOrders];
    global.fallbackOrders.unshift(fallbackOrder);
    return res.status(201).json(fallbackOrder);
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
        "name email mobile"
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
    let orders = [];
    if (mongoose.connection.readyState === 1) {
      try {
        orders = await Order.find({}).populate("user", "id name").sort({
          createdAt: -1,
        }).lean();
      } catch (e) {
        orders = [];
      }
    }
    if (global.fallbackOrders && global.fallbackOrders.length > 0) {
      orders = [...orders, ...global.fallbackOrders];
    }
    res.json(orders);
  } catch (error) {
    res.json(global.fallbackOrders || []);
  }
};

const resolveBuyer = (order) => {
  let buyer = order.user;
  const directMobile =
    order.shippingAddress?.mobile || order.buyerMobile || order.mobile || "";

  if (typeof buyer === "object" && buyer?.name) {
    return {
      name: buyer.name,
      email: buyer.email || "",
      mobile: directMobile || buyer.mobile || "+91 98765 43210",
    };
  }
  const uid = typeof buyer === "string" ? buyer : String(buyer?._id || "");
  const found = [
    { _id: "demo_admin", name: "Admin User", email: "admin@example.com", mobile: "+91 98765 00001" },
    { _id: "demo_john", name: "John Doe", email: "john@example.com", mobile: "+91 98765 43210" },
    { _id: "demo_sarah", name: "Sarah Jenkins", email: "sarah.j@example.com", mobile: "+91 98111 22334" },
    { _id: "demo_david", name: "David Miller", email: "david.m@example.com", mobile: "+91 98222 33445" },
    { _id: "demo_seller1", name: "Seller", email: "seller1@example.com", mobile: "+91 98333 44556" },
    ...(global.fallbackUsers || []),
  ].find((u) => String(u._id) === uid || String(u.email) === uid);

  const mobile = directMobile || (found && found.mobile) || "+91 98765 43210";

  if (found) {
    return { name: found.name, email: found.email, mobile };
  }
  if (order.buyerName) {
    return { name: order.buyerName, email: order.buyerEmail || "", mobile };
  }
  if (order.shippingAddress?.fullName || order.shippingAddress?.name) {
    return { name: order.shippingAddress.fullName || order.shippingAddress.name, email: "", mobile };
  }
  return { name: "Valued Customer", email: "", mobile };
};

// @desc    Get orders containing items sold by the logged-in seller
//          (each order is trimmed down to only that seller's own line items)
// @route   GET /api/orders/seller
// @access  Private/Seller
const getSellerOrders = async (req, res) => {
  try {
    let dbOrders = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const query = req.user.isAdmin
          ? {}
          : { "orderItems.seller": req.user._id };
        dbOrders = await Order.find(query)
          .populate("user", "name email mobile")
          .sort({ createdAt: -1 })
          .lean();
      } catch (err) {
        console.warn("MongoDB getSellerOrders query error:", err.message);
        dbOrders = [];
      }
    }

    // Combine and deduplicate orders by _id
    const combinedMap = new Map();
    for (const ord of [...dbOrders, ...(global.fallbackOrders || [])]) {
      if (ord && ord._id && !combinedMap.has(String(ord._id))) {
        combinedMap.set(String(ord._id), ord);
      }
    }
    const allOrders = Array.from(combinedMap.values());

    // Strict descending sort by createdAt so latest orders are always at the top (#1)
    allOrders.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    const scoped = allOrders
      .map((order) => {
        const myItems = (order.orderItems || []).filter((item) => {
          if (req.user.isAdmin) return true;
          return item.seller && String(item.seller) === String(req.user._id);
        });

        if (myItems.length === 0) return null;

        const buyerInfo = resolveBuyer(order);

        return {
          _id: order._id,
          user: {
            _id: typeof order.user === "object" ? order.user?._id : order.user,
            name: buyerInfo.name,
            email: buyerInfo.email,
            mobile: buyerInfo.mobile,
          },
          buyerName: buyerInfo.name,
          buyerEmail: buyerInfo.email,
          buyerMobile: buyerInfo.mobile,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          isPaid: order.isPaid,
          paidAt: order.paidAt,
          isDelivered: order.isDelivered,
          deliveredAt: order.deliveredAt,
          createdAt: order.createdAt,
          orderItems: myItems,
          myItemsTotal: myItems.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0),
        };
      })
      .filter(Boolean);

    // Ensure final response list is sorted strictly newest first
    scoped.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    res.json(scoped);
  } catch (error) {
    console.error("getSellerOrders error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a single order item as delivered (seller can only mark
//          their own items; admin can mark any item)
// @route   PUT /api/orders/:id/items/:itemId/deliver
// @access  Private/Seller
const updateOrderItemDelivered = async (req, res) => {
  try {
    let order = null;
    if (mongoose.connection.readyState === 1) {
      try {
        order = await Order.findById(req.params.id);
      } catch (e) {}
    }

    if (order) {
      const item = order.orderItems.id(req.params.itemId);

      if (!item) {
        return res.status(404).json({ message: "Order item not found" });
      }

      const isOwner = item.seller && String(item.seller) === String(req.user._id);
      if (!isOwner && !req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this item" });
      }

      item.isDelivered = true;
      item.deliveredAt = Date.now();

      if (order.orderItems.every((i) => i.isDelivered)) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      await order.save();
      return res.json(order);
    }

    // In-memory fallback order update
    const memOrder = (global.fallbackOrders || []).find(
      (o) => String(o._id) === String(req.params.id)
    );

    if (!memOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const memItem = (memOrder.orderItems || []).find(
      (i) => String(i._id || i.product) === String(req.params.itemId)
    );

    if (memItem) {
      memItem.isDelivered = true;
      memItem.deliveredAt = new Date().toISOString();
    }

    if ((memOrder.orderItems || []).every((i) => i.isDelivered)) {
      memOrder.isDelivered = true;
      memOrder.deliveredAt = new Date().toISOString();
    }

    res.json(memOrder);
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
