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
You are a software engineer. Fix the following ${language} code and return only the corrected version:

\`\`\`${language}
${codeSnippet}
\`\`\`

${contextText ? `Here is additional context:\n\n${contextText}` : ''}
`;

  try {
    const fixedCode = await sendPrompt(prompt);

    if (req.user?.id) {
      await Response.create({
        userId: req.user.id,
        input: codeSnippet,
        output: fixedCode,
        command: 'fix',
        createdAt: new Date(),
      });
    }

    res.json({ fixedCode });
  } catch (err) {
    console.error('Fix route error:', err);
    res.status(500).json({ error: 'Failed to fix code' });
  }
});

module.exports = router;
