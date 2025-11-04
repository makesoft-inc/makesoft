const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Google OAuth
require('../strategies/google');
require('../strategies/github');

// Initialize Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/oauth/failure' }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Redirect to frontend with token
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/callback?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect('/oauth/failure');
    }
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/oauth/failure' }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/callback?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect('/oauth/failure');
    }
  }
);

// Unified callback endpoint
router.get('/callback', async (req, res) => {
  // This endpoint handles both Google and GitHub callbacks
  // The actual callback logic is in the provider-specific routes above
  res.status(400).json({ error: 'Invalid OAuth callback' });
});

// OAuth failure handler
router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'OAuth authentication failed' });
});

module.exports = router;

