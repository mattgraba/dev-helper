import { OpenAI } from 'openai';
import { getOpenAIKey } from '../utils/configManager.js';

let openaiClient = null;

function getClient() {
  if (!openaiClient) {
    const apiKey = getOpenAIKey();
    if (!apiKey) {
      throw new Error('No OpenAI API key configured. Run: dev-helper config set-key <your-key>');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

function resetClient() {
  openaiClient = null;
}

async function sendPrompt(prompt, systemPrompt = 'You are a senior software engineer.') {
  const completion = await getClient().chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });
  return completion.choices[0].message.content;
}

function extractExplanationAndFix(aiResponse) {
  const codeBlockRegex = /```[\w-]*\n([\s\S]*?)```/i;
  const match = aiResponse.match(codeBlockRegex);

  let explanation = '';
  let fix = '';

  if (match) {
    fix = match[1].trim();
    explanation = aiResponse.slice(0, match.index).replace(/explanation:/i, '').trim();
  } else {
    explanation = aiResponse.trim();
    fix = '[Fix not clearly detected in response]';
  }

  return { explanation, fix };
}

async function analyzeCode({ errorText, language = 'JavaScript', contextFiles = [] }) {
  const contextText = contextFiles.map(f => `// ${f.filename || f.name}\n${f.content}`).join('\n\n');

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

  const fullResponse = await sendPrompt(prompt, 'You are a senior software engineer. Always respond with valid JSON only.');
  return { raw: fullResponse };
}

async function explainCode({ codeSnippet, language = 'JavaScript', contextFiles = [] }) {
  const contextText = contextFiles.map(f => `// ${f.filename || f.name}\n${f.content}`).join('\n\n');

  const prompt = `
You are an expert software engineer.
Explain the following ${language} code snippet line by line in beginner-friendly terms:

\`\`\`${language}
${codeSnippet}
\`\`\`

${contextText ? `Additional context:\n\n${contextText}` : ''}
`;

  const explanation = await sendPrompt(prompt);
  return { explanation };
}

async function fixCode({ codeSnippet, language = 'JavaScript', contextFiles = [] }) {
  const contextText = contextFiles.map(f => `// ${f.filename || f.name}\n${f.content}`).join('\n\n');

  const prompt = `
You are a software engineer. Fix the following ${language} code and return only the corrected version:

\`\`\`${language}
${codeSnippet}
\`\`\`

${contextText ? `Here is additional context:\n\n${contextText}` : ''}
`;

  const fixedCode = await sendPrompt(prompt);
  return { fixedCode };
}

async function generateCode({ description, language = 'JavaScript', context = '', fileType = '' }) {
  const prompt = `
Generate ${fileType ? fileType + ' ' : ''}code in ${language} for the following description:

"${description}"

Output preference: code only, no explanation

${context ? `\n\nAdditional context:\n${context}` : ''}
`;

  const generatedCode = await sendPrompt(prompt);
  return { generatedCode };
}

async function scaffoldCode({ name }) {
  const prompt = `
Scaffold a modern React component named "${name}" using best practices.
Include comments and clear structure.
`;

  const scaffoldCode = await sendPrompt(prompt);
  return { scaffoldCode };
}

async function getTerminalCommands({ goal, context = '', contextFiles = [] }) {
  const contextFileText = contextFiles.map(f => `// ${f.filename || f.name}\n${f.content}`).join('\n\n');

  const prompt = `
You're a DevOps engineer. Provide the terminal commands to accomplish the following:

"${goal}"

${context ? `\n\nProject context:\n${context}` : ''}
${contextFileText ? `\n\nProject files:\n${contextFileText}` : ''}
`;

  const commands = await sendPrompt(prompt);
  return { commands };
}

export {
  analyzeCode,
  explainCode,
  fixCode,
  generateCode,
  scaffoldCode,
  getTerminalCommands,
  resetClient,
};
