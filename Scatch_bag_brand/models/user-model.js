const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/scatch_bag_brand');

// Define the User Schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order', // Assuming you have an Order model
    },
  ],
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  picture: {
    type: String, // URL or path to the image
    default: '', // Default value if no picture is uploaded
  },
}, { timestamps: true }); // Add createdAt and updatedAt fields

// Create the User Model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;