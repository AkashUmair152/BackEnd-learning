const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const userModel = require('./models/user'); // Assuming you have a user model
const postModel = require('./models/post'); // Assuming you have a post model

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// Register Page
app.get('/register', (req, res) => {
    res.render('register');
});

// Handle User Registration
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

// Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

// Handle User Login
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

// Logout Route
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
app.post('/create-post', verifyToken, async (req, res) => {
    const { content } = req.body;

    try {
        const newPost = new postModel({
            user: req.user.id, // Use `user` to match the schema
            content,
        });

        await newPost.save(); // Save the post to the database

        // Add the post ID to the user's `post` array
        const user = await userModel.findById(req.user.id);
        user.post.push(newPost._id); // Add the post reference to the user's `post` array
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