const router = require("express").Router();
const { privateRoutesAuth } = require("../auth/privateRoutesAuth");
const { getPosts, addPost, deletePost } = require("../models/posts");

router.get("/", getPosts);

router.post("/add", privateRoutesAuth, addPost)

router.delete("/delete", privateRoutesAuth, deletePost)

module.exports = { routes: router };
