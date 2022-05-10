const { userSchema } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registrationValidation,
  loginValidation,
} = require("../models/validationModel");

const registerUser = async (request, response) => {
  //Validate the request data
  const validation = registrationValidation.validate(request.body);
  if (validation.error) return response.status(400).send(validation.error);

  //Check if user already exists
  const emailExist = await userSchema.findOne({
    email: request.body.email,
  });
  if (emailExist)
    return response.status(400).send("User with the email already exist");

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
    response.send(savedUser);
  } catch (error) {
    response.status(400).send(error);
  }
};

const loginUser = async (request, response) => {
  //Validate the request data
  const validation = loginValidation.validate(request.body);
  if (validation.error) return response.status(400).send(validation.error);

  //Check Email
  const checkEmail = await userSchema.findOne({
    email: request.body.email,
  });

  //Check Password
  const checkPassword = await bcrypt.compare(
    request.body.password,
    checkEmail.password
  );

  //Login Condition
  if (checkEmail && checkPassword == true) {
    //Assign a token
    const loginToken = jwt.sign(
      { _id: checkEmail._id },
      process.env.TOKEN_SECRET
    );
    return response
      .status(200)
      .header("auth-token", loginToken)
      .send("login successful");
  }

  if (checkEmail && checkPassword == !true)
    return response.status(400).send("Invalid Credentials");
};

module.exports = { registerUser, loginUser };
