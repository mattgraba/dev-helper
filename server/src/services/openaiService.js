const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyzes error text (existing functionality)
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

/**
 * Generic prompt sender for flexible tasks like scaffolding
 */
async function sendPrompt(prompt) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a senior software engineer and project scaffolding expert.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });
  return completion.choices[0].message.content;
}

module.exports = { getAIResponse, sendPrompt };
