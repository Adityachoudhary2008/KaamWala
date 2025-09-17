const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Provider = require('../models/Provider');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, serviceType, location, phone } = req.body;
    const existingProvider = await Provider.findOne({ email });
    if(existingProvider) return res.status(400).json({ message:"Email already registered", success:false });

    const hashedPassword = await bcrypt.hash(password,10);
    const newProvider = new Provider({ name,email,password:hashedPassword, serviceType,location,phone });
    await newProvider.save();

    res.json({ message:"Provider registered successfully", success:true, provider:{ _id:newProvider._id, name:newProvider.name, email:newProvider.email, serviceType:newProvider.serviceType } });
  } catch(err){
    res.status(500).json({ message:err.message, success:false });
  }
});

// Login
router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    const provider = await Provider.findOne({ email });
    if(!provider) return res.status(400).json({ message:"Provider not found", success:false });

    const isMatch = await bcrypt.compare(password, provider.password);
    if(!isMatch) return res.status(400).json({ message:"Invalid password", success:false });

    const token = jwt.sign({ id:provider._id, role:"provider" }, process.env.JWT_SECRET, { expiresIn:"1d" });

    res.json({ message:"Login successful", success:true, provider:{ _id:provider._id, name:provider.name, email:provider.email, serviceType:provider.serviceType }, token });
  } catch(err){
    res.status(500).json({ message:err.message, success:false });
  }
});

module.exports = router;
