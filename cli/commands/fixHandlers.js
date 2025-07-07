const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora').default;
const { scanFiles } = require('../utils/fileScanner');
const handleCliError = require('../utils/errorHandler');
const { checkFileExists } = require('../utils/fsUtils');

async function handleFixBasic({ filePath, language, output }) {
  const spinner = ora(`Sending ${filePath} to /fix...`).start();
  try {
    const resolvedPath = path.resolve(filePath);
    if (!checkFileExists(resolvedPath)) return;

    const code = fs.readFileSync(resolvedPath, 'utf-8');
    const lang = language?.toLowerCase?.() || 'javascript';

    const res = await axios.post('http://localhost:3001/fix', {
      codeSnippet: code,
      language: lang,
    });

    let { fixedCode } = res.data;
    if (!fixedCode) throw new Error('No code returned from /fix.');

    fixedCode = fixedCode.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    const outPath = output ? path.resolve(output) : resolvedPath;
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, fixedCode);

    console.log(chalk.green(`✅ Fixed code written to ${output || filePath}`));
    spinner.succeed('Fix complete ✅');
  } catch (err) {
    handleCliError(spinner, err, 'Failed to fix code ❌');
  }
}

async function handleFixWithContext({ filePath, language, output }) {
  const spinner = ora(`Sending ${filePath} with context to /fix...`).start();
  const resolvedPath = path.resolve(filePath);
  if (!checkFileExists(resolvedPath)) return;

  try {
    const mainCode = fs.readFileSync(resolvedPath, 'utf-8');
    const lang = language?.toLowerCase?.() || 'javascript';

    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

    const res = await axios.post('http://localhost:3001/fix', {
      codeSnippet: mainCode,
      language: lang,
      contextFiles,
    });

    let { fixedCode } = res.data;
    if (!fixedCode) throw new Error('No code returned from /fix.');

    fixedCode = fixedCode.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    const outPath = output ? path.resolve(output) : resolvedPath;
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, fixedCode);

    console.log(chalk.green(`✅ Fixed code written to ${output || filePath}`));
    spinner.succeed('Contextual fix complete ✅');
  } catch (err) {
    handleCliError(spinner, err, 'Failed to fix code with context ❌');
  }
}

module.exports = {
  handleFixBasic,
  handleFixWithContext,
};

