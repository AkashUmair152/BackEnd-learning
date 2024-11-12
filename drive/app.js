const express = require("express");
const userRoutes = require("./routes/user.routes");
const indexRouter = require("./routes/index.routes");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const connectToDB = require("./config/db");
connectToDB();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// Set view engine to EJS
app.set("view engine", "ejs");
app.use("/", indexRouter);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
