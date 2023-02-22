const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

// Model
const User = require("./model/User");

// Express App
const app = express();

// Config
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_CONNECT, () =>
  console.log("Connected to MongoDB")
);

// Middleware
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log("Middleware");
  console.log(req.path, req.method);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// Get Users route (GET) using UserSchema model (model\User.js)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Create register route (POST) using UserSchema model (model\User.js)
app.post("/register", async (req, res) => {
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password", salt);

  // Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = user.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.json({ message: err });
  }
});

// Create login route (POST) using UserSchema model (model\User.js)
app.post("/login", async (req, res) => {
  // Check if email exists
  const checkEmail = await User.findOne({ email: req.body.email });
  if (!checkEmail) return res.status(400).json({ message: "Email not found" });

  // Check if password is correct
  const validPassword = await bcrypt.compare(
    req.body.password,
    checkEmail.password
  );

  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }

  return res.status(200).json({ message: "Logged in" });
});

// app.use((err, req, res, next) => {
//   logger.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// Listen on port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
