const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Add favorite
router.post('/add', authMiddleware, async (req, res) => {
  const { countryCode } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user.favorites.includes(countryCode)) {
      user.favorites.push(countryCode);
      await user.save();
    }
    res.json({ message: 'Favorite added', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove favorite
router.post('/remove', authMiddleware, async (req, res) => {
  const { countryCode } = req.body;
  try {
    const user = await User.findById(req.userId);
    user.favorites = user.favorites.filter(code => code !== countryCode);
    await user.save();
    res.json({ message: 'Favorite removed', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get favorites
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;