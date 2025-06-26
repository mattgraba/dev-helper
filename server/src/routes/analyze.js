const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const { getAIResponse } = require('../services/openaiService');

router.post('/', async (req, res) => {
  const { errorText, userId } = req.body;

  if (!errorText) return res.status(400).json({ error: 'Missing errorText' });

  try {
    const aiResponse = await getAIResponse(errorText);

    // Save to DB
    await Response.create({ prompt: errorText, aiResponse, userId });

    const parts = aiResponse.split(/Fix:/i);

    const explanation = parts[0].replace(/Explanation:/i, '').trim();
    const fix = parts[1] ? parts[1].trim() : '';
    
    res.json({ explanation, fix });
  } catch (error) {
    console.error('OpenAI or DB error:', error);
    res.status(500).json({ error: 'Failed to analyze error' });
  }
});

module.exports = router;
