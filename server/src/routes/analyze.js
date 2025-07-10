const express = require('express');
const router = express.Router();
const { sendPrompt } = require('../services/openaiService');
const extractExplanationAndFix = require('../utils/extractExplanationAndFix');
const Response = require('../models/Response');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const { errorText, language = 'JavaScript', contextFiles = [] } = req.body;

  if (!errorText || typeof errorText !== 'string' || !errorText.trim()) {
    return res.status(400).json({ error: 'Missing or invalid errorText' });
  }

  const contextText = contextFiles.map(f => `// ${f.name}\n${f.content}`).join('\n\n');

  const prompt = `
You're an AI debugger. Analyze the following ${language} code, explain the error, and suggest a fix:

\`\`\`${language}
${errorText}
\`\`\`

${contextText ? `Context:\n\n${contextText}` : ''}
`;

  try {
    const fullResponse = await sendPrompt(prompt);
    const { explanation, fix } = extractExplanationAndFix(fullResponse);

    if (req.user?.id) {
      await Response.create({
        userId: req.user.id,
        input: errorText,
        output: `${explanation}\n\n${fix}`,
        command: 'analyze',
        createdAt: new Date(),
      });
    }

    res.json({ explanation, fix });
  } catch (err) {
    console.error('Analyze route error:', err);
    res.status(500).json({ error: 'Failed to analyze error' });
  }
});

module.exports = router;

