const router = require("express").Router();
const { registerUser, loginUser } = require("../models/auth");

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = { routes: router };
