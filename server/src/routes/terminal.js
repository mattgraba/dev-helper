import express from 'express';
const router = express.Router();
import { sendPrompt } from '../services/openaiService.js';
import Response from '../models/Response.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.post('/', authMiddleware, async (req, res) => {
  const { goal, context } = req.body;

  if (!goal || typeof goal !== 'string' || !goal.trim()) {
    return res.status(400).json({ error: 'Missing or invalid goal' });
  }

  const prompt = `
You're a DevOps engineer. Provide the terminal commands to accomplish the following:

"${goal}"

${context ? `\n\nProject context:\n${context}` : ''}
`;

  try {
    const commands = await sendPrompt(prompt);

    if (req.user?.id) {
      await Response.create({
        userId: req.user.id,
        input: goal,
        output: commands,
        command: 'terminal',
        createdAt: new Date(),
      });
    }

    res.json({ commands });
  } catch (err) {
    console.error('Terminal route error:', err);
    res.status(500).json({ error: 'Failed to generate terminal commands' });
  }
});

export default router;
