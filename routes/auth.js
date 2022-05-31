const router = require("express").Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
} = require("../services/auth");

router.get("/register", (request, response) => {
  if (request.session.isAuthenticated)
    return response.redirect("/app/dashboard");
  else return response.render("register", { title: "TestBlogs | Register", message: "" });
});

router.post("/register", registerUser);

router.get("/login", (request, response) => {
  if (request.session.isAuthenticated)
    return response.redirect("/app/dashboard");
  else return response.render("login", { title: "TestBlogs | Login", message: "" });
});

router.post("/login", loginUser);

router.get("/forgot", (request, response) => {
  if (request.session.isAuthenticated)
    return response.redirect("/app/dashboard");
  else
    return response.render("forgot", { title: "TestBlogs | Reset Password", message: "" });
});

router.post("/forgot", forgotPassword);

router.post("/logout", logoutUser);

module.exports = { routes: router };
