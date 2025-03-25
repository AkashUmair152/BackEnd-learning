const express = require("express");
const app = express();
const port = 3000;
const multer = require('multer');
const cookieParser = require('cookie-parser');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const path=require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// database connection here 
const connectDB = require('./config/mongoose-connecetion');
connectDB();

// handling routes here 
const productRouter = require('./routes/productRouter');
const ownerRouter = require('./routes/ownerRouter');
const userRouter = require('./routes/userRouter');
const { env } = require("process");

app.use('/product', productRouter);
app.use('/owner', ownerRouter);
app.use('/users', userRouter);



app.get('/', (req, res) => {
    res.send(' Welcome to the Home Page ');
});


app.listen(3000, () => {
    console.log(`Example app listening on port ${port}`);
});