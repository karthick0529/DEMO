const express = require('express');
const User = require('../models/user'); 
const bcrypt =require("bcryptjs");
const dotenv = require('dotenv');
const JWT = require('jsonwebtoken');

dotenv.config();

const router = express.Router();

const generateToken = (user) => {

  return JWT.sign(
    { id:user.id, name:user.name },
     process.env.JWT_TOKEN, 
     { expiresIn: '1h',}
    );
}

router.post('/register', async (req, res) => {
  try {
    // const newUser = new User(req.body);

    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if(!user) {
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({name,password:hashedPassword});
    await newUser.save();
    res.status(200).json({
      userID : newUser._id,
      name: newUser.name,
      password: hashedPassword,
      token: generateToken(newUser)
    });
    } else {
      return res.status(400).send('User already exists');
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log(req.body); // Log the request body
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid password');
    
    res.status(200).json({
      message: 'Logged in successfully',
      token: generateToken(user)
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;

