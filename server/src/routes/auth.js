import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'default-secret-key';

router.post('/login', (req, res) => {
  const { userId } = req.body;

  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    return res.status(400).json({ error: 'Missing or invalid userId' });
  }

  const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '7d' });
  res.json({ token });
});

export default router;
