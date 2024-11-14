const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// list of 5 jokes

app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      Id: 1,
      title: "joke 1",
      content: "this is joke 1",
    },
    {
      Id: 2,
      title: "joke 2",
      content: "this is joke 2",
    },
    {
      Id: 3,
      title: "joke 3",
      content: "this is joke 3",
    },
    {
      Id: 4,
      title: "joke 4",
      content: "this is joke 4",
    },
    {
      Id: 5,
      title: "joke 5",
      content: "this is joke 5",
    },
  ];
  res.send(jokes);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server at http//localhost:${port}`);
});
