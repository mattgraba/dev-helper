import express from 'express';
const router = express.Router();
import Response from '../models/Response.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.get('/', authMiddleware, async (req, res) => {
  try {
    // Always filter by the authenticated user's ID
    const userId = req.user.id;
    const results = await Response.find({ userId }).sort({ createdAt: -1 }).limit(20);

    res.json(results);
  } catch (err) {
    console.error('History route error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { command, input, output } = req.body;

    const newEntry = await Response.create({
      userId: req.user.id,
      command,
      input,
      output,
      createdAt: new Date(),
    });

    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Failed to save to history:', err);
    res.status(500).json({ error: 'Failed to save history' });
  }
});


export default router;