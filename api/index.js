const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../backend/config/db");

dotenv.config({ path: "../backend/.env" });

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

// OTP endpoints for mobile verification & demo fallback
app.post("/api/auth/send-otp", (req, res) => {
  const { phone } = req.body;
  return res.json({
    success: true,
    message: "OTP sent successfully",
    devMode: true,
    devOtp: "1234",
  });
});

app.post("/api/auth/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  if (otp === "1234" || otp === 1234) {
    return res.json({
      success: true,
      message: "OTP verified successfully",
    });
  }
  return res.status(400).json({ success: false, message: "Invalid OTP code. Use 1234." });
});

app.use("/api/auth", require("../backend/routes/authRoutes"));
app.use("/api/products", require("../backend/routes/productRoutes"));
app.use("/api/orders", require("../backend/routes/orderRoutes"));
app.use("/api/users", require("../backend/routes/userRoutes"));
app.use("/api/admin", require("../backend/routes/adminRoutes"));
app.use("/api/info", require("../backend/routes/infoRoutes"));
app.use("/api/notifications", require("../backend/routes/notificationRoutes"));
app.use("/api/reviews", require("../backend/routes/reviewRoutes"));

module.exports = app;