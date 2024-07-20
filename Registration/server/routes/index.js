const express = require('express');
const User = require('../models/user'); 
const bcrypt =require("bcryptjs");

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    // const newUser = new User(req.body);

    const { name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({name,password:hashedPassword});
    await newUser.save();
    res.status(200).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid password');
    res.status(200).send('Logged in successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

