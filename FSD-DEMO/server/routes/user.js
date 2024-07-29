const express = require("express");
const router = express.Router();
const User = require("./models/User");
const jwt = require("jsonwebtoken");

// Current user info

router.get("/", async(req,res) => {
    const profile = await User.findById(req.user.id);
    res.send(profile);
});
