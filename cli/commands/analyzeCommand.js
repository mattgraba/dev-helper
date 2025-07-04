const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const { scanFiles } = require('../utils/fileScanner');

async function handleAnalyzeBasic({ filePath, language }) {
  try {
    const code = fs.readFileSync(path.resolve(filePath), 'utf-8');

    console.log(chalk.cyan(`📤 Sending ${filePath} to /analyze...`));

    const res = await axios.post('http://localhost:3001/analyze', {
      errorText: code,
      language,
    });

    const { explanation, fix } = res.data;

    console.log(chalk.green('\n🧠 Explanation:\n'), explanation);
    console.log(chalk.green('\n🛠 Suggested Fix:\n'), fix);
  } catch (err) {
    console.error(chalk.red('❌ Failed to analyze code.'));
    console.error(err.response?.data || err.message);
  }
}

async function handleAnalyzeWithContext({ filePath, language }) {
  try {
    const mainCode = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

    console.log(chalk.cyan(`📤 Sending ${filePath} with context to /analyze...`));

    const res = await axios.post('http://localhost:3001/analyze', {
      errorText: mainCode,
      language,
      contextFiles,
    });

    const { explanation, fix } = res.data;

    console.log(chalk.green('\n🧠 Explanation:\n'), explanation);
    console.log(chalk.green('\n🛠 Suggested Fix:\n'), fix);
  } catch (err) {
    console.error(chalk.red('❌ Failed to analyze code with context.'));
    console.error(err.response?.data || err.message);
  }
}

module.exports = {
  handleAnalyzeBasic,
  handleAnalyzeWithContext,
};
