const express= require("express");
const app = express();
const path = require("path");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index");

})

app.get("/profile/:username",(req,res)=>{
    const username = req.params.username;
    res.send(`<h1>hello ${username} & welcome to the profile</h1>`);     
})

app.listen(3000, () => {
    console.log("its working on port 3000");
}) 

