// server.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const User = require("./userModel");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.set("view engine", "ejs"); // Set EJS as the template engine
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Save uploaded files to the "public/uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename file to avoid conflicts
  },
});

const upload = multer({ storage: storage });

// Ensure the "uploads" folder exists
const fs = require("fs");
const dir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Routes

// Home Page
app.get("/", (req, res) => {
  res.render("index");
});

// View All Users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.render("users", { users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Add User Form
app.get("/add", (req, res) => {
  res.render("add");
});

// Add User POST
app.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { username, email } = req.body;
    const image = req.file.filename; // Get the uploaded file's name
    const newUser = new User({ username, email, image });
    await newUser.save();
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Edit User Form
app.get("/edit/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("edit", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Update User POST
app.post("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { username, email } = req.body;
    const updateData = { username, email };
    if (req.file) {
      updateData.image = req.file.filename; // Only update the image if a new one was uploaded
    }
    await User.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Delete User
app.get("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Start the Server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});