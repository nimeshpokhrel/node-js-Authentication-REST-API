const router = require("express").Router();
const { registerUser, loginUser } = require("../services/auth");

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = { routes: router };
