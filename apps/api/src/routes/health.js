const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (req, res) => {
  const status = {
    status: 'ok',
    service: 'api',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  };

  const statusCode = status.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(status);
});

module.exports = router;

