import express from 'express';
const router = express.Router();
import { sendPrompt } from '../services/openaiService.js';
import extractExplanationAndFix from '../utils/extractExplanationAndFix.js';
import Response from '../models/Response.js';
import authMiddleware from '../middleware/authMiddleware.js';

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

    // Save to history (non-blocking, don't fail if MongoDB unavailable)
    if (req.user?.id) {
      try {
        await Response.create({
          userId: req.user.id,
          input: errorText,
          output: `${explanation}\n\n${fix}`,
          command: 'analyze',
          createdAt: new Date(),
        });
      } catch (dbErr) {
        console.warn('Failed to save to history:', dbErr.message);
      }
    }

    res.json({ explanation, fix });
  } catch (err) {
    console.error('Analyze route error:', err);
    res.status(500).json({ error: 'Failed to analyze error' });
  }
});

export default router;

