import express from 'express';
const router = express.Router();
import { sendPrompt } from '../services/openaiService.js';
import extractExplanationAndFix from '../utils/extractExplanationAndFix.js';
import Response from '../models/Response.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { handleOpenAIError } from '../utils/openaiErrorHandler.js';

router.post('/', authMiddleware, async (req, res) => {
  const { errorText, language = 'JavaScript', contextFiles = [] } = req.body;

  if (!errorText || typeof errorText !== 'string' || !errorText.trim()) {
    return res.status(400).json({ error: 'Missing or invalid errorText' });
  }

  const contextText = contextFiles.map(f => `// ${f.name}\n${f.content}`).join('\n\n');

  const prompt = `Analyze the following ${language} code for bugs, errors, and issues.

\`\`\`${language}
${errorText}
\`\`\`

${contextText ? `Context files:\n\n${contextText}\n` : ''}
Respond ONLY with valid JSON in this exact format (no markdown fences, no extra text):
{
  "issues": [
    { "line": <line_number_or_null>, "title": "<short title>", "detail": "<1-2 sentence explanation>" }
  ],
  "suggestion": "<concise fix recommendation covering all issues>"
}`;

  try {
    const fullResponse = await sendPrompt(prompt);

    // Try to parse structured JSON response
    let issues, suggestion;
    try {
      let text = fullResponse.trim();
      const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/i);
      if (fenceMatch) text = fenceMatch[1].trim();
      const parsed = JSON.parse(text);
      issues = parsed.issues || [];
      suggestion = parsed.suggestion || '';
    } catch {
      // Fallback to legacy format
      const { explanation, fix } = extractExplanationAndFix(fullResponse);
      issues = [{ line: null, title: 'Analysis', detail: explanation }];
      suggestion = fix;
    }

    // Save to history (non-blocking, don't fail if MongoDB unavailable)
    if (req.user?.id) {
      try {
        await Response.create({
          userId: req.user.id,
          input: errorText,
          output: JSON.stringify({ issues, suggestion }),
          command: 'analyze',
          createdAt: new Date(),
        });
      } catch (dbErr) {
        console.warn('Failed to save to history:', dbErr.message);
      }
    }

    res.json({ issues, suggestion });
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

