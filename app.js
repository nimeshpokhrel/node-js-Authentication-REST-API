const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");
const bodyParser = require("body-parser");
const session = require("express-session")
const mongodbSession = require("connect-mongodb-session")(session)

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = 3000;

env.config();
``
mongoose.connect(process.env.DB_CONNECT, () => {
  console.log("Connected to DataBase");
});

const saveSession = new mongodbSession({
  uri: process.env.DB_CONNECT,
  collection: "sessions"
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  store: saveSession
}))

app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))

app.set("view engine", "ejs")

app.use(bodyParser.json());

app.use("/user", authRoutes.routes);

app.use("/app", postRoutes.routes);

app.get("/", (request, response) => {
  if (request.session.isAuthenticated) return response.redirect("/app/dashboard")
  else return response.redirect("/user/login");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
