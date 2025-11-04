require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const threadsRoutes = require('./routes/threads');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const forumLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(forumLimiter);

// Routes
app.use('/health', healthRoutes);
app.use('/threads', threadsRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/makesoft';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Forum service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing MongoDB connection');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;

