import express from 'express';
const router = express.Router();
import { sendPrompt } from '../services/openaiService.js';
import Response from '../models/Response.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { handleOpenAIError } from '../utils/openaiErrorHandler.js';

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

    // Save to history (non-blocking, don't fail if MongoDB unavailable)
    if (req.user?.id) {
      try {
        await Response.create({
          userId: req.user.id,
          input: codeSnippet,
          output: explanation,
          command: 'explain',
          createdAt: new Date(),
        });
      } catch (dbErr) {
        console.warn('Failed to save to history:', dbErr.message);
      }
    }

    res.json({ explanation });
  } catch (err) {
    const { status, message, retryAfter } = handleOpenAIError(err);
    const response = { error: message };
    if (retryAfter) {
      response.retryAfter = retryAfter;
      res.set('Retry-After', retryAfter.toString());
    }
    return res.status(status).json(response);
  }
});

export default router;
