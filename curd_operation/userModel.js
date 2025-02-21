// userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false, // Optional field
  },
  image: {
    type: String, // This will store the path to the uploaded image
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);