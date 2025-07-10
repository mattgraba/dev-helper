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

async function handleFixBasic({ filePath, language, outputPath }) {
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const originalCode = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const spinner = ora(`Sending ${filePath} to /fix...`).start();
    const res = await axios.post('http://localhost:3001/fix', {
      codeSnippet: originalCode,
      language,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Fix complete ✅');

    const { fixedCode } = res.data;

    if (outputPath) {
      fs.writeFileSync(outputPath, fixedCode, 'utf-8');
      console.log(chalk.blue(`\n✅ Saved to ${outputPath}`));
    } else {
      console.log(chalk.green('\n🔧 Fixed Code:\n'), fixedCode);
    }

    await saveToHistory({
      command: 'fix',
      input: originalCode,
      output: fixedCode,
    });

  } catch (err) {
    handleCliError('fix', err);
  }
}

async function handleFixWithContext({ filePath, language, outputPath }) {
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

    const spinner = ora(`Sending ${filePath} with context to /fix...`).start();
    const res = await axios.post('http://localhost:3001/fix', {
      codeSnippet: mainCode,
      language,
      contextFiles,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Fix with context complete ✅');

    const { fixedCode } = res.data;

    if (outputPath) {
      fs.writeFileSync(outputPath, fixedCode, 'utf-8');
      console.log(chalk.blue(`\n✅ Saved to ${outputPath}`));
    } else {
      console.log(chalk.green('\n🔧 Fixed Code:\n'), fixedCode);
    }

    await saveToHistory({
      command: 'fix',
      input: mainCode,
      output: fixedCode,
    });

  } catch (err) {
    handleCliError('fix', err);
  }
}

module.exports = {
  handleFixBasic,
  handleFixWithContext,
};


