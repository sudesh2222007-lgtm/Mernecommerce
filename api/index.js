const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("../backend/config/db");

dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });

let isConnected = false;
const ensureDB = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error("MongoDB serverless connection error:", err.message);
    }
  }
};

const app = express();
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  await ensureDB();
  next();
});

// Routes
app.use("/api/auth", require("../backend/routes/authRoutes"));
app.use("/api/products", require("../backend/routes/productRoutes"));
app.use("/api/orders", require("../backend/routes/orderRoutes"));
app.use("/api/seller", require("../backend/routes/sellerRoutes"));

app.get(["/", "/api"], (req, res) => {
  res.json({ message: "Norra Ecommerce API is running..." });
});

module.exports = app;
