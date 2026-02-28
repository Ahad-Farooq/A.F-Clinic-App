const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER ROUTE (Standard Name)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role 
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully! Please Login." });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // JWT Token Generation (JWT_SECRET environment variable se lega)
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'af_clinic_secret_key_2024', 
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, role: user.role } 
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;