const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Signup
router.post('/signup', async (req,res)=>{
  try{
    const { name,email,password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if(existingAdmin) return res.status(400).json({ message:"Email already registered", success:false });

    const hashedPassword = await bcrypt.hash(password,10);
    const newAdmin = new Admin({ name,email,password:hashedPassword });
    await newAdmin.save();

    res.json({ message:"Admin registered successfully", success:true, admin:{ _id:newAdmin._id, name:newAdmin.name, email:newAdmin.email } });
  } catch(err){
    res.status(500).json({ message:err.message, success:false });
  }
});

// Login
router.post('/login', async (req,res)=>{
  try{
    const { email,password } = req.body;
    const admin = await Admin.findOne({ email });
    if(!admin) return res.status(400).json({ message:"Admin not found", success:false });

    const isMatch = await bcrypt.compare(password, admin.password);
    if(!isMatch) return res.status(400).json({ message:"Invalid password", success:false });

    const token = jwt.sign({ id:admin._id, role:"admin" }, process.env.JWT_SECRET, { expiresIn:"1d" });

    res.json({ message:"Login successful", success:true, admin:{ _id:admin._id, name:admin.name, email:admin.email }, token });
  } catch(err){
    res.status(500).json({ message:err.message, success:false });
  }
});

module.exports = router;
