const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const { scanFiles } = require('../utils/fileScanner');
const handleCliError = require('../utils/errorHandler');
const { checkFileExists } = require('../utils/fsUtils');

async function handleExplainBasic({ file: filePath, language }) {
  try {
    if (!checkFileExists(filePath)) return;

    const code = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const spinner = ora(`Sending ${filePath} to /analyze...`).start();

    const res = await axios.post('http://localhost:3001/explain', {
      codeSnippet: code,
      language,
    });

    spinner.succeed('Analysis complete ✅');

    console.log(chalk.green('\n🧠 Explanation:\n'));
    console.log(res.data.explanation);
  } catch (err) {
    handleCliError(spinner, err, 'Failed to generate explain command ❌');
  }
}

async function handleExplainWithContext({ file: filePath, language }) {
  try {
    if (!checkFileExists(filePath)) return;

    const mainCode = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

    const spinner = ora(`Sending ${filePath} to /analyze...`).start();

    const res = await axios.post('http://localhost:3001/explain', {
      codeSnippet: mainCode,
      language,
      contextFiles,
    });

    spinner.succeed('Analysis complete ✅');

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
