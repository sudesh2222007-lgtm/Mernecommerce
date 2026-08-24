const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config({ path: path.resolve(__dirname, ".env") });

// Fail fast with a clear message instead of a cryptic mongoose crash
if (!process.env.MONGO_URI) {
  console.error(
    "\n❌ MONGO_URI is not set.\n" +
      "   Make sure a file named exactly '.env' exists in the backend/ folder\n" +
      `   (expected at: ${path.resolve(__dirname, ".env")})\n` +
      "   and that it contains a line like:\n" +
      "   MONGO_URI=mongodb://127.0.0.1:27017/mern_ecommerce\n"
  );
  process.exit(1);
}

connectDB();

const app = express();

// Middleware
// CLIENT_URL should be set to your deployed frontend's URL in production
// (e.g. https://your-app.vercel.app). Falls back to allowing all origins
// during local development so the Vite dev server works out of the box.
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

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/seller", require("./routes/sellerRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`)
);
