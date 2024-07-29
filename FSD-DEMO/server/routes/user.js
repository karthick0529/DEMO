const express = require("express");
const router = express.Router();
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Current user information

router.get("/", auth, async (req, res) => {
  const profile = await User.findById(req.user.id);
  res.send(profile);
});

// Register new user

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  //check if user already exists
  let user = await User.findOne({ email });
  if (user) return res.status(400).send("User already exists");

  //Save the new user
  user = new User({ name, email, password });
  await user.save();

  //Generate Token and send it
  const jwtData = { id: user_id, name: user.name };
  const token = jwt.sign(jwtData, process.env.JWTSECRET, { expires: "24hr" });
  res.send({ token });
});

module.exports = router;
