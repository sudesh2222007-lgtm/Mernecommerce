const mongoose = require("mongoose");

// Disable 10-second command buffering so queries never hang if connection is establishing
mongoose.set("bufferCommands", false);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState >= 1) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    console.warn("⚠️ MONGO_URI is not set. Operating in resilient offline fallback mode.");
    return null;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 4000,
      socketTimeoutMS: 30000,
      family: 4, // Use IPv4, skip IPv6 resolution delays
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongooseInstance) => {
        console.log(`✅ MongoDB Connected: ${mongooseInstance.connection.host}/${mongooseInstance.connection.name}`);
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error(`❌ MongoDB connection failed: ${err.message}`);
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`❌ Error awaiting MongoDB connection: ${error.message}`);
    return null;
  }

  return cached.conn;
};

module.exports = connectDB;
