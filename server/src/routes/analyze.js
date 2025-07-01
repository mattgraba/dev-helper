const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const { getAIResponse } = require('../services/openaiService');
const extractExplanationAndFix = require('../utils/extractExplanationAndFix');

router.post('/', async (req, res) => {
  const { errorText, userId, language = 'JavaScript', contextFiles = [] } = req.body;

  if (!errorText) return res.status(400).json({ error: 'Missing errorText' });

  try {
    const aiResponse = await getAIResponse(errorText, language, contextFiles);

    const { explanation, fix } = extractExplanationAndFix(aiResponse);
    // Save to DB
    await Response.create({ prompt: errorText, aiResponse, userId });
    
    res.json({ explanation, fix });
  } catch (error) {
    console.error('OpenAI or DB error:', error);
    res.status(500).json({ error: 'Failed to analyze error' });
  }
});

module.exports = router;
