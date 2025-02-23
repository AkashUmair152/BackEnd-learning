const express= require("express");
const cookieParser= require("cookie-parser");
const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");

const app=express();
app.use(cookieParser());

// how to set cookies and read cookies
/*
app.get("/",(req,res)=>{
    res.cookie("name","Akash");
    res.send("cookie is set");
})


app.get("/read",(req,res)=>{
    console.log(req.cookies);
    res.send("Hello World i am reading cookie "+req.cookies.name);
})*/

// Route to generate and display the hash
app.get("/", async (req, res) => {
    const password = "akash"; // The string you want to hash

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        res.send(`Hash generated: ${hash}`);
    } catch (err) {
        res.status(500).send("Error generating hash");
    }
});

// Route to compare a plain-text password with a hash
app.get("/compare", async (req, res) => {
    const plainTextPassword = "akash"; // The password to compare
    const hash = "$2b$10$D5If3b2f9NvezintIMAAvu393Pw/I2X0AkDWAbS/7rBPsn20JKhbi"; // Example hash (replace with your actual hash)

    try {
        const isMatch = await bcrypt.compare(plainTextPassword, hash);

        if (isMatch) {
            res.send("Password matches the hash!");
        } else {
            res.send("Password does NOT match the hash.");
        }
    } catch (err) {
        res.status(500).send("Error comparing password");
    }
});

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})