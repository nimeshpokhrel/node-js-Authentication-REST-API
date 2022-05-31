const router = require("express").Router();

const { checkCookies } = require("../auth/privateRoutesAuth");
const { getPosts, addPost, deletePost } = require("../services/posts");

router.get("/dashboard",checkCookies, (request, response) => {
    response.render("dashboard")
});

router.post("/add", checkCookies, addPost);

router.delete("/delete", checkCookies, deletePost);

module.exports = { routes: router };
