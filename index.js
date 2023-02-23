const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const AuthRoutes = require("./routes/auth");

// Express App
const app = express();
// Config
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connected to MongoDB");
    // Listen on port
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Middleware
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/auth", AuthRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

router.use((err, req, res, next) => {
  res.status(500).send("Something broke!");
});
