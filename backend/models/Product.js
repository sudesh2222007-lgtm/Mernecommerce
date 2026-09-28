const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    brand: {
      type: String,
      required: true,
      default: 'Aura',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    rating: {
      type: Number,
      required: true,
      default: 4.5,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 12,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 10,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
