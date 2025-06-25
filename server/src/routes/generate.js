const express = require('express');
const router = express.Router();
const { sendPrompt } = require('../services/openaiService');

router.post('/', async (req, res) => {
  const {
    description,
    language = 'JavaScript',
    context = '',
    fileType = '',
    outputPreference = 'code only, no explanation'
  } = req.body;

  if (!description) return res.status(400).json({ error: 'Missing description' });

  const prompt = `
You are a senior software engineer and code generator.
Generate a ${fileType || 'code file'} in ${language} based on the following description:

"${description}"

${context ? `Context:\n${context}` : ''}

Only output clean, complete code with no explanation.
`;

  try {
    const result = await sendPrompt(prompt);
    res.json({ result });
  } catch (err) {
    console.error('Generate route error:', err);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

module.exports = router;
