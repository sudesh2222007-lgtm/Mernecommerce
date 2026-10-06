const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_db';
    const conn = await mongoose.connect(dbUri);
    isConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not run process.exit(1) in serverless environment to prevent function crash
  }
};

module.exports = connectDB;
