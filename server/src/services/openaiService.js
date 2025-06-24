const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Sends error text to OpenAI and returns the AI's response.
 * @param {string} errorText - The error message to analyze.
 * @returns {Promise<string>} AI-generated explanation and fix.
 */
async function getAIResponse(errorText) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful programming assistant.' },
      { role: 'user', content: `Explain and fix the following error: ${errorText}` },
    ],
  });
  return completion.choices[0].message.content;
}

module.exports = { getAIResponse };
