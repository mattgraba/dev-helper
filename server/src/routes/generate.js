import express from 'express';
const router = express.Router();
import { sendPrompt } from '../services/openaiService.js';
import Response from '../models/Response.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { handleOpenAIError } from '../utils/openaiErrorHandler.js';

router.post('/', authMiddleware, async (req, res) => {
  const {
    description,
    language = 'JavaScript',
    context = '',
    fileType = '',
    outputPreference = 'code only, no explanation',
  } = req.body;

  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ error: 'Missing or invalid description' });
  }

  const prompt = `
Generate ${fileType ? fileType + ' ' : ''}code in ${language} for the following description:

"${description}"

Output preference: ${outputPreference}

${context ? `\n\nAdditional context:\n${context}` : ''}
`;

  try {
    const generatedCode = await sendPrompt(prompt);

    // Save to history (non-blocking, don't fail if MongoDB unavailable)
    if (req.user?.id) {
      try {
        await Response.create({
          userId: req.user.id,
          input: description,
          output: generatedCode,
          command: 'generate',
          createdAt: new Date(),
        });
      } catch (dbErr) {
        console.warn('Failed to save to history:', dbErr.message);
      }
    }

    res.json({ generatedCode });
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
