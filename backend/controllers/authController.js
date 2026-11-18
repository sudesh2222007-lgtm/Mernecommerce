const mongoose = require("mongoose");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const connectDB = require("../config/db");

// Persistent fallback registry in global scope across hot serverless executions
global.fallbackUsers = global.fallbackUsers || [];

const demoUsers = [
  { _id: "demo_admin", name: "Admin User", email: "admin@example.com", password: "123456", isAdmin: true, isSeller: false },
  { _id: "demo_john", name: "John Doe", email: "john@example.com", password: "123456", isAdmin: false, isSeller: false },
  { _id: "demo_seller1", name: "Seller", email: "seller1@example.com", password: "123456", isAdmin: false, isSeller: true, storeName: "Seller Store" },
  { _id: "demo_seller2", name: "Rahul Verma", email: "seller2@example.com", password: "123456", isAdmin: false, isSeller: true, storeName: "Urban Threads" },
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, isSeller, storeName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (isSeller && !storeName) {
      return res
        .status(400)
        .json({ message: "Please provide a store name to register as a seller" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Try DB connection if configured
    if (process.env.MONGO_URI && mongoose.connection.readyState !== 1) {
      try {
        await connectDB();
      } catch (e) {}
    }

    // 2. If connected to MongoDB, persist to MongoDB
    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        isSeller: !!isSeller,
        storeName: isSeller ? (storeName || "").trim() : "",
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        storeName: user.storeName,
        token: generateToken({
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          storeName: user.storeName,
        }),
      });
    }

    // 3. Resilient offline/serverless fallback: allow instant registration without blocking
    const existsInDemo = demoUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    const existsInFallback = (global.fallbackUsers || []).some(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (existsInDemo || existsInFallback) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = {
      _id: "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8),
      name: name.trim(),
      email: cleanEmail,
      password: password,
      isAdmin: false,
      isSeller: !!isSeller,
      storeName: isSeller ? (storeName || "").trim() : "",
      createdAt: new Date().toISOString(),
    };

    global.fallbackUsers = global.fallbackUsers || [];
    global.fallbackUsers.push(newUser);

    const token = generateToken({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      isSeller: newUser.isSeller,
      storeName: newUser.storeName,
    });

    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      isSeller: newUser.isSeller,
      storeName: newUser.storeName,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Try DB connection if configured
    if (process.env.MONGO_URI && mongoose.connection.readyState !== 1) {
      try {
        await connectDB();
      } catch (e) {}
    }

    // If connected to MongoDB, query the database
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          storeName: user.storeName,
          token: generateToken({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
            storeName: user.storeName,
          }),
        });
      }
      if (user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    }

    // Check demo users
    const demo = demoUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (demo) {
      return res.json({
        _id: demo._id,
        name: demo.name,
        email: demo.email,
        isAdmin: demo.isAdmin,
        isSeller: demo.isSeller,
        storeName: demo.storeName || "",
        token: generateToken({
          id: demo._id,
          name: demo.name,
          email: demo.email,
          isAdmin: demo.isAdmin,
          isSeller: demo.isSeller,
          storeName: demo.storeName || "",
        }),
      });
    }

    // Check fallback registered users
    const fallback = (global.fallbackUsers || []).find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (fallback) {
      return res.json({
        _id: fallback._id,
        name: fallback.name,
        email: fallback.email,
        isAdmin: fallback.isAdmin,
        isSeller: fallback.isSeller,
        storeName: fallback.storeName || "",
        token: generateToken({
          id: fallback._id,
          name: fallback.name,
          email: fallback.email,
          isAdmin: fallback.isAdmin,
          isSeller: fallback.isSeller,
          storeName: fallback.storeName || "",
        }),
      });
    }

    res.status(401).json({
      message: "Invalid email or password. (For demo access, use admin@example.com / 123456)",
    });
  } catch (error) {
    console.error("Login error:", error);
    const cleanEmail = (req.body?.email || "").toLowerCase().trim();
    const password = req.body?.password;

    const demo = demoUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );
    if (demo) {
      return res.json({
        _id: demo._id,
        name: demo.name,
        email: demo.email,
        isAdmin: demo.isAdmin,
        isSeller: demo.isSeller,
        storeName: demo.storeName || "",
        token: generateToken({
          id: demo._id,
          name: demo.name,
          email: demo.email,
          isAdmin: demo.isAdmin,
          isSeller: demo.isSeller,
          storeName: demo.storeName || "",
        }),
      });
    }

    const fallback = (global.fallbackUsers || []).find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );
    if (fallback) {
      return res.json({
        _id: fallback._id,
        name: fallback.name,
        email: fallback.email,
        isAdmin: fallback.isAdmin,
        isSeller: fallback.isSeller,
        storeName: fallback.storeName || "",
        token: generateToken({
          id: fallback._id,
          name: fallback.name,
          email: fallback.email,
          isAdmin: fallback.isAdmin,
          isSeller: fallback.isSeller,
          storeName: fallback.storeName || "",
        }),
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (req.user) {
      return res.json(req.user);
    }
    res.status(404).json({ message: "User not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send OTP to user phone
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    res.json({
      success: true,
      message: "OTP sent successfully to " + (phone || "phone"),
      devMode: true,
      devOtp: "1234",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP code
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (otp === "1234" || otp === 1234) {
      return res.json({
        success: true,
        message: "OTP verified successfully",
      });
    }
    res.status(400).json({ success: false, message: "Invalid OTP code. Use 1234." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, sendOtp, verifyOtp };

