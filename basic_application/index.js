const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/user", (req, res) => {
  res.send("this is a User of Backend ");
});
app.get("/profile", (req, res) => {
  res.send("This is Profile Page of a User");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
