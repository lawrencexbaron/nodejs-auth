const express = require("express");
const router = express.Router();
// import User model
const User = require("../model/User");
const verify = require("../utils/verifyToken");
// Import Controller
const AuthController = require("../controller/AuthController");

// Create register route (POST) using UserSchema model (model\User.js)
router.post("/register", AuthController.register);

// Create login route (POST) using UserSchema model (model\User.js)
router.post("/login", AuthController.login);

// Get Users route (GET) using UserSchema model (model\User.js)
router.get("/users", verify, AuthController.getUsers);

module.exports = router;
