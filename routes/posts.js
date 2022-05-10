const router = require("express").Router();
const { privateRoutesAuth } = require("../auth/privateRoutesAuth");
const { getPosts, addPost } = require("../models/posts");

router.get("/", privateRoutesAuth, getPosts);

router.post("/add", privateRoutesAuth, addPost)

module.exports = { routes: router };
