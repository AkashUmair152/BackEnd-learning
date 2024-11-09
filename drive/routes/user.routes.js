const express = require("express");

const router = express.router();

router.get("/test", (req, res) => {
  res.send("user test route");
});

MediaSourceHandle.exports = router;
