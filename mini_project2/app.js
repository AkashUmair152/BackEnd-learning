const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const multer = require('multer');

// Import Models
const userModel = require('./models/user'); // Assuming you have a user model
const postModel = require('./models/post'); // Assuming you have a post model

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Store uploaded files in the `public/uploads` folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
    },
});

const upload = multer({ storage: storage }); // Define the upload middleware

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(cookieParser()); // Parse cookies

// Set EJS as the Templating Engine
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/miniproject2')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, name, email, password, age } = req.body;

    // Check if the user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) return res.status(400).send('User already exists');

    // Hash the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return res.status(500).send('Error hashing password');

            // Create a new user
            const newUser = new userModel({
                username,
                name,
                email,
                password: hash,
                age,
            });

            try {
                await newUser.save(); // Save the user to the database
                const token = jwt.sign({ id: newUser._id, email: newUser.email }, "secretkey");
                res.cookie('token', token, { httpOnly: true }); // Set JWT token in cookie
                res.redirect('/profile'); // Redirect to profile after registration
            } catch (err) {
                console.error(err);
                res.status(500).send('Error saving user');
            }
        });
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send('User not found');

    // Validate the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid Password');

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, "secretkey");
    res.cookie('token', token, { httpOnly: true }); // Set JWT token in cookie

    res.redirect('/profile'); // Redirect to profile after login
});

app.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the JWT token cookie
    res.redirect('/'); // Redirect to the homepage
});

// Profile Route
app.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).populate('post'); // Fetch user details and populate posts
        if (!user) return res.status(404).send('User not found');

        // Extract posts from the user's `post` array
        const posts = user.post.sort((a, b) => b.date - a.date); // Sort by newest first

        res.render('profile', { userName: user.name, posts }); // Render profile with user's name and posts
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Create Post Route
app.post('/create-post', verifyToken, upload.single('image'), async (req, res) => {
    const { content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Get the image URL if a file was uploaded

    try {
        const newPost = new postModel({
            user: req.user.id,
            content,
            image: imageUrl, // Save the image URL in the database
        });

        await newPost.save(); // Save the post to the database

        // Add the post ID to the user's `post` array
        const user = await userModel.findById(req.user.id);
        user.post.push(newPost._id);
        await user.save();

        res.redirect('/profile'); // Redirect back to the profile page
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating post');
    }
});

// Middleware to Verify JWT Token
function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('You need to log in');

    jwt.verify(token, 'secretkey', function (err, decoded) {
        if (err) return res.status(401).send('Unauthorized');
        req.user = decoded; // Attach the decoded user data to the request object
        next();
    });
}

// Start the Server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});