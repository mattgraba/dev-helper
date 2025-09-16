import express from 'express';
const router = express.Router();
import { sendPrompt } from '../services/openaiService.js';
import Response from '../models/Response.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Missing or invalid name' });
  }

  const prompt = `
Scaffold a modern React component named "${name}" using best practices.
Include comments and clear structure.
`;

  try {
    const scaffoldCode = await sendPrompt(prompt);

    if (req.user?.id) {
      await Response.create({
        userId: req.user.id,
        input: name,
        output: scaffoldCode,
        command: 'scaffold',
        createdAt: new Date(),
      });
    }

    res.json({ scaffoldCode });
  } catch (err) {
    console.error('Scaffold route error:', err);
    res.status(500).json({ error: 'Failed to generate scaffold' });
  }
});

export default router;
