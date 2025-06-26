const express = require('express');
const router = express.Router();
const { sendPrompt } = require('../services/openaiService');

router.post('/', async (req, res) => {
  const {
    goal,
    context = {},
    task = 'Generate project file structure and boilerplate code.',
    outputPreference = 'modular code blocks'
  } = req.body;

  if (!goal) return res.status(400).json({ error: 'Missing goal' });

  const prompt = `
You are a senior full-stack engineer and code scaffolding expert.
Your task is to help a developer accomplish the following goal:
Goal: ${goal}

Here is the current context:
${JSON.stringify(context, null, 2)}

Task: ${task}
Output Preference: ${outputPreference}

Respond ONLY with code and brief explanations if needed.
`;

  try {
    const response = await sendPrompt(prompt);
    res.json({ componentCode: response });
  } catch (err) {
    console.error('Scaffold route error:', err);
    res.status(500).json({ error: 'Failed to get scaffold output' });
  }
});

module.exports = router;
