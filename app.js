const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = 3000;

env.config();

mongoose.connect(process.env.DB_CONNECT, () => {
  console.log("connected to db");
});

app.use(bodyParser.json());

app.use("/api/user", authRoutes.routes);

app.use("/api/post", postRoutes.routes);

app.get("/", (request, response) => {
  response.send("success");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
