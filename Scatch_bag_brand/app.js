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


app.get("/", (req, res) => {
    res.send("Hello World!");
}); 

app.listen(3000, () => {
    console.log(`Example app listening on port ${port}`);
});