const express = require('express');
const router = express.Router();
const { sendPrompt } = require('../services/openaiService');
const Response = require('../models/Response');
const authMiddleware = require('../middleware/authMiddleware');

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

module.exports = router;
