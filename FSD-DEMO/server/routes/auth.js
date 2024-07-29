const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Login Route

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  let user = await User.findOne({ email, password });
  if (!user)
    return res.status(400).send({ message: "Invalid email or password" });

  // Generate Token and send it
  const jwtData = { id: user._id, name: user.name };
  const token = jwt.sign(jwtData, process.env.JWTSECRET, { expiresIn: "24h" });
  res.send({ token });
});

module.exports = router;
