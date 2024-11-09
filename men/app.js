const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.static("public"));

// reading json data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// morgan logger

app.use(morgan("dev"));

// render html
app.set("view engine", "ejs");

// creating middleware

app.use("/", (req, res, next) => {
  console.log("this is middleware");

  //   res.send("this is middleware");

  return next();
});

app.get("/", (req, res) => {
  res.render("index");
});

// creting a routes using express

app.get("/about", (req, res) => {
  res.send("This is about page");
});

// rendering html with ejs
app.get("/profile", (req, res) => {
  res.render("this is profile page");
});

// form hadlling with express

app.post("/get-data", (req, res) => {
  console.log(req.body);
  res.send("data received ");
});

// defining server

app.listen(3000);
