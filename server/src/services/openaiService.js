import { OpenAI } from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
import { estimateTotalTokens } from '../utils/tokenEstimator.js';

const TOKEN_LIMIT = 8000; // for gpt-4 8k model; lower than hard max for safety

/**
 * Builds a structured prompt combining buggy code with optional context files
 */
function buildContextualPrompt({ errorText, language = 'JavaScript', contextFiles = [] }) {
  let prompt = `You are a senior programming assistant helping developers debug their code.\n\n`;

  if (contextFiles.length > 0) {
    prompt += `Below are supporting project files that may contain relevant definitions, functions, or configuration needed to understand and fix the bug:\n\n`;
    
    for (const file of contextFiles) {
      prompt += `--- FILE: ${file.filename} ---\n`;
      prompt += `${file.content}\n\n`;
    }

    prompt += `--- END OF CONTEXT ---\n\n`;
  }

  prompt += `Now, analyze the following buggy ${language} code:\n\n`;
  prompt += `${errorText}\n\n`;

  prompt += `Please return:\n1. A clear explanation of what the error is and why it's happening.\n2. A suggested fix, ideally using the project context if relevant.\nFormat your response like this:\n\nExplanation:\n<your explanation>\n\nFix:\n\`\`\`${language}\n<fixed code here>\n\`\`\``;

  return prompt;
}

/**
 * Analyzes error text and (optionally) project context to return explanation + fix
 */
async function getAIResponse(errorText, language = 'JavaScript', contextFiles = []) {
  const prompt = buildContextualPrompt({ errorText, language, contextFiles });

  const tokenCount = estimateTotalTokens(prompt);
  if (tokenCount > TOKEN_LIMIT) {
    throw new Error(`Token estimate (${tokenCount}) exceeds safe limit (${TOKEN_LIMIT}). Please reduce context or file size.`);
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful programming assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 1500,
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

export {
  getAIResponse,
  sendPrompt,
};

