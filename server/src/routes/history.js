const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const results = await Response.find(filter).sort({ createdAt: -1 }).limit(20);

    res.json(results);
  } catch (err) {
    console.error('History route error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});
