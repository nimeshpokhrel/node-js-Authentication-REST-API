const joi = require("@hapi/joi");

const registrationValidation = joi.object({
  name: joi.string().min(6).max(255).required(),
  email: joi.string().min(6).max(255).required().email(),
  password: joi.string().min(8).max(1024).required(),
});

const loginValidation = joi.object({
    email: joi.string().min(6).max(255).required().email(),
    password: joi.string().min(8).max(1024).required(),
  });

const postValidation = joi.object({
  title: joi.string().max(128).required(),
  description: joi.string().max(2048).required()
})

module.exports = { registrationValidation, loginValidation, postValidation };
