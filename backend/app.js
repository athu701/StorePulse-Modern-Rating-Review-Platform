const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const storeRoutes = require("./routes/store.routes");
const ratingRoutes = require("./routes/rating.routes");
const reactionRoutes = require("./routes/reaction.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
app.use(
  cors({
    origin:"*",
    credentials: false,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("API is running"));

module.exports = app;
