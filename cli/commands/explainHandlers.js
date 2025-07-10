const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');

const getToken = require('../utils/getToken');
const { scanFiles } = require('../utils/fileScanner');
const { checkFileExists } = require('../utils/fsUtils');
const handleCliError = require('../utils/errorHandler');
const saveToHistory = require('../utils/historySaver');

async function handleExplainBasic({ filePath, language }) {
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const mainCode = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const spinner = ora(`Sending ${filePath} to /explain...`).start();
    const res = await axios.post('http://localhost:3001/explain', {
      codeSnippet: mainCode,
      language,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Explanation complete ✅');

    const { explanation } = res.data;
    console.log(chalk.green('\n📖 Explanation:\n'), explanation);

    await saveToHistory({
      command: 'explain',
      input: mainCode,
      output: explanation,
    });

  } catch (err) {
    handleCliError('explain', err);
  }
}

async function handleExplainWithContext({ filePath, language }) {
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const mainCode = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const contextFiles = await scanFiles(path.dirname(filePath), filePath);

    const spinner = ora(`Sending ${filePath} with context to /explain...`).start();
    const res = await axios.post('http://localhost:3001/explain', {
      codeSnippet: mainCode,
      language,
      contextFiles,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Contextual explanation complete ✅');

    const { explanation } = res.data;
    console.log(chalk.green('\n📖 Explanation:\n'), explanation);

    await saveToHistory({
      command: 'explain',
      input: mainCode,
      output: explanation,
    });

  } catch (err) {
    handleCliError('explain', err);
  }
}

module.exports = {
  handleExplainBasic,
  handleExplainWithContext,
};

