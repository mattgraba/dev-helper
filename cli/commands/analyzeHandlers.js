const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');

const getToken = require('../utils/getToken');
const { checkFileExists } = require('../utils/fsUtils');
const { scanFiles } = require('../utils/fileScanner');
const handleCliError = require('../utils/errorHandler');
const saveToHistory = require('../utils/historySaver');

async function handleAnalyzeBasic({ filePath, language }) {
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const errorText = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const spinner = ora(`Sending ${filePath} to /analyze...`).start();
    const res = await axios.post('http://localhost:3001/analyze', {
      errorText,
      language,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Analysis complete ✅');

    const { explanation, fix } = res.data;
    console.log(chalk.green('\n🧠 Explanation:\n'), explanation);
    console.log(chalk.blue('\n🔧 Suggested Fix:\n'), fix);

    await saveToHistory({
      command: 'analyze',
      input: errorText,
      output: `${explanation}\n\n${fix}`,
    });

  } catch (err) {
    handleCliError('analyze', err);
  }
}

async function handleAnalyzeWithContext({ filePath, language }) {
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const errorText = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const contextFiles = await scanFiles(path.dirname(filePath), filePath);

    const spinner = ora(`Sending ${filePath} with context to /analyze...`).start();
    const res = await axios.post('http://localhost:3001/analyze', {
      errorText,
      language,
      contextFiles,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Contextual analysis complete ✅');

    const { explanation, fix } = res.data;
    console.log(chalk.green('\n🧠 Explanation:\n'), explanation);
    console.log(chalk.blue('\n🔧 Suggested Fix:\n'), fix);

    await saveToHistory({
      command: 'analyze',
      input: errorText,
      output: `${explanation}\n\n${fix}`,
    });

  } catch (err) {
    handleCliError('analyze', err);
  }
}

module.exports = {
  handleAnalyzeBasic,
  handleAnalyzeWithContext,
};
