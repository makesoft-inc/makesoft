const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get users (protected route)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // User model should be defined in auth service, but for MVP we'll use a simple query
    // In production, this would be a shared model or service-to-service call
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}, { projection: { password: 0, oauthId: 0 } }).limit(100).toArray();

    res.json({
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne(
      { _id: new mongoose.Types.ObjectId(req.user.userId) },
      { projection: { password: 0, oauthId: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

