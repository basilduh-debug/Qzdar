const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/signup - register a new user
router.post('/signup', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: 'Username and password are required' });
    }

    // Check if username is taken
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ msg: 'Username already exists' });

    // Hash the password (JWT lecture - L13)
    const hashed = await bcrypt.hash(password, 10);

    // Save the new user
    const user = new User({ username, password: hashed, role: role || 'user' });
    await user.save();

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: { id: user._id, name: user.username, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/auth/signin - log in
router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    // Compare hashes (bcrypt)
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: 'Incorrect password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: { id: user._id, name: user.username, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
