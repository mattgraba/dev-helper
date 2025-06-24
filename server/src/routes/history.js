const express = require('express');
const router = express.Router();
const Response = require('../models/Response');

// GET /history - fetch recent responses (optionally filtered by user later)
router.get('/', async (req, res) => {
  const { userId } = req.query;
  const query = userId ? { userId } : {};
  
  try {
    const responses = await Response.find(query)
      .sort({ timestamp: -1 }) // newest first
      .limit(20); // limit for performance/sanity

    res.json(responses);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
