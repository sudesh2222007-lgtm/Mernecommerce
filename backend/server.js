const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const autoSeedIfEmpty = require("./utils/autoSeed");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config({ path: path.resolve(__dirname, ".env") });

if (!process.env.MONGO_URI && process.env.NODE_ENV !== "production") {
  console.error(
    "\n❌ MONGO_URI is not set.\n" +
      "   Make sure MONGO_URI environment variable is configured in Vercel settings.\n"
  );
}

if (process.env.MONGO_URI) {
  connectDB();
}

const app = express();

// Ensure DB is connected & seeded for serverless invocations
app.use(async (req, res, next) => {
  if (process.env.MONGO_URI) {
    try {
      await connectDB();
      await autoSeedIfEmpty();
    } catch (err) {
      return res.status(500).json({ message: "Database connection failed", error: err.message });
    }
  }
  next();
});

// Middleware
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : true;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json()); // to accept JSON data in req.body

// Routes (support both /api/... and direct /... routes in Vercel serverless)
app.use(["/api/auth", "/auth"], require("./routes/authRoutes"));
app.use(["/api/products", "/products"], require("./routes/productRoutes"));
app.use(["/api/orders", "/orders"], require("./routes/orderRoutes"));
app.use(["/api/seller", "/seller"], require("./routes/sellerRoutes"));

app.get(["/", "/api"], (req, res) => {
  res.json({ message: "API is running..." });
});

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`)
  );
}

module.exports = app;


