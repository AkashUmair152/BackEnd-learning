const mongoose = require('mongoose');

// Define the Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // URL or path to the image
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Price cannot be negative
  },
  bgColor: {
    type: String,
    default: '#ffffff', // Default background color
  },
  panelColor: {
    type: String,
    default: '#f5f5f5', // Default panel color
  },
  textColor: {
    type: String,
    default: '#000000', // Default text color
  },
}, { timestamps: true }); // Add createdAt and updatedAt fields

// Create the Product Model
const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;