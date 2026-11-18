const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const demoUsers = [
  { _id: "demo_admin", name: "Admin User", email: "admin@example.com", isAdmin: true, isSeller: false },
  { _id: "demo_john", name: "John Doe", email: "john@example.com", isAdmin: false, isSeller: false },
  { _id: "demo_seller1", name: "Priya Sharma", email: "seller1@example.com", isAdmin: false, isSeller: true, storeName: "TechNest Store" },
  { _id: "demo_seller2", name: "Rahul Verma", email: "seller2@example.com", isAdmin: false, isSeller: true, storeName: "Urban Threads" },
];

// Protect routes - user must be logged in
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secret = process.env.JWT_SECRET || "norra_luxury_secret_jwt_key_2026";
      const decoded = jwt.verify(token, secret);

      // Fast-path demo user support for offline/demo operation
      if (decoded.id && String(decoded.id).startsWith("demo_")) {
        const demo = demoUsers.find((u) => u._id === decoded.id) || demoUsers[0];
        req.user = demo;
        return next();
      }

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select("-password");
      }

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Auth protect error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin only middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

// Seller only middleware — admins are also allowed through, since an admin
// can act as a store owner too. Attaches nothing extra; controllers scope
// queries to req.user._id themselves.
const seller = (req, res, next) => {
  if (req.user && (req.user.isSeller || req.user.isAdmin)) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as a seller" });
  }
};

module.exports = { protect, admin, seller };
