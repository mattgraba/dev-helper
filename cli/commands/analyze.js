const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const { scanFiles } = require('../utils/fileScanner');
const handleCliError = require('../utils/errorHandler');
const { checkFileExists } = require('../utils/fsUtils');

async function handleAnalyzeBasic({ filePath, language }) {
  try {
    if (!checkFileExists(filePath)) return;

    const code = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const spinner = ora(`Sending ${filePath} to /analyze...`).start();
      
    const res = await axios.post('http://localhost:3001/analyze', {
      errorText: code,
      language,
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
  try {
    if (!checkFileExists(filePath)) return;
    
    const mainCode = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

    const spinner = ora(`Sending ${filePath} with context to /analyze...`).start();

    const res = await axios.post('http://localhost:3001/analyze', {
      errorText: mainCode,
      language,
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
