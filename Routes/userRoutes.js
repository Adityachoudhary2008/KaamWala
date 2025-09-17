const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered", success:false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User registered successfully", success:true, user: { _id:newUser._id, name:newUser.name, email:newUser.email } });
  } catch(err) {
    res.status(500).json({ message: err.message, success:false });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: "User not found", success:false });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ message:"Invalid password", success:false });

    const token = jwt.sign({ id:user._id, role:"user" }, process.env.JWT_SECRET, { expiresIn:"1d" });

    res.json({ message:"Login successful", success:true, user:{ _id:user._id, name:user.name, email:user.email }, token });
  } catch(err) {
    res.status(500).json({ message: err.message, success:false });
  }
});

module.exports = router;
