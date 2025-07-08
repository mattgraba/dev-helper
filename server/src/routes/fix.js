const Response = require('../models/Response'); // or wherever your model is

router.post('/', async (req, res) => {
  const { codeSnippet, language = 'JavaScript' } = req.body;
  if (!codeSnippet) return res.status(400).json({ error: 'Missing codeSnippet' });

  const prompt = `
You are an expert software engineer.
Here is some ${language} code:

\`\`\`${language}
${codeSnippet}
\`\`\`

Please provide a cleaned-up, fixed, and improved version of this code.
Return only the fixed code with no explanations.
`;

  try {
    const fixedCode = await sendPrompt(prompt);

    // Save to DB for this user
    if (req.user && req.user.id) {
      await Response.create({
        userId: req.user.id,
        input: codeSnippet,
        output: fixedCode,
        command: 'fix',
        createdAt: new Date(),
      });
    }

    res.json({ fixedCode });
  } catch (err) {
    console.error('Fix route error:', err);
    res.status(500).json({ error: 'Failed to generate fixed code' });
  }
});

