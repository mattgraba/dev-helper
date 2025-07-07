const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const { scanFiles } = require('../utils/fileScanner');
const handleCliError = require('../utils/errorHandler');
const { checkFileExists } = require('../utils/fsUtils');

async function handleExplainBasic({ filePath, language }) {
  try {
    const resolvedPath = path.resolve(filePath);
    if (!checkFileExists(resolvedPath)) return;

    const code = fs.readFileSync(resolvedPath, 'utf-8');
    const lang = language || 'javascript';

    const spinner = ora(`Sending ${filePath} to /explain...`).start();

    const res = await axios.post('http://localhost:3001/explain', {
      codeSnippet: code,
      language: lang,
    });

    spinner.succeed('Explanation complete ✅');

    console.log(chalk.green('\n🧠 Explanation:\n'));
    console.log(res.data.explanation);
  } catch (err) {
    handleCliError(spinner, err, 'Failed to generate explain command ❌');
  }
}

async function handleExplainWithContext({ filePath, language }) {
  try {
    const resolvedPath = path.resolve(filePath);
    if (!checkFileExists(resolvedPath)) return;

    const mainCode = fs.readFileSync(resolvedPath, 'utf-8');
    const lang = language || 'javascript';

    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

    const spinner = ora(`Sending ${filePath} with context to /explain...`).start();

    const res = await axios.post('http://localhost:3001/explain', {
      codeSnippet: mainCode,
      language: lang,
      contextFiles,
    });

    spinner.succeed('Contextual explanation complete ✅');

    console.log(chalk.green('\n🧠 Explanation:\n'));
    console.log(res.data.explanation);
  } catch (err) {
    handleCliError(spinner, err, 'Failed to generate explain command with context ❌');
  }
}

module.exports = {
  handleExplainBasic,
  handleExplainWithContext,
};
