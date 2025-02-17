const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const userModel = require("./models/user"); // Import the User model

const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/mydatabase", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

connectDB(); // Call the function to connect to MongoDB

// Middleware to serve static files
app.use(express.static("public"));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Use Morgan for logging
app.use(morgan("dev"));

// Middleware to parse URL-encoded form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware for all routes
// app.use((req, res, next) => {
//   console.log("this is middleware");
//   let a = 5;
//   let b = 5;
//   console.log(a / b);
//   return next();
// });


// Default route
app.get("/", (req, res) => {
  res.render("index");
});


// Route to handle form submission
app.post("/get-data", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user using the User model
    const newUser = new userModel({ username, email, password });

    // Save the user to the database
    await newUser.save();

    // console.log("User saved:", newUser);

    // Send a JSON response indicating success
    res.status(200).json({ success: true, message: "User added successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});