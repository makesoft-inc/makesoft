const express = require('express');
const { body, validationResult } = require('express-validator');
const Thread = require('../models/Thread');

const router = express.Router();

// Get all threads
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const threads = await Thread.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-replies'); // Don't include replies in list view

    const total = await Thread.countDocuments();

    res.json({
      threads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get threads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single thread
router.get('/:id', async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Increment views
    thread.views += 1;
    await thread.save();

    res.json(thread);
  } catch (error) {
    console.error('Get thread error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create thread
router.post(
  '/',
  [
    body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
    body('content').isLength({ min: 10, max: 10000 }).withMessage('Content must be 10-10000 characters'),
    body('authorId').notEmpty().withMessage('Author ID is required'),
    body('authorUsername').notEmpty().withMessage('Author username is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content, authorId, authorUsername } = req.body;

      const thread = new Thread({
        title,
        content,
        authorId,
        authorUsername,
      });

      await thread.save();

      res.status(201).json(thread);
    } catch (error) {
      console.error('Create thread error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;

