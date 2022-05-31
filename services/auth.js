const crypto = require("crypto");

const { passwordResetSchema } = require("../models/passwordResetModel");
const { userSchema } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const {
  registrationValidation,
  loginValidation,
} = require("../models/validationModel");

const registerUser = async (request, response) => {
  //Validate the request data
  const validation = registrationValidation.validate(request.body);
  if (validation.error) return response.render("register", { title: "TestBlogs | Register", message: `${validation.error.message}` });

  //Check if user already exists
  const emailExist = await userSchema.findOne({
    email: request.body.email,
  });
  if (emailExist)
    return response.render("register", { title: "TestBlogs | Register", message: `"email" exists for another user` });

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(request.body.password, salt);

  //Register the new user
  const user = new userSchema({
    name: request.body.name,
    email: request.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    response.redirect("/user/login");
  } catch (error) {
    response.status(400).send(error);
  }
};

const loginUser = async (request, response) => {
  //Validate the request data
  // const validation = loginValidation.validate(request.body);
  // if (validation.error) return response.status(400).send(validation.error);

  //Check Email
  const checkEmail = await userSchema.findOne({
    email: request.body.email,
  });
  if (!checkEmail) return response.render("login", { title: "TestBlogs | Login", message: `"email" or "password" invalid` });

  //Check Password
  const checkPassword = await bcrypt.compare(
    request.body.password,
    checkEmail.password
  );

  //Login Condition
  if (checkEmail && checkPassword == true) {
    //Assign a token
    // const loginToken = jwt.sign(
    //   { _id: checkEmail._id },
    //   process.env.TOKEN_SECRET
    // );
    request.session.isAuthenticated = true;
    request.session.userID = checkEmail._id;
    response
      .status(200)
      // .header("auth-token", loginToken)
      .redirect("/app/dashboard");
    return;
  }

  if (checkEmail && checkPassword == !true)
    return response.render("login", { title: "TestBlogs | Login", message: `"email" or "password" invalid` });
};

const logoutUser = (request, response) => {
  request.session.destroy((error) => {
    if (error) throw error;
    response.redirect("/user/login");
  });
};

const forgotPassword = async (request, response) => {
  const checkEmail = await userSchema.findOne({
    email: request.body.email,
  });
  if (!checkEmail) return response.render("forgot", { title: "TestBlogs | Reset Password", message: `"user" with email doesn't exist`, messageType:"alert alert-warning d-flex align-items-center", ariaLabel: "Warning:", xlink: "#exclamation-triangle-fill"  });

  const initialRandomKey = crypto.randomBytes(20).toString("hex");
  const finalRandomKey =
    initialRandomKey + "." + crypto.randomBytes(20).toString("hex");

  const resetKey = new passwordResetSchema({
    resetKey: finalRandomKey,
    selectedUser: checkEmail._id,
  });

  try {
    await resetKey.save();
  } catch (error) {
    response.status(400).send(error);
  }
  response.render("forgot", { title: "TestBlogs | Reset Password", message: `Password reset link sent to email`, messageType: "alert alert-success d-flex align-items-center", ariaLabel: "Success:", xlink: "#check-circle-fill" });
};

module.exports = { registerUser, loginUser, logoutUser, forgotPassword };
