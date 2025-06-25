const express = require('express');
const router = express.Router();
const { sendPrompt } = require('../services/openaiService');

router.post('/', async (req, res) => {
  const { codeSnippet, language = 'JavaScript' } = req.body;

  if (!codeSnippet) return res.status(400).json({ error: 'Missing codeSnippet' });

  const prompt = `
You are an expert software engineer.
Explain the following ${language} code snippet line by line in simple terms:

\`\`\`${language}
${codeSnippet}
\`\`\`

Provide clear explanations but keep it concise.
`;

  try {
    const explanation = await sendPrompt(prompt);
    res.json({ explanation });
  } catch (err) {
    console.error('Explain route error:', err);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

module.exports = router;
