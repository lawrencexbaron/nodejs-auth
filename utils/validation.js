const Joi = require("joi");

// Base options for Joi validation
const baseOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
  abortEarly: false,
};

// Register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data, baseOptions);
};

// Login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data, baseOptions);
};

module.exports.registerValidation = registerValidation;
