const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'default-secret-key';

router.post('/login', (req, res) => {
  const { userId } = req.body;

  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    return res.status(400).json({ error: 'Missing or invalid userId' });
  }

  const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '7d' });
  res.json({ token });
});

module.exports = router;
