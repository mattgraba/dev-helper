const express = require('express');
const router = express.Router();
const { sendPrompt } = require('../services/openaiService');
const Response = require('../models/Response');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const { codeSnippet, language = 'JavaScript', contextFiles = [] } = req.body;

  if (!codeSnippet || typeof codeSnippet !== 'string' || !codeSnippet.trim()) {
    return res.status(400).json({ error: 'Missing or invalid codeSnippet' });
  }

  const contextText = contextFiles.map(f => `// ${f.name}\n${f.content}`).join('\n\n');

  const prompt = `
You are an expert software engineer.
Explain the following ${language} code snippet line by line in beginner-friendly terms:

\`\`\`${language}
${codeSnippet}
\`\`\`

${contextText ? `Additional context:\n\n${contextText}` : ''}
`;

  try {
    const explanation = await sendPrompt(prompt);

    if (req.user?.id) {
      await Response.create({
        userId: req.user.id,
        input: codeSnippet,
        output: explanation,
        command: 'explain',
        createdAt: new Date(),
      });
    }

    res.json({ explanation });
  } catch (err) {
    console.error('Explain route error:', err);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

module.exports = router;
