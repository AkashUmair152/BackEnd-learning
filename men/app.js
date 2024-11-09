const express = require("express");
const morgan = require("morgan");

const app = express();
const connection = require("./config/db");

const userModel = require("./models/user");

app.use(express.static("public"));

// reading json data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// morgan logger

app.use(morgan("dev"));

// render html
app.set("view engine", "ejs");

// // form hadlling with express

// app.post("/get-data", (req, res) => {
//   console.log(req.body);
//   res.send("data received ");
// });

// user registeration route

app.get("/", (req, res) => {
  res.render("register");
});

// create a user from front from to the backend database
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const newUser = await userModel.create({
    username: username,
    email: email,
    password: password,
  });

  res.send(newUser);
});

// find/read method

app.get("/all-user", (req, res) => {
  userModel.find().then((users) => {
    res.send(users);
  });
});

// update method

app.get("/update", async (req, res) => {
  await userModel.findOneAndUpdate(
    {
      username: "akash",
    },
    {
      email: "akash@123.com",
    }
  );
  res.send("user updated");
});

// delete method

app.get("/delete", async (req, res) => {
  await userModel.findOneAndDelete({
    username: "aaaaaa",
  });
  res.send("user deleted");
});

// defining server

app.listen(3000);
