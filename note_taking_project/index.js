const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Route
app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).send("Internal Server Error");
    }

    const tasks = [];
    files.forEach((file) => {
      const filePath = path.join(__dirname, "files", file);
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          return res.status(500).send("Internal Server Error");
        }
        const title = file.replace(".txt", "").split("_").join(" ");
        tasks.push({ title, description: data });

        if (tasks.length === files.length) {
          res.render("index", { files: tasks });
        }
      });
    });

    if (files.length === 0) {
      res.render("index", { files: [] });
    }
  });
});

// Create Task Route
app.post("/create", (req, res) => {
  const fileName = `${req.body.title.split(" ").join("_")}.txt`;
  const filePath = path.join(__dirname, "files", fileName);

  fs.writeFile(filePath, req.body.description, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.redirect("/");
  });
});

// Delete Task Route
app.post("/delete/:title", (req, res) => {
  const fileName = `${req.params.title.split(" ").join("_")}.txt`;
  const filePath = path.join(__dirname, "files", fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.redirect("/");
  });
});

// Start the Server
app.listen(3000, () => {
  console.log("Listening on port 3000");
});