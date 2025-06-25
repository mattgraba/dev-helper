const express = require('express');
const router = express.Router();
const { sendPrompt } = require('../services/openaiService');

router.post('/', async (req, res) => {
  const { goal, context = '' } = req.body;

  if (!goal) return res.status(400).json({ error: 'Missing goal' });

  const prompt = `
You are a senior developer and DevOps expert.
Given the following project goal and context, provide a concise list of terminal commands to setup, install dependencies, and run the project.

Goal:
${goal}

${context ? `Context:\n${context}\n` : ''}

Return only the terminal commands, with no explanations.
Format commands in a bash-friendly, copy-pasteable manner.
`;

  try {
    const commands = await sendPrompt(prompt);
    res.json({ commands });
  } catch (err) {
    console.error('Terminal route error:', err);
    res.status(500).json({ error: 'Failed to generate terminal commands' });
  }
});

module.exports = router;
