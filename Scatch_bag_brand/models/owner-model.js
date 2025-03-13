const mongoose = require('mongoose');


// Define the User Schema
const ownerSchema = new mongoose.Schema({
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
 
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order', // Assuming you have an Order model
    },
  ],
  picture: {
    type: String, // URL or path to the image
    default: '', // Default value if no picture is uploaded
  },
}, { timestamps: true }); // Add createdAt and updatedAt fields

// Create the User Model
const ownerModel = mongoose.model('owner', ownerSchema);

module.exports = ownerModel;