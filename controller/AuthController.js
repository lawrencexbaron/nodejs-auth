const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// import User model
const User = require("../model/User");
const verify = require("../utils/verifyToken");
const { registerValidation, loginValidation } = require("../utils/validation");

const register = async (req, res) => {
  // Validate data before creating a user
  const { error } = registerValidation(req.body);
  // Iterate through the error.details array and return the messages
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: messages, data: {} });
  }
  // Check if email exists
  const checkEmail = await User.findOne({ email: req.body.email });
  if (checkEmail)
    return res.status(400).json({ message: "Email already exists", data: {} });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  // Validate data before creating a user
  const { error } = loginValidation(req.body);
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: messages, data: {} });
  }
  // Check if email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "User not found" });

  // Check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

  return res
    .status(200)
    .header("auth-token", token)
    .json({ message: "success", data: { token: token, id: user._id } });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  getUsers,
};
