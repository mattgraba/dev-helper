const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora').default;
const { scanFiles } = require('../utils/fileScanner');
const handleCliError = require('../utils/errorHandler');
const { checkFileExists } = require('../utils/fsUtils');

async function handleAnalyzeBasic({ filePath, language }) {
  const spinner = ora(`Sending ${filePath} to /analyze...`).start();
  try {
    const resolvedPath = path.resolve(filePath);
    if (!checkFileExists(resolvedPath)) return;

    const code = fs.readFileSync(resolvedPath, 'utf-8');
    const lang = language || 'javascript';  // Default for language
      
    const res = await axios.post('http://localhost:3001/analyze', {
      errorText: code,
      language: lang,
    });

    spinner.succeed('Analysis complete ✅');

    const { explanation, fix } = res.data;

    console.log(chalk.green('\n🧠 Explanation:\n'), explanation);
    console.log(chalk.green('\n🛠 Suggested Fix:\n'), fix);
  } catch (err) {
    handleCliError(spinner, err, 'Failed to generate analyze command ❌');
  }
}

async function handleAnalyzeWithContext({ filePath, language }) {
  const spinner = ora(`Sending ${filePath} with context to /analyze...`).start();
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

    const res = await axios.post('http://localhost:3001/analyze', {
      errorText: mainCode,
      language: lang,
      contextFiles,
    });

    spinner.succeed('Contextual analysis complete ✅');

    const { explanation, fix } = res.data;

    console.log(chalk.green('\n🧠 Explanation:\n'), explanation);
    console.log(chalk.green('\n🛠 Suggested Fix:\n'), fix);
  } catch (err) {
    handleCliError(spinner, err, 'Failed to generate analyze command with context ❌');
  }
}

module.exports = {
  handleAnalyzeBasic,
  handleAnalyzeWithContext,
};
