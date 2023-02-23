// import express
const express = require("express");
// import express router
const router = express.Router();
// import bcrypt
const bcrypt = require("bcrypt");
// import User model
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../utils/validation");

// Create register route (POST) using UserSchema model (model\User.js)
router.post("/register", async (req, res) => {
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
});

// Create login route (POST) using UserSchema model (model\User.js)
router.post("/login", async (req, res) => {
  // Validate data before creating a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  // Check if email exists
  const getUser = await User.findOne({ email: req.body.email });
  if (!getUser) return res.status(400).json({ message: "User not found" });

  // Check if password is correct
  const validPassword = await bcrypt.compare(
    req.body.password,
    getUser.password
  );

  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }
  return res.status(200).json({ message: "success", data: getUser });
});

// Get Users route (GET) using UserSchema model (model\User.js)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
